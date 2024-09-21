import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        // @ts-ignore
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
