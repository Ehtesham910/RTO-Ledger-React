import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/serviceRequests.css';
import ViewServiceRequestModal from '../components/modals/ViewServiceRequestModal';
import AddServiceRequestModal from '../components/modals/AddServiceRequestModal';
import EditServiceRequestModal from '../components/modals/EditServiceRequestModal';
import Pagination from '../components/Pagination';

function ServiceRequests() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedEditRequest, setSelectedEditRequest] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const canEdit = ['Admin', 'Operator'].includes(user.role);

    const [requests, setRequests] = useState(() => {
        const savedData = sessionStorage.getItem('serviceRequestsData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [loading, setLoading] = useState(!sessionStorage.getItem('serviceRequestsData'));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Fetch Service Requests from backend
        axios.get('http://localhost:5000/api/servicerequests')
            .then((response) => {
                setRequests(response.data);
                sessionStorage.setItem('serviceRequestsData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching service requests:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

    // Date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN'); 
    }

    const getNextRequestNo = () => {
        if (!requests || requests.length === 0) return 'REQ-0001';
        let maxNum = 0;
        requests.forEach(r => {
            if (r.request_no) {
                const numMatch = String(r.request_no).match(/\d+/);
                if (numMatch) {
                    const numPart = parseInt(numMatch[0], 10);
                    if (numPart > maxNum) maxNum = numPart;
                }
            }
        });
        if (maxNum === 0) maxNum = requests.length;
        return `REQ-${(maxNum + 1).toString().padStart(4, '0')}`;
    };

    const nextRequestNo = getNextRequestNo();

    const formatVehicleNumber = (vNum) => {
        if (!vNum) return '-';
        const clean = vNum.replace(/\s+/g, '').toUpperCase();
        const match = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);
        if (match) {
            return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        }
        return vNum; 
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/servicerequests/${id}`, { status: newStatus });
            const updatedRequests = requests.map(req => req.id === id ? {...req, status: newStatus} : req);
            setRequests(updatedRequests);
            sessionStorage.setItem('serviceRequestsData', JSON.stringify(updatedRequests));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service request?")) {
            try {
                await axios.delete(`http://localhost:5000/api/servicerequests/${id}`);
                const updatedRequests = requests.filter(req => req.id !== id);
                setRequests(updatedRequests);
                sessionStorage.setItem('serviceRequestsData', JSON.stringify(updatedRequests));
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    console.error("Error deleting service request:", error);
                    alert("Failed to delete service request.");
                }
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Service Requests</h2>
                    <p className="page-subtitle">Manage all customer service requests and their status</p>
                </div>
                {canEdit && (
                    <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create Request
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Request No.</th>
                                <th>Customer Name</th>
                                <th>Vehicle No.</th>
                                <th>Service</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRequests.map((req, index) => (
                                <tr key={req.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td><span className="badge">{req.request_no || '-'}</span></td>
                                    
                                    <td className="font-medium" style={{ color: '#0f172a' }}>
                                        {req.customers?.name || 'Unknown'}
                                    </td>
                                    
                                    <td>
                                        <span className="badge" style={{ whiteSpace: 'nowrap' }}>
                                            {formatVehicleNumber(req.vehicles?.vehicle_number)}
                                        </span>
                                    </td>
                                    
                                    <td>{req.services?.service_name || '-'}</td>
                                    
                                    <td>
                                        <span style={{ fontWeight: '500' }}>
                                            {req.amount ? `₹ ${req.amount}` : '-'}
                                        </span>
                                    </td>
                                    
                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            backgroundColor: 
                                                req.status === 'Completed' ? '#dcfce7' : 
                                                req.status === 'In Progress' ? '#dbeafe' : 
                                                req.status === 'Cancelled' ? '#fee2e2' : 
                                                '#fef9c3',
                                            color: 
                                                req.status === 'Completed' ? '#166534' : 
                                                req.status === 'In Progress' ? '#1e40af' : 
                                                req.status === 'Cancelled' ? '#991b1b' : 
                                                '#854d0e'
                                        }}>
                                            {req.status || 'Pending'}
                                        </span>
                                    </td>

                                    <td>{formatDate(req.created_at)}</td>
                                    
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                className="btn-action view" 
                                                title="View Details"
                                                onClick={() => {
                                                    setSelectedRequest(req);
                                                    setIsViewModalOpen(true);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            {canEdit && (
                                                <>
                                                    <button 
                                                        className="btn-action edit" 
                                                        title="Edit Request"
                                                        onClick={() => {
                                                            setSelectedEditRequest(req);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button 
                                                        className="btn-action delete" 
                                                        title="Delete Request" 
                                                        onClick={() => handleDelete(req.id)}
                                                    >
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
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Loading service requests...</td>
                                </tr>
                            ) : paginatedRequests.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="empty-state">
                                        No service requests found. Click 'Create Request' to generate one.
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
                    totalItems={requests.length} 
                    itemsPerPage={itemsPerPage} 
                />
            </div>

            <AddServiceRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                nextRequestNo={nextRequestNo}
                onSave={async (newRequestData) => {
                    setIsModalOpen(false); // Close instantly
                    try {
                        const response = await axios.post('http://localhost:5000/api/servicerequests', newRequestData);
                        
                        // Update UI
                        const updatedRequests = [response.data, ...requests];
                        setRequests(updatedRequests);
                        sessionStorage.setItem('serviceRequestsData', JSON.stringify(updatedRequests));
                    } catch (error) {
                        console.error("Error saving service request:", error);
                        alert("Failed to create service request.");
                    }
                }}
            />

            <ViewServiceRequestModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                request={selectedRequest}
            />

            <EditServiceRequestModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                request={selectedRequest}
                onSave={async (updatedData) => {
                    setIsEditModalOpen(false); // Close instantly
                    try {
                        const response = await axios.put(`http://localhost:5000/api/servicerequests/${updatedData.id}`, updatedData);
                        
                        // Update UI
                        const updatedRequests = requests.map(req => 
                            req.id === updatedData.id ? response.data : req
                        );
                        setRequests(updatedRequests);
                        sessionStorage.setItem('serviceRequestsData', JSON.stringify(updatedRequests));
                    } catch (error) {
                        console.error("Error updating service request:", error);
                        alert("Failed to update service request.");
                    }
                }}
            />
        </div>
    );
}

export default ServiceRequests;
