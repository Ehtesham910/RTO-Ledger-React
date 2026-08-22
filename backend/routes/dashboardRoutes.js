const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// Get Dashboard Statistics
router.get("/stats", async (req, res) => {
  try {
    const totalCustomers = await prisma.customers.count();
    const totalVehicles = await prisma.vehicles.count();
    const totalServices = await prisma.services.count();
    const totalRequests = await prisma.service_requests.count();
    const totalUsers = await prisma.users.count();

    const pendingJobs = await prisma.service_requests.count({
      where: { status: { notIn: ["Completed", "Done"] } },
    });

    const completedJobs = await prisma.service_requests.count({
      where: { status: { in: ["Completed", "Done"] } },
    });

    // Today's Requests
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaysRequests = await prisma.service_requests.count({
      where: {
        created_at: {
          gte: startOfToday,
        },
      },
    });

    // Revenue and Dues
    const ledgersAggr = await prisma.ledgers.aggregate({
      _sum: {
        amount_paid: true,
        due_amount: true,
      },
    });

    const totalRevenue = ledgersAggr._sum.amount_paid || 0;
    const totalDueAmount = ledgersAggr._sum.due_amount || 0;

    // Monthly chart data for the current calendar year.
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const recentRequests = await prisma.service_requests.findMany({
      where: { created_at: { gte: yearStart } },
      select: { created_at: true },
    });

    const recentCustomers = await prisma.customers.findMany({
      where: { created_at: { gte: yearStart } },
      select: { created_at: true },
    });

    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const requestsByMonth = {};
    const customersByMonth = {};

    for (let month = 0; month < 12; month++) {
      const monthLabel = monthFormatter.format(new Date(currentYear, month, 1));
      requestsByMonth[monthLabel] = 0;
      customersByMonth[monthLabel] = 0;
    }

    recentRequests.forEach((r) => {
      if (r.created_at) {
        const monthLabel = monthFormatter.format(r.created_at);
        if (requestsByMonth[monthLabel] !== undefined)
          requestsByMonth[monthLabel]++;
      }
    });

    recentCustomers.forEach((c) => {
      if (c.created_at) {
        const monthLabel = monthFormatter.format(c.created_at);
        if (customersByMonth[monthLabel] !== undefined)
          customersByMonth[monthLabel]++;
      }
    });

    const chartRequests = Object.keys(requestsByMonth).map((month) => ({
      date: month,
      count: requestsByMonth[month],
    }));
    const chartCustomers = Object.keys(customersByMonth).map((month) => ({
      date: month,
      count: customersByMonth[month],
    }));

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
      chartCustomers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
