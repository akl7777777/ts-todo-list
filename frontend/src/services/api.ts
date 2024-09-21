import axios, { AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:5566/api';

// 定义 To do 接口
export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    assignedTo: number;
    createdBy: number;
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
