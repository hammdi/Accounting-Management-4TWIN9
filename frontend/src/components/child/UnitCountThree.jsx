import React, { useEffect, useState } from 'react'
import useReactApexChart from '../../hook/useReactApexChart'
import { Icon } from '@iconify/react'
import axios from "axios"

const TaxComplianceStats = () => {
    const { createChartThree } = useReactApexChart()
    const [taxStats, setTaxStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTaxStats = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taxes/getalltaxes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                // Process data to get stats by tax type/status
                const data = response.data
                
                // Group taxes by status and calculate totals
                const stats = [
                    {
                        name: "Pending Taxes",
                        code: "PENDING",
                        amount: data.filter(tax => tax.status === 'Pending').reduce((sum, tax) => sum + (tax.taxAmount || 0), 0),
                        count: data.filter(tax => tax.status === 'Pending').length,
                        trend: Math.random() > 0.5 ? 'up' : 'down',
                        change: (Math.random() * 30).toFixed(1),
                        color: '#F98C08',
                        icon: 'mdi:clock-outline'
                    },
                    {
                        name: "Filed Taxes",
                        code: "FILED",
                        amount: data.filter(tax => tax.status === 'Filed').reduce((sum, tax) => sum + (tax.taxAmount || 0), 0),
                        count: data.filter(tax => tax.status === 'Filed').length,
                        trend: 'up',
                        change: (Math.random() * 20 + 5).toFixed(1),
                        color: '#5F80FF',
                        icon: 'mdi:file-check-outline'
                    },
                    {
                        name: "Current Year",
                        code: "CURRENT",
                        amount: data.filter(tax => tax.taxYear === new Date().getFullYear()).reduce((sum, tax) => sum + (tax.taxAmount || 0), 0),
                        count: data.filter(tax => tax.taxYear === new Date().getFullYear()).length,
                        trend: 'up',
                        change: (Math.random() * 15 + 5).toFixed(1),
                        color: '#C817F8',
                        icon: 'mdi:calendar-star'
                    },
                    {
                        name: "Overdue",
                        code: "OVERDUE",
                        amount: data.filter(tax => new Date(tax.dueDate) < new Date() && tax.status === 'Pending').reduce((sum, tax) => sum + (tax.taxAmount || 0), 0),
                        count: data.filter(tax => new Date(tax.dueDate) < new Date() && tax.status === 'Pending').length,
                        trend: 'down',
                        change: (Math.random() * 10).toFixed(1),
                        color: '#2171EA',
                        icon: 'mdi:alert-circle-outline'
                    },
                    {
                        name: "Total Taxes",
                        code: "TOTAL",
                        amount: data.reduce((sum, tax) => sum + (tax.taxAmount || 0), 0),
                        count: data.length,
                        trend: 'up',
                        change: (Math.random() * 10 + 5).toFixed(1),
                        color: '#45B369',
                        icon: 'mdi:finance'
                    }
                ]
                
                setTaxStats(stats)
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching tax stats")
                console.error("Error fetching taxes:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTaxStats()
    }, [])

    if (loading) return <div className="text-center py-5"><Icon icon="mdi:loading" className="animate-spin text-4xl" /></div>
    if (error) return <div className="alert alert-danger">{error}</div>

    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
            {taxStats.map((stat, index) => (
                <div className="col" key={index}>
                    <div className={`card shadow-none border ${index % 2 === 0 ? 'bg-gradient-end-3' : 'bg-gradient-end-1'}`}>
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div className="w-40-px h-40-px rounded-circle flex-shrink-0 bg-white d-flex align-items-center justify-content-center">
                                    <Icon icon={stat.icon} className="text-xl" style={{ color: stat.color }} />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="text-xl mb-1">{stat.name}</h6>
                                    <p className="fw-medium text-secondary-light mb-0">{stat.code}</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex flex-wrap justify-content-between align-items-center gap-1">
                                <div className="">
                                    <h6 className="mb-8">${stat.amount.toLocaleString()}</h6>
                                    <span className={`text-${stat.trend === 'up' ? 'success' : 'danger'}-main text-md`}>
                                        {stat.trend === 'up' ? '+' : '-'} {stat.change}%
                                    </span>
                                </div>
                                <div
                                    id={`${stat.code.toLowerCase()}AreaChart`}
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChartThree(stat.color)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TaxComplianceStats