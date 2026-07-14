import React from 'react';
import '../../assets/css/addCustomerModal.css';

const ViewReceiptModal = ({ isOpen, onClose, receipt }) => {
    if (!isOpen || !receipt) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Receipt Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Receipt No.</label>
                        <input type="text" value={receipt.receipt_no || "-"} readOnly style={{ fontWeight: '600', color: '#10b981' }} />
                    </div>
                    <div className="form-group">
                        <label>Date & Time</label>
                        <input type="text" value={formatDate(receipt.received_at)} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input type="text" value={receipt.ledgers?.customers?.name || "Unknown"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Customer Code</label>
                        <input type="text" value={receipt.ledgers?.customers?.customer_code || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Vehicle No.</label>
                        <input type="text" value={formatVehicleNumber(receipt.ledgers?.vehicles?.vehicle_number)} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Service Name</label>
                        <input type="text" value={receipt.ledgers?.service_requests?.services?.service_name || "-"} readOnly />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Amount Received</label>
                        <input type="text" value={`₹ ${parseFloat(receipt.amount_received || 0).toLocaleString('en-IN')}`} readOnly style={{ fontWeight: '600', color: '#16a34a' }} />
                    </div>
                    <div className="form-group">
                        <label>Payment Mode</label>
                        <input type="text" value={receipt.payment_mode || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Transaction Reference</label>
                        <input type="text" value={receipt.transaction_reference || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Received By</label>
                        <input type="text" value={receipt.users?.username || receipt.users?.name || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group" style={{ width: '100%' }}>
                        <label>Remarks</label>
                        <textarea value={receipt.remarks || "-"} readOnly style={{ width: '100%', minHeight: '60px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', resize: 'vertical', backgroundColor: '#f8fafc' }} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="save-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewReceiptModal;
