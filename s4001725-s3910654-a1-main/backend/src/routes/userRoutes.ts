import { Router } from 'express';
import { UserController } from '../controller/UserController';

const router = Router();
const userController = new UserController();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    await userController.getUsers(req, res);
});

// GET /api/users/type/:type - Get user type by user ID
router.get('/type/:id', async (req, res) => {
    await userController.getUserType(req, res);
});

// GET /api/users/type/:type - Get users by type
router.get('/types/:type', async (req, res) => {
    await userController.getUsersByType(req, res);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
    await userController.getUserById(req, res);
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
    await userController.createUser(req, res);
});

// POST /api/users/login - Login user
router.post('/login', async (req, res) => {
    await userController.login(req, res);
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
    await userController.deleteUser(req, res);
});

export default router;
