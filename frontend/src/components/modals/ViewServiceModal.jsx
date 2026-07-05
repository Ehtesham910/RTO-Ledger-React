import React from 'react';
import '../../assets/css/addCustomerModal.css';

const ViewServiceModal = ({ isOpen, onClose, service }) => {
    if (!isOpen || !service) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>Service Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Service Name</label>
                        <input type="text" value={service.service_name || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Default Fee</label>
                        <input type="text" value={service.default_fee != null ? `₹ ${service.default_fee}` : "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows="4" value={service.description || "-"} readOnly></textarea>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <input type="text" value={service.is_active ? "Active" : "Inactive"} readOnly style={{ color: service.is_active ? '#22c55e' : '#ef4444', fontWeight: 'bold' }} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="save-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewServiceModal;
