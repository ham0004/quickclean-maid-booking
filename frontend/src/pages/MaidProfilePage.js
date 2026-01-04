import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaidById } from '../services/maidsService';

const MaidProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [maid, setMaid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaid = async () => {
            try {
                setLoading(true);
                const data = await getMaidById(id);
                setMaid(data.maid);
            } catch (err) {
                console.error('Error fetching maid:', err);
                setError('Failed to load maid profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchMaid();
    }, [id]);

    const handleBookNow = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login', { state: { from: `/maids/${id}` } });
            return;
        }
        if (user.role !== 'customer') {
            alert('Only customers can book maids.');
            return;
        }
        // Navigate to booking - will be implemented in Feature 2
        navigate(`/book/${id}`);
    };

    if (loading) {
        return (
            <div className="maid-profile-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !maid) {
        return (
            <div className="maid-profile-page">
                <div className="error-container">
                    <h2>⚠️ Profile Not Found</h2>
                    <p>{error || 'This maid profile does not exist.'}</p>
                    <button onClick={() => navigate('/maids')} className="back-btn">
                        ← Back to Maids
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="maid-profile-page">
            <div className="profile-header">
                <button className="back-link" onClick={() => navigate('/maids')}>
                    ← Back to Maids
                </button>
            </div>

            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="profile-image-container">
                        <img
                            src={maid.profileImage || '/images/default-profile.png'}
                            alt={maid.name}
                            className="profile-image"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                            }}
                        />
                    </div>
                    <h1 className="profile-name">{maid.name}</h1>
                    {maid.rating > 0 && (
                        <div className="profile-rating">
                            <span className="stars">⭐ {maid.rating.toFixed(1)}</span>
                            <span className="reviews">({maid.totalReviews} reviews)</span>
                        </div>
                    )}
                    <div className="profile-experience">
                        <span className="badge">🎯 {maid.experience || 0} years experience</span>
                    </div>
                    <button className="book-now-btn" onClick={handleBookNow}>
                        📅 Book Now
                    </button>
                    <div className="contact-info">
                        <p><strong>📧 Email:</strong> {maid.email}</p>
                        <p><strong>📞 Phone:</strong> {maid.phone}</p>
                    </div>
                </div>

                <div className="profile-main">
                    {maid.bio && (
                        <section className="profile-section">
                            <h2>About Me</h2>
                            <p className="bio-text">{maid.bio}</p>
                        </section>
                    )}

                    {maid.skills && maid.skills.length > 0 && (
                        <section className="profile-section">
                            <h2>Skills</h2>
                            <div className="skills-list">
                                {maid.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {maid.availableServices && maid.availableServices.length > 0 && (
                        <section className="profile-section">
                            <h2>Services Offered</h2>
                            <div className="services-list">
                                {maid.availableServices.map((service) => (
                                    <div key={service._id} className="service-card">
                                        <div className="service-info">
                                            <h3>{service.name}</h3>
                                            <p>{service.description}</p>
                                        </div>
                                        <div className="service-price">
                                            <span className="price">৳{service.basePrice}</span>
                                            <span className="unit">{service.priceUnit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="profile-section">
                        <h2>Member Since</h2>
                        <p>{new Date(maid.memberSince).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MaidProfilePage;
