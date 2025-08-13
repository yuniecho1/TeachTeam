import { Router } from 'express';
import { CourseController } from '../controller/CourseController';
const router = Router();
const courseController = new CourseController();

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
    await courseController.getCourses(req, res);
});

// GET /api/courses/lecturer/:lecturerId - Get courses by lecturer
router.get('/lecturer/:lecturerId', async (req, res) => {
    await courseController.getCoursesByLecturer(req, res);
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
    await courseController.getCourseById(req, res);
});

// POST /api/courses - Create new course
router.post('/', async (req, res) => {
    await courseController.createCourse(req, res);
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', async (req, res) => {
    await courseController.deleteCourse(req, res);
});

export default router;
