import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css';

const EditLedgerModal = ({ isOpen, onClose, onSave, record }) => {
    const [formData, setFormData] = useState({
        id: '',
        service_fee: '',
        amount_paid: '',
        due_amount: '',
        status: 'Pending',
        payment_mode: 'Cash (Paid)'
    });

    useEffect(() => {
        if (isOpen && record) {
            setFormData({
                id: record.id,
                service_fee: record.service_fee || 0,
                amount_paid: record.amount_paid || 0,
                due_amount: record.due_amount || 0,
                status: record.status || 'Pending',
                payment_mode: record.payment_mode || 'Cash (Paid)'
            });
        }
    }, [isOpen, record]);

    if (!isOpen || !record) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newFormData = { ...formData, [name]: value };

        // Auto calculate due amount if service_fee or amount_paid changes
        if (name === 'service_fee' || name === 'amount_paid') {
            const fee = parseFloat(newFormData.service_fee) || 0;
            const paid = parseFloat(newFormData.amount_paid) || 0;
            const due = fee - paid;
            newFormData.due_amount = due > 0 ? due : 0;

            // Auto update status
            if (paid >= fee && fee > 0) {
                newFormData.status = 'Paid';
            } else if (paid > 0 && paid < fee) {
                newFormData.status = 'Partial';
            } else {
                newFormData.status = 'Pending';
            }
        }

        setFormData(newFormData);
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
                    <h2>Edit Ledger Record</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Read Only Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input type="text" value={record.customers?.name || "Unknown"} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Vehicle No.</label>
                            <input type="text" value={formatVehicleNumber(record.vehicles?.vehicle_number)} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Request No.</label>
                            <input type="text" value={record.service_requests?.request_no || "-"} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Service Name</label>
                            <input type="text" value={record.service_requests?.services?.service_name || "-"} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                    </div>

                    <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                    {/* Editable Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Service Fee (₹)</label>
                            <input type="number" name="service_fee" value={formData.service_fee} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Amount Paid (₹) <span style={{color: 'red'}}>*</span></label>
                            <input type="number" name="amount_paid" placeholder="Enter Amount Paid" required value={formData.amount_paid} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Payment Mode <span style={{color: 'red'}}>*</span></label>
                            <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="Cash (Paid)">Cash (Paid)</option>
                                <option value="Razorpay (Online)">Razorpay (Online)</option>
                                <option value="Pay Later (Unpaid)">Pay Later (Unpaid)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Amount (₹)</label>
                            <input type="number" name="due_amount" value={formData.due_amount} readOnly style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status <span style={{color: 'red'}}>*</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} required style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none' }}>
                                <option value="Pending">Pending</option>
                                <option value="Partial">Partial</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                        <div className="form-group">
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Update Ledger</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLedgerModal;
