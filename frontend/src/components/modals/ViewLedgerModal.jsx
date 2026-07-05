import React from 'react';
import '../../assets/css/addCustomerModal.css';

const ViewLedgerModal = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid':
                return { backgroundColor: '#dcfce7', color: '#166534' };
            case 'Partial':
                return { backgroundColor: '#fef9c3', color: '#854d0e' };
            case 'Pending':
            default:
                return { backgroundColor: '#fee2e2', color: '#991b1b' };
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Ledger Record Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input type="text" value={record.customers?.name || "Unknown"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Customer Code</label>
                        <input type="text" value={record.customers?.customer_code || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Request No.</label>
                        <input type="text" value={record.service_requests?.request_no || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="text" value={formatDate(record.created_at)} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Vehicle No.</label>
                        <input type="text" value={formatVehicleNumber(record.vehicles?.vehicle_number)} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Service Name</label>
                        <input type="text" value={record.service_requests?.services?.service_name || "-"} readOnly />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Total Fee</label>
                        <input type="text" value={`₹ ${record.service_fee || 0}`} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Amount Paid</label>
                        <input type="text" value={`₹ ${record.amount_paid || 0}`} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Due Amount</label>
                        <input type="text" value={`₹ ${record.due_amount || 0}`} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <div style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px' }}>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '13px',
                                fontWeight: '500',
                                ...getStatusStyle(record.status)
                            }}>
                                {record.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="save-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewLedgerModal;
