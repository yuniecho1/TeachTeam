import { Router } from 'express';
import { SkillController } from '../controller/SkillController';

const router = Router();
const skillController = new SkillController();

// GET /api/skills - Get all skills
router.get('/', async (req, res) => {
    await skillController.getSkills(req, res);
});

// GET /api/skills/candidate/:candidateId - Get skills by candidate
router.get('/candidate/:candidateId', async (req, res) => {
    await skillController.getSkillsByCandidate(req, res);
});

// GET /api/skills/:id - Get skill by ID
router.get('/:id', async (req, res) => {
    await skillController.getSkillById(req, res);
});

// POST /api/skills - Create new skill
router.post('/', async (req, res) => {
    await skillController.createSkill(req, res);
});

// DELETE /api/skills/:id - Delete skill
router.delete('/:id', async (req, res) => {
    await skillController.removeSkillFromCandidate(req, res);
});

// POST /api/skills/candidate - Add skill to candidate
router.post('/candidate', async (req, res) => {
    await skillController.addSkillToCandidate(req, res);
});

// DELETE /api/skills/candidate - Remove skill from candidate
router.delete('/candidate', async (req, res) => {
    await skillController.removeSkillFromCandidate(req, res);
});

export default router;