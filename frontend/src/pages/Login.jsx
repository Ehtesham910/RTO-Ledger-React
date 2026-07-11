import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/login.css';

function Login() {
    const [loginType, setLoginType] = useState('staff'); // 'staff' or 'customer'
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            if (loginType === 'staff') {
                response = await axios.post('http://localhost:5000/api/auth/login', {
                    username: identifier,
                    password
                });
            } else {
                response = await axios.post('http://localhost:5000/api/auth/customer-login', {
                    mobile: identifier,
                    password
                });
            }

            const { token, user } = response.data;
            
            // Store token in sessionStorage
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));

            // Set default headers for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Redirect to appropriate dashboard
            if (loginType === 'staff') {
                navigate('/dashboard');
            } else {
                navigate('/portal/dashboard');
            }
            
        } catch (err) {
            console.error('Login error', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">RTO Ledger</div>
                    <div className="login-subtitle">Sign in to access your account</div>
                </div>

                <div className="login-type-toggle">
                    <button 
                        type="button"
                        className={loginType === 'staff' ? 'active' : ''} 
                        onClick={() => { setLoginType('staff'); setIdentifier(''); setError(''); }}
                    >
                        Staff
                    </button>
                    <button 
                        type="button"
                        className={loginType === 'customer' ? 'active' : ''} 
                        onClick={() => { setLoginType('customer'); setIdentifier(''); setError(''); }}
                    >
                        Customer
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="identifier">{loginType === 'staff' ? 'Username' : 'Mobile Number'}</label>
                        <input 
                            type="text" 
                            id="identifier" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={loginType === 'staff' ? 'Enter your username' : 'Enter your registered mobile'}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={loginType === 'customer' ? 'Enter your password (default: customer123)' : 'Enter your password'}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
