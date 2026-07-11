import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/vehicles.css';
import PortalAddVehicleModal from '../../components/modals/PortalAddVehicleModal';
import PortalEditVehicleModal from '../../components/modals/PortalEditVehicleModal';

function MyVehicles() {
    const [vehicles, setVehicles] = useState(() => {
        const saved = sessionStorage.getItem('portal_vehicles');
        return saved ? JSON.parse(saved) : [];
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditVehicle, setSelectedEditVehicle] = useState(null);
    const [loading, setLoading] = useState(!sessionStorage.getItem('portal_vehicles'));
    
    const fetchVehicles = () => {
        axios.get('http://localhost:5000/api/portal/vehicles')
            .then(res => {
                setVehicles(res.data);
                sessionStorage.setItem('portal_vehicles', JSON.stringify(res.data));
            })
            .catch(err => console.error("Error fetching vehicles:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await axios.delete(`http://localhost:5000/api/portal/vehicles/${id}`);
                setVehicles(vehicles.filter(v => v.id !== id));
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert("Failed to delete vehicle.");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">My Vehicles</h2>
                    <p className="page-subtitle">Manage your registered vehicles</p>
                </div>
                <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Vehicle
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Vehicle Number</th>
                                <th>Type</th>
                                <th>Chassis Number</th>
                                <th>Engine Number</th>
                                <th>Registration Date</th>
                                <th>Driver Details</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v, idx) => (
                                <tr key={v.id}>
                                    <td>{idx + 1}</td>
                                    <td style={{ fontWeight: '600', color: '#0f172a' }}>{v.vehicle_number}</td>
                                    <td>{v.vehicle_type}</td>
                                    <td>{v.chassis_number || '-'}</td>
                                    <td>{v.engine_number || '-'}</td>
                                    <td>{formatDate(v.registration_date)}</td>
                                    <td>
                                        {v.driver_name ? (
                                            <div>
                                                <div>{v.driver_name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{v.driver_mobile}</div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                className="btn-action edit" 
                                                title="Edit"
                                                onClick={() => {
                                                    setSelectedEditVehicle(v);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="btn-action delete" title="Delete Vehicle" onClick={() => handleDelete(v.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        Loading vehicles...
                                    </td>
                                </tr>
                            ) : vehicles.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        No vehicles found. Click 'Add Vehicle' to register one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PortalAddVehicleModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    fetchVehicles();
                }} 
            />

            <PortalEditVehicleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                vehicle={selectedEditVehicle}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    fetchVehicles();
                }}
            />
        </div>
    );
}

export default MyVehicles;
