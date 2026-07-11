import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

function PortalAddServiceRequestModal({ isOpen, onClose, onSuccess }) {
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        vehicle_id: '',
        service_id: '',
        amount: '',
        remarks: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen]);

    const fetchDropdownData = async () => {
        try {
            const [vehRes, srvRes] = await Promise.all([
                axios.get('http://localhost:5000/api/portal/vehicles'),
                axios.get('http://localhost:5000/api/portal/active-services')
            ]);
            setVehicles(vehRes.data.filter(v => v.is_active));
            setServices(srvRes.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    if (!isOpen) return null;

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const selectedService = services.find(s => s.id.toString() === serviceId);
        setFormData({
            ...formData,
            service_id: serviceId,
            amount: selectedService ? selectedService.default_fee : ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/portal/service-requests', formData);
            setFormData({ vehicle_id: '', service_id: '', amount: '', remarks: '' });
            onSuccess(response.data);
        } catch (error) {
            console.error("Error adding request:", error);
            alert("Failed to add service request.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>New Service Request</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleAddRequest}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Select Vehicle <span style={{color: 'red'}}>*</span></label>
                            <select name="vehicle_id" value={formData.vehicle_id} onChange={handleInputChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="" disabled>-- Select Vehicle --</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.vehicle_number}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Select Service <span style={{color: 'red'}}>*</span></label>
                            <select name="service_id" value={formData.service_id} onChange={handleServiceChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="" disabled>-- Select Service --</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.service_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Agreed Fee (₹) <span style={{color: 'red'}}>*</span></label>
                            <input type="number" name="amount" placeholder="Enter Amount" value={formData.amount} onChange={handleInputChange} required min="0" />
                        </div>
                        <div className="form-group" style={{ visibility: 'hidden' }}>
                            <label>Hidden</label>
                            <input type="text" />
                        </div>
                    </div>
                    
                    <div className="form-group full-width" style={{ marginTop: '15px' }}>
                        <label>Remarks / Instructions</label>
                        <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} rows="4" placeholder="Any specific instructions..."></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PortalAddServiceRequestModal;
