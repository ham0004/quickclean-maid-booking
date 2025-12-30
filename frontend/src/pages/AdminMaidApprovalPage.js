import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingMaids, getAllMaids, approveMaid, rejectMaid, getDashboardStats } from '../services/adminService';

const AdminMaidApprovalPage = () => {
    const navigate = useNavigate();
    const [maids, setMaids] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedMaid, setSelectedMaid] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [maidsResponse, statsResponse] = await Promise.all([
                activeTab === 'pending' ? getPendingMaids() : getAllMaids({ status: activeTab }),
                getDashboardStats()
            ]);

            if (maidsResponse.success) {
                setMaids(maidsResponse.maids);
            }
            if (statsResponse.success) {
                setStats(statsResponse.stats);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
            } else {
                setError('Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (maid) => {
        setProcessing(true);
        try {
            await approveMaid(maid._id);
            fetchData();
        } catch (err) {
            console.error('Error approving maid:', err);
            setError(err.response?.data?.message || 'Failed to approve maid');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            return;
        }
        setProcessing(true);
        try {
            await rejectMaid(selectedMaid._id, rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedMaid(null);
            fetchData();
        } catch (err) {
            console.error('Error rejecting maid:', err);
            setError(err.response?.data?.message || 'Failed to reject maid');
        } finally {
            setProcessing(false);
        }
    };

    const openRejectModal = (maid) => {
        setSelectedMaid(maid);
        setRejectReason('');
        setShowRejectModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>

            <div className="relative px-4 mx-auto max-w-6xl sm:px-6 lg:px-8 pt-8">
                {/* Header */}
                <div className="glass-card !p-6 mb-6 fade-in">
                    <h1 className="text-2xl font-bold text-gray-900">Maid Verification</h1>
                    <p className="text-gray-600">Review and approve maid registrations</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="glass-card !p-4 text-center fade-in">
                            <p className="text-3xl font-bold text-yellow-600">{stats.pendingMaids}</p>
                            <p className="text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="glass-card !p-4 text-center fade-in">
                            <p className="text-3xl font-bold text-green-600">{stats.approvedMaids}</p>
                            <p className="text-sm text-gray-600">Approved</p>
                        </div>
                        <div className="glass-card !p-4 text-center fade-in">
                            <p className="text-3xl font-bold text-red-600">{stats.rejectedMaids}</p>
                            <p className="text-sm text-gray-600">Rejected</p>
                        </div>
                        <div className="glass-card !p-4 text-center fade-in">
                            <p className="text-3xl font-bold text-blue-600">{stats.totalMaids}</p>
                            <p className="text-sm text-gray-600">Total Maids</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="glass-card !p-2 mb-6 fade-in">
                    <div className="flex gap-2">
                        {['pending', 'approved', 'rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === tab
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                {/* Maid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {maids.length === 0 ? (
                        <div className="col-span-2 glass-card !p-12 text-center">
                            <span className="text-4xl mb-4 block">📋</span>
                            <p className="text-gray-600">No {activeTab} maids found</p>
                        </div>
                    ) : (
                        maids.map((maid) => (
                            <div key={maid._id} className="glass-card !p-6 fade-in">
                                {/* Maid Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                                        {maid.name?.charAt(0).toUpperCase() || 'M'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{maid.name}</h3>
                                        <p className="text-sm text-gray-600">{maid.email}</p>
                                        <p className="text-sm text-gray-500">{maid.phone}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${maid.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                            maid.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {maid.verificationStatus}
                                    </span>
                                </div>

                                {/* Profile Info */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Experience:</span>
                                        <span className="font-medium">{maid.maidProfile?.experience || 0} years</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Hourly Rate:</span>
                                        <span className="font-medium">${maid.maidProfile?.hourlyRate || 0}/hr</span>
                                    </div>
                                    {maid.maidProfile?.skills?.length > 0 && (
                                        <div>
                                            <span className="text-gray-500">Skills:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {maid.maidProfile.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Documents */}
                                {maid.documents?.idDocumentUrl && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">ID Document ({maid.documents.idType})</p>
                                        <a
                                            href={`http://localhost:5000${maid.documents.idDocumentUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-600 text-sm hover:underline"
                                        >
                                            📄 View Document
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">ID: {maid.documents.idNumber}</p>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {maid.adminNotes && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Admin Notes:</p>
                                        <p className="text-sm text-gray-700">{maid.adminNotes}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                {activeTab === 'pending' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleApprove(maid)}
                                            disabled={processing}
                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => openRejectModal(maid)}
                                            disabled={processing}
                                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            ✗ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="glass-card !p-6 w-full max-w-md animate-fade-in">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Maid Registration</h3>
                            <p className="text-gray-600 mb-4">
                                Please provide a reason for rejecting {selectedMaid?.name}'s registration.
                            </p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason.trim() || processing}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Rejecting...' : 'Confirm Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMaidApprovalPage;
