import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const PayrollStatsReport = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('Yearly');
    const [stats, setStats] = useState({
        totalPayrolls: 0,
        employeesPaid: 0,
        completedPayments: 0,
        averageSalary: 0,
        totalSalaries: 0,
        totalTaxes: 0
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

        const paidPayrolls = filteredData.filter(p => p.status === 'Paid');
        const totalSalaries = paidPayrolls.reduce((sum, p) => sum + p.salary, 0);
        const estimatedTaxes = totalSalaries * 0.2; // Estimation des taxes à 20%

        setStats({
            totalPayrolls: filteredData.length,
            employeesPaid: [...new Set(paidPayrolls.map(p => p.employee?._id))].length,
            completedPayments: paidPayrolls.length,
            averageSalary: paidPayrolls.length > 0 ? totalSalaries / paidPayrolls.length : 0,
            totalSalaries,
            totalTaxes: estimatedTaxes
        });
    };

    const prepareChartData = () => {
        if (payrollData.length === 0) return { series: [], options: {} };

        const currentYear = new Date().getFullYear();
        const monthlyData = Array(12).fill(0).map(() => ({ salaries: 0, count: 0 }));
        
        payrollData
            .filter(p => p.status === 'Paid' && new Date(p.paymentDate).getFullYear() === currentYear)
            .forEach(p => {
                const month = new Date(p.paymentDate).getMonth();
                monthlyData[month].salaries += p.salary;
                monthlyData[month].count++;
            });

        return {
            series: [
                {
                    name: 'Total Salaries',
                    data: monthlyData.map(m => m.salaries)
                },
                {
                    name: 'Number of Payments',
                    data: monthlyData.map(m => m.count)
                }
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    title: {
                        text: 'Months'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Amount ($)'
                    }
                },
                fill: {
                    opacity: 1
                },
                colors: ['#3A57E8', '#85F4FA'],
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "$ " + val.toLocaleString()
                        }
                    }
                }
            }
        };
    };

    const chartData = prepareChartData();

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="col-xxl-9">
            <div className="card radius-8 border-0">
                <div className="row">
                    <div className="col-xxl-6 pe-xxl-0">
                        <div className="card-body p-24">
                            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 className="mb-2 fw-bold text-lg">Payroll Report</h6>
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
                            <ul className="d-flex flex-wrap align-items-center mt-3 gap-3">
                                <li className="d-flex align-items-center gap-2">
                                    <span className="w-12-px h-12-px radius-2 bg-primary-600" />
                                    <span className="text-secondary-light text-sm fw-semibold">
                                        Total Salaries:
                                        <span className="text-primary-light fw-bold">
                                            ${stats.totalSalaries.toLocaleString()}
                                        </span>
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <span className="w-12-px h-12-px radius-2 bg-yellow" />
                                    <span className="text-secondary-light text-sm fw-semibold">
                                        Estimated Taxes:
                                        <span className="text-primary-light fw-bold">${stats.totalTaxes.toLocaleString()}</span>
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-40">
                                {payrollData.length > 0 ? (
                                    <ReactApexChart 
                                        options={chartData.options} 
                                        series={chartData.series} 
                                        type="bar" 
                                        height={250} 
                                        id="payrollStatusChart" 
                                        className="margin-16-minus" 
                                    />
                                ) : (
                                    <div className="text-center py-4">No payroll data available</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6">
                        <div className="row h-100 g-0">
                            <div className="col-6 p-0 m-0">
                                <div className="card-body p-24 h-100 d-flex flex-column justify-content-center border border-top-0">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                        <div>
                                            <span className="mb-12 w-44-px h-44-px text-primary-600 bg-primary-light border border-primary-light-white flex-shrink-0 d-flex justify-content-center align-items-center radius-8 h6 mb-12">
                                                <Icon icon="fluent:people-money-24-filled" className="icon" />
                                            </span>
                                            <span className="mb-1 fw-medium text-secondary-light text-md">
                                                Total Payrolls
                                            </span>
                                            <h6 className="fw-semibold text-primary-light mb-1">{stats.totalPayrolls}</h6>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-0">
                                        {timeRange === 'Monthly' ? 'This month' : 'This year'}
                                    </p>
                                </div>
                            </div>
                            <div className="col-6 p-0 m-0">
                                <div className="card-body p-24 h-100 d-flex flex-column justify-content-center border border-top-0 border-start-0 border-end-0">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                        <div>
                                            <span className="mb-12 w-44-px h-44-px text-yellow bg-yellow-light border border-yellow-light-white flex-shrink-0 d-flex justify-content-center align-items-center radius-8 h6 mb-12">
                                                <Icon icon="ion:person" className="icon" />
                                            </span>
                                            <span className="mb-1 fw-medium text-secondary-light text-md">
                                                Employees Paid
                                            </span>
                                            <h6 className="fw-semibold text-primary-light mb-1">
                                                {stats.employeesPaid}
                                            </h6>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-0">
                                        Unique employees
                                    </p>
                                </div>
                            </div>
                            <div className="col-6 p-0 m-0">
                                <div className="card-body p-24 h-100 d-flex flex-column justify-content-center border border-top-0 border-bottom-0">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                        <div>
                                            <span className="mb-12 w-44-px h-44-px text-lilac bg-lilac-light border border-lilac-light-white flex-shrink-0 d-flex justify-content-center align-items-center radius-8 h6 mb-12">
                                                <Icon icon="mdi:cash-check" className="icon" />
                                            </span>
                                            <span className="mb-1 fw-medium text-secondary-light text-md">
                                                Completed Payments
                                            </span>
                                            <h6 className="fw-semibold text-primary-light mb-1">
                                                {stats.completedPayments}
                                            </h6>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-0">
                                        {stats.totalPayrolls - stats.completedPayments > 0 ? (
                                            <span>
                                                Pending: <span className="bg-warning-focus px-1 rounded-2 fw-medium text-warning-main text-sm">
                                                    {stats.totalPayrolls - stats.completedPayments}
                                                </span>
                                            </span>
                                        ) : 'All payments completed'}
                                    </p>
                                </div>
                            </div>
                            <div className="col-6 p-0 m-0">
                                <div className="card-body p-24 h-100 d-flex flex-column justify-content-center border border-top-0 border-start-0 border-end-0 border-bottom-0">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                        <div>
                                            <span className="mb-12 w-44-px h-44-px text-pink bg-pink-light border border-pink-light-white flex-shrink-0 d-flex justify-content-center align-items-center radius-8 h6 mb-12">
                                                <Icon icon="mdi:account-cash" className="icon" />
                                            </span>
                                            <span className="mb-1 fw-medium text-secondary-light text-md">
                                                Average Salary
                                            </span>
                                            <h6 className="fw-semibold text-primary-light mb-1">
                                                ${stats.averageSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </h6>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-0">
                                        Based on completed payments
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollStatsReport;