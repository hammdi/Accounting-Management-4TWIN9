import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../assets/css/signIn.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            console.log('Email:', email, 'Password:', password, 'Remember Me:', rememberMe);
            setIsLoading(false);
        }, 2000); // Simulating API call delay
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-5 shadow-lg" style={{ width: '550px', borderRadius: '12px' }}>
                <h3 className="text-center fw-bold">Sign In to your Account</h3>
                <p className="text-center text-muted">Welcome back! Please enter your details</p>
                
                <form onSubmit={handleSubmit}>
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
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <FaLock className="text-secondary" />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control border-start-0"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="input-group-text bg-white border-start-0" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash className="text-secondary" /> : <FaEye className="text-secondary" />}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <input type="checkbox" name="Rememberme" id="rememberme" required style={{ marginTop: "2px" }}/>
                            <label htmlFor="rememberme" className="form-check-label" required style={{ marginTop: "6px" }}>Remember Me?</label>
                        </div>
                        
                        <Link to="/forgot-password" className="text-decoration-none text-primary">Forgot Password?</Link>
                    </div>
                    
                    <button className="btn btn-primary w-100 mb-3" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
                
                <div className="text-center my-3 text-muted">Or sign in with</div>
                
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-light d-flex align-items-center px-4 border border-secondary">
                        <img 
                            src="https://cdn.iconscout.com/icon/free/png-256/free-github-40-432516.png?f=webp" 
                            alt="Facebook Icon" 
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
                    Don't have an account? <Link to="/sign-up" className="text-primary">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;


















