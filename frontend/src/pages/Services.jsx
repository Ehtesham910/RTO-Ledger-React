import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/services.css';
import AddServiceModal from '../components/modals/AddServiceModal';
import ViewServiceModal from '../components/modals/ViewServiceModal';
import EditServiceModal from '../components/modals/EditServiceModal';
import Pagination from '../components/Pagination';

function Services() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditService, setSelectedEditService] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const canEdit = ['Admin', 'Operator', 'Agent'].includes(user.role);

    const [services, setServices] = useState(() => {
        const savedData = sessionStorage.getItem('servicesData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('servicesData'));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`)
            .then((response) => {
                setServices(response.data);
                sessionStorage.setItem('servicesData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const totalPages = Math.ceil(services.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedServices = services.slice(indexOfFirstItem, indexOfLastItem);

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            const updatedServices = services.map(s => 
                s.id === id ? { ...s, is_active: newStatus } : s
            );
            setServices(updatedServices);
            sessionStorage.setItem('servicesData', JSON.stringify(updatedServices));
            
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services/${id}/status`, { is_active: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                // Backend delete
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services/${id}`);

                // Update UI
                const updatedServices = services.filter(s => s.id !== id);
                setServices(updatedServices);
                sessionStorage.setItem('servicesData', JSON.stringify(updatedServices));

            } catch (error) {
                console.error("Error deleting service:", error);
                alert(error.response?.data?.error || "Failed to delete service. Please try again.");
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Services</h2>
                    <p className="page-subtitle">Manage service offerings and their fees</p>
                </div>
                {canEdit && (
                    <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Service
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Service Name</th>
                                <th>Default Fee</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedServices.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td className="font-medium">{service.service_name}</td>
                                    <td>
                                        <span className="badge">₹ {service.default_fee}</span>
                                    </td>
                                    <td>{service.description || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '500', color: service.is_active ? '#22c55e' : '#ef4444' }}>
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <label className="switch">
                                                <input type="checkbox" checked={service.is_active} onChange={() => handleStatusToggle(service.id, service.is_active)} disabled={!canEdit} />
                                                <span className="slider" style={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                className="btn-action view" 
                                                title="View Details"
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setIsViewModalOpen(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            {canEdit && (
                                                <>
                                                    <button 
                                                        className="btn-action edit" 
                                                        title="Edit Service"
                                                        onClick={() => {
                                                            setSelectedEditService(service);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button className="btn-action delete" title="Delete Service" onClick={() => handleDelete(service.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading services...</td>
                                </tr>
                            ) : paginatedServices.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No services found. Click 'Add Service' to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} 
                    totalItems={services.length} 
                    itemsPerPage={itemsPerPage} 
                />
            </div>

            <AddServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (newServiceData) => {
                    setIsModalOpen(false); // Close instantly
                    try {
                        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`, newServiceData);
                        
                        // Update UI
                        const updatedServices = [response.data, ...services];
                        setServices(updatedServices);
                        sessionStorage.setItem('servicesData', JSON.stringify(updatedServices));
                    } catch (error) {
                        console.error("Error saving service:", error);
                        alert("Failed to save service.");
                    }
                }}
            />

            <ViewServiceModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                service={selectedService}
            />

            <EditServiceModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                service={selectedEditService}
                onSave={async (updatedServiceData) => {
                    setIsEditModalOpen(false); // Close instantly
                    try {
                        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services/${updatedServiceData.id}`, updatedServiceData);
                        
                        // Update UI
                        const updatedServices = services.map(s => 
                            s.id === updatedServiceData.id ? response.data : s
                        );
                        setServices(updatedServices);
                        sessionStorage.setItem('servicesData', JSON.stringify(updatedServices));
                    } catch (error) {
                        console.error("Error updating service:", error);
                        alert("Failed to update service.");
                    }
                }}
            />
        </div>
    );
}

export default Services;
