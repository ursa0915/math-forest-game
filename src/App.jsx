import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:grade" element={<GamePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}
