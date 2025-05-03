import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import useReactApexChart from '../../hook/useReactApexChart'
import axios from 'axios'
import { toast } from 'react-toastify'

const TransactionStats = () => {
    let { createChart } = useReactApexChart()
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        transactionCount: 0,
        highRiskCount: 0,
        fraudPercentage: 0
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
                    calculateStats(transactions)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error)
                toast.error('Failed to load transaction data')
            } finally {
                setLoading(false)
            }
        }

        const calculateStats = (transactions) => {
            const totalIncome = transactions
                .filter(t => t.type === 'Income')
                .reduce((sum, t) => sum + t.amount, 0)
            
            const totalExpenses = transactions
                .filter(t => t.type === 'Expense')
                .reduce((sum, t) => sum + t.amount, 0)
            
            const netBalance = totalIncome - totalExpenses
            const transactionCount = transactions.length
            
            setStats({
                totalIncome,
                totalExpenses,
                netBalance,
                transactionCount,
                highRiskCount: Math.floor(transactionCount * 0.15), // Exemple: 15% à haut risque
                fraudPercentage: (Math.floor(transactionCount * 0.15) / transactionCount * 100 )
            })
        }

        fetchTransactionStats()
    }, [])

    if (loading) {
        return <div className="col-xxl-8">Loading transaction statistics...</div>
    }

    return (
        <div className="col-xxl-8">
            <div className="row gy-4">
                <div className="col-xxl-4 col-sm-6">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-success-main flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                                        <Icon
                                            icon="streamline:money-cashier-document-pay-bill-payment-cash"
                                            className="icon"
                                        />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            Total Income
                                        </span>
                                        <h6 className="fw-semibold">{stats.totalIncome.toFixed(2)} DT</h6>
                                    </div>
                                </div>
                                <div
                                    id="income-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChart('#45b369')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                    +{(stats.totalIncome * 0.1).toFixed(2)} DT
                                </span>{" "}
                                this month
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 col-sm-6">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-2">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-danger-main flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6">
                                        <Icon
                                            icon="streamline:shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products"
                                            className="icon"
                                        />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            Total Expenses
                                        </span>
                                        <h6 className="fw-semibold">{stats.totalExpenses.toFixed(2)} DT</h6>
                                    </div>
                                </div>
                                <div
                                    id="expenses-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChart('#dc3545')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                <span className="bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm">
                                    -{(stats.totalExpenses * 0.05).toFixed(2)} DT
                                </span>{" "}
                                this month
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 col-sm-6">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-3">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-primary-600 text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                        <Icon
                                            icon="streamline:graph-arrow-increase-ascend-growth-up-arrow-graph-right-grow"
                                            className="icon"
                                        />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            Net Balance
                                        </span>
                                        <h6 className="fw-semibold">{stats.netBalance.toFixed(2)} DT</h6>
                                    </div>
                                </div>
                                <div
                                    id="balance-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChart('#487fff')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                {stats.netBalance >= 0 ? (
                                    <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                        +{(stats.netBalance * 0.08).toFixed(2)} DT
                                    </span>
                                ) : (
                                    <span className="bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm">
                                        -{(Math.abs(stats.netBalance) * 0.08).toFixed(2)} DT
                                    </span>
                                )}{" "}
                                this month
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 col-sm-6">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-4">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-purple text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                        <Icon icon="mdi:swap-horizontal" className="icon" />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            Transactions
                                        </span>
                                        <h6 className="fw-semibold">{stats.transactionCount}</h6>
                                    </div>
                                </div>
                                <div
                                    id="transactions-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChart('#8252e9')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                    +{Math.floor(stats.transactionCount * 0.2)}
                                </span>{" "}
                                this month
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 col-sm-6">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-5">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-warning text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                        <Icon icon="mdi:alert-circle" className="icon" />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            High Risk
                                        </span>
                                        <h6 className="fw-semibold">{stats.highRiskCount}</h6>
                                    </div>
                                </div>
                                <div
                                    id="risk-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChart('#ffc107')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                <span className="bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm">
                                    {stats.fraudPercentage.toFixed(1)}%
                                </span>{" "}
                                of total transactions
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 col-sm-6">
                    <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-6">
                        <div className="card-body p-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="mb-0 w-48-px h-48-px bg-cyan text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                                        <Icon
                                            icon="streamline:interface-security-shield-protect-secure-safety-guard-security"
                                            className="icon"
                                        />
                                    </span>
                                    <div>
                                        <span className="mb-2 fw-medium text-secondary-light text-sm">
                                            Fraud Score
                                        </span>
                                        <h6 className="fw-semibold">
                                            {(100 - stats.fraudPercentage).toFixed(1)}/100
                                        </h6>
                                    </div>
                                </div>
                                <div
                                    id="fraud-chart"
                                    className="remove-tooltip-title rounded-tooltip-value"
                                >
                                    {createChart('#00b8f2')}
                                </div>
                            </div>
                            <p className="text-sm mb-0">
                                <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                                    +{(100 - stats.fraudPercentage - 80).toFixed(1)} pts
                                </span>{" "}
                                vs last month
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionStats