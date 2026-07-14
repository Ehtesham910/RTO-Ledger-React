const prisma = require('../prismaClient');

const getCustomers = async (req, res) => {
    try {
        let whereClause = {};
        if (req.user.role === 'Agent') {
            whereClause = { agent_id: BigInt(req.user.id) };
        }

        const customers = await prisma.customers.findMany({
            where: whereClause,
            orderBy: {
                id: 'desc'
            },
            include: {
                agent: {
                    select: { username: true }
                }
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customers.findUnique({
            where: { id: BigInt(id) }
        });
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const createCustomer = async (req, res) => {
    try {
        const { name, mobile, email, address, is_active, agent_id } = req.body;
        
        let finalAgentId = null;
        if (req.user.role === 'Agent') {
            finalAgentId = BigInt(req.user.id);
        } else if (req.user.role === 'Admin' && agent_id) {
            finalAgentId = BigInt(agent_id);
        }

        const lastCustomer = await prisma.customers.findFirst({ orderBy: { id: 'desc' } });
        let newCustomerCode = 'CUST-0001';
        if (lastCustomer) {
            const numMatch = String(lastCustomer.customer_code).match(/\d+/);
            if (numMatch) {
                newCustomerCode = `CUST-${(parseInt(numMatch[0], 10) + 1).toString().padStart(4, '0')}`;
            } else {
                newCustomerCode = `CUST-${Date.now()}`;
            }
        }

        const newCustomer = await prisma.customers.create({
            data: {
                customer_code: newCustomerCode,
                name,
                mobile,
                email,
                address,
                is_active: is_active ?? true,
                agent_id: finalAgentId
            },
            include: {
                agent: {
                    select: { username: true }
                }
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

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile, email, address, agent_id } = req.body;
        
        const dataToUpdate = { name, mobile, email, address };
        if (req.user.role === 'Admin' && agent_id !== undefined) {
            dataToUpdate.agent_id = agent_id ? BigInt(agent_id) : null;
        }

        const updatedCustomer = await prisma.customers.update({
            where: { id: BigInt(id) },
            data: dataToUpdate,
            include: {
                agent: {
                    select: { username: true }
                }
            }
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

const getNextCustomerCode = async (req, res) => {
    try {
        const lastCustomer = await prisma.customers.findFirst({ orderBy: { id: 'desc' } });
        if (!lastCustomer) {
            return res.json({ nextCode: 'CUST-0001' });
        }
        const numMatch = String(lastCustomer.customer_code).match(/\d+/);
        if (numMatch) {
            return res.json({ nextCode: `CUST-${(parseInt(numMatch[0], 10) + 1).toString().padStart(4, '0')}` });
        }
        return res.json({ nextCode: `CUST-${Date.now()}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomerStatus, updateCustomer, deleteCustomer, getNextCustomerCode };
