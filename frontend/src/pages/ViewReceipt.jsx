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

    const handlePrint = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        window.print();
    };

    if (isLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading receipt...</div>;
    }

    if (!receipt) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>Receipt not found!</div>;
    }

    return (
        <div className="page-container" style={{ background: '#f3f4f6', minHeight: '100vh', padding: '40px 0', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .a4-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }
                .invoice-box {
                    background: white;
                    width: 100%;
                    max-width: 800px;
                    min-height: 1050px;
                    padding: 0;
                    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
                    border-radius: 12px;
                    overflow: hidden;
                    color: #1e293b;
                    position: relative;
                }

                .invoice-top-gradient {
                    height: 12px;
                    background: linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
                    width: 100%;
                }

                .invoice-content-inner {
                    padding: 50px 60px;
                    position: relative;
                    z-index: 1;
                }
                
                /* Subtle Watermark */
                .invoice-content-inner::before {
                    content: 'RTO LEDGER';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-25deg);
                    font-size: 110px;
                    font-weight: 900;
                    color: rgba(226, 232, 240, 0.25);
                    white-space: nowrap;
                    z-index: -1;
                    pointer-events: none;
                }

                .inv-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 30px;
                    border-bottom: 2px solid #f1f5f9;
                    margin-bottom: 35px;
                }
                
                .inv-brand-section {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .brand-logo-placeholder {
                    width: 50px;
                    height: 50px;
                    background-color: #0f172a;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00c292;
                    font-weight: 900;
                    font-size: 30px;
                    font-family: 'Inter', sans-serif;
                }

                .inv-brand h2 {
                    margin: 0;
                    color: #0f172a;
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }
                .inv-brand p {
                    margin: 2px 0 0 0;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }

                .inv-title {
                    text-align: right;
                }
                .inv-title h1 {
                    margin: 0 0 15px 0;
                    color: #0f172a;
                    font-size: 32px;
                    font-weight: 800;
                    letter-spacing: 2px;
                }
                
                .receipt-meta-grid {
                    display: grid;
                    grid-template-columns: auto auto;
                    gap: 4px 15px;
                    text-align: right;
                    font-size: 13px;
                    color: #475569;
                }
                .meta-val {
                    font-weight: 700;
                    color: #0f172a;
                    margin-left: 10px;
                }

                .inv-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 25px;
                    margin-bottom: 40px;
                }
                
                .info-box {
                    background: #f8fafc;
                    padding: 20px 25px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                }
                .info-box h3 {
                    margin: 0 0 15px 0;
                    font-size: 12px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .info-box h3::before {
                    content: '';
                    display: block;
                    width: 8px;
                    height: 8px;
                    background: #2563eb;
                    border-radius: 50%;
                }
                
                .info-row {
                    display: flex;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .info-row:last-child {
                    margin-bottom: 0;
                }
                .info-label {
                    color: #64748b;
                    width: 110px;
                    font-weight: 500;
                }
                .info-val {
                    font-weight: 600;
                    color: #0f172a;
                    flex: 1;
                }

                .inv-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin-bottom: 30px;
                }
                .inv-table th {
                    background: #f1f5f9;
                    color: #475569;
                    text-align: left;
                    padding: 14px 18px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .inv-table th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
                .inv-table th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
                
                .inv-table td {
                    padding: 22px 18px;
                    font-size: 15px;
                    color: #1e293b;
                    border-bottom: 1px solid #f1f5f9;
                }
                .text-right { text-align: right !important; }
                
                .inv-summary-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-top: 20px;
                }
                
                .payment-info {
                    width: 45%;
                }
                .payment-box {
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    border: 2px dashed #cbd5e1;
                    margin-top: 5px;
                }
                
                .paid-stamp {
                    display: inline-block;
                    color: #10b981;
                    border: 4px solid #10b981;
                    padding: 8px 20px;
                    font-size: 24px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 6px;
                    transform: rotate(-5deg);
                    border-radius: 8px;
                    margin-top: 25px;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) inset;
                }

                .summary-box {
                    width: 320px;
                    background: #f8fafc;
                    border-radius: 10px;
                    padding: 20px;
                    border: 1px solid #e2e8f0;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    font-size: 14px;
                    color: #475569;
                    font-weight: 500;
                }
                
                .summary-divider {
                    height: 1px;
                    background: #cbd5e1;
                    margin: 12px 0;
                }
                
                .summary-row.total {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0f172a;
                    padding-bottom: 0;
                }

                .inv-footer {
                    margin-top: 80px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding-top: 30px;
                    border-top: 2px solid #f1f5f9;
                }
                
                .footer-note {
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.6;
                }
                .footer-note strong {
                    color: #475569;
                    font-size: 13px;
                    display: block;
                    margin-bottom: 6px;
                }
                
                .signatures {
                    text-align: center;
                }
                .sign-line {
                    width: 180px;
                    border-top: 2px solid #cbd5e1;
                    padding-top: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Custom SVG Barcode CSS */
                .barcode-svg {
                    margin-top: 15px;
                    opacity: 0.7;
                }

                @media print {
                    body * { visibility: hidden; }
                    .invoice-box, .invoice-box * { visibility: visible; }
                    @page { size: A4 portrait; margin: 0; }
                    html, body {
                        height: 100vh;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden;
                    }
                    .page-container { background: white !important; padding: 0 !important; min-height: 0 !important; }
                    .invoice-box {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        max-width: 100%;
                        min-height: 0 !important;
                        height: auto !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                    .invoice-content-inner {
                        padding: 15mm;
                    }
                    .brand-logo-placeholder {
                        background-color: #0f172a !important;
                        color: #00c292 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .info-box, .inv-table th, .summary-box {
                        background: #f8fafc !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '0 20px', maxWidth: '800px', margin: '0 auto 25px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>
                    Receipt Preview
                </h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => {
                            if (location.pathname.startsWith('/portal')) {
                                navigate('/portal/receipts');
                            } else {
                                navigate('/receipts');
                            }
                        }} 
                        style={{ 
                            padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', 
                            borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: '600',
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                        }}
                    >
                        &larr; Back
                    </button>
                    <button type="button" onClick={handlePrint} className="btn-add" style={{ padding: '10px 20px', fontWeight: '600', borderRadius: '8px' }}>
                        <span style={{ marginRight: '6px' }}>🖨️</span> Print A4 Invoice
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
                                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>
                                            {receipt.ledgers?.service_requests?.services?.service_name || 'Service Fee'}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                                            Service requested on {formatReceiptDate(receipt.ledgers?.service_requests?.created_at)}
                                        </div>
                                    </td>
                                    <td style={{ verticalAlign: 'top', paddingTop: '22px', color: '#475569', fontWeight: 500 }}>
                                        {receipt.ledgers?.service_requests?.request_no || '-'}
                                    </td>
                                    <td className="text-right" style={{ verticalAlign: 'top', paddingTop: '22px', fontWeight: 700, color: '#0f172a' }}>
                                        ₹{parseFloat(receipt.ledgers?.service_fee || 0).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Summary & Payment Info */}
                        <div className="inv-summary-container">
                            
                            <div className="payment-info">
                                <div className="payment-box">
                                    <div className="info-row" style={{ marginBottom: '6px' }}>
                                        <span className="info-label" style={{ width: 'auto', marginRight: '10px' }}>Payment Mode:</span> 
                                        <span className="info-val">{receipt.payment_mode || 'Cash'}</span>
                                    </div>
                                    {receipt.transaction_reference && (
                                        <div className="info-row" style={{ marginBottom: 0 }}>
                                            <span className="info-label" style={{ width: 'auto', marginRight: '10px' }}>Ref ID:</span> 
                                            <span className="info-val" style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
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
                                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{parseFloat(receipt.ledgers?.service_fee || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Previous Due</span>
                                    <span style={{ fontWeight: 700, color: '#ef4444' }}>
                                        ₹{parseFloat(receipt.ledgers?.due_amount || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                
                                <div className="summary-divider"></div>
                                
                                <div className="summary-row total">
                                    <span>Amount Paid</span>
                                    <span style={{ color: '#2563eb' }}>
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
                                <span style={{ display: 'block', marginTop: '15px', color: '#94a3b8' }}>
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
