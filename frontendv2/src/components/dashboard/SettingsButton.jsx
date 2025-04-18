import { FiSettings } from "react-icons/fi"

const SettingsButton = () => {
  return (
    <div className="dash-settings-btn-container">
      <button type="button" className="dash-settings-btn" aria-label="Settings">
        <FiSettings className="dash-settings-icon" />
        <span className="dash-settings-pulse"></span>
        <span className="dash-settings-pulse dash-pulse-delay"></span>
      </button>
    </div>
  )
}

export default SettingsButton

