import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/ledger.css'; 
import ViewLedgerModal from '../components/modals/ViewLedgerModal';
import EditLedgerModal from '../components/modals/EditLedgerModal';
import Pagination from '../components/Pagination';

function Ledger() {
    const navigate = useNavigate();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLedger, setSelectedLedger] = useState(null);
    const [selectedEditEntry, setSelectedEditEntry] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const canEdit = ['Admin', 'Accountant'].includes(user.role);

    const [ledgers, setLedgers] = useState(() => {
        const savedData = sessionStorage.getItem('ledgerData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('ledgerData'));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Fetch Ledger data from backend
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ledger`)
            .then((response) => {
                setLedgers(response.data);
                sessionStorage.setItem('ledgerData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching ledger:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const totalPages = Math.ceil(ledgers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedLedgers = ledgers.slice(indexOfFirstItem, indexOfLastItem);

    // Date formatting helper
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); 
    }

    const formatVehicleNumber = (vNum) => {
        if (!vNum) return '-';
        const clean = vNum.replace(/\s+/g, '').toUpperCase();
        const match = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return vNum;
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Ledger</h2>
                    <p className="page-subtitle">Track customer dues, payments, and financial records</p>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Vehicle No.</th>
                                <th>Request No.</th>
                                <th>Service Name</th>
                                <th>Total Fee</th>
                                <th>Amount Paid</th>
                                <th>Due Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLedgers.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    
                                    <td className="font-medium" style={{ color: '#0043deff', whiteSpace: 'nowrap' }} >
                                        {record.customers?.name || 'Unknown'} <br/>
                                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>
                                            {record.customers?.customer_code ? `${record.customers.customer_code}` : ''}
                                        </span>
                                    </td>
                                    
                                    <td>
                                        <span className="badge" style={{ whiteSpace: 'nowrap' }}>
                                            {formatVehicleNumber(record.vehicles?.vehicle_number)}
                                        </span>
                                    </td>
                                    <td>{record.service_requests?.request_no || '-'}</td>
                                    
                                    <td>{record.service_requests?.services?.service_name || '-'}</td>
                                    
                                    <td style={{ fontWeight: '500', color: '#334155' }}>
                                        ₹ {record.service_fee || 0}
                                    </td>
                                    <td style={{ fontWeight: '500', color: '#16a34a' }}>
                                        ₹ {record.amount_paid || 0}
                                    </td>
                                    <td style={{ fontWeight: '600', color: '#ef4444' }}>
                                        ₹ {record.due_amount || 0}
                                    </td>
                                    
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: record.status === 'Paid' ? '#dcfce7' : (record.status === 'Partial' ? '#fef9c3' : '#fee2e2'),
                                            color: record.status === 'Paid' ? '#166534' : (record.status === 'Partial' ? '#854d0e' : '#991b1b')
                                        }}>
                                            {record.status || 'Pending'}
                                        </span>
                                    </td>

                                    <td>{formatDate(record.created_at)}</td>
                                    
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                className="btn-action view" 
                                                title="View Details"
                                                onClick={() => {
                                                    if (record.customer_id) {
                                                        navigate(`/ledger/customer/${record.customer_id}`);
                                                    } else {
                                                        setSelectedLedger(record);
                                                        setIsViewModalOpen(true);
                                                    }
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            {canEdit && (
                                                <button 
                                                    className="btn-action edit" 
                                                    title="Edit Ledger"
                                                    onClick={() => {
                                                        setSelectedLedger(record);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {loading ? (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>Loading ledger records...</td>
                                </tr>
                            ) : paginatedLedgers.length === 0 && (
                                <tr>
                                    <td colSpan="11" className="empty-state">
                                        No ledger records found. 
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
                    totalItems={ledgers.length} 
                    itemsPerPage={itemsPerPage} 
                />
            </div>

            <ViewLedgerModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                record={selectedLedger}
            />

            <EditLedgerModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                record={selectedLedger}
                onSave={async (updatedData) => {
                    setIsEditModalOpen(false);
                    try {
                        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ledger/${updatedData.id}`, updatedData);
                        
                        // Update UI
                        const updatedLedger = ledgers.map(l => 
                            l.id === updatedData.id ? response.data : l
                        );
                        setLedgers(updatedLedger);
                        sessionStorage.setItem('ledgerData', JSON.stringify(updatedLedger));
                    } catch (error) {
                        console.error("Error updating ledger record:", error);
                        alert("Failed to update ledger record.");
                    }
                }}
            />
        </div>
    );
}

export default Ledger;
