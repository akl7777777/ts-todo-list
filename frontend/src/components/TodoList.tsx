import React, { useState, useEffect, useCallback } from 'react';
import {
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
    Checkbox, TextField, Button, Paper, Tooltip, Select, MenuItem,
    FormControl, InputLabel, Container, Grid, Typography, Box, Divider,
    Pagination, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ArchiveIcon from '@mui/icons-material/Archive';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SearchIcon from '@mui/icons-material/Search';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { Todo, User, getTodos, createTodo, updateTodo, deleteTodo, uploadFile, getFileUrl, getUsers } from '../services/api';
import dayjs, { Dayjs } from 'dayjs';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [newTodoDueDate, setNewTodoDueDate] = useState<Dayjs | null>(null);
    const [assignedTo, setAssignedTo] = useState<number | ''>('');
    const [files, setFiles] = useState<File[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTodos();
        if (user?.role === 'admin') {
            fetchUsers();
        } else if (user) {
            setUsers([user as User]);
        }
    }, [user, startDate, endDate, page, pageSize, searchTerm]);

    const fetchTodos = useCallback(async () => {
        const { count, todos: fetchedTodos } = await getTodos(startDate?.toDate(), endDate?.toDate(), page, pageSize, searchTerm);
        setTodos(fetchedTodos);
        setTotalCount(count);
    }, [startDate, endDate, page, pageSize, searchTerm]);

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
            const assignee = user.role === 'admin' ? (assignedTo || user.id) : user.id;
            const todo = await createTodo(newTodoTitle, newTodoDescription, assignee, newTodoDueDate?.toDate());
            if (files.length > 0) {
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append('files', file);
                });
                await uploadFile(todo.id, formData);
            }
            setNewTodoTitle('');
            setNewTodoDescription('');
            setNewTodoDueDate(null);
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

    const getFileIcon = (fileName: string) => {
        if (fileName.match(/\.(pdf)$/i)) {
            return <PictureAsPdfIcon fontSize="small" />;
        } else if (fileName.match(/\.(doc|docx)$/i)) {
            return <DescriptionIcon fontSize="small" />;
        } else if (fileName.match(/\.(xls|xlsx)$/i)) {
            return <TableChartIcon fontSize="small" />;
        } else if (fileName.match(/\.(ppt|pptx)$/i)) {
            return <SlideshowIcon fontSize="small" />;
        } else if (fileName.match(/\.(zip|rar|7z)$/i)) {
            return <ArchiveIcon fontSize="small" />;
        } else if (fileName.match(/\.(txt)$/i)) {
            return <TextSnippetIcon fontSize="small" />;
        } else {
            return <InsertDriveFileIcon fontSize="small" />;
        }
    };

    const renderAttachment = (attachment: string) => (
        <>
            {attachment.match(/\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i) ? (
                <a href={getFileUrl(attachment)} target="_blank" rel="noopener noreferrer">
                    <img
                        src={getFileUrl(attachment)}
                        alt={getOriginalFileName(attachment)}
                        style={{ maxHeight: '100px', marginRight: '10px' }}
                    />
                </a>
            ) : attachment.match(/\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i) ? (
                <a href={getFileUrl(attachment)} target="_blank" rel="noopener noreferrer">
                    <video
                        src={getFileUrl(attachment)}
                        style={{ maxHeight: '100px', marginRight: '10px' }}
                        controls
                    />
                </a>
            ) : (
                <a href={getFileUrl(attachment)} target="_blank" rel="noopener noreferrer">
                    {getFileIcon(attachment)}
                </a>
            )}
            <Tooltip title={getOriginalFileName(attachment)}>
                <Typography variant="body2" color="textSecondary">
                    {getOriginalFileName(attachment)}
                </Typography>
            </Tooltip>
        </>
    );

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) {
            return dayjs(a.dueDate).diff(dayjs(b.dueDate));
        }
        return a.completed ? 1 : -1;
    });

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    待办事项列表
                </Typography>
                <Grid container spacing={3} alignItems="center" mb={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="搜索待办事项"
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            label="开始日期"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            slots={{
                                textField: TextField,
                            }}
                            slotProps={{
                                textField: { fullWidth: true },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            label="结束日期"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            slots={{
                                textField: TextField,
                            }}
                            slotProps={{
                                textField: { fullWidth: true },
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3}>
                            <Box p={3}>
                                <Typography variant="h6" gutterBottom>
                                    Add New To do
                                </Typography>
                                <form onSubmit={handleCreateTodo}>
                                    <TextField
                                        value={newTodoTitle}
                                        onChange={(e) => setNewTodoTitle(e.target.value)}
                                        placeholder="Todo title"
                                        fullWidth
                                        margin="normal"
                                        onPaste={handlePaste}
                                    />
                                    <TextField
                                        value={newTodoDescription}
                                        onChange={(e) => setNewTodoDescription(e.target.value)}
                                        placeholder="Todo description"
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={3}
                                    />
                                    <DatePicker
                                        label="Due Date"
                                        value={newTodoDueDate}
                                        onChange={(date) => setNewTodoDueDate(date)}
                                        slots={{
                                            textField: TextField,
                                        }}
                                        slotProps={{
                                            textField: { fullWidth: true, margin: "normal" },
                                        }}
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
                                    <Paper {...getRootProps()} sx={{ p: 2, textAlign: 'center', mt: 2, cursor: 'pointer' }}>
                                        <input {...getInputProps()} />
                                        {isDragActive ? (
                                            <Typography>Drop the files here ...</Typography>
                                        ) : (
                                            <Typography>Drag 'n' drop files here, or click to select</Typography>
                                        )}
                                    </Paper>
                                    {files.length > 0 && (
                                        <Box mt={2}>
                                            <Typography variant="subtitle2">Attached files:</Typography>
                                            <List dense>
                                                {files.map((file, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText primary={file.name} />
                                                        {file.type.startsWith('image/') && (
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}
                                                                style={{ maxHeight: '100px', marginLeft: '10px' }}
                                                            />
                                                        )}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}
                                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                        Add Todo
                                    </Button>
                                </form>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3}>
                            <List>
                                {sortedTodos.map((todo) => (
                                    <React.Fragment key={todo.id}>
                                        <ListItem dense>
                                            <Checkbox
                                                checked={todo.completed}
                                                onChange={() => handleToggleTodo(todo.id, !todo.completed)}
                                            />
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1">
                                                        {todo.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {todo.description}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {`Due: ${dayjs(todo.dueDate).format('YYYY-MM-DD')} | Assigned to: ${users.find(u => u.id === todo.assignedTo)?.username || 'Unknown'} | Created by: ${users.find(u => u.id === todo.createdBy)?.username || 'Unknown'}`}
                                                        </Typography>
                                                        {((todo.attachments && todo.attachments.length > 0) || todo.attachment) && (
                                                            <Box mt={1}>
                                                                {todo.attachment && (
                                                                    <Box mt={1}>
                                                                        {todo.attachment.split(',').map((attachment, index) => (
                                                                            <Box key={index} display="flex" alignItems="center" mb={1}>
                                                                                {renderAttachment(attachment)}
                                                                            </Box>
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Box>
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
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                            <Pagination
                                count={Math.ceil(totalCount / pageSize)}
                                page={page}
                                onChange={(event, value) => {
                                    setPage(value);
                                }}
                                color="primary"
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TodoList;