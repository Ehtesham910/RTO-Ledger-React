import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

function PortalAddVehicleModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        vehicle_number: '',
        vehicle_type: '2 Wheeler',
        chassis_number: '',
        engine_number: '',
        registration_date: '',
        driver_name: '',
        driver_mobile: ''
    });

    if (!isOpen) return null;

    const formatVehicleNumber = (val) => {
        const raw = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const match = raw.match(/^([A-Z]{0,2})(\d{0,2})([A-Z]{0,3})?(\d{0,4})?/);
        if (!match) return raw;
        
        let parts = [];
        if (match[1]) parts.push(match[1]);
        if (match[2]) parts.push(match[2]);
        if (match[3]) parts.push(match[3]);
        if (match[4]) parts.push(match[4]);
        
        return parts.join(' ');
    };

    const formatChassis = (val) => {
        if (!val) return '';
        let clean = val.toUpperCase();
        if (!clean.startsWith('CHS')) {
            const digits = clean.replace(/[^0-9]/g, '');
            clean = 'CHS' + digits;
        }
        const digits = clean.substring(3).replace(/[^0-9]/g, '').substring(0, 6);
        return 'CHS' + digits;
    };

    const formatEngine = (val) => {
        if (!val) return '';
        let clean = val.toUpperCase();
        if (!clean.startsWith('ENG')) {
            const digits = clean.replace(/[^0-9]/g, '');
            clean = 'ENG' + digits;
        }
        const digits = clean.substring(3).replace(/[^0-9]/g, '').substring(0, 6);
        return 'ENG' + digits;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'vehicle_number') {
            setFormData({ ...formData, [name]: formatVehicleNumber(value) });
        } else if (name === 'chassis_number') {
            setFormData({ ...formData, [name]: formatChassis(value) });
        } else if (name === 'engine_number') {
            setFormData({ ...formData, [name]: formatEngine(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFocus = (e) => {
        const { name, value } = e.target;
        if (name === 'chassis_number' && !value) {
            setFormData(prev => ({ ...prev, chassis_number: 'CHS' }));
        }
        if (name === 'engine_number' && !value) {
            setFormData(prev => ({ ...prev, engine_number: 'ENG' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'chassis_number' && value === 'CHS') {
            setFormData(prev => ({ ...prev, chassis_number: '' }));
        }
        if (name === 'engine_number' && value === 'ENG') {
            setFormData(prev => ({ ...prev, engine_number: '' }));
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/portal/vehicles', formData);
            setFormData({
                vehicle_number: '', vehicle_type: '2 Wheeler', chassis_number: '',
                engine_number: '', registration_date: '', driver_name: '', driver_mobile: ''
            });
            onSuccess();
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("Failed to add vehicle.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Vehicle</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleAddVehicle}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Vehicle No. <span style={{color: 'red'}}>*</span></label>
                            <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} required placeholder="Enter Vehicle No." />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type <span style={{color: 'red'}}>*</span></label>
                            <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="2-Wheeler">2-Wheeler</option>
                                <option value="3-Wheeler">3-Wheeler</option>
                                <option value="4-Wheeler">4-Wheeler</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Heavy Vehicle">Heavy Vehicle</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Registration Date</label>
                            <input type="date" name="registration_date" value={formData.registration_date} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ visibility: 'hidden' }}>
                            <label>Hidden</label>
                            <input type="text" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Chassis No.</label>
                            <input 
                                type="text" 
                                placeholder="e.g. CHS123456" 
                                name="chassis_number" 
                                value={formData.chassis_number} 
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className="form-group">
                            <label>Engine No.</label>
                            <input 
                                type="text" 
                                placeholder="e.g. ENG123456" 
                                name="engine_number" 
                                value={formData.engine_number} 
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    <div className="form-divider" style={{ margin: '15px 0', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: '500', paddingBottom: '5px' }}>
                        <span>Driver Details (Optional)</span>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Driver Name</label>
                            <input type="text" placeholder="Enter Driver Name" name="driver_name" value={formData.driver_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Driver Mobile</label>
                            <input type="tel" placeholder="10-digit number" pattern="[0-9]{10}" maxLength="10" name="driver_mobile" value={formData.driver_mobile} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Save Vehicle</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PortalAddVehicleModal;
