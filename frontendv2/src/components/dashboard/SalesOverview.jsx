const SalesOverview = ({ animationDelay }) => {
  return (
    <div className={`dash-card animated fadeIn`} style={{ animationDelay: `${animationDelay}s` }}>
      <div className="dash-card-header">
        <h5 className="dash-card-title">Sales Overview</h5>
        <div className="dash-card-actions">
          <button className="btn btn-sm btn-primary mr-2">Monthly</button>
          <button className="btn btn-sm btn-light">Weekly</button>
        </div>
      </div>
      <div className="dash-card-body">
        <div className="chart-container" style={{ height: "300px" }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <p className="text-muted">Sales chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesOverview

