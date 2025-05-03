import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserStatsWidget = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        newUsersThisWeek: 0,
        percentageChange: 0
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                
                // Récupérer tous les utilisateurs
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/users`, config);
                const users = response.data;

                // Calculer les statistiques
                const now = new Date();
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                
                const newUsersThisWeek = users.filter(user => 
                    new Date(user.createdAt) > oneWeekAgo
                ).length;

                const activeUsers = users.filter(user => user.status === "Active").length;
                const inactiveUsers = users.filter(user => user.status === "Inactive").length;
                const totalUsers = users.length;

                // Calculer le pourcentage de changement
                const percentageChange = totalUsers > 0 
                    ? Math.round((newUsersThisWeek / totalUsers) * 100) 
                    : 0;

                setStats({
                    totalUsers,
                    activeUsers,
                    inactiveUsers,
                    newUsersThisWeek,
                    percentageChange
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques utilisateurs :", error);
            }
        };

        fetchUserStats();
    }, []);

    return (
        <>
            {/* Widget Utilisateurs Totaux */}
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-16 shadow-none radius-8 border h-100 bg-gradient-start-3">
                    <div className="card-body p-0">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                            <div className="d-flex align-items-center">
                                <div className="w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20">
                                    <span className="mb-0 w-40-px h-40-px bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center radius-8 h6 mb-0">
                                        <Icon
                                            icon="flowbite:users-group-solid"
                                            className="icon"
                                        />
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-2 fw-medium text-secondary-light text-md">
                                        Total Users
                                    </span>
                                    <h6 className="fw-semibold my-1">{stats.totalUsers}</h6>
                                    <p className="text-sm mb-0">
                                        <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                            {stats.percentageChange}%
                                        </span>{" "}
                                        change this week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Utilisateurs Actifs */}
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-16 shadow-none radius-8 border h-100 bg-gradient-start-2">
                    <div className="card-body p-0">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                            <div className="d-flex align-items-center">
                                <div className="w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20">
                                    <span className="mb-0 w-40-px h-40-px bg-success-main flex-shrink-0 text-white d-flex justify-content-center align-items-center radius-8 h6 mb-0">
                                        <Icon
                                            icon="ic:round-check-circle"
                                            className="text-white text-2xl mb-0"
                                        />
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-2 fw-medium text-secondary-light text-md">
                                        Active Users
                                    </span>
                                    <h6 className="fw-semibold my-1">{stats.activeUsers}</h6>
                                    <p className="text-sm mb-0">
                                        {stats.totalUsers > 0 ? 
                                            Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0
                                        }% of total users
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Utilisateurs Inactifs */}
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-16 shadow-none radius-8 border h-100 bg-gradient-start-5">
                    <div className="card-body p-0">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                            <div className="d-flex align-items-center">
                                <div className="w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20">
                                    <span className="mb-0 w-40-px h-40-px bg-danger-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center radius-8 h6 mb-0">
                                        <Icon
                                            icon="ic:round-block"
                                            className="text-white text-2xl mb-0"
                                        />
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-2 fw-medium text-secondary-light text-md">
                                        Inactive Users
                                    </span>
                                    <h6 className="fw-semibold my-1">{stats.inactiveUsers}</h6>
                                    <p className="text-sm mb-0">
                                        {stats.totalUsers > 0 ? 
                                            Math.round((stats.inactiveUsers / stats.totalUsers) * 100) : 0
                                        }% of total users
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Nouveaux Utilisateurs */}
            <div className="col-xxl-3 col-sm-6">
                <div className="card px-24 py-16 shadow-none radius-8 border h-100 bg-gradient-start-4">
                    <div className="card-body p-0">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                            <div className="d-flex align-items-center">
                                <div className="w-64-px h-64-px radius-16 bg-base-50 d-flex justify-content-center align-items-center me-20">
                                    <span className="mb-0 w-40-px h-40-px bg-info-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center radius-8 h6 mb-0">
                                        <Icon
                                            icon="ic:round-person-add"
                                            className="icon"
                                        />
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-2 fw-medium text-secondary-light text-md">
                                        New Users
                                    </span>
                                    <h6 className="fw-semibold my-1">{stats.newUsersThisWeek}</h6>
                                    <p className="text-sm mb-0">
                                        Joined this week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserStatsWidget;