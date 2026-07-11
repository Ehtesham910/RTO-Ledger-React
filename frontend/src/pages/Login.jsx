import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/login.css';

function Login() {
    const [loginType, setLoginType] = useState('staff'); // 'staff' or 'customer'
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    
    // Form fields
    const [identifier, setIdentifier] = useState(''); // used for staff username or customer mobile
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
                if (mode === 'login') {
                    response = await axios.post('http://localhost:5000/api/auth/customer-login', {
                        mobile: identifier,
                        password
                    });
                } else {
                    response = await axios.post('http://localhost:5000/api/auth/customer-register', {
                        name,
                        mobile: identifier,
                        email,
                        password
                    });
                }
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
            console.error('Auth Error', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError(`Failed to ${mode}. Please try again.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ marginTop: mode === 'register' ? '20px' : '0' }}>
                <div className="login-header">
                    <div className="login-logo">RTO Ledger</div>
                    <div className="login-subtitle">Sign in to access your account</div>
                </div>

                <div className="login-type-toggle">
                    <button 
                        type="button"
                        className={loginType === 'staff' ? 'active' : ''} 
                        onClick={() => { setLoginType('staff'); setMode('login'); setIdentifier(''); setError(''); }}
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

                {loginType === 'customer' && (
                    <div className="login-type-toggle" style={{ marginTop: '10px' }}>
                        <button 
                            type="button"
                            className={mode === 'login' ? 'active' : ''} 
                            onClick={() => { setMode('login'); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button 
                            type="button"
                            className={mode === 'register' ? 'active' : ''} 
                            onClick={() => { setMode('register'); setError(''); }}
                        >
                            Register
                        </button>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    
                    {loginType === 'customer' && mode === 'register' && (
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="identifier">
                            {loginType === 'staff' ? 'Username' : 'Mobile Number'}
                        </label>
                        <input 
                            type="text" 
                            id="identifier" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={loginType === 'staff' ? 'Enter your username' : 'Enter your 10-digit mobile number'}
                            pattern={loginType === 'customer' ? "[0-9]{10}" : undefined}
                            maxLength={loginType === 'customer' ? "10" : undefined}
                            required
                        />
                    </div>

                    {loginType === 'customer' && mode === 'register' && (
                        <div className="input-group">
                            <label htmlFor="email">Email Address (Optional)</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                    )}
                    
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={loginType === 'customer' && mode === 'register' ? 'Create a secure password' : 'Enter your password'}
                            required
                            minLength={mode === 'register' ? "6" : undefined}
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Please wait...' : (mode === 'register' ? 'Register Account' : 'Sign In')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
