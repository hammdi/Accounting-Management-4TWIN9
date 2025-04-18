"use client"
import { useState, useEffect } from "react"
import Sidebar from "../../components/dashboard/Sidebar"
import Navbar from "../../components/dashboard/Navbar"
import SettingsButton from "../../components/dashboard/SettingsButton"

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [screenSize, setScreenSize] = useState(undefined)

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (screenSize <= 992) {
      setActiveMenu(false)
    } else {
      setActiveMenu(true)
    }
  }, [screenSize])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`dash-container ${darkMode ? "dash-dark-theme" : ""}`}>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className={`dash-main-content ${activeMenu ? "dash-with-sidebar" : ""}`}>
        <Navbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} toggleTheme={toggleTheme} darkMode={darkMode} />
      </div>

      <SettingsButton />
    </div>
  )
}

export default Dashboard











