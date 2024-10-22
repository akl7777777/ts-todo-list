import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5566';
const API_PREFIX = process.env.REACT_APP_API_PREFIX || '/api';
const FILE_BASE_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_FILE_BASE_URL || 'http://localhost:5566');

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : `${API_BASE_URL}${API_PREFIX}`;

const api = axios.create({
    baseURL: API_URL,
});

export const getFileUrl = (fileName: string) => `${FILE_BASE_URL}/uploads/${fileName}`;

// const api = axios.create({
//     baseURL: API_URL,
// });

// 定义 To do 接口
export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    assignedTo: number;
    createdBy: number;
    dueDate?: Date;
    attachment?: string; // 保留这个以保持向后兼容
    attachments?: string[]; // 添加这个新字段
}

// 定义 User 接口
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储的身份验证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 重定向到登录页面
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const getTodos = async (startDate?: Date | null, endDate?: Date | null, page = 1, pageSize = 10, searchTerm = ''): Promise<{ count: number, todos: Todo[] }> => {
    let url = `/todos?page=${page}&pageSize=${pageSize}`;
    if (startDate && endDate) {
        url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    }
    if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    const response = await api.get(url);
    return response.data;
};

export const createTodo = async (title: string, description: string, assignedTo: number, dueDate?: Date): Promise<Todo> => {
    const response = await api.post('/todos', { title, description, assignedTo, dueDate });
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

export const uploadFile = async (todoId: number, formData: FormData) => {
    const response = await api.post(`/todos/${todoId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;
