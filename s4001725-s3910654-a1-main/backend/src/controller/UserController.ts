import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Admin } from '../entity/Admin';
import { Lecturer } from '../entity/Lecturer';
import { Candidate } from '../entity/Candidate';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);
    private adminRepository = AppDataSource.getRepository(Admin);
    private lecturerRepository = AppDataSource.getRepository(Lecturer);
    private candidateRepository = AppDataSource.getRepository(Candidate);

    // Get all users
    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.userRepository.find();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    // Get user by ID
    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id; 

            const user = await this.userRepository.findOne({
                where: { user_id: Number(userId) }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }

    // Create a new user
    async createUser(req: Request, res: Response) {
        try {
            const { username, password, name, surname, role } = req.body;

            // Validate required fields
            if (!username || !password || !name || !surname || !role) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Validate role
            if (!['admin', 'lecturer', 'candidate'].includes(role.toLowerCase())) {
                return res.status(400).json({ error: 'Invalid role. Must be admin, lecturer, or candidate' });
            }

            // Check if username already exists
            const existingUserByUsername = await this.userRepository.findOne({
                where: { username }
            });

            if (existingUserByUsername) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = this.userRepository.create({
                username,
                password: hashedPassword,
                name,
                surname
            });

            const savedUser = await this.userRepository.save(user);

            // Create corresponding role entity
            try {
                switch (role.toLowerCase()) {
                    case 'admin':
                        const admin = this.adminRepository.create({ user_id: savedUser.user_id });
                        await this.adminRepository.save(admin);
                        break;
                    case 'lecturer':
                        const lecturer = this.lecturerRepository.create({ user_id: savedUser.user_id });
                        await this.lecturerRepository.save(lecturer);
                        break;
                    case 'candidate':
                        const candidate = this.candidateRepository.create({ user_id: savedUser.user_id });
                        await this.candidateRepository.save(candidate);
                        break;
                }
            } catch (roleError) {
                // If role creation fails, delete the user to maintain consistency
                await this.userRepository.remove(savedUser);
                throw roleError;
            }

            res.status(201).json(savedUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    // Update user
    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id; 
            const { username, name, surname } = req.body;

            const user = await this.userRepository.findOne({
                where: { user_id: Number(userId) }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update fields if provided
            if (username) {
                // Check if new username already exists
                const existingUser = await this.userRepository.findOne({
                    where: { username }
                });
                if (existingUser && existingUser.user_id !== Number(userId)) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                user.username = username;
            }
            if (name) user.name = name;
            if (surname) user.surname = surname;

            const updatedUser = await this.userRepository.save(user);
            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    // Delete user
    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id; 

            const user = await this.userRepository.findOne({
                where: { user_id: Number(userId) }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await this.userRepository.remove(user);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    // Get user by role
    async getUserType(req: Request, res: Response) {
        try {
            const { id } = req.params;
    
            const userId = Number(id);
            if (!id || isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
    
            // Optionally, check if user exists in User table
            const user = await this.userRepository.findOne({ where: { user_id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Check each type table
            const admin = await this.adminRepository.findOne({ where: { user_id: userId } });
            if (admin) return res.json({ userType: 'admin' });
    
            const lecturer = await this.lecturerRepository.findOne({ where: { user_id: userId } });
            if (lecturer) return res.json({ userType: 'lecturer' });
    
            const candidate = await this.candidateRepository.findOne({ where: { user_id: userId } });
            if (candidate) return res.json({ userType: 'candidate' });
    
            return res.status(404).json({ error: 'User has no assigned role' });
        } catch (error) {
            console.error('Get user type error:', error);
            res.status(500).json({ error: 'Failed to get user type' });
        }
    }

    // Get users by role
    async getUsersByType(req: Request, res: Response) {
        try {
            const { type } = req.params;
            
            if (!['admin', 'lecturer', 'candidate'].includes(type.toLowerCase())) {
                return res.status(400).json({ error: 'Invalid user type' });
            }

            let users: User[] = [];

            switch (type.toLowerCase()) {
                case 'admin':
                    const admins = await this.adminRepository.find({
                        relations: ['user']
                    });
                    users = admins.map(admin => admin.user);
                    break;
                case 'lecturer':
                    const lecturers = await this.lecturerRepository.find({
                        relations: ['user']
                    });
                    users = lecturers.map(lecturer => lecturer.user);
                    break;
                case 'candidate':
                    const candidates = await this.candidateRepository.find({
                        relations: ['user']
                    });
                    users = candidates.map(candidate => candidate.user);
                    break;
            }

            res.json(users);
        } catch (error) {
            console.error('Error fetching users by type:', error);
            res.status(500).json({ error: 'Failed to fetch users by type' });
        }
    }

    // Login user and return user type
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const user = await this.userRepository.findOne({
                where: { username }
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare password with hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check user type
            const admin = await this.adminRepository.findOne({
                where: { user_id: user.user_id }
            });
            if (admin) {
                return res.json({ userType: 'admin', user });
            }

            const lecturer = await this.lecturerRepository.findOne({
                where: { user_id: user.user_id }
            });
            if (lecturer) {
                return res.json({ userType: 'lecturer', user });
            }

            const candidate = await this.candidateRepository.findOne({
                where: { user_id: user.user_id }
            });
            if (candidate) {
                return res.json({ userType: 'candidate', user });
            }

            return res.status(403).json({ error: 'User has no assigned role' });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    }
}