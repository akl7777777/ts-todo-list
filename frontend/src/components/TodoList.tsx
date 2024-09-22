import React, { useState, useEffect, useCallback } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, TextField, Button, Paper, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { Todo, User, getTodos, createTodo, updateTodo, deleteTodo, uploadFile, getFileUrl, getUsers } from '../services/api';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState<number | ''>('');
    const [files, setFiles] = useState<File[]>([]);
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoTitle.trim() && user) {
            const assignee = user.role === 'admin' ? (assignedTo as number) : user.id;
            const todo = await createTodo(newTodoTitle, newTodoDescription, assignee);
            if (files.length > 0) {
                for (const file of files) {
                    await uploadFile(todo.id, file);
                }
            }
            setNewTodoTitle('');
            setNewTodoDescription('');
            setAssignedTo('');
            setFiles([]);
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

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        const pastedFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) pastedFiles.push(blob);
            }
        }
        setFiles(prevFiles => [...prevFiles, ...pastedFiles]);
    };

    const getOriginalFileName = (fileName: string) => {
        const parts = fileName.split('-');
        return parts.slice(2).join('-');
    };

    return (
        <div>
            <form onSubmit={handleCreateTodo}>
                <TextField
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Add new todo title"
                    fullWidth
                    margin="normal"
                    onPaste={handlePaste}
                />
                <TextField
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    placeholder="Add todo description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
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
                <Paper {...getRootProps()} style={{ padding: 20, textAlign: 'center', marginTop: 10 }}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    )}
                </Paper>
                {files.length > 0 && (
                    <div>
                        <h4>Attached files:</h4>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <Button type="submit" variant="contained" color="primary">
                    Add To do
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
                            secondary={
                                <>
                                    <div>{todo.description}</div>
                                    <div>{`Assigned to: ${users.find(u => u.id === todo.assignedTo)?.username || 'Unknown'} | Created by: ${users.find(u => u.id === todo.createdBy)?.username || 'Unknown'}`}</div>
                                    {todo.attachment && (
                                        <Tooltip title={getOriginalFileName(todo.attachment)}>
                                            <IconButton
                                                size="small"
                                                href={getFileUrl(todo.attachment)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <AttachFileIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </>
                            }
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
