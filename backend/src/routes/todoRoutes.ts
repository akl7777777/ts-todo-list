import express from 'express';
import multer from 'multer';
import { createTodo, getTodos, updateTodo, deleteTodo, uploadFile } from '../controllers/todoController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.post('/:id/upload', upload.array('files'), uploadFile);

export default router;
