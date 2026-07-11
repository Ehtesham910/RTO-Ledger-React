import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/servicerequests.css';

function MyServiceRequests() {
    const [requests, setRequests] = useState(() => {
        const saved = sessionStorage.getItem('portal_requests');
        return saved ? JSON.parse(saved) : [];
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // For Add Modal
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        vehicle_id: '',
        service_id: '',
        amount: '',
        remarks: ''
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('portal_requests'));

    const fetchRequests = () => {
        axios.get('http://localhost:5000/api/portal/service-requests')
            .then(res => {
                setRequests(res.data);
                sessionStorage.setItem('portal_requests', JSON.stringify(res.data));
            })
            .catch(err => console.error("Error fetching requests:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openAddModal = async () => {
        try {
            const [vehRes, srvRes] = await Promise.all([
                axios.get('http://localhost:5000/api/portal/vehicles'),
                axios.get('http://localhost:5000/api/portal/active-services')
            ]);
            setVehicles(vehRes.data.filter(v => v.is_active));
            setServices(srvRes.data);
            setIsAddModalOpen(true);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            alert("Failed to load form data");
        }
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const selectedService = services.find(s => s.id.toString() === serviceId);
        setFormData({
            ...formData,
            service_id: serviceId,
            amount: selectedService ? selectedService.default_fee : ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/portal/service-requests', formData);
            setIsAddModalOpen(false);
            setFormData({ vehicle_id: '', service_id: '', amount: '', remarks: '' });
            fetchRequests();
        } catch (error) {
            console.error("Error adding request:", error);
            alert("Failed to add service request.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">My Service Requests</h2>
                    <p className="page-subtitle">Track and request services for your vehicles</p>
                </div>
                <button className="btn-add" onClick={openAddModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Request
                </button>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Request No</th>
                                <th>Vehicle</th>
                                <th>Service</th>
                                <th>Fee</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, idx) => (
                                <tr key={req.id}>
                                    <td>{idx + 1}</td>
                                    <td style={{ fontWeight: '600', color: '#4f46e5' }}>{req.request_no}</td>
                                    <td>{req.vehicles?.vehicle_number}</td>
                                    <td>{req.services?.service_name}</td>
                                    <td>{formatCurrency(req.amount)}</td>
                                    <td>{formatDate(req.created_at)}</td>
                                    <td>
                                        <span className={`status-badge status-${(req.status || 'pending').toLowerCase()}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {loading ? null : requests.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                        No service requests found. Click 'New Request' to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Request Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>New Service Request</h2>
                            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
                        </div>
                        
                        <form onSubmit={handleAddRequest}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Select Vehicle *</label>
                                    <select name="vehicle_id" value={formData.vehicle_id} onChange={handleInputChange} required>
                                        <option value="">-- Select Vehicle --</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>{v.vehicle_number}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Select Service *</label>
                                    <select name="service_id" value={formData.service_id} onChange={handleServiceChange} required>
                                        <option value="">-- Select Service --</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.service_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Agreed Fee (₹) *</label>
                                    <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Remarks / Instructions</label>
                                    <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} rows="3" placeholder="Any specific instructions..."></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyServiceRequests;
