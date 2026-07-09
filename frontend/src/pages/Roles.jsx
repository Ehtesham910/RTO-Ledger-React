import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/roles.css';
import AddRoleModal from '../components/modals/AddRoleModal';
import EditRoleModal from '../components/modals/EditRoleModal';
import ManagePermissionsModal from '../components/modals/ManagePermissionsModal';

function Roles() {
    const [roles, setRoles] = useState(() => {
        const savedData = localStorage.getItem('rolesData');
        return savedData ? JSON.parse(savedData) : [];
    });

    const [allPermissions, setAllPermissions] = useState(() => {
        const savedPerms = localStorage.getItem('allPermissionsData');
        return savedPerms ? JSON.parse(savedPerms) : [];
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/roles');
            setRoles(response.data);
            localStorage.setItem('rolesData', JSON.stringify(response.data));

            const permResponse = await axios.get('http://localhost:5000/api/roles/permissions-list');
            setAllPermissions(permResponse.data);
            localStorage.setItem('allPermissionsData', JSON.stringify(permResponse.data));
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAddRole = async (newRoleData) => {
        setIsAddModalOpen(false);
        try {
            await axios.post('http://localhost:5000/api/roles', newRoleData);
            fetchRoles();
        } catch (error) {
            console.error("Error creating role:", error);
            alert("Failed to create role.");
        }
    };

    const handleEditRole = async (id, updatedData) => {
        setIsEditModalOpen(false);
        try {
            await axios.put(`http://localhost:5000/api/roles/${id}`, updatedData);
            fetchRoles();
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        }
    };

    const handleSavePermissions = async (roleId, permissionIds) => {
        setIsPermissionsModalOpen(false);
        try {
            await axios.post(`http://localhost:5000/api/roles/${roleId}/permissions`, {
                permissionIds
            });
            fetchRoles();
        } catch (error) {
            console.error("Error updating permissions:", error);
            alert("Failed to update permissions.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this role?")) {
            try {
                await axios.delete(`http://localhost:5000/api/roles/${id}`);
                fetchRoles();
            } catch (error) {
                console.error("Error deleting role:", error);
                alert("Failed to delete role. Check if users are assigned to this role first.");
            }
        }
    };

    // Filter Logic
    const filteredRoles = roles.filter(role => {
        return role.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Roles & Permissions</h2>
                    <p className="page-subtitle">Manage user roles and assign their access permissions</p>
                </div>
                <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Role
                </button>
            </div>

            <div className="controls-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search roles by name or description..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', flex: '1', minWidth: '200px' }}
                />
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Role Name</th>
                                <th>Description</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoles.map((role, index) => (
                                <tr key={role.id}>
                                    <td>{index + 1}</td>
                                    <td className="font-medium">{role.name}</td>
                                    <td>{role.description || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                            <button 
                                                className="btn-action view" 
                                                style={{
                                                    padding: '0.375rem 0.75rem',
                                                    fontSize: '0.825rem',
                                                    fontWeight: '500',
                                                    lineHeight: '1.25'
                                                }}
                                                title="Manage Permissions"
                                                onClick={() => {
                                                    setSelectedRole(role);
                                                    setIsPermissionsModalOpen(true);
                                                }}
                                            >
                                                Manage Permissions
                                            </button>
                                            <button 
                                                className="btn-action edit" 
                                                title="Edit Role" 
                                                onClick={() => {
                                                    setSelectedRole(role);
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
                                                title="Delete Role" 
                                                onClick={() => handleDelete(role.id)}
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

                            {filteredRoles.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="empty-state" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                                        No roles found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddRoleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddRole}
            />

            <EditRoleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditRole}
                role={selectedRole}
            />

            <ManagePermissionsModal
                isOpen={isPermissionsModalOpen}
                onClose={() => setIsPermissionsModalOpen(false)}
                role={selectedRole}
                allPermissions={allPermissions}
                onSave={handleSavePermissions}
            />
        </div>
    );
}

export default Roles;
