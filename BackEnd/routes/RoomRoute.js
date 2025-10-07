const express = require('express')
const router = express.Router()
const Room = require("../models/RoomModel")
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

router.post('/addRoom', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber, floor: req.body.floor });
        if (existingRoom) {
            return res.status(400).json({ error: 'Room number already exists on this floor' });
        }
        const newRoom = new Room(req.body)
        await newRoom.save()
        res.status(201).json(newRoom)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


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











module.exports = router