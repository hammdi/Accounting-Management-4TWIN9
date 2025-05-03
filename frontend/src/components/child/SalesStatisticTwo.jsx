import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const UserStatsWidget = () => {
    const [stats, setStats] = useState({
        activeRate: 0,
        dailyActiveUsers: 0,
        newRegistrations: 0
    });

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const users = response.data;
                const activeUsers = users.filter(user => user.status === "Active").length;
                const today = new Date().toDateString();
                
                // Calcul des statistiques
                const activeRate = users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0;
                const dailyActiveUsers = users.filter(user => 
                    new Date(user.lastLogin).toDateString() === today
                ).length;
                const newRegistrations = users.filter(user => 
                    new Date(user.createdAt).toDateString() === today
                ).length;

                setStats({
                    activeRate,
                    dailyActiveUsers,
                    newRegistrations
                });
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };

        fetchUserStats();
    }, []);

    // Configuration des graphiques
    const activeRateOptions = {
        chart: {
            type: 'radialBar',
            height: 200,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e0e0e0",
                    strokeWidth: '97%',
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: '22px',
                        formatter: function(val) {
                            return val + "%";
                        }
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                shadeIntensity: 0.4,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 53, 91]
            },
        },
        labels: ['Active Users'],
        colors: ['#4CAF50']
    };

    const activeRateSeries = [stats.activeRate];

    const registrationOptions = {
        chart: {
            type: 'bar',
            height: 80,
            sparkline: {
                enabled: true
            },
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '60%',
                distributed: true
            }
        },
        colors: ['#3B82F6'],
        xaxis: {
            categories: ['Today'],
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            show: false
        },
        tooltip: {
            enabled: false
        },
        dataLabels: {
            enabled: false
        }
    };

    const registrationSeries = [{
        name: 'New Users',
        data: [stats.newRegistrations]
    }];

    return (
        <div className="col-xxl-4">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <h6 className="mb-2 fw-bold text-lg">User Statistics</h6>
                    <div className="mt-24">
                        <div className="d-flex align-items-center gap-1 justify-content-between mb-44">
                            <div>
                                <span className="text-secondary-light fw-normal mb-12 text-xl">
                                    Active Users Rate
                                </span>
                                <h5 className="fw-semibold mb-0">{stats.activeRate}%</h5>
                            </div>
                            <div className="position-relative">
                                <ReactApexChart 
                                    id="activeRateGauge" 
                                    options={activeRateOptions} 
                                    series={activeRateSeries} 
                                    type="radialBar" 
                                    width={200}
                                />
                                <span className="w-36-px h-36-px rounded-circle bg-neutral-100 d-flex justify-content-center align-items-center position-absolute start-50 translate-middle top-100">
                                    <Icon
                                        icon="mdi:account-check"
                                        className="text-primary-600 text-md mb-0"
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-1 justify-content-between mb-44">
                            <div>
                                <span className="text-secondary-light fw-normal mb-12 text-xl">
                                    Daily Active Users
                                </span>
                                <h5 className="fw-semibold mb-0">{stats.dailyActiveUsers}</h5>
                            </div>
                            <div className="w-164-px h-80-px d-flex align-items-center justify-content-center">
                                <Icon 
                                    icon="mdi:account-group" 
                                    className="text-primary-600 text-4xl" 
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-1 justify-content-between">
                            <div>
                                <span className="text-secondary-light fw-normal mb-12 text-xl">
                                    Today's Registrations
                                </span>
                                <h5 className="fw-semibold mb-0">{stats.newRegistrations}</h5>
                            </div>
                            <ReactApexChart 
                                id="dailyRegistrationsChart" 
                                options={registrationOptions} 
                                series={registrationSeries} 
                                type="bar" 
                                width={164} 
                                height={80}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStatsWidget;