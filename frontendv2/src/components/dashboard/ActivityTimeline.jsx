const ActivityTimeline = ({ animationDelay }) => {
  const activities = [
    {
      icon: "fa-shopping-cart",
      color: "primary",
      title: "New order received",
      subtitle: "Order #10248 from Paul Henriot",
      time: "5 minutes ago",
    },
    {
      icon: "fa-user-plus",
      color: "success",
      title: "New customer registered",
      subtitle: "Mary Saveley from USA",
      time: "1 hour ago",
    },
    {
      icon: "fa-credit-card",
      color: "warning",
      title: "Payment received",
      subtitle: "$1,863.40 from Karin Josephs",
      time: "2 hours ago",
    },
    {
      icon: "fa-exclamation-triangle",
      color: "danger",
      title: "Inventory alert",
      subtitle: "Product SKU-5678 is running low",
      time: "3 hours ago",
    },
  ]

  return (
    <div className={`dash-card animated fadeIn`} style={{ animationDelay: `${animationDelay}s` }}>
      <div className="dash-card-header">
        <h5 className="dash-card-title">Recent Activity</h5>
        <div className="dash-card-actions">
          <button className="btn btn-sm btn-light">
            <i className="fa fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="dash-card-body">
        <div className="dash-activity-timeline">
          {activities.map((activity, index) => (
            <div className="dash-activity-item" key={index}>
              <div className={`dash-activity-icon bg-${activity.color}`}>
                <i className={`fa ${activity.icon}`}></i>
              </div>
              <div className="dash-activity-content">
                <div className="dash-activity-title">{activity.title}</div>
                <div className="dash-activity-subtitle">{activity.subtitle}</div>
                <div className="dash-activity-time">{activity.time}</div>
              </div>
              <div className="dash-activity-action">
                <button className="btn btn-sm btn-outline-primary">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityTimeline

