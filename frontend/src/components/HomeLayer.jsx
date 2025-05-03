"use client"

import { useNavigate, Link } from "react-router-dom"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useEffect } from "react"

// Define the color palette
const colorPalette = {
  primary: "#FFFFFF", // White as the primary color
  dark: "#242423", // Dark background color
  greyDark: "#333533", // Dark grey for text
  greyLight: "#cccccc", // Light grey for borders and accents
  silverSubtle: "#f2f2f2", // Very light grey for subtle backgrounds
}

const HomeLayer = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observer.observe(element)
    })

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [])

  const handleJoinNow = () => {
    navigate("/sign-in")
  }

  return (
    <div className="millim-homepage" style={{ backgroundColor: colorPalette.silverSubtle }}>
      {/* 1. Navigation (Header) */}
      <nav className="navbar navbar-expand-lg navbar-light py-3 sticky-top shadow-sm" style={{ backgroundColor: "white" }}>
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img src="assets/images/logo.png" alt="Millim Logo" className="max-w-290-px" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0" style={{ color: colorPalette.primary }}>
              <li className="nav-item px-2">
                <Link to="/features" className="nav-link" style={{ color: colorPalette.greyDark }}>
                  Features
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/solutions" className="nav-link" style={{ color: colorPalette.greyDark }}>
                  Solutions
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/pricing" className="nav-link" style={{ color: colorPalette.greyDark }}>
                  Pricing
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/resources" className="nav-link" style={{ color: colorPalette.greyDark }}>
                  Resources
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link to="/enterprise" className="nav-link" style={{ color: colorPalette.greyDark }}>
                  Enterprise
                </Link>
              </li>
            </ul>

            <div className="d-flex gap-3">
              <Link to="/sign-in" className="btn btn-link text-dark text-decoration-none">
                Sign in
              </Link>
              <button onClick={handleJoinNow} className="btn px-4 rounded-1" style={{ backgroundColor: colorPalette.primary, borderColor: colorPalette.primary, color: colorPalette.dark }}>
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero-section py-5 py-lg-6">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 animate-on-scroll">
              <h1 className="display-4 fw-bold mb-4 lh-sm" style={{ color: colorPalette.greyDark }}>
                Simplify your financial operations
              </h1>
              <p className="lead mb-4 fs-5" style={{ color: colorPalette.greyDark }}>
                Millim gives you the tools to manage, track, and optimize your company's finances with powerful
                automation and insights.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <button onClick={handleJoinNow} className="btn btn-lg px-4 py-2 rounded-1" style={{ backgroundColor: colorPalette.primary, borderColor: colorPalette.primary, color: colorPalette.dark }}>
                  Start Free Trial
                </button>
                <button className="btn btn-outline-gold btn-lg px-4 py-2 rounded-1 d-flex align-items-center" style={{ color: colorPalette.greyDark, borderColor: colorPalette.greyDark }}>
                  <Icon icon="mdi:play-circle" className="me-2" width="20" height="20" />
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="col-lg-6 animate-on-scroll">
              {/* Placeholder for an image or other content */}
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Financial Management"
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Overview */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Explore Our Key Features
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Discover how Millim can transform your financial management.
              </p>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="ic:outline-insights" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Real-time Insights</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Get up-to-the-minute data on your financial performance.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:automation" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Automated Workflows</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Automate routine tasks and focus on strategic initiatives.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:finance" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Financial Planning</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Plan for the future with our comprehensive financial tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Testimonials */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                What Our Customers Say
              </h2>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body">
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    "Millim has transformed our financial processes. We now have real-time insights and can make
                    data-driven decisions."
                  </p>
                  <footer className="blockquote-footer mt-2">
                    Jane Doe, <cite title="Source Title">Acme Corp</cite>
                  </footer>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body">
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    "The automation features have saved us countless hours. We can now focus on growing our business."
                  </p>
                  <footer className="blockquote-footer mt-2">
                    Richard Roe, <cite title="Source Title">Beta Co</cite>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Integrations */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Seamless Integrations
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Millim works with your existing tools for a smoother workflow.
              </p>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-3 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="logos:salesforce" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Salesforce</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="logos:google-sheets" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Google Sheets</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="logos:xero" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Xero</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="logos:slack" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Slack</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security & Compliance */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Security You Can Trust
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                We’re committed to safeguarding your financial data.
              </p>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:shield-lock" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Data Encryption</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Your data is encrypted both in transit and at rest.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:lock-check" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Access Control</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Granular access control ensures that only authorized personnel can access your data.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:security" width="48" height="48" style={{ color: colorPalette.primary }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Regular Audits</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    We conduct regular security audits to ensure the integrity of our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AI & Forecasting */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f2f2f2 0%, #ffffff 100%)' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                AI-Powered Predictions
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Use predictive analytics to stay ahead of the curve.
              </p>
            </div>
          </div>
          <div className="row mt-4 align-items-center">
            <div className="col-lg-6 animate-on-scroll">
              <img
                src="https://images.pexels.com/photos/5473304/pexels-photo-5473304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="AI Predictions"
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
            <div className="col-lg-6 animate-on-scroll">
              <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <h5 className="fw-bold mb-3" style={{ color: colorPalette.greyDark }}>
                  Future Financial Trends
                </h5>
                <p className="mb-3" style={{ color: colorPalette.greyDark }}>
                  Our AI algorithms analyze vast amounts of data to predict future financial trends, helping you stay
                  ahead of the curve.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2" style={{ color: colorPalette.greyDark }}>
                    <Icon icon="mdi:trending-up" className="me-1" color={colorPalette.primary} />
                    Predictive Analytics
                  </li>
                  <li className="mb-2" style={{ color: colorPalette.greyDark }}>
                    <Icon icon="mdi:chart-line" className="me-1" color={colorPalette.primary} />
                    Forecasting Tools
                  </li>
                  <li style={{ color: colorPalette.greyDark }}>
                    <Icon icon="mdi:lightbulb-on" className="me-1" color={colorPalette.primary} />
                    Informed Decision Making
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action (CTA) */}
      <section className="cta-section py-5" style={{ backgroundColor: colorPalette.primary }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 text-center">
              <h2 className="text-dark fw-bold mb-4 animate-on-scroll">
                Ready to transform your financial management?
              </h2>
              <button onClick={handleJoinNow} className="btn btn-lg px-4 py-2 rounded-1 btn-light border-gold animate-on-scroll" style={{ backgroundColor: colorPalette.silverSubtle, color: colorPalette.dark }}>
                Start Your Free Trial Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="py-5" style={{ backgroundColor: colorPalette.dark }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <img src="assets/images/logo.png" alt="Millim Logo" className="mb-3 max-w-290-px" />
              <p style={{ color: colorPalette.greyLight }}>
                Millim is a financial management platform that helps you simplify your financial operations.
              </p>
            </div>
            <div className="col-md-2">
              <h5 className="text-white mb-3">Company</h5>
              <ul className="list-unstyled">
                <li><Link to="/about" className="text-muted text-decoration-none">About</Link></li>
                <li><Link to="/careers" className="text-muted text-decoration-none">Careers</Link></li>
                <li><Link to="/blog" className="text-muted text-decoration-none">Blog</Link></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h5 className="text-white mb-3">Features</h5>
              <ul className="list-unstyled">
                <li><Link to="/invoicing" className="text-muted text-decoration-none">Invoicing</Link></li>
                <li><Link to="/reporting" className="text-muted text-decoration-none">Reporting</Link></li>
                <li><Link to="/banking" className="text-muted text-decoration-none">Banking</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="text-white mb-3">Subscribe</h5>
              <p style={{ color: colorPalette.greyLight }}>
                Subscribe to our newsletter to stay updated on the latest features and news.
              </p>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Your email" aria-label="Your email" aria-describedby="button-addon2" />
                <button className="btn" type="button" id="button-addon2" style={{ backgroundColor: colorPalette.primary, color: colorPalette.dark }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 text-center">
              <p className="text-muted">
                © 2024 Millim. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomeLayer
