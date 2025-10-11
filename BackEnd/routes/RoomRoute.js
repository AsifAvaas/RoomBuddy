const express = require('express')
const router = express.Router()
const Room = require("../models/RoomModel")
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const Tenant = require('../models/TenantModel')
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');


router.post('/addRoom', authMiddleware, adminMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { roomNumber, floor, occupancy_type, rent } = req.body;

        // Prevent duplicate room on same floor
        const existingRoom = await Room.findOne({ roomNumber, floor });
        if (existingRoom) {
            return res.status(400).json({ error: 'Room number already exists on this floor' });
        }

        // Determine capacity
        let capacity = 1;
        if (occupancy_type === 'Triple') capacity = 3;
        else if (occupancy_type === 'Shared') capacity = 6;

        // Upload images to Cloudinary
        const uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'room_images',
                    resource_type: 'image',
                });
                uploadedImages.push(result.secure_url);
            }
        }

        // Create new room
        const newRoom = new Room({
            roomNumber,
            floor,
            occupancy_type,
            capacity,
            available_slots: capacity,
            rent,
            images: uploadedImages
        });

        await newRoom.save();

        res.status(201).json({
            success: true,
            message: 'Room added successfully',
            newRoom
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/getAllRooms', authMiddleware, async (req, res) => {
    try {
        const rooms = await Room.find()
        res.status(200).json(rooms)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/getAvailableRooms', async (req, res) => {
    try {
        const availableRooms = await Room.find({ available_slots: { $gt: 0 } });
        res.status(200).json(availableRooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/editRoom/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { available_slots, capacity } = req.body;

        // Optional validation again
        if (available_slots > capacity) {
            return res.status(400).json({ error: 'Available slots cannot exceed capacity' });
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,

        );

        if (!updatedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ success: true, message: 'Room updated successfully', data: updatedRoom });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.delete('/deleteRoom/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:roomId/tenants', async (req, res) => {
    try {
        const { roomId } = req.params;
        const tenants = await Tenant.find({ roomId })
            .populate('userId', 'username email phone profilePic') // include only the fields you need

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ success: true, tenants, room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/room/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }



        res.status(200).json({ success: true, room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get('/myRoom', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        console.log(userId)
        const tenant = await Tenant.find({ userId }).populate('roomId')
        if (!tenant) {
            return res.status(404).json({ message: 'No room assigned' });
        }
        res.status(200).json({ success: true, tenant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})








module.exports = router