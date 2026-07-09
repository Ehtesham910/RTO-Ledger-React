import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [message, setMessage] = useState('');

    // Users and Roles load karne ke liye
    useEffect(() => {
        // Fetch users
        axios.get('http://localhost:5000/api/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error fetching users:", err));

        // Fetch roles for dropdown
        axios.get('http://localhost:5000/api/roles')
            .then(res => setRoles(res.data))
            .catch(err => console.error("Error fetching roles:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) return;

        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                username,
                email,
                password,
                role_id: roleId ? roleId : null
            });
            setUsers([...users, response.data]);
            setUsername('');
            setEmail('');
            setPassword('');
            setRoleId('');
            setMessage('User created successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Failed to create user");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Users & Permissions</h2>
                    <p className="page-subtitle">Manage system users, assign their roles and credentials</p>
                </div>
            </div>

            {message && (
                <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* Add User Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Create New User</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Username *</label>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Email *</label>
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Password *</label>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>Assign Role</label>
                            <select 
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-add" style={{ width: '100%', justifyContent: 'center' }}>
                            Save User
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="card">
                    <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Existing Users</h3>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td className="font-medium">{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                                                    {user.roles?.name || 'No Role'}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ color: user.is_active ? '#16a34a' : '#dc2626', fontWeight: '500' }}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;
