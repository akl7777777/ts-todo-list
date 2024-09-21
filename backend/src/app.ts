import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import todoRoutes from './routes/todoRoutes';
import sequelize from './config/database';
import Todo from "./models/Todo";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = process.env.PORT || 5566;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 添加请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message, stack: err.stack });
});

// 初始化数据库
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // 同步模型（如果表不存在则创建）
        await Todo.sync({ alter: true });
        console.log('Todo model synchronized');

        // 检查是否需要添加初始数据
        const count = await Todo.count();
        if (count === 0) {
            await Todo.bulkCreate([
                { title: 'First todo' },
                { title: 'Second todo', completed: true }
            ]);
            console.log('Initial todos created');
        }
    } catch (error) {
        console.error('Unable to initialize database:', error);
        throw error;
    }
}

// 初始化数据库并启动服务器
initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
    });
