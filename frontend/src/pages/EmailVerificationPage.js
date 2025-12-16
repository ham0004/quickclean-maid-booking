import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const EmailVerificationPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyEmail(token);
                if (response.success) {
                    setStatus('success');
                    setMessage(response.message || 'Your email has been verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Verification failed. Please try again.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(
                    error.response?.data?.message ||
                    'The verification link is invalid or has expired.'
                );
            }
        };

        if (token) {
            verify();
        }
    }, [token]);

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>

            <div className="relative px-4 mx-auto max-w-md sm:px-6 lg:px-8 w-full">
                <div className="glass-card !p-8 text-center fade-in">
                    {/* Verifying State */}
                    {status === 'verifying' && (
                        <>
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100">
                                <div className="w-10 h-10 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Verifying Your Email
                            </h1>
                            <p className="mt-3 text-gray-600">
                                Please wait while we verify your email address...
                            </p>
                        </>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <>
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-100">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Email Verified! 🎉
                            </h1>
                            <p className="mt-3 text-gray-600">
                                {message}
                            </p>
                            <div className="mt-8 space-y-3">
                                <Link to="/login" className="w-full btn-primary block">
                                    Login to Your Account
                                </Link>
                                <Link to="/" className="w-full btn-outline block">
                                    Go to Homepage
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <>
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-red-100">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Verification Failed
                            </h1>
                            <p className="mt-3 text-gray-600">
                                {message}
                            </p>
                            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-600 mb-3">
                                    The verification link may have expired. You can request a new one by logging in.
                                </p>
                            </div>
                            <div className="mt-6 space-y-3">
                                <Link to="/login" className="w-full btn-primary block">
                                    Go to Login
                                </Link>
                                <Link to="/register" className="w-full btn-outline block">
                                    Create New Account
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
