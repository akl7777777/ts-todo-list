import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Todo, getAllTodos, createTodo, updateTodo, deleteTodo } from '../services/api';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const fetchedTodos = await getAllTodos();
        setTodos(fetchedTodos);
    };

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoTitle.trim()) {
            const newTodo = await createTodo(newTodoTitle);
            setTodos([...todos, newTodo]);
            setNewTodoTitle('');
        }
    };

    const handleToggleTodo = async (id: number, completed: boolean) => {
        await updateTodo(id, { completed });
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed } : todo));
    };

    const handleDeleteTodo = async (id: number) => {
        await deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
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
                        <ListItemText primary={todo.title} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default TodoList;
