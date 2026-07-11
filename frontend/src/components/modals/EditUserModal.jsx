import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        if (isOpen && user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setPassword(''); // Don't show existing password
            setRoleId(user.role_id ? String(user.role_id) : '');

            const savedRoles = sessionStorage.getItem('rolesData');
            if (savedRoles) {
                setRolesList(JSON.parse(savedRoles));
            } else {
                axios.get('http://localhost:5000/api/roles')
                    .then(res => setRolesList(res.data))
                    .catch(err => console.error("Error fetching roles for dropdown:", err));
            }
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.id, {
            username,
            email,
            password,
            role_id: roleId ? roleId : null
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit User</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group full-width" style={{ marginBottom: '15px' }}>
                        <label>Username <span style={{ color: 'red' }}>*</span></label>
                        <input 
                            type="text" 
                            placeholder="Enter Username" 
                            required 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="email" 
                                placeholder="Enter Email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Reset Password</label>
                            <input 
                                type="password" 
                                placeholder="Leave blank to keep current" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="form-group full-width" style={{ marginBottom: '25px' }}>
                        <label>Assign Role</label>
                        <select 
                            value={roleId} 
                            onChange={(e) => setRoleId(e.target.value)}
                            style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '15px' }}
                        >
                            <option value="">Select Role</option>
                            {rolesList.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="close-btn" style={{ fontSize: '15px', marginRight: '15px' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Update User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
