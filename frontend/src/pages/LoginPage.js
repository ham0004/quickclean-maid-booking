import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, resendVerification } from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [needsVerification, setNeedsVerification] = useState(false);
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setNeedsVerification(false);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await login(formData);

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: 'Login successful! Redirecting...'
                });

                // Redirect based on role
                setTimeout(() => {
                    const user = response.user;
                    if (user.role === 'admin') {
                        navigate('/admin/maids');
                    } else if (user.role === 'maid') {
                        navigate('/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                }, 1500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            const needsEmailVerification = error.response?.data?.needsVerification;

            setMessage({ type: 'error', text: errorMessage });
            setNeedsVerification(needsEmailVerification);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setIsResending(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await resendVerification(formData.email);
            setMessage({
                type: 'success',
                text: response.message || 'Verification email sent! Please check your inbox.'
            });
            setNeedsVerification(false);
            // Start 60-second cooldown
            setCooldownSeconds(60);
        } catch (error) {
            // Check for rate limit error
            if (error.response?.status === 429) {
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Too many requests. Please try again later.'
                });
                // Set cooldown based on server response or default to 15 minutes
                setCooldownSeconds(error.response?.data?.retryAfter ? error.response.data.retryAfter * 60 : 60);
            } else {
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Failed to resend verification email.'
                });
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"></div>

            <div className="relative px-4 mx-auto max-w-md sm:px-6 lg:px-8 pt-16">
                <div className="glass-card !p-8 fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg">
                                <span className="text-2xl">🧹</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome Back!
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Login to your QuickClean account
                        </p>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? '✅ ' : '❌ '}
                            {message.text}
                        </div>
                    )}

                    {/* Resend Verification */}
                    {needsVerification && (
                        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                            <p className="text-sm text-yellow-800 mb-3">
                                📧 Your email is not verified yet. Would you like us to resend the verification email?
                            </p>
                            <button
                                onClick={handleResendVerification}
                                disabled={isResending || cooldownSeconds > 0}
                                className="text-sm font-medium text-yellow-700 hover:text-yellow-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResending
                                    ? 'Sending...'
                                    : cooldownSeconds > 0
                                        ? `Resend in ${cooldownSeconds}s`
                                        : 'Resend Verification Email'}
                            </button>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className={`input-field ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`input-field ${errors.password ? 'input-error' : ''}`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="spinner mr-2"></span>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Social Login (placeholder) */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
