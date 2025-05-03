import React, { useEffect, useState } from 'react';
import useReactApexChart from '../../hook/useReactApexChart';
import ReactApexChart from 'react-apexcharts';
import axios from "axios";
import { Icon } from '@iconify/react';

const TaxComplianceStats = () => {
    const [taxData, setTaxData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('This Year');
    const { statisticsDonutChartOptionsThree } = useReactApexChart();

    useEffect(() => {
        const fetchTaxData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taxes/getalltaxes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTaxData(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching tax data");
                console.error("Error fetching taxes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxData();
    }, []);

    // Prepare data for donut chart
    const prepareChartData = () => {
        let filteredData = taxData;
        
        // Filter by time range (simplified example)
        const now = new Date();
        if (timeRange === 'This Week') {
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
            filteredData = filteredData.filter(tax => new Date(tax.dueDate) >= oneWeekAgo);
        } else if (timeRange === 'This Month') {
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            filteredData = filteredData.filter(tax => new Date(tax.dueDate) >= oneMonthAgo);
        }
        // 'This Year' is default

        // Group by status
        const statusCounts = filteredData.reduce((acc, tax) => {
            acc[tax.status] = (acc[tax.status] || 0) + 1;
            return acc;
        }, {});

        // Calculate percentages
        const total = filteredData.length;
        const filedPercentage = total > 0 ? Math.round((statusCounts['Filed'] || 0) / total * 100) : 0;
        const pendingPercentage = total > 0 ? Math.round((statusCounts['Pending'] || 0) / total * 100) : 0;

        return {
            series: [filedPercentage, pendingPercentage],
            filedCount: statusCounts['Filed'] || 0,
            pendingCount: statusCounts['Pending'] || 0,
            total,
            growthRate: total > 0 ? Math.round(Math.random() * 30 + 5) : 0 // Simulated growth
        };
    };

    const chartData = prepareChartData();

    // Custom chart options for tax data
    const taxChartOptions = {
        ...statisticsDonutChartOptionsThree,
        colors: ['#45B369', '#F98C08'], // Green for Filed, Orange for Pending
        labels: ['Filed', 'Pending'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Taxes',
                            formatter: () => chartData.total.toString()
                        }
                    }
                }
            }
        },
        tooltip: {
            y: {
                formatter: (value) => `${value}%`
            }
        }
    };

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="col-xxl-12 col-lg-6">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg">Tax Compliance Status</h6>
                        <div className="">
                            <select 
                                className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="This Week">This Week</option>
                                <option value="This Month">This Month</option>
                                <option value="This Year">This Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="position-relative">
                        <span className="w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute end-0 top-0 z-1">
                            +{chartData.growthRate}%
                        </span>
                        <ReactApexChart 
                            options={taxChartOptions} 
                            series={chartData.series} 
                            type="donut" 
                            height={260} 
                            id="taxStatusDonutChart"
                            className="mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none" 
                        />
                        <span className="w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute start-0 bottom-0 z-1">
                            {chartData.total}
                        </span>
                    </div>
                    <ul className="d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3">
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px radius-2 bg-primary-600" />
                            <span className="text-secondary-light text-sm fw-normal">
                                Filed Taxes:
                                <span className="text-primary-light fw-bold"> {chartData.filedCount}</span>
                            </span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <span className="w-12-px h-12-px radius-2 bg-yellow" />
                            <span className="text-secondary-light text-sm fw-normal">
                                Pending Taxes:
                                <span className="text-primary-light fw-bold"> {chartData.pendingCount}</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TaxComplianceStats;