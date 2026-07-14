import React, { useState } from 'react';
// Yahan CSS file ka path dhyan se check kar lein
import '../../assets/css/addCustomerModal.css'; 

const AddCustomerModal = ({ isOpen, onClose, onSave, nextCode, agents }) => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        agent_id: ''
    });

    // Agar modal open nahi hai toh kuch render mat karo
    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const newCustomer = {
            customer_code: nextCode,
            ...formData,
            is_active: true
        };
        onSave(newCustomer); 
        // Reset form
        setFormData({ name: '', mobile: '', email: '', address: '', agent_id: '' });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                {/* Header Section */}
                <div className="modal-header">
                    <h2>Add New Customer</h2>
                    <button type="button" className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Customer Code</label>
                            <input type="text" value={nextCode || ""} readOnly name="customer_code" />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter Customer Name" required name="name" value={formData.name} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input 
                                type="tel" 
                                name="mobile"
                                pattern="[0-9]{10}" 
                                maxLength="10" 
                                placeholder="Enter 10-digit Mobile Number" 
                                title="Mobile number must be exactly 10 digits"
                                required 
                                value={formData.mobile} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Enter Email" 
                                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                title="Please enter a valid email address (e.g., name@gmail.com)"
                                value={formData.email} 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange}
                            placeholder="Enter full address"
                            rows="2"
                        ></textarea>
                    </div>
                    
                    {isAdmin && (
                        <div className="form-group full-width">
                            <label>Assign Agent (Optional)</label>
                            <select 
                                name="agent_id" 
                                value={formData.agent_id} 
                                onChange={handleChange}
                                className="form-control"
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">-- No Agent (Self / Admin) --</option>
                                {agents && agents.map(agent => (
                                    <option key={agent.id} value={agent.id}>{agent.username}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Save Customer</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddCustomerModal;
