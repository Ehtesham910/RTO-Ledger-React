import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/login.css';

function CustomerLogin() {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/customer-login', { mobile, password });
            
            // Save token and user info
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Set default headers for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            // Redirect to customer portal dashboard
            navigate('/portal/dashboard');
        } catch (err) {
            console.error('Customer Login Error:', err);
            setError(err.response?.data?.error || 'Invalid mobile number or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Customer Portal</h2>
                    <p>Enter your credentials to access your account</p>
                </div>
                
                {error && <div className="login-error">{error}</div>}
                
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                            type="text"
                            id="mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter your registered mobile"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password (default: customer123)"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                    
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <a href="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '14px' }}>
                            Are you an Employee? Admin Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CustomerLogin;
