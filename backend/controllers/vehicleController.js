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

const createVehicle = async (req, res) => {
    try {
        const { customer_id, vehicle_number, vehicle_type, chassis_number, engine_number, registration_date, driver_name, driver_mobile, is_active } = req.body;
        
        let data = { 
            customer_id: BigInt(customer_id),
            vehicle_number, 
            vehicle_type, 
            chassis_number, 
            engine_number, 
            driver_name, 
            driver_mobile,
            is_active: is_active ?? true
        };
        
        if (registration_date) {
            data.registration_date = new Date(registration_date);
        }

        const newVehicle = await prisma.vehicles.create({
            data,
            include: { customers: { select: { name: true } } }
        });
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateVehicleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const updatedVehicle = await prisma.vehicles.update({
            where: { id: BigInt(id) },
            data: { is_active },
            include: { customers: { select: { name: true } } }
        });
        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicle_number, vehicle_type, chassis_number, engine_number, registration_date, driver_name, driver_mobile } = req.body;
        
        let updateData = { vehicle_number, vehicle_type, chassis_number, engine_number, driver_name, driver_mobile };
        if (registration_date) {
            updateData.registration_date = new Date(registration_date);
        }

        const updatedVehicle = await prisma.vehicles.update({
            where: { id: BigInt(id) },
            data: updateData,
            include: { customers: { select: { name: true } } }
        });
        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vehicles.delete({
            where: { id: BigInt(id) }
        });
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getVehicles, createVehicle, updateVehicleStatus, updateVehicle, deleteVehicle };