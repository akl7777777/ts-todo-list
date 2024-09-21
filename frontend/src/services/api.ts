import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5566/api';

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export const getAllTodos = async (): Promise<Todo[]> => {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
};

export const createTodo = async (title: string): Promise<Todo> => {
    const response = await axios.post(`${API_URL}/todos`, { title });
    return response.data;
};

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
    const response = await axios.put(`${API_URL}/todos/${id}`, updates);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/todos/${id}`);
};

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data;
};
