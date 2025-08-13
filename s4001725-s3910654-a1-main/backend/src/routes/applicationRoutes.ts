import { Router } from 'express';
import { ApplicationController } from '../controller/ApplicationController';

const router = Router();
const applicationController = new ApplicationController();

// GET /api/applications - Get all applications
router.get('/', async (req, res) => {
    await applicationController.getApplications(req, res);
});

// GET /api/applications/candidate/:candidateId - Get applications by candidate
router.get('/candidate/:candidateId', async (req, res) => {
    await applicationController.getApplicationsByCandidate(req, res);
});

// GET /api/applications/course/:courseId - Get applications by course
router.get('/course/:courseId', async (req, res) => {
    await applicationController.getApplicationsByCourse(req, res);
});

// GET /api/applications/:applicationId/comments - Get comments for application
router.get('/:applicationId/comments', async (req, res) => {
    await applicationController.getApplicationComments(req, res);
});

// GET /api/applications/:id - Get application by ID
router.get('/:id', async (req, res) => {
    await applicationController.getApplicationById(req, res);
});

router.get('/applicants/:lecturerUserId', (req, res) =>
    applicationController.getApplicants(req, res)
  );

// POST /api/applications - Create new application
router.post('/', async (req, res) => {
    await applicationController.createApplication(req, res);
});

// DELETE /api/applications/:id - Delete application
router.delete('/:id', async (req, res) => {
    await applicationController.deleteApplication(req, res);
});

// POST /api/applications/choose - Lecturer chooses application
router.post('/choose', async (req, res) => {
    await applicationController.chooseApplication(req, res);
});

// POST /api/applications/comment - Add comment to application
router.post('/comment', async (req, res) => {
    await applicationController.addComment(req, res);
});

// POST /api/applications/select - Toggle candidate selection
router.post('/select', (req, res) => applicationController.toggleCandidateSelection(req, res));

// POST /api/applications/save-comment - Save comment to application
router.post('/save-comment', (req, res) => applicationController.saveComment(req, res));

export default router;