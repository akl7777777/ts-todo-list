import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/todos" element={<TodoList />} />
                    </Route>
                    <Route path="/" element={<Navigate to="/todos" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
