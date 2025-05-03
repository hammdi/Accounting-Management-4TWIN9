import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const UserActivationStats = () => {
    const [activationData, setActivationData] = useState({
        activated: 0,
        notActivated: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchActivationData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const users = response.data;
                const activated = users.filter(user => user.status === "Active").length;
                const notActivated = users.filter(user => user.status === "Inactive").length;
                
                setActivationData({
                    activated,
                    notActivated,
                    totalUsers: users.length
                });
            } catch (error) {
                console.error("Error fetching user activation data:", error);
            }
        };

        fetchActivationData();
    }, []);

    const donutOptions = {
        chart: {
            type: 'donut',
            height: 230
        },
        labels: ['Activated', 'Not Activated'],
        colors: ['#4CAF50', '#F44336'],
        legend: {
            show: false
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Users',
                            color: '#666',
                            formatter: function(w) {
                                return activationData.totalUsers;
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return value + " users";
                }
            }
        }
    };

    const donutSeries = [activationData.activated, activationData.notActivated];

    const activationRate = activationData.totalUsers > 0 
        ? Math.round((activationData.activated / activationData.totalUsers) * 100) 
        : 0;

    return (
        <div className="col-xxl-3">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <h6 className="mb-2 fw-bold text-lg">User Activation</h6>
                    <div className="position-relative">
                        <span className="w-80-px h-80-px bg-base shadow text-primary-light fw-bold text-xxl d-flex justify-content-center align-items-center rounded-circle position-absolute end-0 top-0 z-1">
                            {activationRate}%
                        </span>
                        <ReactApexChart 
                            options={donutOptions} 
                            series={donutSeries} 
                            type="donut" 
                            height={230} 
                            id="activationDonutChart"
                            className="mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none" 
                        />
                        <span className="w-80-px h-80-px bg-base shadow text-primary-light fw-bold text-xxl d-flex justify-content-center align-items-center rounded-circle position-absolute start-0 bottom-0 z-1">
                            {activationData.totalUsers}
                        </span>
                    </div>
                    <ul className="d-flex flex-wrap flex-column mt-64 gap-3">
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-16-px h-16-px radius-2 bg-primary-600" />
                            <span className="text-secondary-light text-lg fw-normal">
                                Activated:
                                <span className="text-primary-light fw-bold text-lg ms-2">
                                    {activationData.activated}
                                </span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-16-px h-16-px radius-2 bg-danger-600" />
                            <span className="text-secondary-light text-lg fw-normal">
                                Not Activated:
                                <span className="text-primary-light fw-bold text-lg ms-2">
                                    {activationData.notActivated}
                                </span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2 mt-3">
                            <Icon icon="mdi:clock-alert-outline" className="text-warning" />
                            <span className="text-secondary-light text-sm">
                                {activationData.notActivated} pending verifications
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserActivationStats;