import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, resendVerification } from '../services/authService';
import MaidBookingsTab from '../components/MaidBookingsTab';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState({ type: '', text: '' });
    const [isResending, setIsResending] = useState(false);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    // Cooldown timer effect
    useEffect(() => {
        let timer;
        if (cooldownSeconds > 0) {
            timer = setTimeout(() => {
                setCooldownSeconds(cooldownSeconds - 1);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldownSeconds]);

    // Fetch current user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await getCurrentUser();
                if (response.success) {
                    setUser(response.user);
                } else {
                    setError('Failed to load user data');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Failed to load user data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    // Handle resend verification email
    const handleResendVerification = async () => {
        setIsResending(true);
        setResendMessage({ type: '', text: '' });

        try {
            const response = await resendVerification(user.email);
            setResendMessage({
                type: 'success',
                text: response.message || 'Verification email sent! Please check your inbox.'
            });
            setCooldownSeconds(60);
        } catch (error) {
            if (error.response?.status === 429) {
                setResendMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Too many requests. Please try again later.'
                });
                setCooldownSeconds(error.response?.data?.retryAfter ? error.response.data.retryAfter * 60 : 60);
            } else {
                setResendMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Failed to resend verification email.'
                });
            }
        } finally {
            setIsResending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center">
                <div className="glass-card !p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/login" className="btn-primary">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>

            <div className="relative px-4 mx-auto max-w-6xl sm:px-6 lg:px-8 pt-8">
                {/* Verification Banner */}
                {user && !user.isVerified && (
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-sm fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">📧</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-yellow-800">Email Not Verified</h3>
                                    <p className="text-sm text-yellow-700">
                                        Please verify your email address to access all features. Check your inbox for a verification link.
                                    </p>
                                    {resendMessage.text && (
                                        <p className={`mt-2 text-sm ${resendMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {resendMessage.type === 'success' ? '✅ ' : '❌ '}{resendMessage.text}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleResendVerification}
                                disabled={isResending || cooldownSeconds > 0}
                                className="flex-shrink-0 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResending
                                    ? 'Sending...'
                                    : cooldownSeconds > 0
                                        ? `Resend in ${cooldownSeconds}s`
                                        : 'Resend Email'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Welcome Header */}
                <div className="glass-card !p-8 mb-6 fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800'
                                    : user?.role === 'maid'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                </span>
                                {user?.isVerified && (
                                    <span className="inline-flex items-center text-green-600 text-sm">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content based on role */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Common cards for all users */}
                    <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">👤</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">My Profile</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">View and update your personal information</p>
                        <Link to="/profile" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                            View Profile →
                        </Link>
                    </div>

                    {/* Customer-specific cards */}
                    {user?.role === 'customer' && (
                        <>
                            <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📅</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">My Bookings</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">View and manage your service bookings</p>
                                <Link to="/bookings" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    View Bookings →
                                </Link>
                            </div>

                            <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🔍</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Find Maids</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">Search for available cleaning service providers</p>
                                <Link to="/search" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    Search Now →
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Maid-specific cards */}
                    {user?.role === 'maid' && (
                        <>
                            <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Job Requests</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">View and respond to booking requests</p>
                                <Link to="/maid/requests" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    View Requests →
                                </Link>
                            </div>

                            <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">My Earnings</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">Track your earnings and payment history</p>
                                <Link to="/maid/earnings" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    View Earnings →
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Admin-specific cards */}
                    {user?.role === 'admin' && (
                        <>
                            <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📁</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Categories</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">Manage service categories</p>
                                <Link to="/admin/categories" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    Manage →
                                </Link>
                            </div>

                            <div className="glass-card !p-6 hover:shadow-xl transition-shadow fade-in">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Maid Approvals</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">Review and approve maid registrations</p>
                                <Link to="/admin/maids" className="text-primary-600 font-medium text-sm hover:text-primary-700">
                                    Review →
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Stats (placeholder) */}
                <div className="mt-8 glass-card !p-6 fade-in">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-primary-600">0</p>
                            <p className="text-sm text-gray-600">
                                {user?.role === 'customer' ? 'Bookings' : user?.role === 'maid' ? 'Jobs' : 'Users'}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-green-600">0</p>
                            <p className="text-sm text-gray-600">
                                {user?.role === 'customer' ? 'Completed' : user?.role === 'maid' ? 'Completed' : 'Maids'}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-blue-600">0</p>
                            <p className="text-sm text-gray-600">
                                {user?.role === 'customer' ? 'Pending' : user?.role === 'maid' ? 'Pending' : 'Pending'}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-bold text-purple-600">5.0</p>
                            <p className="text-sm text-gray-600">Rating</p>
                        </div>
                    </div>
                </div>

                {/* Maid Bookings Section */}
                {user?.role === 'maid' && (
                    <div className="mt-8 glass-card !p-6 fade-in">
                        <MaidBookingsTab />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
