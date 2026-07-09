import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/roles.css'; // sharing premium CSS styles for consistency
import AddUserModal from '../components/modals/AddUserModal';

function Users() {
    // 1. Initial State ko LocalStorage se fetch karenge taaki instantly page load ho jaye
    const [users, setUsers] = useState(() => {
        const savedData = localStorage.getItem('usersData');
        return savedData ? JSON.parse(savedData) : [];
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // 2. Fetch Users function definition
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
            localStorage.setItem('usersData', JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 3. Create User submit handler
    const handleAddUser = async (newUserData) => {
        setIsAddModalOpen(false);
        try {
            await axios.post('http://localhost:5000/api/users', newUserData);
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user.");
        }
    };

    // 4. Toggle User active status logic
    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            // UI state update
            const updatedUsers = users.map(u => 
                u.id === id ? { ...u, is_active: newStatus } : u
            );
            setUsers(updatedUsers);
            localStorage.setItem('usersData', JSON.stringify(updatedUsers));
            
            // Backend synchronization
            await axios.put(`http://localhost:5000/api/users/${id}/status`, { is_active: newStatus });
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    // 5. Delete User handler
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    return (
        <div className="page-container">
            {/* Header section with page titles and add button */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Users & Permissions</h2>
                    <p className="page-subtitle">Manage system user accounts, assign roles, and toggle status</p>
                </div>
                <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add User
                </button>
            </div>

            {/* Users listing Table */}
            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Assigned Role</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
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
                                        {/* Status indicator with switch toggle */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '500', color: user.is_active ? '#22c55e' : '#ef4444' }}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={user.is_active} 
                                                    onChange={() => handleStatusToggle(user.id, user.is_active)} 
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <button 
                                                className="btn-action delete" 
                                                title="Delete User" 
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No users found. Click 'Add User' to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddUser}
            />
        </div>
    );
}

export default Users;
