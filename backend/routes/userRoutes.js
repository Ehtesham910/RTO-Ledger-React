const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// 1. Get all users with their assigned roles and specific permissions
router.get('/', async (req, res) => {
    try {
        const allUsers = await prisma.users.findMany({
            include: {
                roles: true,
                user_permissions: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 1.5 Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({
            where: { id: BigInt(id) },
            include: {
                roles: true
            }
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Create a new User
router.post('/', async (req, res) => {
    try {
        const { username, email, password, role_id } = req.body;
        
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password_hash: password,
                role_id: role_id ? BigInt(role_id) : null,
                is_active: true
            },
            include: {
                roles: true
            }
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Toggle User active/inactive status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        
        const updatedUser = await prisma.users.update({
            where: { id: BigInt(id) },
            data: { is_active }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Update a User
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role_id } = req.body;
        
        const dataToUpdate = {
            username,
            email,
            role_id: role_id ? BigInt(role_id) : null
        };
        
        // Only update password if provided
        if (password) {
            dataToUpdate.password_hash = password;
        }

        const updatedUser = await prisma.users.update({
            where: { id: BigInt(id) },
            data: dataToUpdate,
            include: {
                roles: true
            }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Update permissions for a specific user
router.post('/:id/permissions', async (req, res) => {
    try {
        const userId = BigInt(req.params.id);
        const { permissionIds } = req.body; 

        await prisma.$transaction([
            prisma.user_permissions.deleteMany({
                where: { user_id: userId }
            }),
            prisma.user_permissions.createMany({
                data: permissionIds.map(pId => ({
                    user_id: userId,
                    permission_id: BigInt(pId)
                }))
            })
        ]);

        res.json({ message: "User permissions updated successfully" });
    } catch (error) {
        console.error("Error updating user permissions:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. Delete a User
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.users.delete({
            where: { id: BigInt(id) }
        });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
