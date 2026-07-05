import React from 'react';
import '../../assets/css/addCustomerModal.css';

const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>

                {/* Header Section */}
                <div className="modal-header">
                    <h2>Customer Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* Info Section */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Customer Code</label>
                        <input type="text" value={customer.customer_code || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={customer.name || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="text" value={customer.mobile || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" value={customer.email || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea rows="4" value={customer.address || "-"} readOnly></textarea>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <input type="text" value={customer.is_active ? "Active" : "Inactive"} readOnly style={{ color: customer.is_active ? '#22c55e' : '#ef4444', fontWeight: 'bold' }} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="save-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomerModal;
