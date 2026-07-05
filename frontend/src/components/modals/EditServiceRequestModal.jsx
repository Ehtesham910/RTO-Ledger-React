import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

const EditServiceRequestModal = ({ isOpen, onClose, onSave, request }) => {
    const [customers, setCustomers] = useState([]);
    const [allVehicles, setAllVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        request_no: '',
        customer_id: '',
        vehicle_id: '',
        service_id: '',
        amount: '',
        status: 'Pending',
        remarks: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Fetch necessary data
            Promise.all([
                axios.get('http://localhost:5000/api/customers'),
                axios.get('http://localhost:5000/api/vehicles'),
                axios.get('http://localhost:5000/api/services')
            ]).then(([custRes, vehRes, servRes]) => {
                setCustomers(custRes.data);
                const fetchedVehicles = vehRes.data;
                setAllVehicles(fetchedVehicles);
                setServices(servRes.data);

                if (request) {
                    const customerVehicles = fetchedVehicles.filter(v => String(v.customer_id) === String(request.customer_id));
                    setFilteredVehicles(customerVehicles);

                    setFormData({
                        id: request.id,
                        request_no: request.request_no,
                        customer_id: request.customer_id ? String(request.customer_id) : '',
                        vehicle_id: request.vehicle_id ? String(request.vehicle_id) : '',
                        service_id: request.service_id ? String(request.service_id) : '',
                        amount: request.amount || '',
                        status: request.status || 'Pending',
                        remarks: request.remarks || ''
                    });
                }
            }).catch(err => console.error("Error fetching data for edit modal:", err));
        }
    }, [isOpen, request]);

    if (!isOpen || !request) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'customer_id') {
            const customerVehicles = allVehicles.filter(v => String(v.customer_id) === String(value));
            setFilteredVehicles(customerVehicles);
            setFormData({ ...formData, customer_id: value, vehicle_id: '' }); // reset vehicle on customer change
        } else if (name === 'service_id') {
            const selectedService = services.find(s => String(s.id) === String(value));
            setFormData({ 
                ...formData, 
                service_id: value, 
                amount: selectedService ? selectedService.default_fee : '' 
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                    <h2>Edit Service Request</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Request No.</label>
                            <input type="text" value={formData.request_no || ""} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Customer <span style={{color: 'red'}}>*</span></label>
                            <select name="customer_id" value={formData.customer_id} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="" disabled>Select Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.customer_code})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Vehicle <span style={{color: 'red'}}>*</span></label>
                            <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required disabled={!formData.customer_id} style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="" disabled>Select Vehicle</option>
                                {filteredVehicles.map(v => (
                                    <option key={v.id} value={v.id}>{formatVehicleNumber(v.vehicle_number)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Service <span style={{color: 'red'}}>*</span></label>
                            <select name="service_id" value={formData.service_id} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="" disabled>Select Service</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.service_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount (₹) <span style={{color: 'red'}}>*</span></label>
                            <input type="number" name="amount" placeholder="Enter Amount" required value={formData.amount} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Status <span style={{color: 'red'}}>*</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Remarks</label>
                        <textarea rows="4" placeholder="Enter any additional notes..." name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Update Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceRequestModal;
