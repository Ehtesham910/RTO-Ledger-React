const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Get Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        const totalCustomers = await prisma.customers.count();
        const totalVehicles = await prisma.vehicles.count();
        const totalServices = await prisma.services.count();
        const totalRequests = await prisma.service_requests.count();
        const totalUsers = await prisma.users.count();
        
        const pendingJobs = await prisma.service_requests.count({
            where: { status: { notIn: ['Completed', 'Done'] } }
        });
        
        const completedJobs = await prisma.service_requests.count({
            where: { status: { in: ['Completed', 'Done'] } }
        });

        // Today's Requests
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const todaysRequests = await prisma.service_requests.count({
            where: {
                created_at: {
                    gte: startOfToday
                }
            }
        });

        // Revenue and Dues
        const ledgersAggr = await prisma.ledgers.aggregate({
            _sum: {
                amount_paid: true,
                due_amount: true
            }
        });

        const totalRevenue = ledgersAggr._sum.amount_paid || 0;
        const totalDueAmount = ledgersAggr._sum.due_amount || 0;

        // Timeseries Data for Charts (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0,0,0,0);

        const recentRequests = await prisma.service_requests.findMany({
            where: { created_at: { gte: sevenDaysAgo } },
            select: { created_at: true }
        });

        const recentCustomers = await prisma.customers.findMany({
            where: { created_at: { gte: sevenDaysAgo } },
            select: { created_at: true }
        });

        const requestsByDate = {};
        const customersByDate = {};

        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            requestsByDate[dateStr] = 0;
            customersByDate[dateStr] = 0;
        }

        recentRequests.forEach(r => {
            if (r.created_at) {
                const dateStr = r.created_at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                if (requestsByDate[dateStr] !== undefined) requestsByDate[dateStr]++;
            }
        });

        recentCustomers.forEach(c => {
            if (c.created_at) {
                const dateStr = c.created_at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                if (customersByDate[dateStr] !== undefined) customersByDate[dateStr]++;
            }
        });

        const chartRequests = Object.keys(requestsByDate).map(date => ({ date, count: requestsByDate[date] }));
        const chartCustomers = Object.keys(customersByDate).map(date => ({ date, count: customersByDate[date] }));

        res.json({
            totalCustomers,
            totalVehicles,
            totalServices,
            totalRequests,
            totalUsers,
            pendingJobs,
            completedJobs,
            todaysRequests,
            totalRevenue,
            totalDueAmount,
            chartRequests,
            chartCustomers
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
