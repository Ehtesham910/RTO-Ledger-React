import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css'; // Reusing standard modal styles

function EditServiceModal({ isOpen, onClose, service, onSave }) {
    const [formData, setFormData] = useState({
        service_name: '',
        default_fee: '',
        description: ''
    });

    useEffect(() => {
        if (service) {
            setFormData({
                service_name: service.service_name || '',
                default_fee: service.default_fee || '',
                description: service.description || ''
            });
        }
    }, [service]);

    if (!isOpen || !service) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        onSave({ id: service.id, ...formData });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Service</h2>
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
                    
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea rows="4" placeholder="Enter Description (Optional)" name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Update Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditServiceModal;
