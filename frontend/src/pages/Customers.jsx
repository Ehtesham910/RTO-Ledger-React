import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
    // 1. STATE BANANA (Dabba tayar karna)
    // 'customers' me data rahega, 'setCustomers' se hum data dalenge. Shuru me dabba khali [] hai.
    const [customers, setCustomers] = useState([]);

    // 2. USEEFFECT BANANA (Automatic data laana)
    useEffect(() => {
        // Axios ko backend ka address dena
        axios.get('http://localhost:5000/api/customers')
            .then((response) => {
                // Jab backend se JSON data mil jaye, toh use dabbe me daal do
                setCustomers(response.data);
            })
            .catch((error) => {
                console.log("Error aa gaya:", error);
            });
    }, []); // Ye khali [] ka matlab hai ki API sirf ek baar call hogi jab page khulega.

    // 3. UI (Screen par dikhana)
    return (
        <div>
            <h2>Customers List</h2>
            
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Loop chala kar har customer ka data table me dikhana */}
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.mobile}</td>
                            <td>{customer.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Customers;
