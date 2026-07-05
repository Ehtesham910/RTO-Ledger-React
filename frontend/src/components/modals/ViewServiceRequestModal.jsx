import React from 'react';
import '../../assets/css/addCustomerModal.css';

const ViewServiceRequestModal = ({ isOpen, onClose, request }) => {
    if (!isOpen || !request) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return { backgroundColor: '#dcfce7', color: '#166534' };
            case 'In Progress':
                return { backgroundColor: '#dbeafe', color: '#1e40af' };
            case 'Cancelled':
                return { backgroundColor: '#fee2e2', color: '#991b1b' };
            default:
                return { backgroundColor: '#fef9c3', color: '#854d0e' };
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Service Request Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Request No.</label>
                        <input type="text" value={request.request_no || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="text" value={formatDate(request.created_at)} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input type="text" value={request.customers?.name || "Unknown"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Vehicle No.</label>
                        <input type="text" value={request.vehicles?.vehicle_number || "-"} readOnly />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Service</label>
                        <input type="text" value={request.services?.service_name || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input type="text" value={request.amount != null ? `₹ ${request.amount}` : "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Status</label>
                        <div style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px' }}>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '13px',
                                fontWeight: '500',
                                ...getStatusStyle(request.status)
                            }}>
                                {request.status || 'Pending'}
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

export default ViewServiceRequestModal;
