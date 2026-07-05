import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css'; 

const EditVehicleModal = ({ isOpen, onClose, onSave, vehicle }) => {
    const [formData, setFormData] = useState({
        vehicle_number: '',
        vehicle_type: '',
        chassis_number: '',
        engine_number: '',
        registration_date: '',
        driver_name: '',
        driver_mobile: ''
    });

    useEffect(() => {
        if (vehicle) {
            // Format date for date input type (YYYY-MM-DD)
            let formattedDate = '';
            if (vehicle.registration_date) {
                const date = new Date(vehicle.registration_date);
                formattedDate = date.toISOString().split('T')[0];
            }

            setFormData({
                vehicle_number: vehicle.vehicle_number || '',
                vehicle_type: vehicle.vehicle_type || '',
                chassis_number: vehicle.chassis_number || '',
                engine_number: vehicle.engine_number || '',
                registration_date: formattedDate,
                driver_name: vehicle.driver_name || '',
                driver_mobile: vehicle.driver_mobile || ''
            });
        }
    }, [vehicle]);

    if (!isOpen || !vehicle) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        onSave({ id: vehicle.id, ...formData });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Edit Vehicle</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input type="text" value={vehicle.customers?.name || "Unknown"} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Vehicle No.</label>
                            <input type="text" placeholder="Enter Vehicle No." required name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="" disabled>Select Type</option>
                                <option value="2-Wheeler">2-Wheeler</option>
                                <option value="3-Wheeler">3-Wheeler</option>
                                <option value="4-Wheeler">4-Wheeler</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Heavy Vehicle">Heavy Vehicle</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Registration Date</label>
                            <input type="date" name="registration_date" value={formData.registration_date} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Chassis No.</label>
                            <input type="text" placeholder="Enter Chassis No." name="chassis_number" value={formData.chassis_number} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Engine No.</label>
                            <input type="text" placeholder="Enter Engine No." name="engine_number" value={formData.engine_number} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Driver Name</label>
                            <input type="text" placeholder="Enter Driver Name" name="driver_name" value={formData.driver_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Driver Mobile</label>
                            <input type="tel" name="driver_mobile" pattern="[0-9]{10}" maxLength="10" placeholder="10-digit number" value={formData.driver_mobile} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Update Vehicle</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default EditVehicleModal;
