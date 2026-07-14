import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/vehicles.css'; 
import AddVehicleModal from '../components/modals/AddVehicleModal';
import ViewVehicleModal from '../components/modals/ViewVehicleModal';
import EditVehicleModal from '../components/modals/EditVehicleModal';
import Pagination from '../components/Pagination';

function Vehicles(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditVehicle, setSelectedEditVehicle] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const permissions = user.permissions || [];
    const canCreate = permissions.includes('vehicle.create');
    const canEdit = permissions.includes('vehicle.edit');

    // State initialize karte waqt hi LocalStorage se purana data nikal lenge
    const [vehicles, setVehicles] = useState(() => {
        const savedData = sessionStorage.getItem('vehiclesData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [filteredVehicles, setFilteredVehicles] = useState(() => {
        const savedData = sessionStorage.getItem('vehiclesData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(!sessionStorage.getItem('vehiclesData'));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() =>{
        // Backend se data la rahe hain
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`)
            .then((response) =>{
                // Naya data aate hi screen par update karein
                setVehicles(response.data);
                setFilteredVehicles(response.data);
                // Agli baar ke liye naya data browser me save kar lein
                sessionStorage.setItem('vehiclesData', JSON.stringify(response.data));
            })
            .catch((error)=>{
                console.error("Error fetching vehicles:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredVehicles(vehicles);
        } else {
            const lowerQ = searchQuery.toLowerCase();
            setFilteredVehicles(vehicles.filter(v => 
                (v.vehicle_number && v.vehicle_number.toLowerCase().includes(lowerQ)) ||
                (v.customers?.name && v.customers.name.toLowerCase().includes(lowerQ)) ||
                (v.chassis_number && v.chassis_number.toLowerCase().includes(lowerQ)) ||
                (v.engine_number && v.engine_number.toLowerCase().includes(lowerQ))
            ));
        }
        setCurrentPage(1);
    }, [searchQuery, vehicles]);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

    // Status toggle logic
    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            const updatedVehicles = vehicles.map(v => 
                v.id === id ? { ...v, is_active: newStatus } : v
            );
            setVehicles(updatedVehicles);
            sessionStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles));
            
            // Backend update
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles/${id}/status`, { is_active: newStatus });
            
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Delete logic
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                // Backend delete
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles/${id}`);

                // Update UI
                const updatedVehicles = vehicles.filter(v => v.id !== id);
                setVehicles(updatedVehicles);
                sessionStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles));

            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert(error.response?.data?.error || "Failed to delete vehicle. Please try again.");
            }
        }
    };

    // Date format karne ke liye chota sa function
    const formatDate = (dateString)=>{
        if(!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); // Indian date format
    }

    const formatVehicleNumber = (vNum) => {
        if (!vNum) return '-';
        const clean = vNum.replace(/\s+/g, '').toUpperCase();
        const match = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return vNum; // fallback
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Vehicles</h2>
                    <p className="page-subtitle">Manage customer vehicles and their details</p>
                </div>
                {canCreate && (
                    <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Vehicle
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Vehicle No.</th>
                                    <th>Type</th>
                                    <th>Chassis No.</th>
                                    <th>Engine No.</th>
                                    <th>Reg. Date</th>
                                    <th>Driver Details</th>
                                    <th>Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedVehicles.map((vehicle, index) => (
                                    <tr key={vehicle.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>
                                            <div className="font-medium" style={{ color: '#64748b' }}>
                                                {vehicle.customers?.name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ whiteSpace: 'nowrap' }}>{formatVehicleNumber(vehicle.vehicle_number)}</span>
                                        </td>
                                        <td>{vehicle.vehicle_type || '-'}</td>
                                        
                                        {/* Chassis aur Engine no. alag alag columns me */}
                                        <td>{vehicle.chassis_number || '-'}</td>
                                        <td>{vehicle.engine_number || '-'}</td>
                                        
                                        <td>{formatDate(vehicle.registration_date)}</td>
                                        
                                        {/* Driver Name aur Mobile ek hi column me */}
                                        <td>
                                            <div style={{ fontSize: '13px' }}>
                                                <div className="font-medium">{vehicle.driver_name || 'No Driver'}</div>
                                                <div style={{ color: '#666' }}>{vehicle.driver_mobile || ''}</div>
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: '500', color: vehicle.is_active ? '#22c55e' : '#ef4444' }}>
                                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <label className="switch">
                                                    <input type="checkbox" checked={vehicle.is_active} onChange={() => handleStatusToggle(vehicle.id, vehicle.is_active)} disabled={!canEdit} />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                        </td>
                                        
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                                <button 
                                                    className="btn-action view" 
                                                    title="View Details"
                                                    onClick={() => {
                                                        setSelectedVehicle(vehicle);
                                                        setIsViewModalOpen(true);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                                {canEdit && (
                                                    <>
                                                        <button 
                                                            className="btn-action edit" 
                                                            title="Edit"
                                                            onClick={() => {
                                                                setSelectedEditVehicle(vehicle);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                        </button>
                                                        <button className="btn-action delete" title="Delete Vehicle" onClick={() => handleDelete(vehicle.id)}>
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
                                        <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                                    </tr>
                                ) : paginatedVehicles.length === 0 && (
                                    <tr>
                                        <td colSpan="10" className="empty-state">
                                            No vehicles found. Click 'Add Vehicle' to register one.
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
                        totalItems={filteredVehicles.length} 
                        itemsPerPage={itemsPerPage} 
                    />
            </div>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (newVehicleData) => {
                    setIsModalOpen(false); // Close modal instantly
                    try {
                        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`, newVehicleData);
                        
                        // Update UI
                        const updatedVehicles = [response.data, ...vehicles];
                        setVehicles(updatedVehicles);
                        sessionStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles));
                        
                        console.log("Vehicle saved successfully!", response.data);
                    } catch (error) {
                        console.error("Error saving vehicle:", error);
                        alert("Failed to save vehicle. Please check the backend connection.");
                    }
                }}
            />

            <ViewVehicleModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                vehicle={selectedVehicle}
            />

            <EditVehicleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                vehicle={selectedEditVehicle}
                onSave={async (updatedVehicleData) => {
                    setIsEditModalOpen(false); // Close modal instantly
                    try {
                        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles/${updatedVehicleData.id}`, updatedVehicleData);
                        
                        // Update UI
                        const updatedVehicles = vehicles.map(v => 
                            v.id === updatedVehicleData.id ? response.data : v
                        );
                        setVehicles(updatedVehicles);
                        sessionStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles));
                        
                        console.log("Vehicle updated successfully!", response.data);
                    } catch (error) {
                        console.error("Error updating vehicle:", error);
                        alert("Failed to update vehicle. Please check the backend connection.");
                    }
                }}
            />
        </div>
    );
}
export default Vehicles;