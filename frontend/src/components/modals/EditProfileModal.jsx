import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

function EditProfileModal({ isOpen, onClose, user, onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        mobile: '',
        address: '',
        password: '' // Optional for staff
    });
    const [showPassword, setShowPassword] = useState(false);

    const isCustomer = user?.role === 'Customer';

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                username: user.username || '',
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
                address: user.address || '',
                password: ''
            });
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let updatedData;
            if (isCustomer) {
                // Customer endpoint
                const res = await axios.put(`http://localhost:5000/api/customers/${user.id}`, {
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    address: formData.address
                });
                updatedData = res.data;
            } else {
                // Staff endpoint
                const payload = {
                    username: formData.username,
                    email: formData.email
                };
                if (formData.password) {
                    payload.password = formData.password;
                }
                const res = await axios.put(`http://localhost:5000/api/users/${user.id}`, payload);
                updatedData = res.data;
            }
            onSuccess(updatedData);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSave}>
                    <div className="form-row">
                        {isCustomer ? (
                            <div className="form-group">
                                <label>Name <span style={{color: 'red'}}>*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Username <span style={{color: 'red'}}>*</span></label>
                                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                    </div>

                    {isCustomer && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Mobile <span style={{color: 'red'}}>*</span></label>
                                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}

                    {!isCustomer && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>New Password (Optional)</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                        placeholder="Leave blank to keep unchanged" 
                                        style={{ width: '100%', paddingRight: '40px' }} 
                                    />
                                    <span 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group" style={{visibility: 'hidden'}}>
                                <input type="text" />
                            </div>
                        </div>
                    )}
                    
                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
