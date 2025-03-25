"use client"
import { FiBarChart2, FiUsers, FiShoppingCart, FiDollarSign, FiActivity, FiSettings } from "react-icons/fi"

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  return (
    <div className={`dash-sidebar ${activeMenu ? "dash-sidebar-active" : ""}`}>
      <div className="dash-sidebar-header">
        <div className="dash-logo-container">
          <div className="dash-logo-icon">D</div>
          <h3 className="dash-logo-text">DashMaster</h3>
        </div>
        <button className="dash-sidebar-close" onClick={() => setActiveMenu(false)} aria-label="Close sidebar">
          <i className="fa fa-times"></i>
        </button>
      </div>

      <div className="dash-user-profile">
        <div className="dash-user-avatar">
          <img src="/placeholder.svg?height=50&width=50" alt="User" className="rounded-circle" />
          <span className="dash-status-indicator dash-status-online"></span>
        </div>
        <div className="dash-user-info">
          <h6 className="dash-user-name">John Doe</h6>
          <p className="dash-user-role">Administrator</p>
        </div>
      </div>

      <div className="dash-sidebar-content">
        <div className="dash-sidebar-menu">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="dash-nav-link active" href="#">
                <FiBarChart2 className="dash-nav-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="dash-nav-link" href="#">
                <FiUsers className="dash-nav-icon" />
                <span>Customers</span>
                <span className="badge badge-primary ml-auto">New</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="dash-nav-link" href="#">
                <FiShoppingCart className="dash-nav-icon" />
                <span>Orders</span>
                <span className="badge badge-warning ml-auto">5</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="dash-nav-link" href="#">
                <FiDollarSign className="dash-nav-icon" />
                <span>Revenue</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="dash-nav-link" href="#">
                <FiActivity className="dash-nav-icon" />
                <span>Analytics</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="dash-sidebar-footer-menu">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="dash-nav-link" href="#">
                <FiSettings className="dash-nav-icon" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar





