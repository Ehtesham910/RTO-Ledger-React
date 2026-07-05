import React from 'react';
import '../../assets/css/addCustomerModal.css'; 

const ViewVehicleModal = ({ isOpen, onClose, vehicle }) => {
    if (!isOpen || !vehicle) return null;

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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Vehicle Details</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input type="text" value={vehicle.customers?.name || "Unknown"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Vehicle No.</label>
                        <input type="text" value={formatVehicleNumber(vehicle.vehicle_number) || "-"} readOnly />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Vehicle Type</label>
                        <input type="text" value={vehicle.vehicle_type || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Registration Date</label>
                        <input type="text" value={formatDate(vehicle.registration_date)} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Chassis No.</label>
                        <input type="text" value={vehicle.chassis_number || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Engine No.</label>
                        <input type="text" value={vehicle.engine_number || "-"} readOnly />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Driver Name</label>
                        <input type="text" value={vehicle.driver_name || "-"} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Driver Mobile</label>
                        <input type="text" value={vehicle.driver_mobile || "-"} readOnly />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Status</label>
                        <input type="text" value={vehicle.is_active ? "Active" : "Inactive"} readOnly style={{ color: vehicle.is_active ? '#22c55e' : '#ef4444', fontWeight: 'bold' }} />
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="save-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewVehicleModal;
