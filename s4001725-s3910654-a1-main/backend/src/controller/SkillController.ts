import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Skill } from '../entity/Skill';  
import { CandidateSkill } from '../entity/CandidateSkill';

export class SkillController {
    private skillRepository = AppDataSource.getRepository(Skill);
    private candidateSkillRepository = AppDataSource.getRepository(CandidateSkill);

    // Get all skills
    async getSkills(req: Request, res: Response) {
        try {
            const skills = await this.skillRepository.find({
                relations: ['candidateSkills']
            });
            res.json(skills);
        } catch (error) {
            console.error('Error fetching skills:', error);
            res.status(500).json({ error: 'Failed to fetch skills' });
        }
    }

    // Get skill by ID
    async getSkillById(req: Request, res: Response) {
        try {
            const skillId = parseInt(req.params.id);

            if (isNaN(skillId)) {
                return res.status(400).json({ error: 'Invalid skill ID' });
            }

            const skill = await this.skillRepository.findOne({
                where: { skill_id: skillId },
                relations: ['candidateSkills', 'candidateSkills.candidate', 'candidateSkills.candidate.user']
            });

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            res.json(skill);
        } catch (error) {
            console.error('Error fetching skill:', error);
            res.status(500).json({ error: 'Failed to fetch skill' });
        }
    }

    // Get skills by candidate
    async getSkillsByCandidate(req: Request, res: Response) {
        try {
            const candidateId = req.params.candidateId;

            const candidateSkills = await this.candidateSkillRepository.find({
                where: { candidate_id: Number(candidateId) },
                relations: ['skill']
            });

            const skills = candidateSkills.map(cs => cs.skill);
            res.json(skills);
        } catch (error) {
            console.error('Error fetching candidate skills:', error);
            res.status(500).json({ error: 'Failed to fetch candidate skills' });
        }
    }

    // Create new skill
    async createSkill(req: Request, res: Response) {
        try {
            const { skill_name } = req.body;

            if (!skill_name) {
                return res.status(400).json({ error: 'Skill name is required' });
            }

            if (skill_name.trim().length === 0) {
                return res.status(400).json({ error: 'Skill name cannot be empty' });
            }

            // Check if skill already exists
            const existingSkill = await this.skillRepository.findOne({
                where: { skill_name: skill_name.trim() }
            });

            if (existingSkill) {
                return res.status(400).json({ error: 'Skill already exists' });
            }

            const skill = this.skillRepository.create({ 
                skill_name: skill_name.trim() 
            });
            
            const savedSkill = await this.skillRepository.save(skill);
            res.status(201).json(savedSkill);
        } catch (error) {
            console.error('Error creating skill:', error);
            res.status(500).json({ error: 'Failed to create skill' });
        }
    }

    // Add skill to candidate
    async addSkillToCandidate(req: Request, res: Response) {
        try {
            const { candidate_id, skill_id } = req.body;

            if (!candidate_id || !skill_id) {
                return res.status(400).json({ error: 'Candidate ID and Skill ID are required' });
            }

            // Check if relationship already exists
            const existingRelation = await this.candidateSkillRepository.findOne({
                where: {
                    candidate_id: candidate_id,
                    skill_id: parseInt(skill_id)
                }
            });

            if (existingRelation) {
                return res.status(400).json({ error: 'Candidate already has this skill' });
            }

            const candidateSkill = this.candidateSkillRepository.create({
                candidate_id: candidate_id,
                skill_id: parseInt(skill_id)
            });

            const savedCandidateSkill = await this.candidateSkillRepository.save(candidateSkill);
            res.status(201).json(savedCandidateSkill);
        } catch (error) {
            console.error('Error adding skill to candidate:', error);
            res.status(500).json({ error: 'Failed to add skill to candidate' });
        }
    }

    // Remove skill from candidate
    async removeSkillFromCandidate(req: Request, res: Response) {
        try {
            const { candidate_id, skill_id } = req.body;

            if (!candidate_id || !skill_id) {
                return res.status(400).json({ error: 'Candidate ID and Skill ID are required' });
            }

            const candidateSkill = await this.candidateSkillRepository.findOne({
                where: {
                    candidate_id: candidate_id,
                    skill_id: parseInt(skill_id)
                }
            });

            if (!candidateSkill) {
                return res.status(404).json({ error: 'Candidate skill relationship not found' });
            }

            await this.candidateSkillRepository.remove(candidateSkill);
            res.json({ message: 'Skill removed from candidate successfully' });
        } catch (error) {
            console.error('Error removing skill from candidate:', error);
            res.status(500).json({ error: 'Failed to remove skill from candidate' });
        }
    }

    // Update skill
    async updateSkill(req: Request, res: Response) {
        try {
            const skillId = parseInt(req.params.id);
            const { skill_name } = req.body;

            if (isNaN(skillId)) {
                return res.status(400).json({ error: 'Invalid skill ID' });
            }

            if (!skill_name || skill_name.trim().length === 0) {
                return res.status(400).json({ error: 'Skill name is required' });
            }

            const skill = await this.skillRepository.findOne({
                where: { skill_id: skillId }
            });

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            // Check if new name already exists
            const existingSkill = await this.skillRepository.findOne({
                where: { skill_name: skill_name.trim() }
            });

            if (existingSkill && existingSkill.skill_id !== skillId) {
                return res.status(400).json({ error: 'Skill with this name already exists' });
            }

            skill.skill_name = skill_name.trim();
            const updatedSkill = await this.skillRepository.save(skill);
            res.json(updatedSkill);
        } catch (error) {
            console.error('Error updating skill:', error);
            res.status(500).json({ error: 'Failed to update skill' });
        }
    }
}

