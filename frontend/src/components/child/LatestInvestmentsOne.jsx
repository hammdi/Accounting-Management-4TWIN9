import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LatestRegistrations = () => {
    const [latestUsers, setLatestUsers] = useState([]);

    useEffect(() => {
        const fetchLatestUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        sort: '-createdAt',
                        limit: 5
                    }
                });
                setLatestUsers(response.data);
            } catch (error) {
                console.error("Error fetching latest users:", error);
            }
        };

        fetchLatestUsers();
    }, []);

    const getUserAvatar = (avatar) => {
        if (avatar && avatar.data) {
            const base64String = btoa(
                new Uint8Array(avatar.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte), ''
                )
            );
            return `data:image/png;base64,${base64String}`;
        }
        return '/default-avatar.png';
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="col-xxl-6">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Latest Registrations</h6>
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
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">User</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Registration Date</th>
                                    <th scope="col" className="text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={getUserAvatar(user.avatar)}
                                                    alt="User avatar"
                                                    className="flex-shrink-0 me-12 w-40-px h-40-px radius-8 me-12"
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="text-md mb-0 fw-normal">{user.name}</h6>
                                                    <span className="text-sm text-secondary-light fw-normal">
                                                        {user.role || 'User'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <h6 className="text-md mb-0 fw-normal">{user.email}</h6>
                                        </td>
                                        <td>{user.phone}</td>
                                        <td>{formatDate(user.createdAt)}</td>
                                        <td className="text-center">
                                            <span className={`px-16 py-4 radius-8 fw-medium text-sm ${
                                                user.status === "Active" 
                                                    ? "bg-success-focus text-success-main" 
                                                    : "bg-warning-focus text-warning-main"
                                            }`}>
                                                {user.status || 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestRegistrations;