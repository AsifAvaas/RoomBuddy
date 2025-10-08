const express = require('express')
const router = express.Router()
const Room = require("../models/RoomModel")
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const Tenant = require('../models/TenantModel')
const RentHIstory = require('../models/RentModel')
const bookingConfirmationTemplate = require('../utils/emailtemplates/bookingConfirmationTemplate')
const sendMail = require('../utils/sendMail')
const UserModel = require('../models/UserModel')
const roomCancalationTemplate = require('../utils/emailtemplates/roomCancellationTemplate')

router.get('/tenantDetails', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const tenants = await Tenant.find().populate('userId roomId')
        if (!tenants) {
            return res.status(404).json({ success: false, message: "No  tenants found" })
        }
        return res.status(200).json({ success: true, data: tenants })


    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

router.get('/tenantDetails/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const userId = req.params.id
        const tenant = await TenantRent.findById(userId)
        if (!tenant) {
            return res.status(404).json({ success: false, message: "No  tenants found" })
        }
        return res.status(200).json({ success: true, data: tenant })


    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})


router.post('/addTenant', authMiddleware, async (req, res) => {
    try {
        const { roomId, bedNo, move_in_date } = req.body;
        const userId = req.user.id

        if (!userId || !roomId || !bedNo || !move_in_date) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }


        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }


        if (room.available_slots <= 0) {
            return res.status(400).json({ success: false, message: "No available slots in this room" });
        }


        const bedTaken = await Tenant.findOne({ roomId, bedNo, isActive: true });
        if (bedTaken) {
            return res.status(400).json({ success: false, message: "This bed is already occupied" });
        }


        const moveIn = new Date(move_in_date);
        const nextDue = new Date(moveIn.getFullYear(), moveIn.getMonth() + 1, 1);

        const newTenant = new Tenant({
            userId,
            roomId,
            bedNo,
            move_in_date: moveIn,
            next_due_date: nextDue,
        });

        await newTenant.save();


        room.available_slots -= 1;
        await room.save();

        const rentRecord = new RentHIstory({
            tenantId: newTenant._id,
            month: moveIn.getMonth() + 1,
            year: moveIn.getFullYear(),
            amount: room.rent,
            status: 'pending',
            paymentMethod: 'none',
        })

        await rentRecord.save();

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const html = bookingConfirmationTemplate(
            user.username || 'Tenant',
            room.roomNumber,
            room.floor,
            bedNo,
            room.rent,
            moveIn
        );
        console.log(user.email)
        await sendMail(
            user.email,
            '✅ Room Booking Confirmed - RoomBuddy',
            html
        );

        return res.status(201).json({
            success: true, message: "Tenant added successfully and rent record created", data: {
                tenant: newTenant,
                rent: rentRecord
            }
        });



    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/cancelSubscription/:id', authMiddleware, async (req, res) => {
    try {
        const tenantId = req.params.id;
        const userId = req.user.id;


        const tenant = await Tenant.findById(tenantId).populate('roomId userId');
        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }

        if (tenant.userId._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized — this is not your subscription" });
        }

        if (!tenant.isActive) {
            return res.status(400).json({ success: false, message: "Subscription already inactive" });
        }


        tenant.isActive = false;
        await tenant.save();


        const room = tenant.roomId;
        room.available_slots += 1;
        await room.save();


        const html = roomCancalationTemplate(
            tenant.userId.username,
            room.roomNumber,
            room.floor,
            tenant.bedNo,
            tenant.move_in_date,

        )

        await sendMail(
            tenant.userId.email,
            '❌ Room Subscription Cancelled - RoomBuddy',
            html
        );

        return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: tenant
        });

    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


router.put('/removeTenant/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const tenantId = req.params.id
        const tenant = await Tenant.findById(tenantId)

        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found" })
        }
        if (!tenant.isActive) {
            return res.status(404).json({ success: false, message: "Tenant not active" })
        }
        tenant.isActive = false
        await tenant.save()

        const room = await Room.findById(tenant.roomId)
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" })
        }
        room.available_slots += 1
        await room.save()

        return res.status(200).json({ success: true, message: "Tenant removed successfully", data: tenant })


    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router