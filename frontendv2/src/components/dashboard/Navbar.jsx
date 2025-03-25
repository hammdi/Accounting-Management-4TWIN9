"use client"
import { FiSearch, FiBell, FiMail, FiMoon, FiSun } from "react-icons/fi"

const Navbar = ({ activeMenu, setActiveMenu, toggleTheme, darkMode }) => {
  return (
    <div className="dash-navbar-container">
      <nav className="dash-navbar">
        <div className="dash-navbar-left">
          <button
            className="dash-menu-toggle"
            type="button"
            onClick={() => setActiveMenu(!activeMenu)}
            aria-label={activeMenu ? "Close sidebar" : "Open sidebar"}
          >
            <i className={`fa ${activeMenu ? "fa-times d-lg-none" : "fa-bars"}`}></i>
          </button>
          <div className="dash-page-title-container">
            <h1 className="dash-page-title">Dashboard</h1>
            <p className="dash-page-subtitle">Welcome back, John! Here's what's happening with your business today.</p>
          </div>
        </div>

        <div className="dash-navbar-right">
          <div className="dash-search-container">
            <div className="dash-search-box">
              <input type="text" className="dash-search-input" placeholder="Search..." />
              <button className="dash-search-btn">
                <FiSearch size={18} />
              </button>
            </div>
          </div>

          <div className="dash-navbar-actions">
            <div className="dash-icon-button">
              <FiBell size={20} />
              <span className="dash-notification-badge badge-danger">4</span>
            </div>

            <div className="dash-icon-button">
              <FiMail size={20} />
              <span className="dash-notification-badge badge-primary">3</span>
            </div>

            <div className="dash-theme-toggle-btn" onClick={toggleTheme}>
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </div>

            <div className="dash-user-dropdown">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="dash-user-avatar-small" />
              <span className="dash-user-name d-none d-md-inline">John Doe</span>
              <i className="fa fa-chevron-down dash-dropdown-icon"></i>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar



