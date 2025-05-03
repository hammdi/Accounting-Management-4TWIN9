import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const UserGrowthChart = () => {
    const [timeRange, setTimeRange] = useState('monthly');
    const [chartData, setChartData] = useState({
        series: [{ name: 'New Users', data: [] }],
        categories: []
    });
    const [totalUsers, setTotalUsers] = useState(0);
    const [growthRate, setGrowthRate] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const users = response.data;
                setTotalUsers(users.length);
                
                // Simuler des données selon la période sélectionnée
                const { data, categories } = generateChartData(users, timeRange);
                setChartData({
                    series: [{ name: 'New Users', data }],
                    categories
                });
                
                // Calculer le taux de croissance
                calculateGrowthRate(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [timeRange]);

    const generateChartData = (users, range) => {
        const now = new Date();
        let data = [];
        let categories = [];
        
        switch(range) {
            case 'daily':
                // 7 derniers jours
                categories = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toLocaleDateString('fr-FR', { weekday: 'short' });
                });
                
                data = Array(7).fill(0).map((_, i) => {
                    const day = new Date();
                    day.setDate(day.getDate() - (6 - i));
                    return users.filter(u => 
                        new Date(u.createdAt).toDateString() === day.toDateString()
                    ).length;
                });
                break;
                
            case 'weekly':
                // 4 dernières semaines
                categories = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
                data = Array(4).fill(0).map((_, i) => {
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - (7 * (4 - i)));
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    
                    return users.filter(u => {
                        const userDate = new Date(u.createdAt);
                        return userDate >= weekStart && userDate <= weekEnd;
                    }).length;
                });
                break;
                
            case 'monthly':
                // 12 derniers mois
                categories = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - (11 - i));
                    return d.toLocaleDateString('fr-FR', { month: 'short' });
                });
                
                data = Array(12).fill(0).map((_, i) => {
                    const month = new Date();
                    month.setMonth(month.getMonth() - (11 - i));
                    
                    return users.filter(u => {
                        const userDate = new Date(u.createdAt);
                        return userDate.getMonth() === month.getMonth() && 
                               userDate.getFullYear() === month.getFullYear();
                    }).length;
                });
                break;
                
            case 'yearly':
                // 5 dernières années
                categories = Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - (4 - i);
                    return year.toString();
                });
                
                data = Array(5).fill(0).map((_, i) => {
                    const year = new Date().getFullYear() - (4 - i);
                    return users.filter(u => 
                        new Date(u.createdAt).getFullYear() === year
                    ).length;
                });
                break;
        }
        
        return { data, categories };
    };

    const calculateGrowthRate = (data) => {
        if (data.length < 2) {
            setGrowthRate(0);
            return;
        }
        
        const current = data[data.length - 1] || 1;
        const previous = data[data.length - 2] || 1;
        const rate = ((current - previous) / previous) * 100;
        
        setGrowthRate(Math.round(rate));
    };

    const chartOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: false
            }
        },
        colors: ['#4CAF50'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            }
        },
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " nouveaux utilisateurs";
                }
            }
        }
    };

    return (
        <div className="col-xxl-8">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <div>
                            <h6 className="mb-2 fw-bold text-lg">Croissance des Utilisateurs</h6>
                            <span className="text-sm fw-medium text-secondary-light">
                                Évolution des nouvelles inscriptions
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <select 
                                className="form-select form-select-sm w-auto bg-base border text-secondary-light"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="daily">Par Jour</option>
                                <option value="weekly">Par Semaine</option>
                                <option value="monthly">Par Mois</option>
                                <option value="yearly">Par Année</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-24 mb-24 d-flex flex-wrap align-items-center gap-4">
                        <div>
                            <span className="text-secondary-light text-sm mb-1">Total Utilisateurs</span>
                            <h4 className="fw-semibold mb-0">{totalUsers}</h4>
                        </div>
                        <div>
                            <span className="text-secondary-light text-sm mb-1">Taux de Croissance</span>
                            <div className="d-flex align-items-center">
                                <h4 className={`fw-semibold mb-0 ${growthRate >= 0 ? 'text-success-main' : 'text-danger-main'}`}>
                                    {growthRate}%
                                </h4>
                                <Icon
                                    icon={growthRate >= 0 ? "iconamoon:arrow-up-2-fill" : "iconamoon:arrow-down-2-fill"}
                                    className={`ms-2 ${growthRate >= 0 ? 'text-success-main' : 'text-danger-main'}`}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <ReactApexChart 
                        options={chartOptions} 
                        series={chartData.series} 
                        type="area" 
                        height={300} 
                    />
                </div>
            </div>
        </div>
    );
};

export default UserGrowthChart;