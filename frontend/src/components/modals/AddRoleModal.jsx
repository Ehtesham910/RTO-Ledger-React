import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css'; // modal ki styling ke liye

const AddRoleModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Jab bhi modal open ho, inputs ko clean (reset) karenge
    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
        }
    }, [isOpen]);

    // Agar isOpen false hai, to display me kuch nahi dikhayenge
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description }); // Parent ko data pass karenge
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation ka use isliye taaki input fields par click karne par modal apne aap close na ho */}
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Role</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group full-width" style={{ marginBottom: '15px' }}>
                        <label>Role Name <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="text" 
                            placeholder="e.g. Operator, Manager" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="form-group full-width" style={{ marginBottom: '25px' }}>
                        <label>Description</label>
                        <textarea 
                            rows="3" 
                            placeholder="Describe the role responsibilities" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="close-btn" style={{ fontSize: '15px', marginRight: '15px' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save Role</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoleModal;
