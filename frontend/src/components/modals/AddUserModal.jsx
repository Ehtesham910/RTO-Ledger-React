import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/addCustomerModal.css';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [rolesList, setRolesList] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    // Modal open hone par rolls list fetch karenge and inputs ko reset karenge
    useEffect(() => {
        if (isOpen) {
            setUsername('');
            setEmail('');
            setPassword('');
            setRoleId('');

            // Roles ko local caching/storage se ya api se check karenge
            const savedRoles = sessionStorage.getItem('rolesData');
            if (savedRoles) {
                setRolesList(JSON.parse(savedRoles));
            } else {
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/roles`)
                    .then(res => setRolesList(res.data))
                    .catch(err => console.error("Error fetching roles for dropdown:", err));
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
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
                    <h2>Add New User</h2>
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
                            <label>Password <span style={{ color: 'red' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter Password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748b',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
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
                            {rolesList.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="close-btn" style={{ fontSize: '15px', marginRight: '15px' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
