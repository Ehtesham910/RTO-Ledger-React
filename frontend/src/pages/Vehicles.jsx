import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/vehicles.css'; 

function Vehicles(){
    // State initialize karte waqt hi LocalStorage se purana data nikal lenge
    const [vehicles, setVehicles] = useState(() => {
        const savedData = localStorage.getItem('vehiclesData');
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() =>{
        // Backend se data la rahe hain
        axios.get('http://localhost:5000/api/vehicles')
            .then((response) =>{
                // Naya data aate hi screen par update karein
                setVehicles(response.data);
                // Agli baar ke liye naya data browser me save kar lein
                localStorage.setItem('vehiclesData', JSON.stringify(response.data));
            })
            .catch((error)=>{
                console.error("Error fetching vehicles:", error);
            });
    }, []);

    // Status toggle logic
    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            const updatedVehicles = vehicles.map(v => 
                v.id === id ? { ...v, is_active: newStatus } : v
            );
            setVehicles(updatedVehicles);
            localStorage.setItem('vehiclesData', JSON.stringify(updatedVehicles));
            
            // Backend update
            await axios.put(`http://localhost:5000/api/vehicles/${id}/status`, { is_active: newStatus });
            
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Date format karne ke liye chota sa function
    const formatDate = (dateString)=>{
        if(!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); // Indian date format
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Vehicles</h2>
                    <p className="page-subtitle">Manage all registered vehicles and their details</p>           
                </div>
                 <button className="btn-add">
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
                                    <th>Customer Name</th>
                                    <th>Vehicle No.</th>
                                    <th>Type</th>
                                    <th>Chassis No.</th>
                                    <th>Engine No.</th>
                                    <th>Reg. Date</th>
                                    <th>Driver Details</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle, index) => (
                                    <tr key={vehicle.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="font-medium" style={{ color: '#0f172a' }}>
                                                {vehicle.customers?.name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge font-medium">{vehicle.vehicle_number}</span>
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
                                                    <input type="checkbox" checked={vehicle.is_active} onChange={() => handleStatusToggle(vehicle.id, vehicle.is_active)} />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                        </td>
                                        
                                        <td className="text-right">
                                            <button className="btn-action edit" title="Edit Vehicle">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                
                                {vehicles.length === 0 && (
                                    <tr>
                                        <td colSpan="10" className="empty-state">
                                            No vehicles found. Click 'Add Vehicle' to register one.
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
export default Vehicles;