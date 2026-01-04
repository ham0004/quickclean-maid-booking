import React, { useState, useEffect } from 'react';
import { getAllMaids } from '../services/maidsService';
import MaidCard from '../components/MaidCard';

const MaidListingPage = () => {
    const [maids, setMaids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalMaids: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchMaids = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllMaids(page, 12);
            setMaids(data.maids || []);
            setPagination(data.pagination || {
                currentPage: page,
                totalPages: 1,
                totalMaids: 0,
                hasNextPage: false,
                hasPrevPage: false
            });
        } catch (err) {
            console.error('Error fetching maids:', err);
            setError('Failed to load maids. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaids(1);
    }, []);

    const handlePageChange = (newPage) => {
        fetchMaids(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="maid-listing-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading maids...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="maid-listing-page">
                <div className="error-container">
                    <h2>⚠️ Oops!</h2>
                    <p>{error}</p>
                    <button onClick={() => fetchMaids(1)} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="maid-listing-page">
            <div className="maid-listing-header">
                <h1>Find Your Perfect Maid</h1>
                <p>Browse our verified and trusted cleaning professionals</p>
                <div className="maid-count">
                    <span>Showing {maids.length} of {pagination.totalMaids} maids</span>
                </div>
            </div>

            {maids.length === 0 ? (
                <div className="no-maids">
                    <h2>🧹 No Maids Available</h2>
                    <p>Check back soon! New maids are joining regularly.</p>
                </div>
            ) : (
                <>
                    <div className="maid-grid">
                        {maids.map((maid) => (
                            <MaidCard key={maid._id} maid={maid} />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={!pagination.hasPrevPage}
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                            >
                                ← Previous
                            </button>
                            <span className="page-info">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                className="pagination-btn"
                                disabled={!pagination.hasNextPage}
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MaidListingPage;
