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

module.exports = { getServices, updateServiceStatus };
