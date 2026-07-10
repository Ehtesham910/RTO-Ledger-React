import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/dashboard.css';

const StatCard = ({ title, value, color, bgColor, icon }) => (
    <div className="stat-card" style={{ '--card-color': color, '--card-bg': bgColor }}>
        <div className="stat-card-header">
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-icon">{icon}</span>
        </div>
        <div className="stat-card-value">{value}</div>
    </div>
);

function PortalDashboard() {
    const [stats, setStats] = useState({
        vehiclesCount: 0,
        requestsCount: 0,
        totalDue: 0,
        totalPaid: 0
    });
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        axios.get('http://localhost:5000/api/portal/dashboard')
            .then(response => {
                setStats(response.data);
            })
            .catch(error => {
                console.error("Error fetching portal dashboard stats:", error);
            });
    }, []);

    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Welcome, {user.username}</h2>
                    <p className="page-subtitle">Here is an overview of your account</p>
                </div>
            </div>

            <div className="dashboard-cards-grid">
                <StatCard 
                    title="MY VEHICLES" 
                    value={stats.vehiclesCount} 
                    color="#0284c7" 
                    bgColor="#f0f9ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><circle cx="6" cy="17" r="2"></circle><circle cx="18" cy="17" r="2"></circle><path d="M14 7v4"></path><path d="M14 7h4l2 4"></path></svg>}
                />

                <StatCard 
                    title="SERVICE REQUESTS" 
                    value={stats.requestsCount} 
                    color="#16a34a" 
                    bgColor="#f0fdf4"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                />

                <StatCard 
                    title="TOTAL PAID" 
                    value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalPaid)} 
                    color="#0d9488" 
                    bgColor="#f0fdfa"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                />

                <StatCard 
                    title="OUTSTANDING DUE" 
                    value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalDue)} 
                    color="#dc2626" 
                    bgColor="#fef2f2"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                />
            </div>
            
            <div className="dashboard-content" style={{ marginTop: '30px' }}>
                <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>Dashboard Home</h3>
                    <p style={{ color: '#64748b' }}>Use the sidebar menu to manage your vehicles, request services, and view your ledger.</p>
                </div>
            </div>
        </div>
    );
}

export default PortalDashboard;
