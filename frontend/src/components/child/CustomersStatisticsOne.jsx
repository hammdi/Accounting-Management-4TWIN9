import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const PayrollStatusStatistics = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('Yearly');
    const [stats, setStats] = useState({
        paidCount: 0,
        pendingCount: 0,
        paidPercentage: 0,
        growthRate: 0
    });

    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payrolls/getallpayrolls`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setPayrollData(response.data);
                calculateStats(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching payroll data");
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, [timeRange]);

    const calculateStats = (data) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        // Filtrer selon la période sélectionnée
        let filteredData = data;
        if (timeRange === 'Yearly') {
            filteredData = data.filter(p => new Date(p.paymentDate).getFullYear() === currentYear);
        } else if (timeRange === 'Monthly') {
            filteredData = data.filter(p => 
                new Date(p.paymentDate).getFullYear() === currentYear && 
                new Date(p.paymentDate).getMonth() === currentMonth
            );
        }

        const paidCount = filteredData.filter(p => p.status === 'Paid').length;
        const pendingCount = filteredData.filter(p => p.status === 'Pending').length;
        const totalCount = filteredData.length;
        const paidPercentage = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

        // Calculer le taux de croissance (simplifié)
        const previousData = data.filter(p => {
            const date = new Date(p.paymentDate);
            return timeRange === 'Yearly' 
                ? date.getFullYear() === currentYear - 1
                : date.getMonth() === (currentMonth - 1 + 12) % 12 && date.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
        });
        const previousPaidCount = previousData.filter(p => p.status === 'Paid').length;
        const growthRate = previousPaidCount > 0 
            ? Math.round(((paidCount - previousPaidCount) / previousPaidCount) * 100)
            : paidCount > 0 ? 100 : 0;

        setStats({
            paidCount,
            pendingCount,
            paidPercentage,
            growthRate
        });
    };

    const prepareChartData = () => {
        return {
            series: [stats.paidCount, stats.pendingCount],
            options: {
                chart: {
                    type: 'donut',
                    height: 350
                },
                labels: ['Paid', 'Pending'],
                colors: ['#3A57E8', '#FFC107'],
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total',
                                    formatter: () => (stats.paidCount + stats.pendingCount).toString(),
                                    color: '#6C757D'
                                },
                                value: {
                                    color: '#2D3748',
                                    fontSize: '20px',
                                    fontWeight: '600'
                                }
                            }
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                tooltip: {
                    y: {
                        formatter: (value) => `${value} payrolls`
                    }
                }
            }
        };
    };

    const chartData = prepareChartData();

    if (loading) return (
        <div className="col-xxl-3 col-lg-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:loading" className="animate-spin text-4xl" />
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="col-xxl-3 col-lg-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body text-danger">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="col-xxl-3 col-lg-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg">Payroll Status</h6>
                        <div className="">
                            <select 
                                className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="Yearly">Yearly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="position-relative">
                        <span className="w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute end-0 top-0 z-1">
                            {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate}%
                        </span>

                        {payrollData.length > 0 ? (
                            <ReactApexChart 
                                options={chartData.options} 
                                series={chartData.series} 
                                type="donut" 
                                height={230} 
                                id="payrollStatusDonutChart"
                                className="mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none" 
                            />
                        ) : (
                            <div className="text-center py-5">No payroll data available</div>
                        )}
                        
                        <span className="w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute start-0 bottom-0 z-1">
                            {stats.paidPercentage}%
                        </span>
                    </div>
                    <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px radius-2 bg-primary-600" />
                            <span className="text-secondary-light text-sm fw-normal">
                                Paid:
                                <span className="text-primary-light fw-bold"> {stats.paidCount}</span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px radius-2 bg-yellow" />
                            <span className="text-secondary-light text-sm fw-normal">
                                Pending:
                                <span className="text-primary-light fw-bold"> {stats.pendingCount}</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PayrollStatusStatistics;