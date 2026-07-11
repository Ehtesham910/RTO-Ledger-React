import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/roles.css';
import '../assets/css/dashboard.css';

// Chart.js imports
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler
);

const StatCard = ({ title, value, color, bgColor, icon }) => (
    <div className="stat-card" style={{ '--card-color': color, '--card-bg': bgColor }}>
        <div className="stat-card-header">
            <span className="stat-card-title">
                {title}
            </span>
            <span className="stat-card-icon">
                {icon}
            </span>
        </div>
        <div className="stat-card-value">
            {value}
        </div>
    </div>
);

function Dashboard() {
    const [stats, setStats] = useState(() => {
        const savedStats = sessionStorage.getItem('dashboardStats');
        return savedStats ? JSON.parse(savedStats) : {
            totalCustomers: 0,
            totalVehicles: 0,
            totalServices: 0,
            totalRequests: 0,
            totalUsers: 0,
            pendingJobs: 0,
            completedJobs: 0,
            todaysRequests: 0,
            totalRevenue: 0,
            totalDueAmount: 0,
            chartRequests: [],
            chartCustomers: []
        };
    });

    const [loading, setLoading] = useState(() => {
        return sessionStorage.getItem('dashboardStats') ? false : true;
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dashboard/stats');
                setStats(response.data);
                sessionStorage.setItem('dashboardStats', JSON.stringify(response.data));
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ fontSize: '18px', color: '#64748b' }}>Loading dashboard...</p>
            </div>
        );
    }

    // --- CHART DATA SETUP ---
    
    // 1. Job Status Overview (Doughnut)
    const jobStatusData = {
        labels: ['Pending', 'Completed'],
        datasets: [
            {
                data: [stats.pendingJobs, stats.completedJobs],
                backgroundColor: ['#2563eb', '#9333ea'],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 4
            }
        ]
    };

    // 2. Financial Overview (Doughnut)
    const financialData = {
        labels: ['Collected Revenue', 'Due Amount'],
        datasets: [
            {
                data: [stats.totalRevenue, stats.totalDueAmount],
                backgroundColor: ['#0d9488', '#dc2626'],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 4
            }
        ]
    };

    // Shared Doughnut Options
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { boxWidth: 12, padding: 20, font: { size: 12 } }
            }
        }
    };

    // 3. Requests Over Time (Line Area)
    const requestLabels = stats.chartRequests ? stats.chartRequests.map(d => d.date) : [];
    const requestCounts = stats.chartRequests ? stats.chartRequests.map(d => d.count) : [];
    
    const lineData = {
        labels: requestLabels,
        datasets: [
            {
                label: 'Requests Generated',
                data: requestCounts,
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.2)', // Light blue fill
                borderColor: '#2563eb', // Solid blue border
                tension: 0.4, // Smooth curve
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 15 } }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } },
            x: { grid: { display: false } }
        }
    };

    // 4. Customer Registrations (Bar)
    const customerLabels = stats.chartCustomers ? stats.chartCustomers.map(d => d.date) : [];
    const customerCounts = stats.chartCustomers ? stats.chartCustomers.map(d => d.count) : [];

    const barData = {
        labels: customerLabels,
        datasets: [
            {
                label: 'New Customers',
                data: customerCounts,
                backgroundColor: '#ea580c', // Solid orange
                borderRadius: 4, // Slightly rounded top
                barThickness: 50 // Matching the wide bars in the screenshot
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 15 } }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } },
            x: { grid: { display: false } }
        }
    };

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="page-subtitle">Welcome, {user.name || user.username || 'User'}</p>
                </div>
            </div>

            <div className="dashboard-cards-grid">
                {/* Row 1 */}
                <StatCard 
                    title="TOTAL CUSTOMERS" value={stats.totalCustomers} color="#e85d04" bgColor="#fff6f0"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                />
                <StatCard 
                    title="TOTAL VEHICLES" value={stats.totalVehicles} color="#0284c7" bgColor="#f0f9ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><circle cx="6" cy="17" r="2"></circle><circle cx="18" cy="17" r="2"></circle><path d="M14 7v4"></path><path d="M14 7h4l2 4"></path></svg>}
                />
                <StatCard 
                    title="TOTAL SERVICES" value={stats.totalServices} color="#16a34a" bgColor="#f0fdf4"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>}
                />

                {/* Row 2 */}
                <StatCard 
                    title="TOTAL REQUESTS" value={stats.totalRequests} color="#db2777" bgColor="#fdf2f8"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                />
                <StatCard 
                    title="PENDING JOBS" value={stats.pendingJobs} color="#2563eb" bgColor="#eff6ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                />
                <StatCard 
                    title="COMPLETED JOBS" value={stats.completedJobs} color="#9333ea" bgColor="#faf5ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                />

                {/* Row 3 */}
                <StatCard 
                    title="TODAY'S REQUESTS" value={stats.todaysRequests} color="#d97706" bgColor="#fffbeb"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                />
                <StatCard 
                    title="TOTAL REVENUE" value={formatCurrency(stats.totalRevenue)} color="#0d9488" bgColor="#f0fdfa"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>}
                />
                <StatCard 
                    title="TOTAL DUE AMOUNT" value={formatCurrency(stats.totalDueAmount)} color="#dc2626" bgColor="#fef2f2"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>}
                />
                <StatCard 
                    title="SYSTEM USERS" value={stats.totalUsers} color="#4f46e5" bgColor="#e0e7ff"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                />
            </div>
            
            {/* All 4 Charts */}
            <div className="dashboard-charts-grid">
                <div className="card" style={{ padding: '24px' }}>
                    <h3 className="chart-title">JOB STATUS OVERVIEW</h3>
                    <div style={{ height: '240px' }}>
                        <Doughnut data={jobStatusData} options={doughnutOptions} />
                    </div>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 className="chart-title">FINANCIAL OVERVIEW</h3>
                    <div style={{ height: '240px' }}>
                        <Doughnut data={financialData} options={doughnutOptions} />
                    </div>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 className="chart-title">REQUESTS OVER TIME</h3>
                    <div style={{ height: '250px' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 className="chart-title">CUSTOMER REGISTRATIONS</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
