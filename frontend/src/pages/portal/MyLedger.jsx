import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/ledger.css';

function MyLedger() {
    const [ledgers, setLedgers] = useState(() => {
        const saved = sessionStorage.getItem('portal_ledger');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('portal_ledger'));

    useEffect(() => {
        axios.get('http://localhost:5000/api/portal/ledger')
            .then(res => {
                setLedgers(res.data);
                sessionStorage.setItem('portal_ledger', JSON.stringify(res.data));
            })
            .catch(err => console.error("Error fetching ledger:", err))
            .finally(() => setLoading(false));
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
                    <h2 className="page-title">My Ledger</h2>
                    <p className="page-subtitle">Statement of your accounts and dues</p>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Ref No.</th>
                                <th>Vehicle</th>
                                <th>Service</th>
                                <th>Total Fee</th>
                                <th>Paid</th>
                                <th>Due</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgers.map((l, idx) => (
                                <tr key={l.id}>
                                    <td>{idx + 1}</td>
                                    <td>{formatDate(l.created_at)}</td>
                                    <td style={{ fontWeight: '500', color: '#334155' }}>
                                        {l.service_requests?.request_no || '-'}
                                    </td>
                                    <td>{l.vehicles?.vehicle_number}</td>
                                    <td>{l.service_requests?.services?.service_name || '-'}</td>
                                    <td>{formatCurrency(l.service_fee)}</td>
                                    <td style={{ color: '#10b981', fontWeight: '500' }}>{formatCurrency(l.amount_paid)}</td>
                                    <td style={{ color: '#ef4444', fontWeight: '500' }}>{formatCurrency(l.due_amount)}</td>
                                    <td>
                                        <span className={`status-badge status-${(l.status || '').toLowerCase()}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {loading ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        Loading ledger entries...
                                    </td>
                                </tr>
                            ) : ledgers.length === 0 && (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        No ledger entries found.
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

export default MyLedger;
