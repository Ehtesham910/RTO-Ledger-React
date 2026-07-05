import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/services.css';

function Services() {
    const [services, setServices] = useState(() => {
        const savedData = localStorage.getItem('servicesData');
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/services')
            .then((response) => {
                setServices(response.data);
                localStorage.setItem('servicesData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
            });
    }, []);

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            const updatedServices = services.map(s => 
                s.id === id ? { ...s, is_active: newStatus } : s
            );
            setServices(updatedServices);
            localStorage.setItem('servicesData', JSON.stringify(updatedServices));
            
            await axios.put(`http://localhost:5000/api/services/${id}/status`, { is_active: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Services</h2>
                    <p className="page-subtitle">Manage service offerings and their fees</p>
                </div>
                <button className="btn-add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Service
                </button>
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
                            {services.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
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
                                                <input type="checkbox" checked={service.is_active} onChange={() => handleStatusToggle(service.id, service.is_active)} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button className="btn-action view" title="View Details">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            <button className="btn-action edit" title="Edit Service">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="btn-action delete" title="Delete Service" onClick={() => console.log('Delete', service.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {services.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No services found. Click 'Add Service' to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Services;
