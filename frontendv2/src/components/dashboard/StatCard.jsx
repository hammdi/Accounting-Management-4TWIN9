const StatCard = ({ title, value, change, icon, color, progress, animationDelay }) => {
  return (
    <div className={`dash-stat-card animated fadeInUp`} style={{ animationDelay: `${animationDelay}s` }}>
      <div className="dash-stat-card-body">
        <div className={`dash-stat-card-icon bg-${color}`}>{icon}</div>
        <div className="dash-stat-card-info">
          <div className="dash-stat-card-title">{title}</div>
          <div className="dash-stat-card-value">{value}</div>
          <div className={`dash-stat-card-change ${change.includes("-") ? "dash-negative" : "dash-positive"}`}>
            <i className={`fa fa-arrow-${change.includes("-") ? "down" : "up"}`}></i> {change}
          </div>
        </div>
      </div>
      <div className="dash-stat-card-progress">
        <div className={`progress-bar bg-${color}`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

export default StatCard

