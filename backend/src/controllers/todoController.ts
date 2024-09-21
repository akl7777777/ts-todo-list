import { Request, Response } from 'express';
import Todo from '../models/Todo';
import User from '../models/User';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';


export const createTodo = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { title, description, assignedTo } = req.body;
        const createdBy = req.user.id;

        const todo = await Todo.create({ title, description, assignedTo, createdBy });
        res.status(201).json(todo);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ message: 'Error creating todo', error: error.message });
    }
};

export const getTodos = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user.id;
        const userRole = req.user.role;

        let todos;
        if (userRole === 'admin') {
            todos = await Todo.findAll({ include: [{ model: User, as: 'assignee' }, { model: User, as: 'creator' }] });
        } else {
            todos = await Todo.findAll({
                where: { assignedTo: userId },
                include: [{ model: User, as: 'assignee' }, { model: User, as: 'creator' }]
            });
        }
        res.json(todos);
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ message: 'Error retrieving todos', error: error.message });
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const { completed } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (userRole !== 'admin' && todo.assignedTo !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this todo' });
        }

        await todo.update({ completed });
        res.json(todo);
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ message: 'Error updating todo', error: error.message });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const userRole = req.user.role;

        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete todos' });
        }

        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await todo.destroy();
        res.status(204).send();
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ message: 'Error deleting todo', error: error.message });
    }
};

export const uploadFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 生成一个唯一的文件名
        const fileExtension = path.extname(req.file.originalname);
        const safeFileName = req.file.originalname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const uniqueFileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${safeFileName}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        fs.writeFileSync(filePath, req.file.buffer);

        // 更新 To do 记录，保存文件名
        await todo.update({ attachment: uniqueFileName });

        res.json({ message: 'File uploaded successfully', fileName: uniqueFileName });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: (error as Error).message });
    }
};
