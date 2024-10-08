# TS-Todo-List

TS-Todo-List 是一个使用 TypeScript 构建的全栈待办事项应用程序。它结合了 React 前端和 Express 后端，并使用 MySQL 数据库进行数据存储。

## 已实现的功能

- 用户认证
    - 用户注册
    - 用户登录
    - JWT 认证
- 待办事项管理
    - 添加新的待办事项
    - 查看所有待办事项列表
    - 将待办事项标记为已完成
    - 删除待办事项（仅管理员）
    - 为待办事项添加描述
    - 设置待办事项截止日期
    - 管理员可以将待办事项分配给特定用户
    - 普通用户只能查看和完成分配给自己的待办事项
    - 普通用户可以创建新的待办事项，但只能分配给自己
- 用户角色
    - 管理员和普通用户角色
    - 基于角色的权限控制
- 数据持久化
    - 使用 MySQL 数据库进行数据存储
- 文件上传
    - 支持为待办事项添加附件
    - 支持拖拽上传和粘贴上传图片
- 界面优化
    - 实现待办事项的日期范围筛选功能
    - 已完成的待办事项自动排序到列表底部

## 计划实现的功能

- 用户管理
    - 管理员可以查看所有用户列表
    - 管理员可以更改用户角色
- 界面优化
    - 添加分页功能以处理大量待办事项
    - 实现更多的排序选项
- 数据可视化
    - 添加仪表板，显示待办事项完成统计
- 通知系统
    - 为即将到期的待办事项发送提醒
- 移动端适配
    - 优化移动设备的用户体验

## 技术栈

- 前端：React, TypeScript, Material-UI, @mui/x-date-pickers
- 后端：Node.js, Express, TypeScript
- 数据库：MySQL
- ORM：Sequelize
- 认证：JWT (JSON Web Tokens)
- 文件上传：Multer

## 项目结构

```
ts-todo-list/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.ts
│   ├── uploads/
│   ├── .env
│   └── package.json
└── README.md
```

## 设置和运行

### 前提条件

- Node.js (推荐使用 LTS 版本)
- MySQL
- Docker (可选，用于容器化部署)

### 使用 Docker Compose 运行

1. 确保已安装 Docker 和 Docker Compose
2. 在项目根目录下运行:
   ```
   docker-compose up --build
   ```

### 手动设置

#### 后端设置

1. 进入后端目录：
   ```
   cd backend
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 创建 `.env` 文件并设置环境变量：
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=ts_todo_list
   PORT=5566
   JWT_SECRET=your_jwt_secret
   ```

4. 启动后端服务器：
   ```
   npm start
   ```

#### 前端设置

1. 进入前端目录：
   ```
   cd frontend
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 启动前端开发服务器：
   ```
   npm start
   ```

## 使用说明

访问 `http://localhost:3000` 来使用应用程序。你可以注册新用户，登录，然后添加、查看、完成或删除待办事项。管理员用户可以管理所有用户的待办事项，而普通用户只能管理自己的待办事项。

## 贡献

欢迎贡献！请随时提交 issue 或 pull request。

## 许可证

[MIT License](LICENSE)
