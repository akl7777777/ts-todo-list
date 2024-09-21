import axios, { AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:5566/api';

// const api = axios.create({
//     baseURL: API_URL,
// });

// 定义 Todo 接口
export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    assignedTo: number;
    createdBy: number;
    attachment?: string; // 添加这一行
}

// 定义 User 接口
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const getTodos = async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data;
};

export const createTodo = async (title: string, description: string, assignedTo: number): Promise<Todo> => {
    const response = await api.post('/todos', { title, description, assignedTo });
    return response.data;
};

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
};

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
};

export const updateUserRole = async (userId: number, newRole: 'admin' | 'user'): Promise<User> => {
    const response = await api.put(`/users/${userId}/role`, { role: newRole });
    return response.data;
};

export const uploadFile = async (todoId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/todos/${todoId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
