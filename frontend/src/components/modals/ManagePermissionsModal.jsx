import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css';

const ManagePermissionsModal = ({ isOpen, onClose, role, allPermissions, onSave }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Role ke load hote hi selected checkboxes config instantly local context me complete ho jayegi
    useEffect(() => {
        if (isOpen && role) {
            const assignedIds = role.role_permissions.map(rp => String(rp.permission_id));
            setSelectedPermissions(assignedIds);
        }
    }, [isOpen, role]);

    if (!isOpen || !role) return null;

    const handleCheckboxChange = (permId) => {
        const idStr = String(permId);
        if (selectedPermissions.includes(idStr)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== idStr));
        } else {
            setSelectedPermissions([...selectedPermissions, idStr]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(role.id, selectedPermissions);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ width: '650px' }}>
                <div className="modal-header">
                    <h2>Manage Permissions: {role.name}</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {allPermissions.map(perm => (
                                <label 
                                    key={perm.id} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '10px',
                                        padding: '12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: '#f8fafc'
                                    }}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={selectedPermissions.includes(String(perm.id))}
                                        onChange={() => handleCheckboxChange(perm.id)}
                                        style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#4f46e5' }}
                                    />
                                    <div>
                                        <strong style={{ fontSize: '13.5px', color: '#1e293b', display: 'block' }}>
                                            {perm.code.replace(/_/g, ' ').toUpperCase()}
                                        </strong>
                                        <span style={{ fontSize: '11.5px', color: '#64748b' }}>{perm.description || 'No description'}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="close-btn" style={{ fontSize: '15px', marginRight: '15px' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManagePermissionsModal;
