import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';
import Todo from './models/Todo';
import User from './models/User';
import {authMiddleware} from "./middleware/auth.middleware";

const app = express();
const port = process.env.PORT || 5566;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/todos', authMiddleware, todoRoutes);
app.use('/api/auth', authRoutes);

// 数据库同步
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced');
    } catch (error) {
        console.error('Unable to sync database:', error);
    }
};

// 启动服务器
const startServer = async () => {
    await syncDatabase();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
