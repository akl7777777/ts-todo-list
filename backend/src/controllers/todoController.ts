import { Request, Response } from 'express';
import Todo from '../models/Todo';
import User from '../models/User';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Op } from 'sequelize';


export const createTodo = async (req: Request, res: Response) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        const createdBy = req.user!.id;

        // 确保 assignedTo 是一个有效的整数
        const assignedToId = parseInt(assignedTo);
        if (isNaN(assignedToId)) {
            return res.status(400).json({ message: 'Invalid assignedTo value' });
        }

        const todo = await Todo.create({
            title,
            description,
            assignedTo: assignedToId,
            createdBy,
            dueDate: dueDate ? new Date(dueDate) : null
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error('Error in createTodo:', error);
        res.status(400).json({ message: 'Error creating todo', error: (error as Error).message });
    }
};

export const getTodos = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, page = 1, pageSize = 10, search } = req.query;
        const userId = req.user!.id;
        const offset = (Number(page) - 1) * Number(pageSize);

        let whereClause: any = {
            [Op.or]: [
                { assignedTo: userId },
                { createdBy: userId }
            ]
        };

        if (startDate && endDate) {
            whereClause.dueDate = {
                [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
            };
        }

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Todo.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'username'] },
                { model: User, as: 'creator', attributes: ['id', 'username'] }
            ],
            order: [['dueDate', 'ASC']],
            offset,
            limit: Number(pageSize)
        });

        res.json({ count, todos: rows });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Error fetching todos' });
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

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const uniqueId = crypto.randomBytes(8).toString('hex');
            const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const safeFileName = `${Date.now()}-${uniqueId}-${originalName}`;
            const filePath = path.join(uploadDir, safeFileName);

            fs.writeFileSync(filePath, file.buffer);
            uploadedFiles.push(safeFileName);
        }

        await todo.update({ attachment: uploadedFiles.join(',') });

        res.json({ message: 'Files uploaded successfully', fileNames: uploadedFiles });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading files', error: (error as Error).message });
    }
};
