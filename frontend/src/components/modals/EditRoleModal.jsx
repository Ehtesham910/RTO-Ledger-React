import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css';

const EditRoleModal = ({ isOpen, onClose, onSave, role }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen && role) {
            setName(role.name || '');
            setDescription(role.description || '');
        }
    }, [isOpen, role]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(role.id, {
            name,
            description
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Role</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group full-width" style={{ marginBottom: '15px' }}>
                        <label>Role Name <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="text" 
                            placeholder="Enter Role Name" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="form-group full-width" style={{ marginBottom: '25px' }}>
                        <label>Description</label>
                        <textarea 
                            placeholder="Enter short description about this role..." 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '10px 12px', 
                                border: '1px solid #cbd5e1', 
                                borderRadius: '6px', 
                                fontSize: '15px',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="close-btn" style={{ fontSize: '15px', marginRight: '15px' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Update Role</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRoleModal;
