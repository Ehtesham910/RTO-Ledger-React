import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortalAddVehicleModal from '../../components/modals/PortalAddVehicleModal';
import PortalAddServiceRequestModal from '../../components/modals/PortalAddServiceRequestModal';
import '../../assets/css/roles.css';
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
    const [stats, setStats] = useState(() => {
        const saved = sessionStorage.getItem('portal_dashboard_stats');
        return saved ? JSON.parse(saved) : {
            vehiclesCount: 0,
            requestsCount: 0,
            pendingRequestsCount: 0,
            completedRequestsCount: 0,
            totalDue: 0,
            totalPaid: 0
        };
    });
    
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const fetchDashboardStats = () => {
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/dashboard`)
            .then(response => {
                setStats(response.data);
                sessionStorage.setItem('portal_dashboard_stats', JSON.stringify(response.data));
            })
            .catch(error => {
                console.error("Error fetching portal dashboard stats:", error);
            });
    };

    useEffect(() => {
        fetchDashboardStats();
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
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title">Welcome, {user.username}</h2>
                    <p className="page-subtitle">Here is an overview of your account</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsVehicleModalOpen(true)} className="btn-add">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Vehicle
                    </button>
                    <button onClick={() => setIsRequestModalOpen(true)} className="btn-add">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Service Request
                    </button>
                </div>
            </div>

            <div className="portal-cards-grid">
                <StatCard 
                    title="MY VEHICLES" 
                    value={stats.vehiclesCount} 
                    color="#ea580c" 
                    bgColor="#fff7ed"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><circle cx="6" cy="17" r="2"></circle><circle cx="18" cy="17" r="2"></circle><path d="M14 7v4"></path><path d="M14 7h4l2 4"></path></svg>}
                />

                <StatCard 
                    title="TOTAL REQUESTS" 
                    value={stats.requestsCount} 
                    color="#0d9488" 
                    bgColor="#f0fdfa"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                />

                <StatCard 
                    title="PENDING REQUESTS" 
                    value={stats.pendingRequestsCount} 
                    color="#2563eb" 
                    bgColor="#eff6ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>}
                />

                <StatCard 
                    title="COMPLETED REQUESTS" 
                    value={stats.completedRequestsCount} 
                    color="#9333ea" 
                    bgColor="#faf5ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
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

            <PortalAddVehicleModal 
                isOpen={isVehicleModalOpen} 
                onClose={() => setIsVehicleModalOpen(false)} 
                onSuccess={() => {
                    setIsVehicleModalOpen(false);
                    fetchDashboardStats();
                }} 
            />
            
            <PortalAddServiceRequestModal 
                isOpen={isRequestModalOpen} 
                onClose={() => setIsRequestModalOpen(false)} 
                onSuccess={() => {
                    setIsRequestModalOpen(false);
                    fetchDashboardStats();
                }} 
            />
        </div>
    );
}

export default PortalDashboard;
