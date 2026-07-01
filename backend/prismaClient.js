const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

// Create a direct connection to your Neon database using pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter
const adapter = new PrismaPg(pool);

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
