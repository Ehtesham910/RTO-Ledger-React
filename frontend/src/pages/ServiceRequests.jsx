import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/serviceRequests.css';

function ServiceRequests() {
    const [requests, setRequests] = useState(() => {
        const savedData = localStorage.getItem('serviceRequestsData');
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        // Fetch Service Requests from backend
        axios.get('http://localhost:5000/api/servicerequests')
            .then((response) => {
                setRequests(response.data);
                localStorage.setItem('serviceRequestsData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching service requests:", error);
            });
    }, []);

    // Date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); 
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Service Requests</h2>
                    <p className="page-subtitle">Manage all customer service requests and their status</p>
                </div>
                <button className="btn-add">
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
                                <th>Request No.</th>
                                <th>Customer Name</th>
                                <th>Vehicle No.</th>
                                <th>Service</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, index) => (
                                <tr key={req.id}>
                                    <td>{index + 1}</td>
                                    <td><span className="badge">{req.request_no}</span></td>
                                    
                                    <td className="font-medium" style={{ color: '#0f172a' }}>
                                        {req.customers?.name || 'Unknown'}
                                    </td>
                                    
                                    <td>{req.vehicles?.vehicle_number || '-'}</td>
                                    
                                    <td>{req.services?.service_name || '-'}</td>
                                    
                                    <td>
                                        <span style={{ fontWeight: '500' }}>
                                            {req.amount ? `₹ ${req.amount}` : '-'}
                                        </span>
                                    </td>
                                    
                                    <td>
                                        {/* Simple status badge depending on status value */}
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

                                    <td>{formatDate(req.created_at)}</td>
                                    
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button className="btn-action view" title="View Details">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            <button className="btn-action edit" title="Edit Request">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="btn-action delete" title="Delete Request" onClick={() => console.log('Delete', req.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="empty-state">
                                        No service requests found. Click 'New Request' to generate one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ServiceRequests;
