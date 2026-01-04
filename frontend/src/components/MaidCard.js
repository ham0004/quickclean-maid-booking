import React from 'react';
import { useNavigate } from 'react-router-dom';

const MaidCard = ({ maid }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/maids/${maid._id}`);
    };

    // Get top 3 skills
    const topSkills = maid.skills?.slice(0, 3) || [];

    return (
        <div className="maid-card">
            <div className="maid-card-image">
                <img
                    src={maid.profileImage || '/images/default-profile.png'}
                    alt={maid.name}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                />
                {maid.rating > 0 && (
                    <div className="maid-rating-badge">
                        <span>⭐ {maid.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
            <div className="maid-card-content">
                <h3 className="maid-name">{maid.name}</h3>
                <div className="maid-experience">
                    <span className="experience-badge">
                        🎯 {maid.experience || 0} years experience
                    </span>
                </div>
                {topSkills.length > 0 && (
                    <div className="maid-skills">
                        {topSkills.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {maid.skills?.length > 3 && (
                            <span className="skill-tag more">+{maid.skills.length - 3}</span>
                        )}
                    </div>
                )}
                <div className="maid-services">
                    {maid.availableServices?.length > 0 ? (
                        <span className="services-count">
                            🧹 {maid.availableServices.length} services offered
                        </span>
                    ) : (
                        <span className="services-count">No services listed</span>
                    )}
                </div>
                <button
                    className="view-profile-btn"
                    onClick={handleViewProfile}
                >
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default MaidCard;
