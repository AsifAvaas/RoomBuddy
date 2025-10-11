const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/RoomModel');
const Tenant = require('../models/TenantModel');
const RentPayment = require('../models/RentModel');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const RentModel = require('../models/RentModel');

//  Dashboard Summary
router.get('/summary', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        const totalTenants = await Tenant.countDocuments({ isActive: true });
        const totalAvailableBedsAgg = await Room.aggregate([
            { $group: { _id: null, total: { $sum: "$available_slots" } } }
        ]);
        const totalAvailableBeds = totalAvailableBedsAgg[0]?.total || 0;

        // Current month rent stats
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const rentSummary = await RentPayment.aggregate([
            { $match: { month, year } },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const paid = rentSummary.find(r => r._id === "paid")?.total || 0;
        const pending = rentSummary.find(r => r._id === "pending")?.count || 0;

        res.status(200).json({
            totalRooms,
            totalTenants,
            totalAvailableBeds,
            totalCollected: paid,
            pendingPayments: pending,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/occupancy', async (req, res) => {
    try {
        const rooms = await Room.find();
        const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
        const totalAvailable = rooms.reduce((sum, r) => sum + r.available_slots, 0);
        const occupied = totalCapacity - totalAvailable;

        res.json({
            occupied,
            available: totalAvailable,
            total: totalCapacity,
            occupancyRate: ((occupied / totalCapacity) * 100).toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/rent-stats', async (req, res) => {
    try {
        const stats = await RentPayment.aggregate([
            {
                $group: {
                    _id: { month: "$month", year: "$year", status: "$status" },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/room-breakdown', async (req, res) => {
    try {
        const rooms = await Room.find().sort({ floor: 1, roomNumber: 1 });
        const formatted = rooms.map(r => ({
            floor: r.floor,
            roomNumber: r.roomNumber,
            type: r.occupancy_type,
            capacity: r.capacity,
            occupied: r.capacity - r.available_slots,
            available: r.available_slots,
            rent: r.rent
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/pending-payments', async (req, res) => {
    try {
        const now = new Date();
        const tenants = await RentModel.find({ status: "pending" })
            .populate({
                path: "tenantId",
                populate: { path: "userId", select: "username email" }
            })
            .populate({
                path: "tenantId",
                populate: { path: "roomId", select: "roomNumber floor" },
            })
            ;

        const dueSoon = tenants.filter(t => {
            const due = t.paymentDate || t.createdAt;
            const diff = (now - new Date(due)) / (1000 * 60 * 60 * 24);
            return diff >= 25; // pending more than ~25 days
        });

        res.json(tenants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/recent-tenants', async (req, res) => {
    try {
        const recentJoined = await Tenant.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'username email')
            .populate('roomId', 'roomNumber');

        const recentlyVacated = await Tenant.find({ isActive: false })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('userId', 'username email')
            .populate('roomId', 'roomNumber');

        res.json({ recentJoined, recentlyVacated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;

/*
This is a repository for a paying guest website named RoomBuddy, there are two directiry in this repo named frontend and backend, read my repo and write me a readme.md file, the readme should show,Table of Contents,overview,Features, Tech Stack,Project Structure,Installation, API Endpoints and the author detail, the main feature of m project is as following
the user can login signup , there is oiptins for google auth, forgot password, then he can brouse rooms and book a room for monthly rent, each month he will get a mail notification saying his rent is due, he can pay it with cash or with integrated payment system with stripe, he can also cancel his rooms and al;so edit his user profile and see his rent history,
the admin will have a dashbiard showin ll the rent info and tenants, he can add edit delete rooms, evict tenatns,see tenants details etc, now write me a reaadme file
*/