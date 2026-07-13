import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ViewReceipt() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if we already have the receipt data from the previous page's state
    const initialReceipt = location.state?.receipt || null;
    const [receipt, setReceipt] = useState(initialReceipt);
    const [isLoading, setIsLoading] = useState(!initialReceipt);

    useEffect(() => {
        // If we don't have the receipt data, fetch it
        if (!initialReceipt && id) {
            const fetchReceipt = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/receipts/${id}`);
                    setReceipt(response.data);
                } catch (error) {
                    console.error("Error fetching receipt:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReceipt();
        }
    }, [id, initialReceipt]);

    const formatVehicleNumber = (vNum) => {
        if (!vNum) return '-';
        const clean = vNum.replace(/\s+/g, '').toUpperCase();
        const match = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return vNum;
    };

    const formatReceiptDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading receipt...</div>;
    }

    if (!receipt) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>Receipt not found!</div>;
    }

    return (
        <div className="page-container">
            <style>{`
                .receipt-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 20px;
                    width: 100%;
                }
                .receipt-slip {
                    background: white;
                    width: 100%;
                    max-width: 480px;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    border: 1px solid #e2e8f0;
                    font-family: 'Courier New', Courier, monospace;
                    color: #1e293b;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .receipt-title {
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    margin: 0 0 5px 0;
                    color: #0f172a;
                }
                .receipt-subtitle {
                    font-size: 13px;
                    color: #64748b;
                    margin: 0;
                }
                .dashed-divider {
                    border-top: 1px dashed #cbd5e1;
                    margin: 15px 0;
                }
                .receipt-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 8px 0;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .receipt-label {
                    color: #475569;
                    font-weight: 500;
                }
                .receipt-value {
                    font-weight: 600;
                    text-align: right;
                }
                .text-blue {
                    color: #2563eb;
                }
                .text-red {
                    color: #ef4444;
                }
                .text-green {
                    color: #16a34a;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 25px;
                    font-size: 13px;
                    color: #64748b;
                    font-style: italic;
                }
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .receipt-slip, .receipt-slip * {
                        visibility: visible;
                    }
                    .receipt-slip {
                        position: absolute;
                        left: 50%;
                        top: 50px;
                        transform: translateX(-50%);
                        box-shadow: none;
                        border: none;
                        width: 100%;
                        max-width: 100%;
                        padding: 0;
                    }
                }
            `}</style>

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>
                    View Receipt
                </h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => {
                            if (location.pathname.startsWith('/portal')) {
                                navigate('/portal/receipts');
                            } else {
                                navigate('/receipts');
                            }
                        }} 
                        style={{ 
                            padding: '8px 16px', 
                            background: 'white', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            color: '#475569', 
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        &larr; Back
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="btn-add"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        Print Receipt
                    </button>
                </div>
            </div>

            <div className="receipt-container">
                <div className="receipt-slip">
                    <div className="receipt-header">
                        <div className="receipt-title">RTO LEDGER RECEIPT</div>
                        <div className="receipt-subtitle">Official Payment Receipt</div>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-row">
                        <span className="receipt-label">Receipt No</span>
                        <span className="receipt-value text-blue">{receipt.receipt_no}</span>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-row">
                        <span className="receipt-label">Customer</span>
                        <span className="receipt-value">{receipt.ledgers?.customers?.name || 'Unknown'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Customer Code</span>
                        <span className="receipt-value">{receipt.ledgers?.customers?.customer_code || '-'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Mobile</span>
                        <span className="receipt-value">{receipt.ledgers?.customers?.mobile || '-'}</span>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-row">
                        <span className="receipt-label">Vehicle No</span>
                        <span className="receipt-value">{formatVehicleNumber(receipt.ledgers?.vehicles?.vehicle_number)}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Chassis No</span>
                        <span className="receipt-value">{receipt.ledgers?.vehicles?.chassis_number || '-'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Engine No</span>
                        <span className="receipt-value">{receipt.ledgers?.vehicles?.engine_number || '-'}</span>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-row">
                        <span className="receipt-label">Request No</span>
                        <span className="receipt-value">{receipt.ledgers?.service_requests?.request_no || '-'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Service</span>
                        <span className="receipt-value">{receipt.ledgers?.service_requests?.services?.service_name || '-'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Requested At</span>
                        <span className="receipt-value">{formatReceiptDate(receipt.ledgers?.service_requests?.created_at)}</span>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-row">
                        <span className="receipt-label">Service Fee</span>
                        <span className="receipt-value">₹{parseFloat(receipt.ledgers?.service_fee || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Paid Amount</span>
                        <span className="receipt-value">₹{parseFloat(receipt.amount_received || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Due Amount</span>
                        <span className="receipt-value text-red">₹{parseFloat(receipt.ledgers?.due_amount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-row">
                        <span className="receipt-label">Payment Mode</span>
                        <span className="receipt-value text-green">{receipt.payment_mode || '-'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Reference No</span>
                        <span className="receipt-value">{receipt.transaction_reference || '-'}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Receipt Date</span>
                        <span className="receipt-value">{formatReceiptDate(receipt.received_at)}</span>
                    </div>
                    <div className="receipt-row">
                        <span className="receipt-label">Receipt By</span>
                        <span className="receipt-value">{receipt.users?.username || '-'}</span>
                    </div>

                    <div className="dashed-divider"></div>

                    <div className="receipt-footer">
                        Thank you for your business!
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewReceipt;
