import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/ledger.css'; 
import Pagination from '../components/Pagination';

function CustomerLedger() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ledgers, setLedgers] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        const fetchCustomerLedger = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/ledger/customer/${id}`);
                setLedgers(response.data);
                if (response.data.length > 0) {
                    setCustomerName(response.data[0].customers?.name || "Unknown");
                }
            } catch (error) {
                console.error("Error fetching customer ledger:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCustomerLedger();
        }
    }, [id]);

    const totalPages = Math.ceil(ledgers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedLedgers = ledgers.slice(indexOfFirstItem, indexOfLastItem);

    const formatVehicleNumber = (vNum) => {
        if (!vNum) return '-';
        const clean = vNum.replace(/\s+/g, '').toUpperCase();
        const match = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return vNum;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
    };

    // Calculate Totals
    const totalFee = ledgers.reduce((sum, item) => sum + (parseFloat(item.service_fee) || 0), 0);
    const totalPaid = ledgers.reduce((sum, item) => sum + (parseFloat(item.amount_paid) || 0), 0);
    const totalDue = ledgers.reduce((sum, item) => sum + (parseFloat(item.due_amount) || 0), 0);

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>
                    Ledger — {customerName || "Customer"}
                </h1>
                <button 
                    className="btn-add"
                    onClick={() => navigate('/ledger')} 
                >
                    &larr; Back
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>TOTAL SERVICE FEE</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>₹{totalFee.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #16a34a' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>TOTAL PAID</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>₹{totalPaid.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>TOTAL DUE</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>₹{totalDue.toLocaleString('en-IN')}</div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>VEHICLE</th>
                                <th>SERVICE</th>
                                <th>SERVICE FEE</th>
                                <th>AMOUNT PAID</th>
                                <th>DUE AMOUNT</th>
                                <th>STATUS</th>
                                <th>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="8" className="empty-state">Loading records...</td></tr>
                            ) : paginatedLedgers.length === 0 ? (
                                <tr><td colSpan="8" className="empty-state">No records found for this customer.</td></tr>
                            ) : (
                                paginatedLedgers.map((item, index) => (
                                    <tr key={item.id.toString()}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>
                                            <span className="badge" style={{ whiteSpace: 'nowrap' }}>
                                                {formatVehicleNumber(item.vehicles?.vehicle_number)}
                                            </span>
                                        </td>
                                        <td>{item.service_requests?.services?.service_name || "-"}</td>
                                        <td style={{ fontWeight: '500', color: '#334155' }}>₹{parseFloat(item.service_fee || 0).toLocaleString('en-IN')}</td>
                                        <td style={{ fontWeight: '500', color: '#16a34a' }}>₹{parseFloat(item.amount_paid || 0).toLocaleString('en-IN')}</td>
                                        <td style={{ fontWeight: '600', color: '#ef4444' }}>
                                            ₹{parseFloat(item.due_amount || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: item.status === 'Paid' ? '#dcfce7' : (item.status === 'Partial' ? '#fef9c3' : '#fee2e2'),
                                                color: item.status === 'Paid' ? '#166534' : (item.status === 'Partial' ? '#854d0e' : '#991b1b')
                                            }}>
                                                {item.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td>{formatDate(item.created_at)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && (
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                        onPageChange={setCurrentPage} 
                        totalItems={ledgers.length} 
                        itemsPerPage={itemsPerPage} 
                    />
                )}
            </div>
        </div>
    );
}

export default CustomerLedger;
