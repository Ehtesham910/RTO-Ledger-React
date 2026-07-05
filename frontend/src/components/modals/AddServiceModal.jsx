import React, { useState } from 'react';
import '../../assets/css/addCustomerModal.css'; // Reusing standard modal styles

function AddServiceModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        service_name: '',
        default_fee: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        onSave(formData);
        
        // Reset form for next time
        setFormData({
            service_name: '',
            default_fee: '',
            description: ''
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add New Service</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: '1' }}>
                            <label>Service Name <span style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="Enter Service Name" required name="service_name" value={formData.service_name} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ flex: '1' }}>
                            <label>Default Fee (₹) <span style={{color: 'red'}}>*</span></label>
                            <input type="number" placeholder="Enter Default Fee" required name="default_fee" value={formData.default_fee} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>
                        <textarea placeholder="Enter Description (Optional)" name="description" value={formData.description} onChange={handleChange} rows="3" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px', outline: 'none', resize: 'vertical' }}></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save">Save Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddServiceModal;
