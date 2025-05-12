"use client"

import { useNavigate, Link } from "react-router-dom"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useEffect, useState } from "react" // ✅ FIXED: added useState

// Define the color palette
const colorPalette = {
  primary: "#FFFFFF",
  dark: "#242423",
  greyDark: "#333533",
  greyLight: "#cccccc",
  silverSubtle: "#f2f2f2",
}

// Add CSS for fade-in animation
const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    opacity: 0;
    animation: fadeIn 1s ease-in-out forwards;
  }
`;

const HomeLayer = () => {
  const navigate = useNavigate()
  const [showDemo, setShowDemo] = useState(false) // ✅ FIXED: moved useState inside component

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = fadeInStyle;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        })
      },
      { threshold: 0.1 }
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

      {/* 1. Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light py-3 sticky-top shadow-sm" style={{ backgroundColor: "white" }}>
        <div className="container">
          {/* Logo */}
          <a href="#home" className="navbar-brand d-flex align-items-center gap-2">
            <img
              src="assets/images/logo.png"
              alt="MiLiM Logo"
              className="mb-3"
              style={{ width: "168px", height: "40px", objectFit: "contain" }}
            />
          </a>

          {/* Toggler Button */}
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

          {/* Collapsible Menu */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium">
              <li className="nav-item px-2">
                <a href="#home" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  Home
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#features" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  Features
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#how-it-works" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  How It Works
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#product-module" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  Product Modules
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#comparison-table" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  Comparison
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#ai-forecasting" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  AI & Forecasting
                </a>
              </li>
              <li className="nav-item px-2">
                <a href="#testimonials" className="nav-link" style={{ color: colorPalette.greyDark, fontSize: "0.9rem" }}>
                  Testimonials
                </a>
              </li>
            </ul>

            {/* Sign In & CTA Button */}
            <div className="d-flex gap-3">
              <a href="/sign-in" className="btn btn-link text-dark text-decoration-none" style={{ fontSize: "0.85rem" }}>
                Sign In
              </a>
              <button
                onClick={handleJoinNow}
                className="btn px-4 rounded-1 fw-semibold shadow-sm"
                style={{
                  backgroundColor: colorPalette.primary,
                  borderColor: colorPalette.primary,
                  color: colorPalette.dark,
                  transition: "all 0.3s ease-in-out",
                  fontSize: "0.85rem",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Try Free Beta
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="home" className="hero-section py-5 py-lg-6">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 animate-on-scroll">
              <h1 className="display-6 fw-bold mb-4 lh-sm" style={{ color: colorPalette.greyDark }}>
                Simplify your financial operations
              </h1>
              <p className="lead mb-4 fs-5" style={{ color: colorPalette.greyDark }}>
                MiLiM is a secure, cloud-based accounting platform powered by artificial intelligence. We help you automate tedious tasks, ensure tax compliance, and gain real-time insights—so you can focus on growing your business.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <button
                  onClick={handleJoinNow}
                  className="btn btn-lg px-4 py-2 rounded-1"
                  style={{
                    backgroundColor: colorPalette.primary,
                    borderColor: colorPalette.primary,
                    color: colorPalette.dark,
                  }}
                >
                  🚀 Try Free Beta
                </button>
                <button
                  onClick={() => setShowDemo(true)}
                  className="btn btn-outline-gold btn-lg px-4 py-2 rounded-1 d-flex align-items-center"
                  style={{ color: colorPalette.greyDark, borderColor: colorPalette.greyDark }}
                >
                  <Icon icon="mdi:play-circle" className="me-2" width="20" height="20" />
                  📽 Watch Demo
                </button>
              </div>
            </div>

            <div className="col-lg-6 animate-on-scroll">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Financial Management"
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>

{/* Video Modal */}
{showDemo && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 1050,
    }}
  >
    <div
      className="position-relative bg-dark rounded-4 p-3 shadow"
      style={{
        width: "90%",
        maxWidth: "800px",
        overflow: "hidden",
      }}
    >
      {/* Exit Button */}
      <button
        className="btn btn-sm btn-light"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1100, // Ensures it's above the iframe
        }}
        onClick={() => setShowDemo(false)}
      >
        ✖ Exit Demo
      </button>

      <div className="ratio ratio-16x9 rounded overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/dn1u0SbWsjA"
          title="MiLiM Demo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded"
          style={{ border: "none" }}
        />
      </div>
    </div>
  </div>
)}


      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Smart Features Tailored for Tunisia
              </h3>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Explore how MiLiM can optimize your financial management with advanced features tailored for Tunisian businesses.
              </p>
            </div>
          </div>
          <div className="row mt-4">
            {/* AI-Powered Bookkeeping */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:book-open" width="48" height="48" style={{ color: "#333333" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>AI-Powered Bookkeeping</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Automate transaction classification and organization with AI, reducing time and errors.
                  </p>
                </div>
              </div>
            </div>
            
            {/* VAT & CNSS Compliance Engine */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:cash-multiple" width="48" height="48" style={{ color: "#333333" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>VAT & CNSS Compliance</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Stay fully compliant with Tunisia's VAT and CNSS regulations without manual checks.
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Dashboards */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:chart-donut" width="48" height="48" style={{ color: "#333333" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Dynamic Dashboards</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    View real-time financial health metrics with interactive dashboards, monitoring cash flow and trends.
                  </p>
                </div>
              </div>
            </div>

            {/* Client & Third-Party Management */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:account-group" width="48" height="48" style={{ color: "#333333" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Client & Third-Party Management</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Streamline client, supplier, and third-party management with customizable profiles and history tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Bank & ERP Integration */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:bank" width="48" height="48" style={{ color: "#333333" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Bank & ERP Integration</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Easily integrate with banking and ERP systems to sync and reconcile financial data automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Military-Grade Security */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:shield-lock" width="48" height="48" style={{ color: "#333333" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Military-Grade Security</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Safeguard your financial data with advanced encryption, access controls, and secure sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 4. How It Works (Onboarding Flow) */}
      <section id="how-it-works" className="py-5 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Get Started in 3 Simple Steps
              </h2>
            </div>
          </div>
          <div className="row mt-4">
            {/* Step 1: Create Your Workspace */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:account-group" width="48" height="48" style={{ color: "#FF6F61" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Step 1: Create Your Workspace</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Register your company profile, invite collaborators, and configure your roles & permissions in a matter of minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Connect & Import Your Data */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:file-import" width="48" height="48" style={{ color: "#FFB100" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Step 2: Connect & Import Your Data</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    Upload accounting documents, Excel sheets, or integrate with your bank. MiLiM instantly processes and structures the data for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Let the AI Do the Work */}
            <div className="col-md-4 mb-4 animate-on-scroll">
              <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body text-center">
                  <Icon icon="mdi:robot" width="48" height="48" style={{ color: "#0F92A1" }} className="mb-3" />
                  <h5 className="card-title" style={{ color: colorPalette.greyDark }}>Step 3: Let the AI Do the Work</h5>
                  <p className="card-text" style={{ color: colorPalette.greyDark }}>
                    From categorizing transactions to generating reports, MiLiM’s AI-driven engine takes over, saving hours of manual work each week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* 5. Product Module Showcase */}
<section id="product-module" className="py-5 bg-light">
  <div className="container">
    <div className="row">
      <div className="col-12 text-center">
        <h2 className="fw-bold mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
          Explore the Power of MiLiM in Action
        </h2>
        <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
          Discover how MiLiM’s powerful modules streamline your financial management. Explore the features in action!
        </p>
      </div>
    </div>

    {/* Carousel for modules */}
    <div id="productModulesCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">

        {/* Accounting Journal Module */}
        <div className="carousel-item active">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 rounded-3 shadow-lg" alt="Accounting Journal" style={{ height: '300px', objectFit: 'cover' }} />
              <h5 className="mt-3 mb-3" style={{ color: colorPalette.greyDark }}>📚 Accounting Journal (Grand Livre)</h5>
              <p style={{ color: colorPalette.greyDark }}>
                Log and filter all transactions with comprehensive audit trails, ensuring transparency and accountability.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Reports Module */}
        <div className="carousel-item">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
            <img src="https://images.pexels.com/photos/5561913/pexels-photo-5561913.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 rounded-3 shadow-lg" alt="Financial Reports" style={{ height: '300px', objectFit: 'cover' }} />
            <h5 className="mt-3 mb-3" style={{ color: colorPalette.greyDark }}>📃 Financial Reports</h5>
              <p style={{ color: colorPalette.greyDark }}>
                Generate accurate balance sheets, income statements, and cash flow reports with just one click.
              </p>
            </div>
          </div>
        </div>

        {/* Expense & Income Tracking Module */}
        <div className="carousel-item">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
            <img src="https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 rounded-3 shadow-lg" alt="Accounting Journal" style={{ height: '300px', objectFit: 'cover' }} />
            <h5 className="mt-3 mb-3" style={{ color: colorPalette.greyDark }}>📉 Expense & Income Tracking</h5>
              <p style={{ color: colorPalette.greyDark }}>
                Track where your money goes with detailed categories, charts, and real-time insights.
              </p>
            </div>
          </div>
        </div>

          {/* AI Forecasts Module */}
          <div className="carousel-item">
            <div className="row justify-content-center">
              <div className="col-md-8 text-center">
                <img src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 rounded-3 shadow-lg" alt="AI Forecasts" style={{ height: '300px', objectFit: 'cover' }} />
                <h5 className="mt-3 mb-3" style={{ color: colorPalette.greyDark }}>🤖 AI Forecasts</h5>
                <p style={{ color: colorPalette.greyDark }}>
                  Harness the power of predictive analytics for smarter revenue and expense forecasting.
                </p>
              </div>
            </div>
          </div>


        {/* Tax Reports Module */}
        <div className="carousel-item">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
            <img src="https://images.pexels.com/photos/7735708/pexels-photo-7735708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="d-block w-100 rounded-3 shadow-lg" alt="Tax Reports" style={{ height: '300px', objectFit: 'cover' }} />
            <h5 className="mt-3 mb-3" style={{ color: colorPalette.greyDark }}>🧾 Tax Reports</h5>
              <p style={{ color: colorPalette.greyDark }}>
                Easily export VAT, CNSS, and other tax declarations in official formats for compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#productModulesCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: `invert(1)` }}></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#productModulesCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: `invert(1)` }}></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</section>

      {/* 6. 📊 Comparison Table 
      <section  id="comparison-table"
        className="py-5"
        style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}
      >
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="fw-bold animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Why MiLiM Outperforms Other Tools
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                A quick comparison to show how MiLiM is tailored for your local needs and powered by smart features.
              </p>
            </div>
          </div>

          <div className="row animate-on-scroll">
            <div className="col-12">
              <div className="table-responsive shadow-sm rounded-3 overflow-hidden">
                <table className="table table-bordered mb-0 text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-bold text-start" style={{ backgroundColor: '#f1f1f1' }}>Feature</th>
                      <th className="fw-bold">MiLiM</th>
                      <th className="fw-bold">Excel</th>
                      <th className="fw-bold">Odoo</th>
                      <th className="fw-bold">QuickBooks</th>
                      <th className="fw-bold">Zoho Books</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-start">AI Bookkeeping</td>
                      <td>✅</td>
                      <td>❌</td>
                      <td>⚠️</td>
                      <td>✅</td>
                      <td>⚠️</td>
                    </tr>
                    <tr>
                      <td className="text-start">VAT Tunisie Native</td>
                      <td>✅</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                    </tr>
                    <tr>
                      <td className="text-start">CNSS-Compatible Reports</td>
                      <td>✅</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                    </tr>
                    <tr>
                      <td className="text-start">Bank Integration</td>
                      <td>✅</td>
                      <td>❌</td>
                      <td>✅</td>
                      <td>✅</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td className="text-start">Tunisian Regulatory Updates</td>
                      <td>✅</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                    </tr>
                    <tr>
                      <td className="text-start">Free Beta</td>
                      <td>✅</td>
                      <td>✅</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-muted small text-center">
                ⚠️ = Partial support or requires customization | ❌ = Not available
              </div>
            </div>
          </div>
        </div>
      </section>
      */}
      {/* 7. 🤖 AI & Forecasting */}
      <section   id="ai-forecasting"

        className="py-5"
        style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}
      >
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="fw-bold animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Smarter Decisions, Powered by AI
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                MiLiM helps you anticipate the future with smart predictions and real-time forecasting tools.
              </p>
            </div>
          </div>

          <div className="row align-items-center g-4">
            {/* Image */}
            <div className="col-lg-6 animate-on-scroll">
              <img
                src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=870&q=80"
                alt="AI Forecasting Dashboard"
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>

            {/* Textual Content */}
            <div className="col-lg-6 animate-on-scroll">
              <div className="p-4 rounded-3 shadow-sm bg-white">
                <h5 className="fw-bold mb-3" style={{ color: colorPalette.greyDark }}>
                  Real-Time Forecasts at Your Fingertips
                </h5>
                <p className="mb-3" style={{ color: colorPalette.greyDark }}>
                  Our AI continuously analyzes your historical data and market trends to suggest smarter financial actions.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex align-items-center" style={{ color: colorPalette.greyDark }}>
                    <Icon icon="mdi:trending-up" width={22} height={22} className="me-2" color="#4CAF50" />
                    Predictive Analytics to detect financial trends early
                  </li>
                  <li className="mb-2 d-flex align-items-center" style={{ color: colorPalette.greyDark }}>
                    <Icon icon="mdi:chart-line" width={22} height={22} className="me-2" color="#2196F3" />
                    Forecasting Tools for smarter cash flow planning
                  </li>
                  <li className="d-flex align-items-center" style={{ color: colorPalette.greyDark }}>
                    <Icon icon="mdi:lightbulb-on-outline" width={22} height={22} className="me-2" color="#FFC107" />
                    Informed Decision Making driven by smart insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 🔐 Security & Compliance */}
      <section id="security-compliance" className="py-5 bg-white">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="fw-bold animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Why You Can Trust MiLiM
              </h2>
              <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
                Enterprise-grade security. Built-in compliance. Peace of mind.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Data Encryption */}
            <div className="col-md-4 animate-on-scroll">
              <div className="text-center px-3 py-4 shadow-sm rounded-3 h-100 bg-light">
                <Icon icon="mdi:shield-lock-outline" width="48" height="48" style={{ color: '#4CAF50' }} className="mb-3" />
                <h5 className="fw-semibold" style={{ color: colorPalette.greyDark }}>End-to-End Encryption</h5>
                <p style={{ color: colorPalette.greyDark }}>
                  Your data is protected at all times—during storage and while it's moving. We use advanced encryption protocols to keep everything safe.
                </p>
              </div>
            </div>

            {/* Access Control */}
            <div className="col-md-4 animate-on-scroll">
              <div className="text-center px-3 py-4 shadow-sm rounded-3 h-100 bg-light">
                <Icon icon="mdi:lock-check-outline" width="48" height="48" style={{ color: '#2196F3' }} className="mb-3" />
                <h5 className="fw-semibold" style={{ color: colorPalette.greyDark }}>Granular Access Control</h5>
                <p style={{ color: colorPalette.greyDark }}>
                  Only the right people see the right data. Manage access by user role to ensure confidentiality across your organization.
                </p>
              </div>
            </div>

            {/* Regular Audits */}
            <div className="col-md-4 animate-on-scroll">
              <div className="text-center px-3 py-4 shadow-sm rounded-3 h-100 bg-light">
                <Icon icon="mdi:security" width="48" height="48" style={{ color: '#FF9800' }} className="mb-3" />
                <h5 className="fw-semibold" style={{ color: colorPalette.greyDark }}>Compliance & Audits</h5>
                <p style={{ color: colorPalette.greyDark }}>
                  Our platform is built with compliance in mind. Regular security audits and monitoring ensure your data stays protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



    {/* 8. 🗣 Testimonials */}
    <section   id="testimonials"

      className="py-5"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-bold animate-on-scroll" style={{ color: colorPalette.greyDark }}>
              What Our Early Users Are Saying
            </h2>
            <p className="lead animate-on-scroll" style={{ color: colorPalette.greyDark }}>
              Real feedback from Tunisian entrepreneurs and beta testers.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Testimonial 1 */}
          <div className="col-md-4 animate-on-scroll">
            <div
              className="p-4 rounded-3 shadow-lg h-100 bg-white"
              style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            >
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pravatar.cc/100?img=8"
                  alt="User avatar"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <div>
                  <h6 className="mb-0 fw-bold">Imen B.</h6>
                  <small className="text-muted">CEO, ComptaPlus</small>
                </div>
              </div>
              <p style={{ color: colorPalette.greyDark }}>
                “With MiLiM, we saved <strong>15 hours/month</strong> on bookkeeping. The AI alerts helped us avoid two compliance issues in the last quarter.”
              </p>
              <div className="d-flex align-items-center">
                <span className="text-warning me-1">★★★★★</span>
                <a
                  href="https://www.linkedin.com/in/imen-b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-auto text-decoration-none small"
                >
                  <Icon icon="mdi:linkedin" className="me-1" color="#0077b5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="col-md-4 animate-on-scroll">
            <div
              className="p-4 rounded-3 shadow-lg h-100 bg-white"
              style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: '50px', height: '50px', fontWeight: 'bold' }}
                >
                  KZ
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Khaled Z.</h6>
                  <small className="text-muted">Freelancer, DevCompta</small>
                </div>
              </div>
              <p style={{ color: colorPalette.greyDark }}>
                “I used to manage everything manually in Excel. MiLiM’s dashboard and smart reminders made my life way easier!”
              </p>
              <div className="d-flex align-items-center">
                <span className="text-warning me-1">★★★★☆</span>
                <a
                  href="https://www.linkedin.com/in/khaled-z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-auto text-decoration-none small"
                >
                  <Icon icon="mdi:linkedin" className="me-1" color="#0077b5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="col-md-4 animate-on-scroll">
            <div
              className="p-4 rounded-3 shadow-lg h-100 bg-white"
              style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
            >
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="User avatar"
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <div>
                  <h6 className="mb-0 fw-bold">Rania D.</h6>
                  <small className="text-muted">Founder, Rania Beauty</small>
                </div>
              </div>
              <p style={{ color: colorPalette.greyDark }}>
                “I had zero accounting experience. MiLiM gave me peace of mind and let me focus on growing my brand.”
              </p>
              <div className="d-flex align-items-center">
                <span className="text-warning me-1">★★★★★</span>
                <a
                  href="https://www.linkedin.com/in/rania-d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-auto text-decoration-none small"
                >
                  <Icon icon="mdi:linkedin" className="me-1" color="#0077b5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 9. 🎯 Final CTA Section */}
    <section  id="contact" className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <h2 className="fw-bold mb-3 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
              Experience the Future of Accounting — Join the Beta
            </h2>
            <p className="lead mb-4 animate-on-scroll" style={{ color: colorPalette.greyDark }}>
              MiLiM is more than an accounting tool—it's your AI-powered financial assistant, designed by Tunisians for Tunisia.
              Join our beta program now and help shape the future of finance.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4 animate-on-scroll">
              <a
                href="#join-beta"
                className="btn btn-lg px-4 py-2 rounded-1"
                style={{
                  backgroundColor: colorPalette.primary,
                  borderColor: colorPalette.primary,
                  color: colorPalette.dark, // Dark text on the primary button for contrast
                  fontWeight: 'bold',
                }}
              >
                🚀 Join Beta Now
              </a>
              <a
                href="#contact"
                className="btn btn-outline-dark btn-lg px-4 py-2 rounded-1"
                style={{
                  borderColor: colorPalette.greyDark,
                  color: colorPalette.greyDark, // Dark grey text for the outline button
                  fontWeight: 'bold',
                }}
              >
                📩 Contact the Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>


    {/* 10. 🔚 Footer */}
    <footer className="py-5" style={{ backgroundColor: colorPalette.dark }}>
      <div className="container">
        <div className="row">
          {/* About MiLiM */}
          <div className="col-md-4 mb-4 mb-md-0">
          <img src="assets/images/logo.png"  alt="MiLiM Logo" className="mb-3" style={{ width: '168px', height: '40px', objectFit: 'contain' }}/>
            <p style={{ color: '#fff' }}>
              MiLiM is a Tunisian startup building the future of intelligent accounting.
              Designed for local businesses, powered by AI.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-white mb-3">Navigation</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/features" className="text-white text-decoration-none">Features</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-white text-decoration-none">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Contact Info & Socials */}
          <div className="col-md-4">
            <h5 className="text-white mb-3">Contact Us</h5>
            <ul className="list-unstyled text-white">
              <li>📍 Tunisia</li>
              <li>📧 <a href="mailto:contact@milim.tn" className="text-white text-decoration-none">contact@milim.tn</a></li>
              <li>📞 <a href="tel:+21612345678" className="text-white text-decoration-none">+216 12 345 678</a></li>
            </ul>
            <div className="d-flex gap-3 mt-3">
              <a href="https://www.linkedin.com/company/milim" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <Icon icon="mdi:linkedin" color="#0A66C2" />
              </a>
              <a href="https://github.com/milim" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <Icon icon="mdi:github" color="#ffffff" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="text-white mb-0">
              © 2024 MiLiM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>

    </div>
  )
}

export default HomeLayer
