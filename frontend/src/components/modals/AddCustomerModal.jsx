import React from 'react';
// Yahan CSS file ka path dhyan se check kar lein
import '../../assets/css/addCustomerModal.css'; 

const AddCustomerModal = ({ isOpen, onClose, onSave, nextCode }) => {
    // Agar modal open nahi hai toh kuch render mat karo
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const formData = new FormData(e.target);
        const newCustomer = {
            customer_code: nextCode,
            name: formData.get('name'),
            mobile: formData.get('mobile'),
            email: formData.get('email'),
            address: formData.get('address'),
            is_active: true
        };
        onSave(newCustomer); 
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
                            <input type="text" placeholder="Enter Customer Name" required name="name" />
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
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea rows="4" placeholder="Enter Address" name="address"></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="save-btn">Save Customer</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddCustomerModal;
