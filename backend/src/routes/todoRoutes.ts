import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todoController';

const router = express.Router();

// 不需要在这里使用 authMiddleware，因为已经在 app.ts 中应用了
router.post('/', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
