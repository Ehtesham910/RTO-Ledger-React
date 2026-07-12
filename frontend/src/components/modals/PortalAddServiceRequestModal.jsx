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
    const [paymentType, setPaymentType] = useState('Later');
    const [amountToPay, setAmountToPay] = useState('');
    const [existingRequests, setExistingRequests] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            loadRazorpayScript();
            setPaymentType('Later');
            setAmountToPay('');
            setFormData({
                vehicle_id: '',
                service_id: '',
                amount: '',
                remarks: ''
            });
        }
    }, [isOpen]);

    const loadRazorpayScript = () => {
        if (document.getElementById('razorpay-script')) return;
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    };

    const fetchDropdownData = async () => {
        try {
            const [vehRes, srvRes, reqRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/vehicles`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/active-services`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/service-requests`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                })
            ]);
            setVehicles(vehRes.data.filter(v => v.is_active));
            setServices(srvRes.data);
            setExistingRequests(reqRes.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    if (!isOpen) return null;

    const checkDuplicate = (vId, sId) => {
        if (!vId || !sId) return false;
        const dup = existingRequests.find(r => 
            r.vehicle_id.toString() === vId.toString() && 
            r.service_id.toString() === sId.toString() && 
            !['Completed', 'Cancelled', 'Rejected'].includes(r.status)
        );
        if (dup) {
            alert("This service request has already been submitted and is currently pending. You cannot submit a new request.");
            onClose();
            return true;
        }
        return false;
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        if (checkDuplicate(formData.vehicle_id, serviceId)) return;

        const selectedService = services.find(s => s.id.toString() === serviceId);
        const fee = selectedService ? selectedService.default_fee : '';
        setFormData({
            ...formData,
            service_id: serviceId,
            amount: fee
        });
        if (paymentType === 'Full') {
            setAmountToPay(fee);
        }
    };

    const handlePaymentTypeChange = (e) => {
        const type = e.target.value;
        setPaymentType(type);
        if (type === 'Full') {
            setAmountToPay(formData.amount);
        } else if (type === 'Later') {
            setAmountToPay('');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'vehicle_id') {
            if (checkDuplicate(value, formData.service_id)) return;
        }
        setFormData({ ...formData, [name]: value });
        if (name === 'amount' && paymentType === 'Full') {
            setAmountToPay(value);
        }
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

    const submitRequest = async (paymentData = {}) => {
        try {
            const finalData = { ...formData, ...paymentData };
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/service-requests`, finalData, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            onSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error === "Duplicate pending request") {
                alert(error.response.data.message);
                onClose();
                return;
            }
            console.error("Error adding request:", error);
            alert("Failed to add service request.");
        }
    };

    const handleAddRequest = async (e) => {
        e.preventDefault();

        if (paymentType === 'Later') {
            await submitRequest();
            return;
        }

        if (!amountToPay || isNaN(amountToPay) || parseFloat(amountToPay) <= 0) {
            alert("Please enter a valid amount to pay.");
            return;
        }

        if (parseFloat(amountToPay) > parseFloat(formData.amount)) {
            alert("Payment amount cannot exceed the agreed fee.");
            return;
        }

        try {
            // Create Razorpay Order
            const orderRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/portal/create-order`, {
                amount: amountToPay,
                vehicle_id: formData.vehicle_id,
                service_id: formData.service_id
            }, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });

            const order = orderRes.data;
            const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');

            const options = {
                key: 'rzp_test_T4cBNMQIEIqZ1s', // Configured in test environment
                amount: order.amount,
                currency: order.currency,
                name: "RTO Ledger System",
                description: "Service Request Payment",
                order_id: order.id,
                handler: async function (response) {
                    // On success, submit request with payment details
                    await submitRequest({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        amount_paid: amountToPay
                    });
                },
                prefill: {
                    name: currentUser.username || 'Customer',
                    email: currentUser.email || 'customer@example.com',
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
            
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error === "Duplicate pending request") {
                alert(error.response.data.message);
                onClose();
                return;
            }
            console.error("Error initiating payment:", error);
            alert("Failed to initiate payment.");
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
                                    <option key={v.id} value={v.id}>{formatVehicleNumber(v.vehicle_number)}</option>
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
                        <div className="form-group">
                            <label>Payment Method</label>
                            <select value={paymentType} onChange={handlePaymentTypeChange} style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc' }}>
                                <option value="Later">Pay Later</option>
                                <option value="Full">Pay Now (Full)</option>
                                <option value="Partial">Pay Now (Partial)</option>
                            </select>
                        </div>
                    </div>

                    {paymentType === 'Partial' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Amount to Pay Now (₹) <span style={{color: 'red'}}>*</span></label>
                                <input 
                                    type="number" 
                                    placeholder="Enter partial amount" 
                                    value={amountToPay} 
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        const maxFee = parseFloat(formData.amount || 0);
                                        if (val !== '' && parseFloat(val) > maxFee) {
                                            val = maxFee.toString();
                                        }
                                        setAmountToPay(val);
                                    }} 
                                    required 
                                    min="1" 
                                    max={formData.amount || 0} 
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="form-group full-width" style={{ marginTop: '15px' }}>
                        <label>Remarks / Instructions</label>
                        <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} rows="4" placeholder="Any specific instructions..."></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {paymentType === 'Later' ? 'Submit Request' : 'Proceed to Pay'}
                            {paymentType !== 'Later' && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PortalAddServiceRequestModal;
