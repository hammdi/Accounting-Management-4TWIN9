import React, { useEffect, useState } from 'react'
import useReactApexChart from '../../hook/useReactApexChart'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react/dist/iconify.js'

const TransactionTrends = () => {
    let { createChartTwo } = useReactApexChart()
    const [stats, setStats] = useState({
        weeklyIncome: 0,
        weeklyExpenses: 0,
        weeklyGrowth: 0,
        chartData: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransactionStats = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/mytransactions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.data.success) {
                    const transactions = response.data.data
                    calculateWeeklyStats(transactions)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error)
                toast.error('Failed to load transaction data')
            } finally {
                setLoading(false)
            }
        }

        const calculateWeeklyStats = (transactions) => {
            // Filtrer les transactions de cette semaine
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            
            const weeklyTransactions = transactions.filter(t => 
                new Date(t.date) >= oneWeekAgo
            )

            const weeklyIncome = weeklyTransactions
                .filter(t => t.type === 'Income')
                .reduce((sum, t) => sum + t.amount, 0)
            
            const weeklyExpenses = weeklyTransactions
                .filter(t => t.type === 'Expense')
                .reduce((sum, t) => sum + t.amount, 0)
            
            // Simuler des données pour le graphique (par jour)
            const chartData = Array.from({ length: 7 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                
                const dayTransactions = transactions.filter(t => 
                    new Date(t.date).toDateString() === date.toDateString()
                )
                
                const dayIncome = dayTransactions
                    .filter(t => t.type === 'Income')
                    .reduce((sum, t) => sum + t.amount, 0)
                
                const dayExpenses = dayTransactions
                    .filter(t => t.type === 'Expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                
                return {
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    income: dayIncome,
                    expenses: dayExpenses,
                    net: dayIncome - dayExpenses
                }
            })

            // Calculer la croissance hebdomadaire (par rapport à la semaine précédente)
            const prevWeekTransactions = transactions.filter(t => {
                const twoWeeksAgo = new Date()
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
                return new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo
            })
            
            const prevWeekNet = prevWeekTransactions
                .reduce((sum, t) => t.type === 'Income' ? sum + t.amount : sum - t.amount, 0)
            
            const currentWeekNet = weeklyIncome - weeklyExpenses
            const weeklyGrowth = prevWeekNet !== 0 
                ? ((currentWeekNet - prevWeekNet) / prevWeekNet) * 100 
                : 100

            setStats({
                weeklyIncome,
                weeklyExpenses,
                weeklyNet: currentWeekNet,
                weeklyGrowth,
                chartData
            })
        }

        fetchTransactionStats()
    }, [])

    if (loading) {
        return (
            <div className="col-xxl-4">
                <div className="card h-100 radius-8 border">
                    <div className="card-body p-24 d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="col-xxl-4">
            <div className="card h-100 radius-8 border">
                <div className="card-body p-24">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-3">
                        <div>
                            <h6 className="mb-2 fw-bold text-lg">Transaction Trends</h6>
                            <span className="text-sm fw-medium text-secondary-light">
                                Weekly Report
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="w-8-px h-8-px bg-success-main rounded-circle"></span>
                            <small className="text-sm">Income</small>
                            <span className="w-8-px h-8-px bg-danger-main rounded-circle ms-2"></span>
                            <small className="text-sm">Expense</small>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                        <div>
                            <h6 className="mb-1 fw-bold text-lg">
                                {stats.weeklyNet >= 0 ? '+' : ''}{stats.weeklyNet.toFixed(2)} DT
                            </h6>
                            <span className={`ps-12 pe-12 pt-2 pb-2 rounded-2 fw-medium text-sm ${
                                stats.weeklyGrowth >= 0 
                                    ? 'bg-success-focus text-success-main' 
                                    : 'bg-danger-focus text-danger-main'
                            }`}>
                                {stats.weeklyGrowth >= 0 ? '+' : ''}{stats.weeklyGrowth.toFixed(1)}%
                            </span>
                        </div>
                        <div className="text-end">
                            <div className="d-flex align-items-center gap-2 justify-content-end">
                                <Icon icon="streamline:money-cashier-document-pay-bill-payment-cash" className="text-success-main" />
                                <span className="fw-medium">{stats.weeklyIncome.toFixed(2)} DT</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 justify-content-end mt-1">
                                <Icon icon="streamline:shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products" className="text-danger-main" />
                                <span className="fw-medium">{stats.weeklyExpenses.toFixed(2)} DT</span>
                            </div>
                        </div>
                    </div>

                    <div id="transaction-trends-chart" className="mt-2">
                        {/* Pass the color value & height here */}
                        {createChartTwo("#487fff", 162)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionTrends