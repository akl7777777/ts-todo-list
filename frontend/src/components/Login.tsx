import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login(email, password);
            console.log('Login response:', response);
            if (response.token && response.userId && response.role) {
                const user = {
                    id: response.userId,
                    role: response.role,
                    // 如果后端没有返回用户名，我们可以暂时使用邮箱作为用户名
                    username: email.split('@')[0]
                };
                authLogin(response.token, user);
                navigate('/todos');
            } else {
                throw new Error('Invalid login response');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;
