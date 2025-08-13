import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Application } from '../entity/Application';
import { ApplicationChosen } from '../entity/ApplicationChosen';
import { ApplicationComment } from '../entity/ApplicationComment';
import { Availability, AppliedRole } from '../entity/enums';
import { Course } from '../entity/Course';
import { CandidateCredential } from '../entity/CandidateCredential';
import { CandidateSkill } from '../entity/CandidateSkill';
import { Skill } from '../entity/Skill';

export class ApplicationController {
    private applicationRepository = AppDataSource.getRepository(Application);
    private applicationChosenRepository = AppDataSource.getRepository(ApplicationChosen);
    private applicationCommentRepository = AppDataSource.getRepository(ApplicationComment);

    // Get all applications
    async getApplications(req: Request, res: Response) {
        try {
            const applications = await this.applicationRepository.find({
                relations: ['candidate', 'candidate.user', 'course', 'applicationChosen', 'applicationComments']
            });
            res.json(applications);
        } catch (error) {
            console.error('Error fetching applications:', error);
            res.status(500).json({ error: 'Failed to fetch applications' });
        }
    }

    // Get application by ID
    async getApplicationById(req: Request, res: Response) {
        try {
            const applicationId = parseInt(req.params.id);
            
            if (isNaN(applicationId)) {
                return res.status(400).json({ error: 'Invalid application ID' });
            }

            const application = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
                relations: ['candidate', 'candidate.user', 'course', 'skill', 'applicationChosen', 'applicationComments']
            });

            if (!application) {
                return res.status(404).json({ error: 'Application not found' });
            }

            res.json(application);
        } catch (error) {
            console.error('Error fetching application:', error);
            res.status(500).json({ error: 'Failed to fetch application' });
        }
    }

    // Get applications by candidate
    async getApplicationsByCandidate(req: Request, res: Response) {
        try {
            const candidateId = Number(req.params.candidateId);

            const applications = await this.applicationRepository.find({
                where: { candidate_id: candidateId },
                relations: ['course', 'skill', 'applicationChosen', 'applicationComments']
            });
            res.json(applications);
        } catch (error) {
            console.error('Error fetching applications:', error);
            res.status(500).json({ error: 'Failed to fetch applications' });
        }
    }

    // Get applications by course
    async getApplicationsByCourse(req: Request, res: Response) {
        try {
            const courseId = parseInt(req.params.courseId);
            
            if (isNaN(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const applications = await this.applicationRepository.find({
                where: { course_id: courseId },
                relations: ['candidate', 'candidate.user', 'skill', 'applicationChosen', 'applicationComments']
            });
            res.json(applications);
        } catch (error) {
            console.error('Error fetching applications:', error);
            res.status(500).json({ error: 'Failed to fetch applications' });
        }
    }

   // Create application
    async createApplication(req: Request, res: Response) {
        try {
            const { 
                candidate_id, 
                course_code, 
                position, 
                degree, 
                level, 
                skills, 
                availability 
            } = req.body;

            if (!candidate_id || !course_code || !position || !degree || !level || !skills || !availability) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const validPositions = ['tutor', 'lab_assistant'];
            const validAvailability = ['part_time', 'full_time'];
            
            if (!validPositions.includes(position)) {
                return res.status(400).json({ error: 'Invalid position' });
            }
            
            if (!validAvailability.includes(availability)) {
                return res.status(400).json({ error: 'Invalid availability' });
            }

            const courseRepo = AppDataSource.getRepository(Course);
            const course = await courseRepo.createQueryBuilder('course')
                .where('course.course_name LIKE :courseCode', { courseCode: `%${course_code}%` })
                .getOne();

            if (!course) {
                return res.status(404).json({ error: `Course not found: ${course_code}` });
            }

            //Check if application already exists for this candidate and course
            const existingApplication = await this.applicationRepository.findOne({
                where: {
                    candidate_id: parseInt(candidate_id),
                    course_id: course.course_id,
                    applied_role: position
                }
            });
            if (existingApplication) {
                return res.status(400).json({ error: `Application already submitted for ${course.course_name}` });
            }

            //Update candidate credentials
            const candidateCredentialRepo = AppDataSource.getRepository(CandidateCredential);
            const existingCredential = await candidateCredentialRepo.findOne({
                where: { candidate_id: parseInt(candidate_id), degree: degree }
            });

            if (!existingCredential) {
                const credential = candidateCredentialRepo.create({
                    candidate_id: parseInt(candidate_id),
                    degree: degree,
                    level: level
                });
                await candidateCredentialRepo.save(credential);
            }

            //Update candidate skills
            const candidateSkillRepo = AppDataSource.getRepository(CandidateSkill);
            const skillRepo = AppDataSource.getRepository(Skill);
            
            const skillNames = skills.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill.length > 0);
            
            for (const skillName of skillNames) {
                // Find or create skill
                let skill = await skillRepo.findOne({ where: { skill_name: skillName } });
                if (!skill) {
                    skill = skillRepo.create({ skill_name: skillName });
                    skill = await skillRepo.save(skill);
                }

                // Create candidate skill relationship if it doesn't exist
                const existingCandidateSkill = await candidateSkillRepo.findOne({
                    where: { candidate_id: parseInt(candidate_id), skill_id: skill.skill_id }
                });

                if (!existingCandidateSkill) {
                    const candidateSkill = candidateSkillRepo.create({
                        candidate_id: parseInt(candidate_id),
                        skill_id: skill.skill_id
                    });
                    await candidateSkillRepo.save(candidateSkill);
                }
            }

            // Find the current max rank
            const maxRankApp = await this.applicationRepository
                .createQueryBuilder("application")
                .orderBy("application.rank", "DESC")
                .getOne();

            const nextRank = maxRankApp ? maxRankApp.rank + 1 : 1;

            // Create the application
            const application = this.applicationRepository.create({
                candidate_id: parseInt(candidate_id),
                course_id: course.course_id,
                availability: availability as 'part_time' | 'full_time',
                applied_role: position as 'lab_assistant' | 'tutor',
                rank: nextRank
            });

            const savedApplication = await this.applicationRepository.save(application);

            res.status(201).json({
                message: 'Application created successfully',
                application: savedApplication,
                course: course.course_name
            });

        } catch (error) {
            console.error('Error creating application:', error);
            res.status(500).json({ error: 'Failed to create application' });
        }
    }

    // Choose application (lecturer selects an application)
    async chooseApplication(req: Request, res: Response) {
        try {
            const { lecturer_id, application_id } = req.body;

            if (!lecturer_id || !application_id) {
                return res.status(400).json({ error: 'Lecturer ID and Application ID are required' });
            }

            // Check if already chosen
            const existingChoice = await this.applicationChosenRepository.findOne({
                where: {
                    lecturer_id: lecturer_id,
                    application_id: parseInt(application_id)
                }
            });

            if (existingChoice) {
                return res.status(400).json({ error: 'Application already chosen by this lecturer' });
            }

            const applicationChosen = this.applicationChosenRepository.create({
                lecturer_id: lecturer_id,
                application_id: parseInt(application_id)
            });

            const savedChoice = await this.applicationChosenRepository.save(applicationChosen);
            res.status(201).json(savedChoice);
        } catch (error) {
            console.error('Error choosing application:', error);
            res.status(500).json({ error: 'Failed to choose application' });
        }
    }

    // Add comment to application
    async addComment(req: Request, res: Response) {
        try {
            const { lecturer_id, application_id, comment } = req.body;

            if (!lecturer_id || !application_id || !comment) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            if (comment.trim().length === 0) {
                return res.status(400).json({ error: 'Comment cannot be empty' });
            }

            const applicationComment = this.applicationCommentRepository.create({
                lecturer_id: lecturer_id,
                application_id: parseInt(application_id),
                comment: comment.trim()
            });

            const savedComment = await this.applicationCommentRepository.save(applicationComment);
            res.status(201).json(savedComment);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }

    // Get comments for an application
    async getApplicationComments(req: Request, res: Response) {
        try {
            const applicationId = parseInt(req.params.applicationId);
            
            if (isNaN(applicationId)) {
                return res.status(400).json({ error: 'Invalid application ID' });
            }

            const comments = await this.applicationCommentRepository.find({
                where: { application_id: applicationId },
                relations: ['lecturer', 'lecturer.user']
            });

            res.json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Failed to fetch comments' });
        }
    }

    // Update application
    async updateApplication(req: Request, res: Response) {
        try {
            const applicationId = parseInt(req.params.id);
            const { availability, applied_role } = req.body;

            if (isNaN(applicationId)) {
                return res.status(400).json({ error: 'Invalid application ID' });
            }

            const application = await this.applicationRepository.findOne({
                where: { application_id: applicationId }
            });

            if (!application) {
                return res.status(404).json({ error: 'Application not found' });
            }

            // Update fields if provided
            if (availability) {
                if (!Object.values(Availability).includes(availability)) {
                    return res.status(400).json({ error: 'Invalid availability value' });
                }
                application.availability = availability;
            }

            if (applied_role) {
                if (!Object.values(AppliedRole).includes(applied_role)) {
                    return res.status(400).json({ error: 'Invalid applied role value' });
                }
                application.applied_role = applied_role;
            }

            const updatedApplication = await this.applicationRepository.save(application);
            res.json(updatedApplication);
        } catch (error) {
            console.error('Error updating application:', error);
            res.status(500).json({ error: 'Failed to update application' });
        }
    }

    // Delete application
    async deleteApplication(req: Request, res: Response) {
        try {
            const applicationId = parseInt(req.params.id);

            if (isNaN(applicationId)) {
                return res.status(400).json({ error: 'Invalid application ID' });
            }

            const application = await this.applicationRepository.findOne({
                where: { application_id: applicationId }
            });

            if (!application) {
                return res.status(404).json({ error: 'Application not found' });
            }

            await this.applicationRepository.remove(application);
            res.json({ message: 'Application deleted successfully' });
        } catch (error) {
            console.error('Error deleting application:', error);
            res.status(500).json({ error: 'Failed to delete application' });
        }
    }

    async getApplicants(req: Request, res: Response) {
        try {
            const lecturerUserId = Number(req.params.lecturerUserId);
            if (isNaN(lecturerUserId)) {
                return res.status(400).json({ error: "Invalid lecturer user_id" });
            }
    
            //Get courses taught by this lecturer
            const courseRepo = AppDataSource.getRepository(Course);
            const courses = await courseRepo.find({ where: { lecturer_id: lecturerUserId } });
            const courseIds = courses.map(course => course.course_id);

            //Get course name from course_id
            const courseIdToName = new Map<number, string>();
            courses.forEach(course => {
                courseIdToName.set(course.course_id, course.course_name);
            });
    
            if (courseIds.length === 0) {
                return res.json([]); 
            }
    
            //Get applications for lecturers courses with related data
            const applications = await this.applicationRepository.find({
                where: courseIds.map(id => ({ course_id: id })),
                relations: [
                    'candidate',
                    'candidate.user',
                    'candidate.credentials',
                    'candidate.skills',
                    'candidate.skills.skill',
                    'candidate.prevRoles',
                    'candidate.prevRoles.course',
                    'applicationComments'
                ]
            });
    
            //Format application data for response
            const result = await Promise.all(applications.map(async (app) => {
                const credential = app.candidate.credentials?.map(c => `${c.degree} ${c.level}`).join(', ') || "";
                const skills = app.candidate.skills
                    ?.map(cs => cs.skill?.skill_name)
                    .filter(Boolean)
                    .join(', ') || "";
    
                const prevRoles = app.candidate.prevRoles
                    ?.map(role => role.course?.course_name)
                    .filter(Boolean)
                    .join(', ') || "";
    
                //Get lecturer's comment for this application
                const commentObj = app.applicationComments?.find(
                    c => c.lecturer_id === lecturerUserId
                );
                const comment = commentObj ? commentObj.comment : "";
    
                const appliedCourse = courseIdToName.get(app.course_id) || "";
    
                return {
                    applicationId: app.application_id,
                    name: `${app.candidate.user.name} ${app.candidate.user.surname}`,
                    appliedCourse,
                    roleApplied: app.applied_role,
                    credential,
                    skills,
                    prevRoles,
                    availabilityType: app.availability,
                    comment
                };
            }));
    
            res.json(result);
        } catch (error) {
            console.error('Error fetching applicants for lecturer:', error);
            res.status(500).json({ error: 'Failed to fetch applicants for lecturer' });
        }
    }

    async toggleCandidateSelection(req: Request, res: Response) {
        try {
            const { lecturer_id, application_id } = req.body;
            if (!lecturer_id || !application_id) {
                return res.status(400).json({ error: "lecturer_id and application_id are required" });
            }
            const repo = AppDataSource.getRepository(ApplicationChosen);
            const existing = await repo.findOne({ where: { lecturer_id, application_id } });
            if (existing) {
                await repo.remove(existing);
                return res.json({ selected: false, message: "Selection removed" });
            } else {
                const newSelection = repo.create({ lecturer_id, application_id });
                await repo.save(newSelection);
                return res.json({ selected: true, message: "Selection added" });
            }
        } catch (error) {
            console.error("Error toggling candidate selection:", error);
            res.status(500).json({ error: "Failed to toggle selection" });
        }
    }

    async saveComment(req: Request, res: Response) {
        try {
            const { lecturer_id, application_id, comment } = req.body;
            if (!lecturer_id || !application_id || !comment) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const applicationComment = this.applicationCommentRepository.create({
                lecturer_id: lecturer_id,
                application_id: parseInt(application_id),
                comment: comment.trim()
            });

            const savedComment = await this.applicationCommentRepository.save(applicationComment);
            res.status(201).json(savedComment);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }
}
