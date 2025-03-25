"use client"

import { useState, useEffect } from "react"
import { FiDollarSign, FiUsers, FiShoppingCart, FiActivity } from "react-icons/fi"

// Import components
import Sidebar from "../../components/dashboard/Sidebar"
import Navbar from "../../components/dashboard/Navbar"
import StatCard from "../../components/dashboard/StatCard"
import SalesOverview from "../../components/dashboard/SalesOverview"
import PerformanceMetrics from "../../components/dashboard/PerformanceMetrics"
import ActivityTimeline from "../../components/dashboard/ActivityTimeline"
import SettingsButton from "../../components/dashboard/SettingsButton"

const Dashbored1 = () => {
  const [activeMenu, setActiveMenu] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoaded(true)
    }, 800)
  }, [])

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dash-dark-theme")
  }

  // Stat cards data
  const statCards = [
    {
      title: "Total Revenue",
      value: "$24,500",
      change: "12% increase",
      icon: <FiDollarSign size={24} />,
      color: "primary",
      progress: 75,
      animationDelay: 0.1,
    },
    {
      title: "New Customers",
      value: "145",
      change: "8% increase",
      icon: <FiUsers size={24} />,
      color: "success",
      progress: 65,
      animationDelay: 0.2,
    },
    {
      title: "Total Orders",
      value: "458",
      change: "5% increase",
      icon: <FiShoppingCart size={24} />,
      color: "warning",
      progress: 45,
      animationDelay: 0.3,
    },
    {
      title: "Conversion Rate",
      value: "12.3%",
      change: "3% decrease",
      icon: <FiActivity size={24} />,
      color: "danger",
      progress: 35,
      animationDelay: 0.4,
    },
  ]

  return (
    <div className={`dash-container ${darkMode ? "dash-dark-theme" : ""}`}>
      {/* Settings button */}
      <SettingsButton />

      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Sidebar toggle button (visible when sidebar is closed) */}
      <button
        className={`dash-sidebar-toggle ${!activeMenu ? "visible" : ""}`}
        onClick={() => setActiveMenu(true)}
        aria-label="Open sidebar"
      >
        <i className="fa fa-bars"></i>
      </button>

      {/* Main content */}
      <div className={`dash-main-content ${activeMenu ? "dash-with-sidebar" : ""}`}>
        {/* Top navbar */}
        <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} toggleTheme={toggleTheme} darkMode={darkMode} />

        {/* Dashboard content */}
        <div className="dash-content-container p-4">
          {/* Page header */}
          {/* Remove or comment out these lines if they exist in your Dashbored1.jsx file:
          <div className="dash-page-header">
            <h1 className="dash-page-title">Dashboard</h1>
            <p className="dash-page-subtitle">Welcome back, John! Here's what's happening with your business today.</p>
          </div>

          The title and subtitle are now handled in the Navbar component */}

          {/* Stats cards */}
          <div className="row">
            {statCards.map((card, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <StatCard {...card} />
              </div>
            ))}
          </div>

          {/* Charts and data */}
          <div className="row">
            <div className="col-lg-8 mb-4">
              <SalesOverview animationDelay={0.5} />
            </div>

            <div className="col-lg-4 mb-4">
              <PerformanceMetrics animationDelay={0.6} />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="row">
            <div className="col-12 mb-4">
              <ActivityTimeline animationDelay={0.7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashbored1










