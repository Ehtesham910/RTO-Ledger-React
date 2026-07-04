import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/receipts.css'; 

function Receipts() {
    const [receipts, setReceipts] = useState(() => {
        const savedData = localStorage.getItem('receiptsData');
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        // Fetch Receipts data from backend
        axios.get('http://localhost:5000/api/receipts')
            .then((response) => {
                setReceipts(response.data);
                localStorage.setItem('receiptsData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching receipts:", error);
            });
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); 
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Receipts</h2>
                    <p className="page-subtitle">View and manage all payment receipts</p>
                </div>
                <button className="btn-add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Generate Receipt
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Receipt No.</th>
                                <th>Customer Name</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Reference No.</th>
                                <th>Date</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt, index) => (
                                <tr key={receipt.id}>
                                    <td>{index + 1}</td>
                                    
                                    <td className="font-medium" style={{ color: '#4f46e5' }}>
                                        <span className="badge">
                                            {receipt.receipt_no}
                                        </span>
                                    </td>
                                    
                                    <td className="font-medium" style={{ color: '#64748b' }}>
                                        {receipt.ledgers?.customers?.name || 'Unknown'}
                                    </td>
                                    
                                    <td style={{ fontWeight: '600', color: '#16a34a' }}>
                                        ₹ {receipt.amount_received || 0}
                                    </td>
                                    
                                    <td>
                                        <span className="badge" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                                            {receipt.payment_mode || '-'}
                                        </span>
                                    </td>

                                    <td style={{ color: '#64748b' }}>
                                        {receipt.transaction_reference || '-'}
                                    </td>

                                    <td>{formatDate(receipt.received_at)}</td>
                                    
                                    <td className="text-right">
                                        <button className="btn-action view" title="Print Receipt">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {receipts.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="empty-state">
                                        No receipts generated yet. 
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

export default Receipts;
