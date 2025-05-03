import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const PayrollTrendsChart = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('Yearly');
    const [totalAmount, setTotalAmount] = useState(0);
    const [growthRate, setGrowthRate] = useState(0);

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
        let filteredData = data.filter(p => p.status === 'Paid');
        if (timeRange === 'Yearly') {
            filteredData = filteredData.filter(p => new Date(p.paymentDate).getFullYear() === currentYear);
        } else if (timeRange === 'Monthly') {
            filteredData = filteredData.filter(p => 
                new Date(p.paymentDate).getFullYear() === currentYear && 
                new Date(p.paymentDate).getMonth() === currentMonth
            );
        }

        // Calcul du total
        const currentTotal = filteredData.reduce((sum, p) => sum + p.salary, 0);
        setTotalAmount(currentTotal);

        // Calcul du taux de croissance
        const previousData = data.filter(p => {
            const date = new Date(p.paymentDate);
            return p.status === 'Paid' && (timeRange === 'Yearly' 
                ? date.getFullYear() === currentYear - 1
                : date.getMonth() === (currentMonth - 1 + 12) % 12 && date.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear));
        });
        
        const previousTotal = previousData.reduce((sum, p) => sum + p.salary, 0);
        const rate = previousTotal > 0 
            ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
            : currentTotal > 0 ? 100 : 0;
        
        setGrowthRate(rate);
    };

    const prepareChartData = () => {
        if (payrollData.length === 0) return { series: [], options: {} };

        const paidData = payrollData.filter(p => p.status === 'Paid');
        const monthlyTotals = Array(12).fill(0);
        
        paidData.forEach(p => {
            const month = new Date(p.paymentDate).getMonth();
            monthlyTotals[month] += p.salary;
        });

        return {
            series: [{
                name: 'Paid Salaries',
                data: monthlyTotals
            }],
            options: {
                chart: {
                    type: 'area',
                    height: 350,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                colors: ['#487fff'],
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
                        stops: [0, 90, 100]
                    }
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return "$" + (value / 1000) + "k";
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "$" + val.toLocaleString();
                        }
                    }
                },
                grid: {
                    show: false
                }
            }
        };
    };

    const chartData = prepareChartData();

    if (loading) return (
        <div className="col-xxl-4">
            <div className="card h-100 radius-8 border">
                <div className="card-body d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:loading" className="animate-spin text-4xl" />
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="col-xxl-4">
            <div className="card h-100 radius-8 border">
                <div className="card-body text-danger">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="col-xxl-4">
            <div className="card h-100 radius-8 border">
                <div className="card-body p-24">
                    <div className="d-flex justify-content-between align-items-start mb-12">
                        <h6 className="fw-bold text-lg mb-0">Payroll Trends</h6>
                        <select 
                            className="form-select form-select-sm w-auto bg-base border text-secondary-light"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="Yearly">Yearly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-semibold mb-0">${totalAmount.toLocaleString()}</h6>
                        <p className="text-sm mb-0">
                            <span className={`border px-8 py-2 rounded-pill fw-semibold text-sm d-inline-flex align-items-center gap-1 ${
                                growthRate >= 0 
                                    ? 'bg-success-focus border-success text-success-main' 
                                    : 'bg-danger-focus border-danger text-danger-main'
                            }`}>
                                {growthRate >= 0 ? '+' : ''}{growthRate}%
                                <Icon 
                                    icon={growthRate >= 0 ? "iconamoon:arrow-up-2-fill" : "iconamoon:arrow-down-2-fill"} 
                                    className="icon" 
                                />
                            </span>
                            {growthRate >= 0 ? 'Increase' : 'Decrease'}
                        </p>
                    </div>
                    <div className="mt-28">
                        {payrollData.length > 0 ? (
                            <ReactApexChart 
                                options={chartData.options} 
                                series={chartData.series} 
                                type="area" 
                                height={360} 
                                id="payroll-trends-chart"
                            />
                        ) : (
                            <div className="text-center py-5">No payroll data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollTrendsChart;