import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';
import { registerMaid } from '../services/maidService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        // Maid-specific fields
        experience: '',
        skills: '',
        bio: '',
        hourlyRate: '',
        idType: 'NID',
        idNumber: ''
    });
    const [idDocument, setIdDocument] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
        }

        // Password validation
        const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Maid-specific validations
        if (formData.role === 'maid') {
            if (!formData.experience) {
                newErrors.experience = 'Experience is required';
            }
            if (!formData.hourlyRate) {
                newErrors.hourlyRate = 'Hourly rate is required';
            }
            if (!formData.idNumber) {
                newErrors.idNumber = 'ID number is required';
            }
            if (!idDocument) {
                newErrors.idDocument = 'ID document is required';
            }
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    idDocument: 'Only PDF, JPG, and PNG files are allowed'
                }));
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    idDocument: 'File size must be less than 5MB'
                }));
                return;
            }
            setIdDocument(file);
            setErrors(prev => ({ ...prev, idDocument: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            let response;

            if (formData.role === 'maid') {
                // Parse skills from comma-separated string
                const skillsArray = formData.skills
                    ? formData.skills.split(',').map(s => s.trim()).filter(s => s)
                    : [];

                response = await registerMaid({
                    ...formData,
                    skills: skillsArray,
                    idDocument: idDocument
                });
            } else {
                const { confirmPassword, experience, skills, bio, hourlyRate, idType, idNumber, ...submitData } = formData;
                response = await register(submitData);
            }

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: response.message || 'Registration successful! Please check your email to verify your account.'
                });
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    role: 'customer',
                    experience: '',
                    skills: '',
                    bio: '',
                    hourlyRate: '',
                    idType: 'NID',
                    idNumber: ''
                });
                setIdDocument(null);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>

            <div className="relative px-4 mx-auto max-w-md sm:px-6 lg:px-8 pt-10">
                <div className="glass-card !p-8 fade-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg">
                                <span className="text-2xl">🧹</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create Your Account
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Join QuickClean and start booking today
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`input-field ${errors.name ? 'input-error' : ''}`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

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
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="01234567890"
                                className={`input-field ${errors.phone ? 'input-error' : ''}`}
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
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
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I want to...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${formData.role === 'customer'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">🏠</span>
                                    <span className={`text-sm font-medium ${formData.role === 'customer' ? 'text-primary-700' : 'text-gray-700'}`}>
                                        Book a Maid
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'maid' }))}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${formData.role === 'maid'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">👩‍🍳</span>
                                    <span className={`text-sm font-medium ${formData.role === 'maid' ? 'text-primary-700' : 'text-gray-700'}`}>
                                        Work as a Maid
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Maid-specific fields */}
                        {formData.role === 'maid' && (
                            <div className="space-y-5 pt-4 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-900">Professional Information</h3>

                                {/* Experience & Hourly Rate */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                            Experience (years)
                                        </label>
                                        <input
                                            type="number"
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="2"
                                            className={`input-field ${errors.experience ? 'input-error' : ''}`}
                                        />
                                        {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hourly Rate ($)
                                        </label>
                                        <input
                                            type="number"
                                            id="hourlyRate"
                                            name="hourlyRate"
                                            value={formData.hourlyRate}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            placeholder="25"
                                            className={`input-field ${errors.hourlyRate ? 'input-error' : ''}`}
                                        />
                                        {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                                        Skills (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="Cleaning, Laundry, Cooking"
                                        className="input-field"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bio (optional)
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        maxLength="500"
                                        placeholder="Tell customers about yourself..."
                                        className="input-field"
                                    />
                                </div>

                                <h3 className="font-semibold text-gray-900 pt-2">ID Verification</h3>

                                {/* ID Type & Number */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
                                            ID Type
                                        </label>
                                        <select
                                            id="idType"
                                            name="idType"
                                            value={formData.idType}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="NID">NID</option>
                                            <option value="Passport">Passport</option>
                                            <option value="Driving License">Driving License</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            ID Number
                                        </label>
                                        <input
                                            type="text"
                                            id="idNumber"
                                            name="idNumber"
                                            value={formData.idNumber}
                                            onChange={handleChange}
                                            placeholder="123456789"
                                            className={`input-field ${errors.idNumber ? 'input-error' : ''}`}
                                        />
                                        {errors.idNumber && <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>}
                                    </div>
                                </div>

                                {/* Document Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload ID Document
                                    </label>
                                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${errors.idDocument ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400'
                                        }`}>
                                        <input
                                            type="file"
                                            id="idDocument"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                        />
                                        <label htmlFor="idDocument" className="cursor-pointer">
                                            {idDocument ? (
                                                <div className="text-green-600">
                                                    <span className="text-2xl">✅</span>
                                                    <p className="mt-2 text-sm">{idDocument.name}</p>
                                                    <p className="text-xs text-gray-500">Click to change</p>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500">
                                                    <span className="text-2xl">📄</span>
                                                    <p className="mt-2 text-sm">Click to upload</p>
                                                    <p className="text-xs">PDF, JPG, PNG (max 5MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {errors.idDocument && <p className="mt-1 text-sm text-red-600">{errors.idDocument}</p>}
                                </div>

                                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    ℹ️ Your profile will be reviewed by an admin before you can start accepting bookings.
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="spinner mr-2"></span>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                            Login here
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="mt-4 text-xs text-center text-gray-500">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
