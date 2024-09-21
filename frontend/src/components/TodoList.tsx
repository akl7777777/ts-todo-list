import React, { useState, useEffect, useCallback } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, TextField, Button, Paper, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { Todo, getTodos, createTodo, updateTodo, deleteTodo, uploadFile } from '../services/api';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoTitle.trim() && user) {
            const todo = await createTodo(newTodoTitle, "", user.id);
            if (files.length > 0) {
                for (const file of files) {
                    await uploadFile(todo.id, file);
                }
            }
            setNewTodoTitle('');
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

    const getFileNameFromPath = (path: string) => {
        return path.split('/').pop() || path;
    };

    const getOriginalFileName = (fileName: string) => {
        const parts = fileName.split('-');
        return parts.slice(2).join('-'); // 跳过时间戳和唯一标识符
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
                    onPaste={handlePaste}
                />
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
                                    {`Assigned to: ${todo.assignedTo} | Created by: ${todo.createdBy}`}
                                    {todo.attachment && (
                                        <Tooltip title={getOriginalFileName(todo.attachment)}>
                                            <IconButton size="small" href={`http://localhost:5566/uploads/${todo.attachment}`} target="_blank">
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
