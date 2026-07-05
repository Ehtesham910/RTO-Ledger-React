const prisma = require('../prismaClient');

const getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customers.findMany({
            orderBy: {
                id: 'desc'
            }
        }); 
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createCustomer = async (req, res) => {
    try {
        const { customer_code, name, mobile, email, address, is_active } = req.body;
        const newCustomer = await prisma.customers.create({
            data: {
                customer_code,
                name,
                mobile,
                email,
                address,
                is_active: is_active ?? true
            }
        });
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const updatedCustomer = await prisma.customers.update({
            where: { id: BigInt(id) },
            data: { is_active }
        });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.customers.delete({
            where: { id: BigInt(id) }
        });
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCustomers, createCustomer, updateCustomerStatus, deleteCustomer };
