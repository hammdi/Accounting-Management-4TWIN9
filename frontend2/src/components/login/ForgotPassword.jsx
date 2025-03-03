import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import '../../assets/css/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset link sent to:', email);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow-lg text-center" style={{ width: '550px', borderRadius: '12px' }}>
                <h2 className="fw-bold">Forgot Password</h2>
                <p className="text-muted">
                    Enter the email address associated with your account and we will send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <FaEnvelope className="text-secondary" />
                        </span>
                        <input 
                            type="email" 
                            className="form-control border-start-0"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100 mb-3" type="submit">
                        Continue
                    </button>
                </form>

                <Link to="/sign-in" className="text-decoration-none fw-bold text-primary">
                    Back to Sign In
                </Link>

                <p className="text-muted mt-3">
                    Already have an account? <Link to="/sign-in" className="text-primary fw-bold">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;

