import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/roles.css'; 
import AddUserModal from '../components/modals/AddUserModal';
import EditUserModal from '../components/modals/EditUserModal';
import ManageUserPermissionsModal from '../components/modals/ManageUserPermissionsModal';

function Users() {
    const [users, setUsers] = useState(() => {
        const savedData = localStorage.getItem('usersData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [allPermissions, setAllPermissions] = useState(() => {
        const savedPerms = localStorage.getItem('allPermissionsData');
        return savedPerms ? JSON.parse(savedPerms) : [];
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchData = async () => {
        try {
            const [usersRes, permsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users'),
                axios.get('http://localhost:5000/api/roles/permissions-list')
            ]);
            setUsers(usersRes.data);
            setAllPermissions(permsRes.data);
            localStorage.setItem('usersData', JSON.stringify(usersRes.data));
            localStorage.setItem('allPermissionsData', JSON.stringify(permsRes.data));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddUser = async (newUserData) => {
        setIsAddModalOpen(false);
        try {
            await axios.post('http://localhost:5000/api/users', newUserData);
            fetchData();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user.");
        }
    };

    const handleEditUser = async (id, updatedData) => {
        setIsEditModalOpen(false);
        try {
            await axios.put(`http://localhost:5000/api/users/${id}`, updatedData);
            fetchData();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    const handleSavePermissions = async (userId, permissionIds) => {
        setIsPermissionsModalOpen(false);
        try {
            await axios.post(`http://localhost:5000/api/users/${userId}/permissions`, {
                permissionIds
            });
            fetchData();
        } catch (error) {
            console.error("Error updating permissions:", error);
            alert("Failed to update user permissions.");
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const updatedUsers = users.map(u => 
                u.id === id ? { ...u, is_active: newStatus } : u
            );
            setUsers(updatedUsers);
            localStorage.setItem('usersData', JSON.stringify(updatedUsers));
            await axios.put(`http://localhost:5000/api/users/${id}/status`, { is_active: newStatus });
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                fetchData();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || (user.roles && user.roles.name === roleFilter);
        const matchesStatus = statusFilter === 'All' || 
                              (statusFilter === 'Active' && user.is_active) || 
                              (statusFilter === 'Inactive' && !user.is_active);
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const uniqueRoles = ['All', ...new Set(users.map(u => u.roles?.name).filter(Boolean))];

    return (
        <div className="page-container">
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

            <div className="controls-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', flex: '1', minWidth: '200px' }}
                />
                <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', minWidth: '150px' }}
                >
                    {uniqueRoles.map(role => (
                        <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
                    ))}
                </select>
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', minWidth: '150px' }}
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

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
                            {filteredUsers.map((user, index) => (
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
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                            <button 
                                                className="btn-action view" 
                                                style={{ padding: '0.375rem 0.75rem', fontSize: '0.825rem', fontWeight: '500', lineHeight: '1.25' }}
                                                title="Manage Permissions"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsPermissionsModalOpen(true);
                                                }}
                                            >
                                                Manage Permissions
                                            </button>
                                            <button 
                                                className="btn-action edit" 
                                                title="Edit User" 
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsEditModalOpen(true);
                                                }}
                                                style={{ padding: '6px' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button 
                                                className="btn-action delete" 
                                                title="Delete User" 
                                                onClick={() => handleDelete(user.id)}
                                                style={{ padding: '6px' }}
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

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="empty-state" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                                        No users found matching your criteria.
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

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditUser}
                user={selectedUser}
            />

            <ManageUserPermissionsModal
                isOpen={isPermissionsModalOpen}
                onClose={() => setIsPermissionsModalOpen(false)}
                user={selectedUser}
                allPermissions={allPermissions}
                onSave={handleSavePermissions}
            />
        </div>
    );
}

export default Users;
