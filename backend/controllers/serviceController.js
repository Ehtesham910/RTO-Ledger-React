const prisma = require("../prismaClient");

const getServices = async(req,res) => {
    try{
        const services = await prisma.services.findMany();
        res.json(services);
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

const updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const updatedService = await prisma.services.update({
            where: { id: BigInt(id) },
            data: { is_active }
        });
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createService = async (req, res) => {
    try {
        const { service_name, default_fee, description, is_active } = req.body;
        const newService = await prisma.services.create({
            data: {
                service_name,
                default_fee: default_fee ? parseFloat(default_fee) : 0,
                description,
                is_active: is_active ?? true
            }
        });
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { service_name, default_fee, description } = req.body;
        
        const updatedService = await prisma.services.update({
            where: { id: BigInt(id) },
            data: { 
                service_name, 
                default_fee: default_fee ? parseFloat(default_fee) : 0, 
                description 
            }
        });
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getServices, updateServiceStatus, createService, updateService };
