import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import '../../assets/css/signUp.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Username:", username, "Email:", email, "Phone:", phone, "Password:", password);
      setIsLoading(false);
    }, 2000); // Simulating API call delay
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-5 shadow-lg" style={{ width: '550px', borderRadius: '12px' }}>
        <h3 className="text-center fw-bold">Sign Up to Your Account</h3>
        <p className="text-center text-muted">Welcome back! Please enter your details</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaUser className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaEnvelope className="text-secondary" />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaPhone className="text-secondary" />
              </span>
              <input
                type="tel"
                className="form-control border-start-0"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaLock className="text-secondary" />
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "start", gap: "8px", marginTop: "12px" }}>
            <input type="checkbox" id="terms" required style={{ marginTop: "-10px" }} />
            <label htmlFor="terms">
              By creating an account means you agree to the {" "}
              <Link to="/terms" className="text-primary text-decoration-none">Terms & Conditions</Link>
              {" "}and our{" "}
              <Link to="/privacy-policy" className="text-primary text-decoration-none">Privacy Policy</Link>.
            </label>
          </div>

          <button className="btn btn-primary w-100 mb-3" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center my-3 text-muted">Or sign up with</div>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-light d-flex align-items-center px-4 border border-secondary">
            <img 
              src="https://cdn.iconscout.com/icon/free/png-256/free-github-40-432516.png?f=webp" 
              alt="GitHub Icon" 
              style={{ width: '20px', height: '20px' }} 
              className="me-2" 
            /> 
            GitHub
          </button>
          <button className="btn btn-light d-flex align-items-center px-4 border border-secondary">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
              alt="Google Icon" 
              style={{ width: '20px', height: '20px' }} 
              className="me-2" 
            /> 
            Google
          </button>
        </div>

        <p className="text-center mt-3 text-muted">
          Already have an account? <Link to="/sign-in" className="text-primary">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;





