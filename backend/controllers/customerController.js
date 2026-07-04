const prisma = require('../prismaClient');

const getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customers.findMany(); // 'customers' is the model from your schema
        res.json(customers);
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

module.exports = { getCustomers, updateCustomerStatus };
