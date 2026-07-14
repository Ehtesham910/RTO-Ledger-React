const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

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

// 1.2 Get all active Agents
router.get('/agents/list', async (req, res) => {
    try {
        const agents = await prisma.users.findMany({
            where: {
                roles: {
                    name: 'Agent'
                },
                is_active: true
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        // Convert BigInt id to string for JSON serialization
        const formattedAgents = agents.map(a => ({
            ...a,
            id: a.id.toString()
        }));
        res.json(formattedAgents);
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
        
        let password_hash = password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password_hash = await bcrypt.hash(password, salt);
        }

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password_hash: password_hash,
                role_id: role_id ? BigInt(role_id) : null,
                is_active: true
            },
            include: {
                roles: true
            }
        });

        // Automatically assign permissions based on the selected role
        if (role_id) {
            const rolePermissions = await prisma.role_permissions.findMany({
                where: { role_id: BigInt(role_id) }
            });
            
            if (rolePermissions.length > 0) {
                await prisma.user_permissions.createMany({
                    data: rolePermissions.map(rp => ({
                        user_id: newUser.id,
                        permission_id: rp.permission_id
                    }))
                });
            }
        }

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
        
        // Only update password if provided and changed
        if (password && !password.startsWith('$2')) { // bcrypt hashes start with $2
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password_hash = await bcrypt.hash(password, salt);
        } else if (password && password.startsWith('$2')) {
            // Keep existing hash if they didn't change it
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
