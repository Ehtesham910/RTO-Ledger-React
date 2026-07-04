import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/customers.css';

function Customers() {
    const [customers, setCustomers] = useState(() => {
        const savedData = localStorage.getItem('customersData');
        return savedData ? JSON.parse(savedData) : [];
    });


    useEffect(() => {
        // Backend se data la rahe hain
        axios.get('http://localhost:5000/api/customers')
            .then((response) => {
                setCustomers(response.data);
                localStorage.setItem('customersData', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error fetching customers:", error);
            });
    }, []);

    // Status toggle logic
    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            // Instantly update UI (Optimistic update)
            const updatedCustomers = customers.map(c => 
                c.id === id ? { ...c, is_active: newStatus } : c
            );
            setCustomers(updatedCustomers);
            localStorage.setItem('customersData', JSON.stringify(updatedCustomers));
            
            // Backend update
            await axios.put(`http://localhost:5000/api/customers/${id}/status`, { is_active: newStatus });
            
        } catch (error) {
            console.error("Error updating status:", error);
            // Agar API fail hui toh wapas purana state set karne ka logic (optional)
        }
    };

    return (
        <div className="page-container">
            {/* Page Header Area */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Customers</h2>
                    <p className="page-subtitle">Manage your clients and their details</p>
                </div>
                <button className="btn-add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Customer
                </button>
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
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>{index + 1}</td>
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
                                            <label className="switch">
                                                <input type="checkbox" checked={customer.is_active} onChange={() => handleStatusToggle(customer.id, customer.is_active)} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <button className="btn-action edit" title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button className="btn-action view" title="View Vehicles">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="empty-state">
                                        No customers found. Click 'Add Customer' to create one.
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

export default Customers;
