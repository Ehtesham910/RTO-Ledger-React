const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// 1. Get all roles with their assigned permissions
router.get('/', async (req, res) => {
    try {
        const allRoles = await prisma.roles.findMany({
            include: {
                role_permissions: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        res.json(allRoles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Create a new role
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newRole = await prisma.roles.create({
            data: { name, description }
        });
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Get all available Permissions in the system
router.get('/permissions-list', async (req, res) => {
    try {
        const allPermissions = await prisma.permissions.findMany();
        res.json(allPermissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update permissions for a specific role
router.post('/:id/permissions', async (req, res) => {
    try {
        const roleId = BigInt(req.params.id);
        const { permissionIds } = req.body; // Array of permission IDs (e.g. [1, 2, 5])

        // Transaction: Old permissions delete karein aur naye insert karein
        await prisma.$transaction([
            prisma.role_permissions.deleteMany({
                where: { role_id: roleId }
            }),
            prisma.role_permissions.createMany({
                data: permissionIds.map(pId => ({
                    role_id: roleId,
                    permission_id: BigInt(pId)
                }))
            })
        ]);

        res.json({ message: "Permissions updated successfully" });
    } catch (error) {
        console.error("Error updating role permissions:", error);
        res.status(500).json({ error: error.message });
    }
});

// 5. Update a role
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatedRole = await prisma.roles.update({
            where: { id: BigInt(id) },
            data: { name, description }
        });
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Delete a role
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.roles.delete({
            where: { id: BigInt(id) }
        });
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
