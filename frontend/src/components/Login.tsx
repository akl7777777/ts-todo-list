import React, {useState, useEffect} from 'react';
import {TextField, Button, Typography, Container, Alert} from '@mui/material';
import {login} from '../services/api';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const navigate = useNavigate();
    const {login: authLogin} = useAuth();

    useEffect(() => {
        const expired = new URLSearchParams(window.location.search).get('expired');
        setSessionExpired(expired === 'true');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login(email, password);
            console.log('Login response:', response);
            if (response.token && response.user) {
                authLogin(response.token, response.user);
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
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {sessionExpired && (
                <Alert severity="warning" sx={{mb: 2}}>
                    您的会话已过期，请重新登录。
                </Alert>
            )}
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
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 2}}>
                    Login
                </Button>
            </form>
            <Typography align="center" style={{marginTop: '1rem'}}>
                Don't have an account?{' '}
                <Link to="/register">
                    Register here
                </Link>
            </Typography>
        </Container>
    );
};

export default Login;
