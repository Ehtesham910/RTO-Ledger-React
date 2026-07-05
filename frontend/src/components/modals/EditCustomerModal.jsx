import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css'; 

const EditCustomerModal = ({ isOpen, onClose, onSave, customer }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: ''
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                mobile: customer.mobile || '',
                email: customer.email || '',
                address: customer.address || ''
            });
        }
    }, [customer]);

    if (!isOpen || !customer) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        onSave({ id: customer.id, ...formData });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>Edit Customer</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Customer Code</label>
                            <input type="text" value={customer.customer_code || ""} readOnly disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter Customer Name" required name="name" value={formData.name} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input 
                                type="tel" 
                                name="mobile"
                                pattern="[0-9]{10}" 
                                maxLength="10" 
                                placeholder="Enter 10-digit Mobile Number" 
                                title="Mobile number must be exactly 10 digits"
                                required 
                                value={formData.mobile} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Enter Email" 
                                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                title="Please enter a valid email address"
                                value={formData.email} 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea rows="4" placeholder="Enter Address" name="address" value={formData.address} onChange={handleChange}></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Update Customer</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default EditCustomerModal;
