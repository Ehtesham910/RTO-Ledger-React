import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/receipts.css';

function MyReceipts() {
    const [receipts, setReceipts] = useState(() => {
        const saved = localStorage.getItem('portal_receipts');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(!localStorage.getItem('portal_receipts'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/portal/receipts')
            .then(res => {
                setReceipts(res.data);
                localStorage.setItem('portal_receipts', JSON.stringify(res.data));
            })
            .catch(err => console.error("Error fetching receipts:", err))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    const handleViewReceipt = (receipt) => {
        // We will pass state to the ViewReceipt component, which we will route
        navigate(`/portal/receipts/${receipt.id}`, { state: { receipt } });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">My Receipts</h2>
                    <p className="page-subtitle">View and download your payment receipts</p>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Receipt No</th>
                                <th>Vehicle</th>
                                <th>Amount Paid</th>
                                <th>Mode</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((r, idx) => (
                                <tr key={r.id}>
                                    <td>{idx + 1}</td>
                                    <td style={{ fontWeight: '600', color: '#10b981' }}>{r.receipt_no}</td>
                                    <td>{r.ledgers?.vehicles?.vehicle_number}</td>
                                    <td style={{ fontWeight: '500' }}>{formatCurrency(r.amount_received)}</td>
                                    <td>
                                        <span className={`status-badge payment-${(r.payment_mode || '').toLowerCase()}`}>
                                            {r.payment_mode}
                                        </span>
                                    </td>
                                    <td>{formatDate(r.received_at)}</td>
                                    <td>
                                        <button 
                                            className="btn-action view" 
                                            title="View Receipt"
                                            onClick={() => handleViewReceipt(r)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {loading ? null : receipts.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        No receipts found.
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

export default MyReceipts;
