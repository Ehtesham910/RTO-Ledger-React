const prisma = require("../prismaClient");

const getVehicles = async(req,res) => {
    try{
        const vehicles = await prisma.vehicles.findMany({
            include: {
                customers: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.json(vehicles);
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

const updateVehicleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const updatedVehicle = await prisma.vehicles.update({
            where: { id: BigInt(id) },
            data: { is_active }
        });
        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getVehicles, updateVehicleStatus };