import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from "axios";

const TaxComplianceTrends = () => {
    const [taxData, setTaxData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('All Companies');
    const [frequency, setFrequency] = useState('Yearly');
    const [companies, setCompanies] = useState([]);

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
                
                const data = response.data;
                setTaxData(data);
                
                // Extract unique companies
                const uniqueCompanies = ['All Companies', ...new Set(data.map(tax => tax.company?.name || 'Unknown'))];
                setCompanies(uniqueCompanies);
                
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching tax data");
                console.error("Error fetching tax data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxData();
    }, []);

    // Prepare data for area chart
    const prepareChartData = () => {
        // Filter data by selected company
        let filteredData = taxData;
        if (selectedCompany !== 'All Companies') {
            filteredData = filteredData.filter(tax => tax.company?.name === selectedCompany);
        }

        // Group data by period based on frequency
        const groupedData = {};
        filteredData.forEach(tax => {
            let periodKey;
            const date = new Date(tax.dueDate);
            
            if (frequency === 'Yearly') {
                periodKey = tax.taxYear;
            } else if (frequency === 'Monthly') {
                periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            } else if (frequency === 'Weekly') {
                const weekNumber = Math.ceil(date.getDate() / 7);
                periodKey = `${date.getFullYear()}-W${weekNumber}`;
            } else { // Today or daily
                periodKey = date.toISOString().split('T')[0];
            }
            
            if (!groupedData[periodKey]) {
                groupedData[periodKey] = {
                    totalAmount: 0,
                    count: 0
                };
            }
            groupedData[periodKey].totalAmount += tax.taxAmount || 0;
            groupedData[periodKey].count++;
        });

        // Sort periods chronologically
        const sortedPeriods = Object.keys(groupedData).sort((a, b) => {
            if (frequency === 'Yearly') return a - b;
            if (frequency === 'Monthly') return a.localeCompare(b);
            if (frequency === 'Weekly') return a.localeCompare(b);
            return new Date(a) - new Date(b);
        });

        // Prepare series data
        const seriesData = sortedPeriods.map(period => ({
            x: period,
            y: groupedData[period].totalAmount
        }));

        return [{
            name: 'Tax Amount',
            data: seriesData
        }];
    };

    // Calculate total tax amount and growth percentage
    const calculateSummary = () => {
        let filteredData = taxData;
        if (selectedCompany !== 'All Companies') {
            filteredData = filteredData.filter(tax => tax.company?.name === selectedCompany);
        }

        const currentTotal = filteredData.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0);
        
        // For demo purposes, we'll calculate a random growth percentage
        const growthPercentage = (Math.random() * 20 - 5).toFixed(1); // Random between -5% and +15%
        const isGrowthPositive = parseFloat(growthPercentage) >= 0;

        return {
            total: currentTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            growthPercentage,
            isGrowthPositive
        };
    };

    const summary = calculateSummary();
    const chartSeries = prepareChartData();

    // Custom chart options matching the crypto design
    const taxChartOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            zoom: {
                enabled: true
            }
        },
        colors: ['#45B369'],
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
            type: 'category',
            labels: {
                formatter: function(val) {
                    return val;
                }
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            labels: {
                formatter: function(val) {
                    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                }
            }
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function(val) {
                    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                }
            }
        },
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 3
        }
    };

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="col-12">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg">Tax Compliance Trends</h6>
                        <div className="d-flex flex-wrap align-items-center gap-4">
                            {companies.slice(0, 4).map((company, index) => (
                                <div key={index} className="form-check d-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="company"
                                        id={`company-${index}`}
                                        checked={selectedCompany === company}
                                        onChange={() => setSelectedCompany(company)}
                                    />
                                    <label
                                        className="form-check-label line-height-1 fw-medium text-secondary-light"
                                        htmlFor={`company-${index}`}
                                    >
                                        {company === 'All Companies' ? 'All' : company.substring(0, 3).toUpperCase()}
                                    </label>
                                </div>
                            ))}
                            {companies.length > 4 && (
                                <select 
                                    className="form-select form-select-sm w-auto bg-base border text-secondary-light"
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                >
                                    {companies.map((company, index) => (
                                        <option key={index} value={company}>
                                            {company}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <select 
                            className="form-select form-select-sm w-auto bg-base border text-secondary-light" 
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                        >
                            <option value="Yearly">Yearly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Today">Daily</option>
                        </select>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-12">
                        <h6 className="fw-semibold mb-0">{summary.total}</h6>
                        <p className="text-sm mb-0 d-flex align-items-center gap-1">
                            {selectedCompany === 'All Companies' ? 'All Companies' : selectedCompany}
                            <span className={`${summary.isGrowthPositive ? 'bg-success-focus border-success text-success-main' : 'bg-danger-focus border-danger text-danger-main'} border px-8 py-2 rounded-pill fw-semibold text-sm d-inline-flex align-items-center gap-1`}>
                                {summary.growthPercentage}%
                                <Icon
                                    icon={summary.isGrowthPositive ? "iconamoon:arrow-up-2-fill" : "iconamoon:arrow-down-2-fill"}
                                    className="icon"
                                />
                            </span>
                        </p>
                    </div>
                    <ReactApexChart 
                        options={taxChartOptions} 
                        series={chartSeries} 
                        type="area" 
                        height={350} 
                        id="taxTrendsChart" 
                    />
                </div>
            </div>
        </div>
    );
};

export default TaxComplianceTrends;