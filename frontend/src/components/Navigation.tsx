import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Todo App
                </Typography>
                <Button color="inherit" component={Link} to="/todos">
                    Todos
                </Button>
                {user?.role === 'admin' && (
                    <Button color="inherit" component={Link} to="/users">
                        User Management
                    </Button>
                )}
                <Button color="inherit" onClick={logout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;
