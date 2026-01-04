import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaidById } from '../services/maidsService';
import { createBooking } from '../services/bookingService';

const BookingPage = () => {
    const { maidId } = useParams();
    const navigate = useNavigate();

    const [maid, setMaid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        serviceId: '',
        bookingDate: '',
        bookingTime: '',
        duration: 2,
        address: {
            street: '',
            city: '',
            postalCode: ''
        },
        specialInstructions: ''
    });

    const [formErrors, setFormErrors] = useState({});

    // Time slots from 7 AM to 9 PM (30-minute intervals)
    const timeSlots = [];
    for (let hour = 7; hour < 21; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Get user's address from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.address) {
            setFormData(prev => ({
                ...prev,
                address: {
                    street: user.address.street || '',
                    city: user.address.city || '',
                    postalCode: user.address.zipCode || ''
                }
            }));
        }
    }, []);

    // Fetch maid details
    useEffect(() => {
        const fetchMaid = async () => {
            try {
                setLoading(true);
                const data = await getMaidById(maidId);
                setMaid(data.maid);

                // Set default service if available
                if (data.maid.availableServices?.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        serviceId: data.maid.availableServices[0]._id
                    }));
                }
            } catch (err) {
                console.error('Error fetching maid:', err);
                setError('Failed to load maid details');
            } finally {
                setLoading(false);
            }
        };

        if (maidId) {
            fetchMaid();
        }
    }, [maidId]);

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Calculate total price
    const calculateTotalPrice = () => {
        const selectedService = maid?.availableServices?.find(s => s._id === formData.serviceId);
        if (selectedService) {
            return selectedService.basePrice * formData.duration;
        }
        return 0;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'duration' ? parseInt(value) : value
            }));
        }

        // Clear error for this field
        setFormErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.serviceId) {
            errors.serviceId = 'Please select a service';
        }
        if (!formData.bookingDate) {
            errors.bookingDate = 'Please select a date';
        }
        if (!formData.bookingTime) {
            errors.bookingTime = 'Please select a time';
        }
        if (!formData.address.street) {
            errors['address.street'] = 'Street address is required';
        }
        if (!formData.address.city) {
            errors['address.city'] = 'City is required';
        }
        if (!formData.address.postalCode) {
            errors['address.postalCode'] = 'Postal code is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const bookingData = {
                maidId,
                serviceId: formData.serviceId,
                bookingDate: formData.bookingDate,
                bookingTime: formData.bookingTime,
                duration: formData.duration,
                address: formData.address,
                specialInstructions: formData.specialInstructions
            };

            await createBooking(bookingData);
            setSuccess(true);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="booking-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading booking form...</p>
                </div>
            </div>
        );
    }

    if (error && !maid) {
        return (
            <div className="booking-page">
                <div className="error-container">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/maids')} className="back-btn">
                        ← Back to Maids
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="booking-page">
                <div className="success-container">
                    <div className="success-icon">🎉</div>
                    <h2>Booking Submitted!</h2>
                    <p>Your booking request has been sent to {maid?.name}.</p>
                    <p className="success-note">You will receive a confirmation email shortly.</p>
                    <p className="redirect-note">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-container">
                <div className="booking-header">
                    <button className="back-link" onClick={() => navigate(`/maids/${maidId}`)}>
                        ← Back to Profile
                    </button>
                    <h1>Book a Service</h1>
                    <p>Complete the form below to book {maid?.name}</p>
                </div>

                <div className="booking-content">
                    {/* Maid Summary Card */}
                    <div className="maid-summary-card">
                        <img
                            src={maid?.profileImage || '/images/default-profile.png'}
                            alt={maid?.name}
                            className="maid-avatar"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                        />
                        <div className="maid-summary-info">
                            <h3>{maid?.name}</h3>
                            <p>⭐ {maid?.rating?.toFixed(1) || '0.0'} • {maid?.experience || 0} years exp</p>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="booking-form">
                        {error && (
                            <div className="form-error-banner">
                                {error}
                            </div>
                        )}

                        {/* Service Selection */}
                        <div className="form-group">
                            <label htmlFor="serviceId">Select Service *</label>
                            <select
                                id="serviceId"
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleInputChange}
                                className={formErrors.serviceId ? 'error' : ''}
                            >
                                <option value="">-- Choose a service --</option>
                                {maid?.availableServices?.map(service => (
                                    <option key={service._id} value={service._id}>
                                        {service.name} - ৳{service.basePrice} {service.priceUnit}
                                    </option>
                                ))}
                            </select>
                            {formErrors.serviceId && <span className="error-text">{formErrors.serviceId}</span>}
                        </div>

                        {/* Date Selection */}
                        <div className="form-group">
                            <label htmlFor="bookingDate">Select Date *</label>
                            <input
                                type="date"
                                id="bookingDate"
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleInputChange}
                                min={getMinDate()}
                                className={formErrors.bookingDate ? 'error' : ''}
                            />
                            {formErrors.bookingDate && <span className="error-text">{formErrors.bookingDate}</span>}
                        </div>

                        {/* Time Selection */}
                        <div className="form-group">
                            <label htmlFor="bookingTime">Select Time *</label>
                            <select
                                id="bookingTime"
                                name="bookingTime"
                                value={formData.bookingTime}
                                onChange={handleInputChange}
                                className={formErrors.bookingTime ? 'error' : ''}
                            >
                                <option value="">-- Choose a time --</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            {formErrors.bookingTime && <span className="error-text">{formErrors.bookingTime}</span>}
                        </div>

                        {/* Duration Slider */}
                        <div className="form-group">
                            <label htmlFor="duration">Duration: {formData.duration} hour(s)</label>
                            <input
                                type="range"
                                id="duration"
                                name="duration"
                                min="1"
                                max="8"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="duration-slider"
                            />
                            <div className="duration-labels">
                                <span>1 hr</span>
                                <span>8 hrs</span>
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="form-section">
                            <h3>Service Address</h3>

                            <div className="form-group">
                                <label htmlFor="address.street">Street Address *</label>
                                <input
                                    type="text"
                                    id="address.street"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    placeholder="Enter street address"
                                    className={formErrors['address.street'] ? 'error' : ''}
                                />
                                {formErrors['address.street'] && <span className="error-text">{formErrors['address.street']}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="address.city">City *</label>
                                    <input
                                        type="text"
                                        id="address.city"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        className={formErrors['address.city'] ? 'error' : ''}
                                    />
                                    {formErrors['address.city'] && <span className="error-text">{formErrors['address.city']}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address.postalCode">Postal Code *</label>
                                    <input
                                        type="text"
                                        id="address.postalCode"
                                        name="address.postalCode"
                                        value={formData.address.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter postal code"
                                        className={formErrors['address.postalCode'] ? 'error' : ''}
                                    />
                                    {formErrors['address.postalCode'] && <span className="error-text">{formErrors['address.postalCode']}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="form-group">
                            <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                            <textarea
                                id="specialInstructions"
                                name="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={handleInputChange}
                                placeholder="Any special requests or instructions for the maid..."
                                rows="4"
                                maxLength="1000"
                            />
                            <span className="char-count">{formData.specialInstructions.length}/1000</span>
                        </div>

                        {/* Price Summary */}
                        <div className="price-summary">
                            <div className="price-row">
                                <span>Service Price:</span>
                                <span>৳{maid?.availableServices?.find(s => s._id === formData.serviceId)?.basePrice || 0}/hr</span>
                            </div>
                            <div className="price-row">
                                <span>Duration:</span>
                                <span>{formData.duration} hour(s)</span>
                            </div>
                            <div className="price-row total">
                                <span>Total:</span>
                                <span>৳{calculateTotalPrice()}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-booking-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Submitting...
                                </>
                            ) : (
                                '📅 Confirm Booking'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
