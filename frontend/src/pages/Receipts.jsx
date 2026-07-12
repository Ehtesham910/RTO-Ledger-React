import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/receipts.css'; 
import ViewReceiptModal from '../components/modals/ViewReceiptModal';
import AddReceiptModal from '../components/modals/AddReceiptModal';
import Pagination from '../components/Pagination';

function Receipts() {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const canEdit = ['Admin', 'Accountant'].includes(user.role);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const [receipts, setReceipts] = useState(() => {
        const savedData = sessionStorage.getItem('receiptsData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('receiptsData'));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchReceipts = () => {
        axios.get('http://localhost:5000/api/receipts')
            .then((response) => {
                setReceipts(response.data);
                sessionStorage.setItem('receiptsData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching receipts:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const totalPages = Math.ceil(receipts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedReceipts = receipts.slice(indexOfFirstItem, indexOfLastItem);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); 
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Receipts</h2>
                    <p className="page-subtitle">View and print all payment receipts</p>
                </div>
                {canEdit && (
                    <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Generate Receipt
                    </button>
                )}
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
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReceipts.map((receipt, index) => (
                                <tr key={receipt.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    
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
                                    
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                className="btn-action view" 
                                                title="View Details"
                                                onClick={() => {
                                                    setSelectedReceipt(receipt);
                                                    setIsViewModalOpen(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            <button 
                                                className="btn-action print" 
                                                title="Print Receipt"
                                                onClick={() => navigate(`/receipts/${receipt.id}`, { state: { receipt } })}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Loading receipts...</td>
                                </tr>
                            ) : paginatedReceipts.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="empty-state">
                                        No receipts generated yet. 
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} 
                    totalItems={receipts.length} 
                    itemsPerPage={itemsPerPage} 
                />
            </div>

            <ViewReceiptModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                receipt={selectedReceipt}
            />

            <AddReceiptModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(newReceipt) => {
                    setIsAddModalOpen(false);
                    fetchReceipts();
                }}
            />
        </div>
    );
}

export default Receipts;
