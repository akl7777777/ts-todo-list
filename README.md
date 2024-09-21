# ts-todo-list

ts-todo-list 是一个使用 TypeScript 构建的全栈待办事项列表应用。它结合了 React 前端和 Express 后端，提供了一个类型安全、高效的任务管理解决方案。

## 特性

- TypeScript: 前后端全面类型支持，提高代码质量和开发效率
- React: 构建响应式和用户友好的前端界面
- Express: 搭建强大而灵活的后端 API
- SQLite: 使用轻量级数据库进行本地数据存储
- 文件上传: 支持为待办事项添加文件和图片附件
- 实时更新: 即时标记任务完成状态，提高用户体验

## 快速开始

1. 克隆仓库
   ```
   git clone https://github.com/yourusername/ts-todo-list.git
   cd ts-todo-list
   ```

2. 安装依赖
   ```
   npm run install-all
   ```

3. 启动开发服务器
   ```
   npm start
   ```

4. 打开浏览器访问 `http://localhost:3000`

## 项目结构

```
ts-todo-list/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/           # Express 后端
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```

## 贡献

我们欢迎所有形式的贡献！如果您发现了 bug 或有新功能建议，请创建一个 issue。如果您想贡献代码，请提交 pull request。

## 许可

MIT
