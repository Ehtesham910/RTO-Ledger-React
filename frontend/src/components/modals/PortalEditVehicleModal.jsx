import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

function PortalEditVehicleModal({ isOpen, onClose, onSuccess, vehicle }) {
    const [formData, setFormData] = useState({
        vehicle_number: '',
        vehicle_type: '2 Wheeler',
        chassis_number: '',
        engine_number: '',
        registration_date: '',
        driver_name: '',
        driver_mobile: ''
    });

    useEffect(() => {
        if (isOpen && vehicle) {
            setFormData({
                vehicle_number: vehicle.vehicle_number || '',
                vehicle_type: vehicle.vehicle_type || '2 Wheeler',
                chassis_number: vehicle.chassis_number || '',
                engine_number: vehicle.engine_number || '',
                registration_date: vehicle.registration_date ? vehicle.registration_date.split('T')[0] : '',
                driver_name: vehicle.driver_name || '',
                driver_mobile: vehicle.driver_mobile || ''
            });
        }
    }, [isOpen, vehicle]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditVehicle = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/portal/vehicles/${vehicle.id}`, formData);
            onSuccess(response.data);
        } catch (error) {
            console.error("Error updating vehicle:", error);
            alert("Failed to update vehicle.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Vehicle</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleEditVehicle}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Vehicle Number <span style={{color: 'red'}}>*</span></label>
                            <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleInputChange} required placeholder="e.g. MH 04 AB 1234" />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type <span style={{color: 'red'}}>*</span></label>
                            <select name="vehicle_type" value={formData.vehicle_type} onChange={handleInputChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="2 Wheeler">2 Wheeler</option>
                                <option value="3 Wheeler">3 Wheeler</option>
                                <option value="4 Wheeler">4 Wheeler</option>
                                <option value="Heavy Vehicle">Heavy Vehicle</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Chassis Number</label>
                            <input type="text" placeholder="e.g. CHS123456" name="chassis_number" value={formData.chassis_number} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Engine Number</label>
                            <input type="text" placeholder="e.g. ENG123456" name="engine_number" value={formData.engine_number} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Registration Date</label>
                            <input type="date" name="registration_date" value={formData.registration_date} onChange={handleInputChange} />
                        </div>
                        <div className="form-group" style={{ visibility: 'hidden' }}>
                            <label>Hidden</label>
                            <input type="text" />
                        </div>
                    </div>
                    <div className="form-divider" style={{ margin: '15px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: '500', paddingBottom: '5px' }}>
                        <span>Driver Details (Optional)</span>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Driver Name</label>
                            <input type="text" placeholder="Enter Driver Name" name="driver_name" value={formData.driver_name} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Driver Mobile</label>
                            <input type="tel" placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" name="driver_mobile" value={formData.driver_mobile} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Update Vehicle</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PortalEditVehicleModal;
