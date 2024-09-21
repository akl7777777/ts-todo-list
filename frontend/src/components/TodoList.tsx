import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { Todo, getTodos, createTodo, updateTodo, deleteTodo, getUsers } from '../services/api';

interface User {
    id: number;
    username: string;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState<number | ''>('');
    const [users, setUsers] = useState<User[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchTodos();
        if (user?.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const fetchTodos = async () => {
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
    };

    const fetchUsers = async () => {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
    };

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoTitle.trim() && user) {
            const assignee = user.role === 'admin' ? (assignedTo as number) : user.id;
            await createTodo(newTodoTitle, newTodoDescription, assignee);
            setNewTodoTitle('');
            setNewTodoDescription('');
            setAssignedTo('');
            fetchTodos();
        }
    };

    const handleToggleTodo = async (id: number, completed: boolean) => {
        await updateTodo(id, { completed });
        fetchTodos();
    };

    const handleDeleteTodo = async (id: number) => {
        if (user?.role === 'admin') {
            await deleteTodo(id);
            fetchTodos();
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateTodo}>
                <TextField
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Add new todo"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    placeholder="Description"
                    fullWidth
                    margin="normal"
                />
                {user?.role === 'admin' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Assign to</InputLabel>
                        <Select
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value as number)}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <Button type="submit" variant="contained" color="primary">
                    Add Todo
                </Button>
            </form>
            <List>
                {todos.map((todo) => (
                    <ListItem key={todo.id} dense button>
                        <Checkbox
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo.id, !todo.completed)}
                        />
                        <ListItemText
                            primary={todo.title}
                            secondary={`${todo.description} | Assigned to: ${todo.assignedTo} | Created by: ${todo.createdBy}`}
                        />
                        {user?.role === 'admin' && (
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default TodoList;
