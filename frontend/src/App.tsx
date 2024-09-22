import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import UserManagement from './components/UserManagement';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
                <Router>
                    <Navigation />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/todos" element={<TodoList />} />
                            <Route path="/users" element={<UserManagement />} />
                        </Route>
                        <Route path="/" element={<Navigate to="/todos" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </LocalizationProvider>
    );
}

export default App;
