import React, { useState, useEffect } from 'react';
import '../../assets/css/addCustomerModal.css';

const ManageUserPermissionsModal = ({ isOpen, onClose, user, allPermissions, onSave }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        if (isOpen && user) {
            const assignedIds = user.user_permissions ? user.user_permissions.map(up => String(up.permission_id)) : [];
            setSelectedPermissions(assignedIds);
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

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
        onSave(user.id, selectedPermissions);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ width: '650px' }}>
                <div className="modal-header">
                    <h2>Manage User Permissions: {user.username}</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div style={{ marginBottom: '15px', fontSize: '13.5px', color: '#475569' }}>
                    <strong>Note:</strong> Permissions granted here are <em>in addition</em> to any permissions this user receives from their assigned role ({user.roles?.name || 'No Role'}).
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
                                        gap: '12px',
                                        padding: '16px 14px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={selectedPermissions.includes(String(perm.id))}
                                        onChange={() => handleCheckboxChange(perm.id)}
                                        style={{ marginTop: '2px', width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', fontWeight: '700', marginBottom: '2px' }}>
                                            {perm.code}
                                        </strong>
                                        <span style={{ fontSize: '13px', color: '#64748b' }}>{perm.description || 'No description'}</span>
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

export default ManageUserPermissionsModal;
