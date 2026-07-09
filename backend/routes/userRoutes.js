const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// 1. Get all users with their assigned roles (to display in table)
router.get('/', async (req, res) => {
    try {
        const allUsers = await prisma.users.findMany({
            include: {
                roles: true
            }
        });
        res.json(allUsers);
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

// 4. Delete a User
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
