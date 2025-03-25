const PerformanceMetrics = ({ animationDelay }) => {
  const metrics = [
    { title: "Revenue Goal", value: "78%", color: "#4361ee" },
    { title: "Customer Satisfaction", value: "92%", color: "#4cc9f0" },
    { title: "Conversion Rate", value: "45%", color: "#f72585" },
  ]

  return (
    <div className={`dash-card animated fadeIn`} style={{ animationDelay: `${animationDelay}s` }}>
      <div className="dash-card-header">
        <h5 className="dash-card-title">Performance</h5>
        <div className="dash-card-actions">
          <button className="btn btn-sm btn-light">
            <i className="fa fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      <div className="dash-card-body">
        <div className="dash-performance-metrics">
          {metrics.map((metric, index) => (
            <div className="dash-performance-metric" key={index}>
              <div className="dash-metric-info">
                <div className="dash-metric-title">{metric.title}</div>
                <div className="dash-metric-value">{metric.value}</div>
              </div>
              <div className="dash-metric-chart">
                <div className="dash-circular-progress">
                  <div
                    className="dash-circular-progress-inner"
                    style={{
                      background: `conic-gradient(${metric.color} ${Number.parseInt(metric.value)}%, #e9ecef 0)`,
                    }}
                  >
                    <div className="dash-circular-progress-circle"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics

