import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import AdminMaidApprovalPage from './pages/AdminMaidApprovalPage';
import MaidListingPage from './pages/MaidListingPage';
import MaidProfilePage from './pages/MaidProfilePage';
import BookingPage from './pages/BookingPage';

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
                    <Route path="/admin/maids" element={<AdminMaidApprovalPage />} />
                    <Route path="/maids" element={<MaidListingPage />} />
                    <Route path="/maids/:id" element={<MaidProfilePage />} />
                    <Route path="/book/:maidId" element={<BookingPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
