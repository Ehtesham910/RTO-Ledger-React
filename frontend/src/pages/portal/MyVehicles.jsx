import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/vehicles.css';

function MyVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        vehicle_number: '',
        vehicle_type: '2 Wheeler',
        chassis_number: '',
        engine_number: '',
        registration_date: '',
        driver_name: '',
        driver_mobile: ''
    });

    const fetchVehicles = () => {
        axios.get('http://localhost:5000/api/portal/vehicles')
            .then(res => setVehicles(res.data))
            .catch(err => console.error("Error fetching vehicles:", err));
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/portal/vehicles', formData);
            setIsAddModalOpen(false);
            setFormData({
                vehicle_number: '', vehicle_type: '2 Wheeler', chassis_number: '',
                engine_number: '', registration_date: '', driver_name: '', driver_mobile: ''
            });
            fetchVehicles();
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("Failed to add vehicle.");
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
                                <th>Status</th>
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
                                        <span className={`status-badge ${v.is_active ? 'status-active' : 'status-inactive'}`}>
                                            {v.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.length === 0 && (
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

            {/* Add Vehicle Modal Inline */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Add New Vehicle</h2>
                            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
                        </div>
                        
                        <form onSubmit={handleAddVehicle}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Vehicle Number *</label>
                                        <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleInputChange} required placeholder="e.g. MH 04 AB 1234" />
                                    </div>
                                    <div className="form-group">
                                        <label>Vehicle Type *</label>
                                        <select name="vehicle_type" value={formData.vehicle_type} onChange={handleInputChange} required>
                                            <option value="2 Wheeler">2 Wheeler</option>
                                            <option value="3 Wheeler">3 Wheeler</option>
                                            <option value="4 Wheeler">4 Wheeler</option>
                                            <option value="Heavy Vehicle">Heavy Vehicle</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Chassis Number</label>
                                        <input type="text" name="chassis_number" value={formData.chassis_number} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Engine Number</label>
                                        <input type="text" name="engine_number" value={formData.engine_number} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Registration Date</label>
                                        <input type="date" name="registration_date" value={formData.registration_date} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-divider"><span>Driver Details (Optional)</span></div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Driver Name</label>
                                        <input type="text" name="driver_name" value={formData.driver_name} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Driver Mobile</label>
                                        <input type="text" name="driver_mobile" value={formData.driver_mobile} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyVehicles;
