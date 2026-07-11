import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/customers.css';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import ViewCustomerModal from '../components/modals/ViewCustomerModal';
import EditCustomerModal from '../components/modals/EditCustomerModal';
import Pagination from '../components/Pagination';

function Customers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditCustomer, setSelectedEditCustomer] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const canEdit = ['Admin', 'Operator', 'Agent'].includes(user.role);

    const [customers, setCustomers] = useState(() => {
        const savedData = sessionStorage.getItem('customersData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [filteredCustomers, setFilteredCustomers] = useState(() => {
        const savedData = sessionStorage.getItem('customersData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(!sessionStorage.getItem('customersData'));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Backend se data la rahe hain
        axios.get('http://localhost:5000/api/customers')
            .then((response) => {
                setCustomers(response.data);
                setFilteredCustomers(response.data);
                sessionStorage.setItem('customersData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching customers:", error);
            })
            .finally(() => {
                setLoading(false);
            });

        const handleGlobalSearch = (e) => {
            setSearchQuery(e.detail.toLowerCase());
        };
        window.addEventListener('globalSearch', handleGlobalSearch);
        return () => window.removeEventListener('globalSearch', handleGlobalSearch);
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredCustomers(customers);
        } else {
            const lowerQ = searchQuery.toLowerCase();
            setFilteredCustomers(customers.filter(c => 
                (c.name && c.name.toLowerCase().includes(lowerQ)) ||
                (c.mobile && c.mobile.toLowerCase().includes(lowerQ)) ||
                (c.email && c.email.toLowerCase().includes(lowerQ)) ||
                (c.customer_code && c.customer_code.toLowerCase().includes(lowerQ))
            ));
        }
        setCurrentPage(1);
    }, [searchQuery, customers]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    // Status toggle logic
    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;

            // Instantly update UI (Optimistic update)
            const updatedCustomers = customers.map(c =>
                c.id === id ? { ...c, is_active: newStatus } : c
            );
            setCustomers(updatedCustomers);
            sessionStorage.setItem('customersData', JSON.stringify(updatedCustomers));

            // Backend update
            await axios.put(`http://localhost:5000/api/customers/${id}/status`, { is_active: newStatus });

        } catch (error) {
            console.error("Error updating status:", error);
            // Agar API fail hui toh wapas purana state set karne ka logic (optional)
        }
    };

    // Delete logic
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                // Backend delete
                await axios.delete(`http://localhost:5000/api/customers/${id}`);

                // Update UI
                const updatedCustomers = customers.filter(c => c.id !== id);
                setCustomers(updatedCustomers);
                sessionStorage.setItem('customersData', JSON.stringify(updatedCustomers));

            } catch (error) {
                console.error("Error deleting customer:", error);
                alert("Failed to delete customer.");
            }
        }
    };

    // Calculate Next Customer Code
    const getNextCustomerCode = () => {
        if (!customers || customers.length === 0) return 'CUST-001';

        let maxNum = 0;
        customers.forEach(c => {
            if (c.customer_code) {
                // Sirf numbers ko extract karega
                const numMatch = String(c.customer_code).match(/\d+/);
                if (numMatch) {
                    const numPart = parseInt(numMatch[0], 10);
                    if (numPart > maxNum) {
                        maxNum = numPart;
                    }
                }
            }
        });

        // Agar pehle se stored customers me koi valid number na mile, 
        // toh array ke length ke hisaab se number dega (eg. 10 customers hain toh maxNum 10 ho jayega)
        if (maxNum === 0) {
            maxNum = customers.length;
        }

        const nextNum = maxNum + 1;
        return `CUST-${nextNum.toString().padStart(3, '0')}`;
    };

    const nextCode = getNextCustomerCode();

    return (
        <div className="page-container">
            {/* Page Header Area */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Customers</h2>
                    <p className="page-subtitle">Manage your clients and their details</p>
                </div>
                {canEdit && (
                    <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Customer
                    </button>
                )}
            </div>

            {/* Table Area */}
            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer Code</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td><span className="badge">{customer.customer_code}</span></td>
                                    <td className="font-medium">{customer.name}</td>
                                    <td>{customer.mobile}</td>
                                    <td>{customer.email || '-'}</td>
                                    <td>{customer.address || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '500', color: customer.is_active ? '#22c55e' : '#ef4444' }}>
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            {canEdit && (
                                                <label className="switch">
                                                    <input type="checkbox" checked={customer.is_active} onChange={() => handleStatusToggle(customer.id, customer.is_active)} />
                                                    <span className="slider"></span>
                                                </label>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                className="btn-action view"
                                                title="View Details"
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
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
                                                            setSelectedEditCustomer(customer);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button className="btn-action delete" title="Delete" onClick={() => handleDelete(customer.id)}>
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
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                                </tr>
                            ) : paginatedCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="empty-state">
                                        No customers found. Click 'Add Customer' to create one.
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
                    totalItems={filteredCustomers.length} 
                    itemsPerPage={itemsPerPage} 
                />
            </div>

            <AddCustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                nextCode={nextCode}
                onSave={async (newCustomerData) => {
                    setIsModalOpen(false); // Close modal instantly
                    try {
                        const response = await axios.post('http://localhost:5000/api/customers', newCustomerData);

                        // Update UI
                        const updatedCustomers = [response.data, ...customers];
                        setCustomers(updatedCustomers);
                        sessionStorage.setItem('customersData', JSON.stringify(updatedCustomers));

                        console.log("Customer saved successfully!", response.data);
                    } catch (error) {
                        console.error("Error saving customer:", error);
                        alert("Failed to save customer. Please check the backend connection.");
                    }
                }}
            />

            <ViewCustomerModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                customer={selectedCustomer}
            />

            <EditCustomerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                customer={selectedEditCustomer}
                onSave={async (updatedCustomerData) => {
                    setIsEditModalOpen(false); // Close modal instantly
                    try {
                        const response = await axios.put(`http://localhost:5000/api/customers/${updatedCustomerData.id}`, updatedCustomerData);
                        
                        // Update UI
                        const updatedCustomers = customers.map(c => 
                            c.id === updatedCustomerData.id ? response.data : c
                        );
                        setCustomers(updatedCustomers);
                        sessionStorage.setItem('customersData', JSON.stringify(updatedCustomers));
                        
                        console.log("Customer updated successfully!", response.data);
                    } catch (error) {
                        console.error("Error updating customer:", error);
                        alert("Failed to update customer. Please check the backend connection.");
                    }
                }}
            />
        </div>
    );
}

export default Customers;
