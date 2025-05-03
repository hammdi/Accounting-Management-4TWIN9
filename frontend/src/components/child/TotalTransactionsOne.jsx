import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';

const UserEngagementStats = () => {
    const [stats, setStats] = useState({
        avgSession: 0,
        retentionRate: 0,
        completionRate: 0,
        trendData: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulation de données si l'API ne répond pas
        const simulateData = () => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            const trend = months.map((_, i) => ({
                month: months[i],
                engagement: Math.floor(Math.random() * 100) + 20,
                completion: Math.floor(Math.random() * 100) + 15
            }));

            setStats({
                avgSession: Math.floor(Math.random() * 10) + 2,
                retentionRate: Math.floor(Math.random() * 30) + 50,
                completionRate: Math.floor(Math.random() * 40) + 40,
                trendData: trend
            });
            setIsLoading(false);
        };

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/engagement`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Using simulated data due to API error:", error);
                simulateData();
            }
        };

        fetchData();
    }, []);

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: { show: false }
        },
        colors: ['#4CAF50', '#3B82F6'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: stats.trendData.map(item => item.month),
            labels: { style: { colors: '#666', fontSize: '12px' } }
        },
        yaxis: {
            title: { text: '% of Users' },
            labels: { style: { colors: '#666', fontSize: '12px' } }
        },
        fill: { opacity: 1 },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%";
                }
            }
        }
    };

    const chartSeries = [
        {
            name: 'Engagement Rate',
            data: stats.trendData.map(item => item.engagement)
        },
        {
            name: 'Completion Rate',
            data: stats.trendData.map(item => item.completion)
        }
    ];

    return (
        <div className="col-xxl-4">
            <div className="card h-100">
                <div className="card-body p-24">
                    <h6 className="mb-2 fw-bold text-lg">User Engagement</h6>
                    
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between mb-4">
                                <div className="text-center">
                                    <div className="bg-primary-50 w-48-px h-48-px rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                        <Icon icon="mdi:clock-outline" className="text-primary-600 text-xl" />
                                    </div>
                                    <h5 className="mb-1">{stats.avgSession} min</h5>
                                    <p className="text-sm text-secondary-light mb-0">Avg. Session</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-success-50 w-48-px h-48-px rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                        <Icon icon="mdi:account-arrow-left" className="text-success-600 text-xl" />
                                    </div>
                                    <h5 className="mb-1">{stats.retentionRate}%</h5>
                                    <p className="text-sm text-secondary-light mb-0">Retention</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-info-50 w-48-px h-48-px rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                        <Icon icon="mdi:check-circle-outline" className="text-info-600 text-xl" />
                                    </div>
                                    <h5 className="mb-1">{stats.completionRate}%</h5>
                                    <p className="text-sm text-secondary-light mb-0">Completion</p>
                                </div>
                            </div>

                            <ReactApexChart 
                                options={chartOptions} 
                                series={chartSeries} 
                                type="bar" 
                                height={290} 
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserEngagementStats;