import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

const AddServiceRequestModal = ({ isOpen, onClose, onSave, nextRequestNo }) => {
    const [customers, setCustomers] = useState([]);
    const [allVehicles, setAllVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);

    const [formData, setFormData] = useState({
        customer_id: '',
        vehicle_id: '',
        service_id: '',
        amount: '',
        status: 'Pending',
        remarks: '',
        payment_method: 'Pay Later (Unpaid)',
        amount_paid: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Fetch necessary data
            Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/customers`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`)
            ]).then(([custRes, vehRes, servRes]) => {
                setCustomers(custRes.data.filter(c => c.is_active));
                setAllVehicles(vehRes.data.filter(v => v.is_active));
                setServices(servRes.data.filter(s => s.is_active));
            }).catch(err => console.error("Error fetching data for modal:", err));

            // Reset form
            setFormData({
                customer_id: '',
                vehicle_id: '',
                service_id: '',
                amount: '',
                status: 'Pending',
                remarks: '',
                payment_method: 'Pay Later (Unpaid)',
                amount_paid: ''
            });
            setFilteredVehicles([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'customer_id') {
            const customerVehicles = allVehicles.filter(v => String(v.customer_id) === String(value));
            setFilteredVehicles(customerVehicles);
            setFormData({ ...formData, customer_id: value, vehicle_id: '' }); // reset vehicle on customer change
        } else if (name === 'service_id') {
            const selectedService = services.find(s => String(s.id) === String(value));
            const newAmount = selectedService ? selectedService.default_fee : '';
            setFormData({ 
                ...formData, 
                service_id: value, 
                amount: newAmount,
                amount_paid: formData.payment_method === 'Pay Later (Unpaid)' ? 0 : newAmount
            });
        } else if (name === 'payment_method') {
            setFormData({
                ...formData,
                payment_method: value,
                amount_paid: value === 'Pay Later (Unpaid)' ? 0 : formData.amount
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, request_no: nextRequestNo });
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
                    <h2>New Service Request</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Request No.</label>
                            <input type="text" value={nextRequestNo || ""} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
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

                    <div className="form-row">
                        <div className="form-group">
                            <label>Payment Method (New Requests Only) <span style={{color: 'red'}}>*</span></label>
                            <select name="payment_method" value={formData.payment_method} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="Pay Later (Unpaid)">Pay Later (Unpaid)</option>
                                <option value="Cash (Paid)">Cash (Paid)</option>
                                <option value="Razorpay (Online)">Razorpay (Online)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Payable Amount (₹)</label>
                            <input 
                                type="number" 
                                name="amount_paid" 
                                placeholder="Enter Amount Paid" 
                                value={formData.amount_paid} 
                                onChange={handleChange} 
                                disabled={formData.payment_method === 'Pay Later (Unpaid)'}
                                style={{ backgroundColor: formData.payment_method === 'Pay Later (Unpaid)' ? '#f8fafc' : 'white' }}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Remarks</label>
                        <textarea rows="4" placeholder="Enter any additional notes..." name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Save Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceRequestModal;
