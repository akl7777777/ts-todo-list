import {NextFunction, Request, Response} from 'express';
import Todo from '../models/Todo';

export const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Fetching all todos');
        const todos = await Todo.findAll();
        console.log('Todos fetched:', todos);
        res.json(todos);
    } catch (error) {
        console.error('Error in getAllTodos:', error);
        next(error);
    }
};

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        if (!title) {
            throw new Error('Title is required');
        }
        const todo = await Todo.create({ title });
        res.status(201).json(todo);
    } catch (error) {
        console.error('Error in createTodo:', error);
        next(error); // 将错误传递给错误处理中间件
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const todo = await Todo.findByPk(id);
        if (todo) {
            await todo.update({ title, completed });
            res.json(todo);
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating todo" });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByPk(id);
        if (todo) {
            await todo.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo" });
    }
};
