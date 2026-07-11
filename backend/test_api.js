const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'RTO_LEDGER_SUPER_SECRET_KEY_12345';

async function main() {
    // Generate a mock token for customer ID 3
    const token = jwt.sign({ id: '3', role: 'Customer', name: 'Test Customer' }, SECRET_KEY);
    
    try {
        const response = await axios.get('http://localhost:5000/api/portal/receipts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
    } catch(err) {
        console.error(err.response ? err.response.data : err.message);
    }
}
main();
