const prisma = require('../prismaClient');

// Helper for BigInt serialization
BigInt.prototype.toJSON = function () { return this.toString(); };

const globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.json({ customers: [], vehicles: [], serviceRequests: [], receipts: [] });
        }

        const query = q.trim();
        const lowerQuery = query.toLowerCase();

        // 1. Find matching customers
        const customers = await prisma.customers.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { mobile: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { customer_code: { contains: query, mode: 'insensitive' } }
                ]
            }
        });

        const customerIds = customers.map(c => c.id);

        // 2. Find matching vehicles (by search term OR belonging to matched customers)
        const vehicles = await prisma.vehicles.findMany({
            where: {
                OR: [
                    { vehicle_number: { contains: query, mode: 'insensitive' } },
                    { chassis_number: { contains: query, mode: 'insensitive' } },
                    { engine_number: { contains: query, mode: 'insensitive' } },
                    { driver_name: { contains: query, mode: 'insensitive' } },
                    ...(customerIds.length > 0 ? [{ customer_id: { in: customerIds } }] : [])
                ]
            },
            include: { customers: { select: { name: true } } }
        });

        // 3. Find matching service requests (by request_no OR belonging to matched customers)
        const serviceRequests = await prisma.service_requests.findMany({
            where: {
                OR: [
                    { request_no: { contains: query, mode: 'insensitive' } },
                    ...(customerIds.length > 0 ? [{ customer_id: { in: customerIds } }] : [])
                ]
            },
            include: { 
                customers: { select: { name: true } },
                vehicles: { select: { vehicle_number: true } },
                services: { select: { service_name: true } }
            }
        });

        // 4. Find matching receipts (by receipt_no OR transaction ref OR belonging to matched customers via ledger)
        const receipts = await prisma.receipts.findMany({
            where: {
                OR: [
                    { receipt_no: { contains: query, mode: 'insensitive' } },
                    { transaction_reference: { contains: query, mode: 'insensitive' } },
                    ...(customerIds.length > 0 ? [{ ledgers: { customer_id: { in: customerIds } } }] : [])
                ]
            },
            include: {
                ledgers: {
                    include: {
                        customers: { select: { name: true } },
                        vehicles: { select: { vehicle_number: true } },
                        service_requests: { include: { services: true } }
                    }
                }
            }
        });

        res.json({
            customers,
            vehicles,
            serviceRequests,
            receipts
        });

    } catch (error) {
        console.error("Error in global search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    globalSearch
};
