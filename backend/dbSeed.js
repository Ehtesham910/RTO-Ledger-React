const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

const standardPermissions = [
  { code: 'customer.create', description: 'Create customer' },
  { code: 'customer.view', description: 'View customer' },
  { code: 'customer.edit', description: 'Edit customer' },
  { code: 'vehicle.create', description: 'Create vehicle' },
  { code: 'vehicle.view', description: 'View vehicle' },
  { code: 'service.create', description: 'Create service request' },
  { code: 'service.view', description: 'View service request' },
  { code: 'ledger.create', description: 'Create ledger entry' },
  { code: 'ledger.view', description: 'View ledger' },
  { code: 'receipt.print', description: 'Print receipt' },
  { code: 'report.view', description: 'View reports' },
  { code: 'user.manage', description: 'Manage users' },
  { code: 'role.manage', description: 'Manage system roles and permissions' },
  { code: 'vehicle.edit', description: 'Edit vehicle' },
  { code: 'service_catalog.create', description: 'Create RTO service' },
  { code: 'service_catalog.edit', description: 'Edit RTO service' },
  { code: 'service_catalog.view', description: 'View RTO service' },
  { code: 'receipt.view', description: 'View receipt' },
  { code: 'service_request.edit', description: 'Edit service request status' }
];

const standardRoles = [
  {
    name: 'Admin',
    description: 'Full system access',
    permissions: [
      'customer.create', 'customer.view', 'customer.edit',
      'vehicle.create', 'vehicle.view', 'vehicle.edit',
      'service.create', 'service.view',
      'ledger.create', 'ledger.view',
      'receipt.print', 'receipt.view',
      'report.view', 'user.manage', 'role.manage',
      'service_catalog.create', 'service_catalog.edit', 'service_catalog.view',
      'service_request.edit'
    ]
  },
  {
    name: 'Operator',
    description: 'Customer and service management',
    permissions: [
      'customer.create', 'customer.view', 'customer.edit',
      'vehicle.create', 'vehicle.view', 'vehicle.edit',
      'service.create', 'service.view',
      'service_catalog.view',
      'service_request.edit'
    ]
  },
  {
    name: 'Accountant',
    description: 'Ledger and receipt management',
    permissions: [
      'customer.view', 'vehicle.view', 'service.view',
      'ledger.create', 'ledger.view',
      'receipt.print', 'receipt.view'
    ]
  },
  {
    name: 'Manager',
    description: 'Reporting and monitoring',
    permissions: [
      'customer.view', 'vehicle.view', 'service.view',
      'ledger.view', 'receipt.view', 'report.view'
    ]
  },
  {
    name: 'Agent',
    description: 'Field agent for customer and service management',
    permissions: [
      'customer.create', 'customer.view', 'customer.edit',
      'vehicle.create', 'vehicle.view', 'vehicle.edit',
      'service.create', 'service.view'
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Seeding strictly standard permissions and roles...');
    
    // Remove extra permissions not in the standard list
    const validCodes = standardPermissions.map(p => p.code);
    await prisma.permissions.deleteMany({
      where: {
        code: { notIn: validCodes }
      }
    });

    // Seed Permissions
    for (const perm of standardPermissions) {
      const existingPerm = await prisma.permissions.findUnique({
        where: { code: perm.code }
      });
      if (!existingPerm) {
        await prisma.permissions.create({
          data: { code: perm.code, description: perm.description }
        });
      }
    }

    // Seed Roles and their permissions
    for (const roleDef of standardRoles) {
      let roleRecord = await prisma.roles.findUnique({
        where: { name: roleDef.name }
      });

      if (!roleRecord) {
        roleRecord = await prisma.roles.create({
          data: { name: roleDef.name, description: roleDef.description }
        });
      }

      // Fetch all permissions for this role
      const dbPerms = await prisma.permissions.findMany({
        where: { code: { in: roleDef.permissions } }
      });

      // Map permissions to this role
      for (const perm of dbPerms) {
        const existingLink = await prisma.role_permissions.findFirst({
          where: {
            role_id: roleRecord.id,
            permission_id: perm.id
          }
        });
        
        if (!existingLink) {
          await prisma.role_permissions.create({
            data: {
              role_id: roleRecord.id,
              permission_id: perm.id
            }
          });
        }
      }
    }

    // Seed default admin user
    const adminRole = await prisma.roles.findUnique({ where: { name: 'Admin' } });
    if (adminRole) {
      const existingAdmin = await prisma.users.findUnique({ where: { username: 'admin' } });
      if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await prisma.users.create({
          data: {
            username: 'admin',
            email: 'admin@rtoledger.com',
            password_hash: passwordHash,
            role_id: adminRole.id,
            is_active: true
          }
        });
        console.log('Default admin user created: admin / admin123');
      }
    }

    // Seed default operator user
    const operatorRole = await prisma.roles.findUnique({ where: { name: 'Operator' } });
    if (operatorRole) {
      const existingOperator = await prisma.users.findUnique({ where: { username: 'operator' } });
      if (!existingOperator) {
        const passwordHash = await bcrypt.hash('operator123', 10);
        await prisma.users.create({
          data: {
            username: 'operator',
            email: 'operator@rtoledger.com',
            password_hash: passwordHash,
            role_id: operatorRole.id,
            is_active: true
          }
        });
        console.log('Default operator user created: operator / operator123');
      }
    }

    // Seed default accountant user
    const accountantRole = await prisma.roles.findUnique({ where: { name: 'Accountant' } });
    if (accountantRole) {
      const existingAccountant = await prisma.users.findUnique({ where: { username: 'accountant' } });
      if (!existingAccountant) {
        const passwordHash = await bcrypt.hash('accountant123', 10);
        await prisma.users.create({
          data: {
            username: 'accountant',
            email: 'accountant@rtoledger.com',
            password_hash: passwordHash,
            role_id: accountantRole.id,
            is_active: true
          }
        });
        console.log('Default accountant user created: accountant / accountant123');
      }
    }

    // Seed default viewer user
    const viewerRole = await prisma.roles.findUnique({ where: { name: 'Viewer' } });
    if (viewerRole) {
      const existingViewer = await prisma.users.findUnique({ where: { username: 'viewer' } });
      if (!existingViewer) {
        const passwordHash = await bcrypt.hash('viewer123', 10);
        await prisma.users.create({
          data: {
            username: 'viewer',
            email: 'viewer@rtoledger.com',
            password_hash: passwordHash,
            role_id: viewerRole.id,
            is_active: true
          }
        });
        console.log('Default viewer user created: viewer / viewer123');
      }
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
