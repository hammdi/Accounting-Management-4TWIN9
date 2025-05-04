import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PendingActions = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPendingUsers(response.data);
            } catch (error) {
                console.error("Error fetching pending users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingUsers();
    }, []);

    const getUserAvatar = (user) => {
        if (user.avatar && user.avatar.data) {
            const base64String = btoa(
                new Uint8Array(user.avatar.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte), ''
                )
            );
            return `data:image/png;base64,${base64String}`;
        }
        return '/default-avatar.png';
    };

    const getActionRequired = (user) => {
        if (user.status === 'Inactive') return 'Account Activation';
        if (!user.emailVerified) return 'Email Verification';
        if (user.is_2fa_enabled === false) return 'Enable 2FA';
        return 'Profile Completion';
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'text-danger-main';
            case 'medium': return 'text-warning-main';
            default: return 'text-info-main';
        }
    };

    return (
        <div className="col-xxl-4">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Pending Actions</h6>
                        <Link
                           to="/users-list"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="text-center py-4">
                            <Icon icon="mdi:check-circle-outline" className="text-success-main text-4xl mb-2" />
                            <p>No pending actions</p>
                            <p className="text-sm text-secondary-light">All users are up to date</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {pendingUsers.slice(0, 3).map((user) => (
                                <div key={user._id} className="d-flex align-items-center gap-3 p-3 bg-base-50 radius-8">
                                    <img
                                        src={getUserAvatar(user)}
                                        alt="User avatar"
                                        className="flex-shrink-0 w-40-px h-40-px radius-8"
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="text-md mb-1 fw-semibold">{user.name}</h6>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`text-xs px-2 py-1 radius-4 ${getPriorityColor(user.priority || 'medium')} bg-${getPriorityColor(user.priority || 'medium').replace('text-', '').replace('-main', '-50')}`}>
                                                {getActionRequired(user)}
                                            </span>
                                            <span className="text-xs text-secondary-light">
                                                {new Date(user.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Link 
                                        to={`/users/${user._id}`}
                                        className="btn btn-sm btn-outline-primary px-3 py-1"
                                    >
                                        Review
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingActions;