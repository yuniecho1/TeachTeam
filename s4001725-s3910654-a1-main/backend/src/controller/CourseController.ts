import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Course } from '../entity/Course';

export class CourseController {
    private courseRepository = AppDataSource.getRepository(Course);

    // Get all courses
    async getCourses(req: Request, res: Response) {
        try {
            const courses = await this.courseRepository.find({
                relations: ['lecturer', 'lecturer.user', 'applications', 'credentials'] 
            });
            res.json(courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    // Get course by ID
    async getCourseById(req: Request, res: Response) {
        try {
            const courseId = parseInt(req.params.id);

            if (isNaN(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const course = await this.courseRepository.findOne({
                where: { course_id: courseId },
                relations: ['lecturer', 'lecturer.user', 'applications', 'applications.candidate', 'applications.candidate.user']
            });

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            res.json(course);
        } catch (error) {
            console.error('Error fetching course:', error);
            res.status(500).json({ error: 'Failed to fetch course' });
        }
    }

    // Get courses by lecturer
    async getCoursesByLecturer(req: Request, res: Response) {
        try {
            const lecturerId = req.params.lecturerId;

            const courses = await this.courseRepository.find({
                where: { lecturer_id: Number(lecturerId) },
                relations: ['applications', 'applications.candidate', 'applications.candidate.user']
            });

            res.json(courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({ error: 'Failed to fetch courses' });
        }
    }

    // Create new course
    async createCourse(req: Request, res: Response) {
        try {
            const { course_name, lecturer_id } = req.body;

            if (!course_name || !lecturer_id) {
                return res.status(400).json({ error: 'Course name and lecturer ID are required' });
            }

            if (course_name.trim().length === 0) {
                return res.status(400).json({ error: 'Course name cannot be empty' });
            }

            // Check if course with same name already exists
            const existingCourse = await this.courseRepository.findOne({
                where: { course_name: course_name.trim() }
            });

            if (existingCourse) {
                return res.status(400).json({ error: 'Course with this name already exists' });
            }

            const course = this.courseRepository.create({
                course_name: course_name.trim(),
                lecturer_id: lecturer_id
            });

            const savedCourse = await this.courseRepository.save(course);
            res.status(201).json(savedCourse);
        } catch (error) {
            console.error('Error creating course:', error);
            res.status(500).json({ error: 'Failed to create course' });
        }
    }

    // Update course
    async updateCourse(req: Request, res: Response) {
        try {
            const courseId = parseInt(req.params.id);
            const { course_name, lecturer_id } = req.body;

            if (isNaN(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const course = await this.courseRepository.findOne({
                where: { course_id: courseId }
            });

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Update fields if provided
            if (course_name) {
                if (course_name.trim().length === 0) {
                    return res.status(400).json({ error: 'Course name cannot be empty' });
                }
                course.course_name = course_name.trim();
            }

            if (lecturer_id) {
                course.lecturer_id = lecturer_id;
            }

            const updatedCourse = await this.courseRepository.save(course);
            res.json(updatedCourse);
        } catch (error) {
            console.error('Error updating course:', error);
            res.status(500).json({ error: 'Failed to update course' });
        }
    }

    // Delete course
    async deleteCourse(req: Request, res: Response) {
        try {
            const courseId = parseInt(req.params.id);

            if (isNaN(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const course = await this.courseRepository.findOne({
                where: { course_id: courseId }
            });

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            await this.courseRepository.remove(course);
            res.json({ message: 'Course deleted successfully' });
        } catch (error) {
            console.error('Error deleting course:', error);
            res.status(500).json({ error: 'Failed to delete course' });
        }
    }
}

