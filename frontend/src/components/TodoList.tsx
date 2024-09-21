import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { Todo, getTodos, createTodo, updateTodo, deleteTodo } from '../services/api';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
    };

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoTitle.trim() && user) {
            await createTodo(newTodoTitle, "", user.id); // 使用空字符串作为描述，当前用户ID作为assignedTo
            setNewTodoTitle('');
            fetchTodos();
        }
    };

    const handleToggleTodo = async (id: number, completed: boolean) => {
        await updateTodo(id, { completed });
        fetchTodos();
    };

    const handleDeleteTodo = async (id: number) => {
        await deleteTodo(id);
        fetchTodos();
    };

    return (
        <div>
            {user?.role === 'admin' && (
                <form onSubmit={handleCreateTodo}>
                    <TextField
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="Add new todo"
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Add Todo
                    </Button>
                </form>
            )}
            <List>
                {todos.map((todo) => (
                    <ListItem key={todo.id} dense button>
                        <Checkbox
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo.id, !todo.completed)}
                        />
                        <ListItemText
                            primary={todo.title}
                            secondary={`Assigned to: ${todo.assignedTo} | Created by: ${todo.createdBy}`}
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
