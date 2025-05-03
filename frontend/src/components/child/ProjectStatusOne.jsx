import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const UserProfileCompletion = () => {
    const [timeRange, setTimeRange] = useState('monthly');
    const [profileStats, setProfileStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile-stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        range: timeRange
                    }
                });
                setProfileStats(response.data);
            } catch (error) {
                console.error("Error fetching profile stats:", error);
                // Données simulées en cas d'erreur
                setProfileStats([
                    { category: 'Basic Info', completion: 85, avgTime: '2 days' },
                    { category: 'Profile Picture', completion: 65, avgTime: '1 day' },
                    { category: 'Verification', completion: 45, avgTime: '3 days' },
                    { category: 'Preferences', completion: 30, avgTime: '5 days' },
                    { category: 'Security Setup', completion: 55, avgTime: '2 days' }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileStats();
    }, [timeRange]);

    const getProgressColor = (percentage) => {
        if (percentage >= 75) return 'bg-success-main';
        if (percentage >= 50) return 'bg-info-main';
        if (percentage >= 25) return 'bg-warning-main';
        return 'bg-danger-main';
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Basic Info': return 'mdi:account-details';
            case 'Profile Picture': return 'mdi:camera-account';
            case 'Verification': return 'mdi:shield-account';
            case 'Preferences': return 'mdi:cog-outline';
            case 'Security Setup': return 'mdi:lock-outline';
            default: return 'mdi:account';
        }
    };

    return (
        <div className="col-xxl-4">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg">Profile Completion</h6>
                        <div className="">
                            <select 
                                className="form-select form-select-sm w-auto bg-base border text-secondary-light"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive scroll-sm">
                            <table className="table sm-table bordered-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Category</th>
                                        <th scope="col">Avg. Time</th>
                                        <th scope="col">
                                            <div className="max-w-112 mx-auto">
                                                <span>Completion</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profileStats.map((stat, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Icon 
                                                        icon={getCategoryIcon(stat.category)} 
                                                        className="text-primary-600 text-lg" 
                                                    />
                                                    {stat.category}
                                                </div>
                                            </td>
                                            <td>{stat.avgTime}</td>
                                            <td>
                                                <div className="max-w-112 mx-auto">
                                                    <div className="w-100">
                                                        <div
                                                            className="progress progress-sm rounded-pill"
                                                            role="progressbar"
                                                            aria-valuenow={stat.completion}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        >
                                                            <div
                                                                className={`progress-bar ${getProgressColor(stat.completion)} rounded-pill`}
                                                                style={{ width: `${stat.completion}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="mt-8 text-secondary-light text-sm fw-medium">
                                                        {stat.completion}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileCompletion;