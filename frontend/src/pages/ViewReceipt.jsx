import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/viewReceipt.css';

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

    const handlePrint = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        window.print();
    };

    if (isLoading) {
        return <div className="receipt-loading">Loading receipt...</div>;
    }

    if (!receipt) {
        return <div className="receipt-error">Receipt not found!</div>;
    }

    return (
        <div className="page-container">
            

            <div className="page-header">
                <div>
                    <h2 className="page-title">Receipt Preview</h2>
                    <p className="page-subtitle">Preview and print the official receipt</p>
                </div>
                <div className="header-actions">
                    <button 
                        onClick={() => {
                            if (location.pathname.startsWith('/portal')) {
                                navigate('/portal/receipts');
                            } else {
                                navigate('/receipts');
                            }
                        }} 
                        className="btn-back"
                    >
                        &larr; Back
                    </button>
                    <button type="button" onClick={handlePrint} className="btn-add" >
                        <span className="icon-left">🖨️</span> Print A4 Invoice
                    </button>
                </div>
            </div>

            <div className="a4-container">
                <div className="invoice-box">
                    <div className="invoice-content-inner">
                        
                        {/* Header */}
                        <div className="inv-header">
                            <div className="inv-brand-section">
                                <div className="brand-logo-placeholder">R</div>
                                <div className="inv-brand">
                                    <h2>RTO LEDGER</h2>
                                    <p>Official Service Portal</p>
                                </div>
                            </div>
                            <div className="inv-title">
                                <h1>RECEIPT</h1>
                                <div className="receipt-meta-grid">
                                    <span>Receipt No:</span> <span className="meta-val">{receipt.receipt_no}</span>
                                    <span>Date:</span> <span className="meta-val">{formatReceiptDate(receipt.received_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Boxes */}
                        <div className="inv-details">
                            <div className="info-box">
                                <h3>Billed To (Customer)</h3>
                                <div className="info-row"><span className="info-label">Name</span> <span className="info-val">{receipt.ledgers?.customers?.name || 'Unknown'}</span></div>
                                <div className="info-row"><span className="info-label">Cust Code</span> <span className="info-val">{receipt.ledgers?.customers?.customer_code || '-'}</span></div>
                                <div className="info-row"><span className="info-label">Mobile</span> <span className="info-val">{receipt.ledgers?.customers?.mobile || '-'}</span></div>
                            </div>
                            
                            <div className="info-box">
                                <h3>Vehicle Information</h3>
                                <div className="info-row"><span className="info-label">Vehicle No</span> <span className="info-val">{formatVehicleNumber(receipt.ledgers?.vehicles?.vehicle_number)}</span></div>
                                <div className="info-row"><span className="info-label">Chassis</span> <span className="info-val">{receipt.ledgers?.vehicles?.chassis_number || '-'}</span></div>
                                <div className="info-row"><span className="info-label">Engine</span> <span className="info-val">{receipt.ledgers?.vehicles?.engine_number || '-'}</span></div>
                            </div>
                        </div>

                        {/* Service Table */}
                        <table className="inv-table">
                            <thead>
                                <tr>
                                    <th>Service Description</th>
                                    <th>Request Ref</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="item-title">
                                            {receipt.ledgers?.service_requests?.services?.service_name || 'Service Fee'}
                                        </div>
                                        <div className="item-desc">
                                            Service requested on {formatReceiptDate(receipt.ledgers?.service_requests?.created_at)}
                                        </div>
                                    </td>
                                    <td className="item-qty">
                                        {receipt.ledgers?.service_requests?.request_no || '-'}
                                    </td>
                                    <td className="text-right item-amt">
                                        ₹{parseFloat(receipt.ledgers?.service_fee || 0).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Summary & Payment Info */}
                        <div className="inv-summary-container">
                            
                            <div className="payment-info">
                                <div className="payment-box">
                                    <div className="info-row bottom-spaced">
                                        <span className="info-label inline-label">Payment Mode:</span> 
                                        <span className="info-val">{receipt.payment_mode || 'Cash'}</span>
                                    </div>
                                    {receipt.transaction_reference && (
                                        <div className="info-row no-margin">
                                            <span className="info-label inline-label">Ref ID:</span> 
                                            <span className="info-val mono-val">
                                                {receipt.transaction_reference}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Show PAID stamp if fully paid */}
                                {parseFloat(receipt.ledgers?.due_amount || 0) <= 0 && (
                                    <div className="paid-stamp">PAID IN FULL</div>
                                )}
                            </div>

                            <div className="summary-box">
                                <div className="summary-row">
                                    <span>Subtotal Fee</span>
                                    <span className="amt-total">₹{parseFloat(receipt.ledgers?.service_fee || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Previous Due</span>
                                    <span className="amt-pending">
                                        ₹{parseFloat(receipt.ledgers?.due_amount || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                
                                <div className="summary-divider"></div>
                                
                                <div className="summary-row total">
                                    <span>Amount Paid</span>
                                    <span className="amt-paid">
                                        ₹{parseFloat(receipt.amount_received || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer & Signatures */}
                        <div className="inv-footer">
                            <div className="footer-note">
                                <strong>Terms & Conditions</strong>
                                1. This is a computer-generated official receipt.<br/>
                                2. Fees once paid are non-refundable.<br/>
                                3. Subject to local jurisdiction.<br/>
                                <span className="footer-note">
                                    Issued By: {receipt.users?.username || 'System'}
                                </span>
                            </div>
                            
                            <div className="signatures">
                                {/* SVG Barcode simulation */}
                                <svg className="barcode-svg" width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0" y="0" width="4" height="40" fill="#0f172a"/>
                                    <rect x="6" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="12" y="0" width="6" height="40" fill="#0f172a"/>
                                    <rect x="22" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="26" y="0" width="8" height="40" fill="#0f172a"/>
                                    <rect x="38" y="0" width="4" height="40" fill="#0f172a"/>
                                    <rect x="46" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="52" y="0" width="6" height="40" fill="#0f172a"/>
                                    <rect x="60" y="0" width="10" height="40" fill="#0f172a"/>
                                    <rect x="74" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="80" y="0" width="4" height="40" fill="#0f172a"/>
                                    <rect x="86" y="0" width="8" height="40" fill="#0f172a"/>
                                    <rect x="98" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="104" y="0" width="6" height="40" fill="#0f172a"/>
                                    <rect x="114" y="0" width="4" height="40" fill="#0f172a"/>
                                    <rect x="120" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="126" y="0" width="10" height="40" fill="#0f172a"/>
                                    <rect x="140" y="0" width="4" height="40" fill="#0f172a"/>
                                    <rect x="146" y="0" width="2" height="40" fill="#0f172a"/>
                                    <rect x="152" y="0" width="8" height="40" fill="#0f172a"/>
                                </svg>
                                <div className="sign-line">Authorized Signatory</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewReceipt;
