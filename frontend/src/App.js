import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import AdminCategoryPage from './pages/AdminCategoryPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify/:token" element={<EmailVerificationPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin/categories" element={<AdminCategoryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

