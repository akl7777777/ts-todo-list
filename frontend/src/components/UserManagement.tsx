import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Select, MenuItem, FormControl, InputLabel, Container, Typography, Box,
    Grid, TablePagination
} from '@mui/material';
import { getUsers, updateUserRole } from '../services/api';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
        try {
            await updateUserRole(userId, newRole);
            setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Management
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={3}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>
                                                    <FormControl variant="outlined" size="small">
                                                        <InputLabel id={`role-select-label-${user.id}`}>Role</InputLabel>
                                                        <Select
                                                            labelId={`role-select-label-${user.id}`}
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                                                            label="Role"
                                                        >
                                                            <MenuItem value="user">User</MenuItem>
                                                            <MenuItem value="admin">Admin</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={users.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default UserManagement;
