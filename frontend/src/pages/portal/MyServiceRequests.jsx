import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/servicerequests.css';
import PortalAddServiceRequestModal from '../../components/modals/PortalAddServiceRequestModal';

function MyServiceRequests() {
    const [requests, setRequests] = useState(() => {
        const saved = sessionStorage.getItem('portal_requests');
        return saved ? JSON.parse(saved) : [];
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(!sessionStorage.getItem('portal_requests'));

    const fetchRequests = () => {
        axios.get('http://localhost:5000/api/portal/service-requests')
            .then(res => {
                setRequests(res.data);
                sessionStorage.setItem('portal_requests', JSON.stringify(res.data));
            })
            .catch(err => console.error("Error fetching requests:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">My Service Requests</h2>
                    <p className="page-subtitle">Track and request services for your vehicles</p>
                </div>
                <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Request
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Request No</th>
                                <th>Vehicle</th>
                                <th>Service</th>
                                <th>Fee</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, idx) => (
                                <tr key={req.id}>
                                    <td>{idx + 1}</td>
                                    <td style={{ fontWeight: '600', color: '#4f46e5' }}>{req.request_no}</td>
                                    <td>{req.vehicles?.vehicle_number}</td>
                                    <td>{req.services?.service_name}</td>
                                    <td>{formatCurrency(req.amount)}</td>
                                    <td>{formatDate(req.created_at)}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            backgroundColor: 
                                                req.status === 'Completed' ? '#dcfce7' : 
                                                req.status === 'In Progress' ? '#dbeafe' : 
                                                req.status === 'Cancelled' ? '#fee2e2' : 
                                                '#fef9c3',
                                            color: 
                                                req.status === 'Completed' ? '#166534' : 
                                                req.status === 'In Progress' ? '#1e40af' : 
                                                req.status === 'Cancelled' ? '#991b1b' : 
                                                '#854d0e'
                                        }}>
                                            {req.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        Loading service requests...
                                    </td>
                                </tr>
                            ) : requests.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        No service requests found. Click 'New Request' to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PortalAddServiceRequestModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchRequests();
                }} 
            />
        </div>
    );
}

export default MyServiceRequests;
