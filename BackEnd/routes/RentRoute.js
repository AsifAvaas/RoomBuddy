const express = require('express')
const router = express.Router()
const Room = require("../models/RoomModel")
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const Tenant = require('../models/TenantModel')
const Rent = require('../models/RentModel')
const Stripe = require('stripe');
const stripe = new Stripe(process.env.Stripe_Secret);

router.get('/rentDetails', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;


        const tenants = await Tenant.find({ userId }).populate('roomId');
        if (tenants.length === 0) {
            return res.status(404).json({ success: false, message: "No tenant records found" });
        }


        const tenantIds = tenants.map(t => t._id);
        const rents = await Rent.find({ tenantId: { $in: tenantIds } }).populate({
            path: 'tenantId',
            populate: { path: 'roomId' }
        });

        if (rents.length === 0) {
            return res.status(404).json({ success: false, message: "No rent details found" });
        }


        const result = tenants.map(tenant => {
            const rentRecords = rents.filter(r => r.tenantId._id.toString() === tenant._id.toString());
            return {

                rentRecords
            };
        });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/myPendingRents', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all tenant entries for this user
        const tenants = await Tenant.find({ userId });

        if (!tenants.length) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }

        // Extract tenant IDs
        const tenantIds = tenants.map(t => t._id);

        // Find all pending rents for these tenants and populate room details
        const pendingRents = await Rent.find({
            tenantId: { $in: tenantIds },
            status: 'pending'
        })
            .populate({
                path: 'tenantId',
                populate: {
                    path: 'roomId', // This will populate the room info from the Tenant model
                    model: 'rooms',
                },
            })
            .sort({ createdAt: -1 });

        if (!pendingRents.length) {
            return res.status(404).json({ success: false, message: 'No pending rents found' });
        }

        res.status(200).json({ success: true, data: pendingRents });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Admin Route for all the pending rents
router.get('/pendingRents', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pendingRents = await Rent.find()
            .populate('tenantId')
            .sort({ createdAt: -1 });

        if (!pendingRents.length) {
            return res.status(404).json({ success: false, message: 'No pending rents found' });
        }

        res.status(200).json({ success: true, data: pendingRents });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.put('/markRentPaid/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const rentId = req.params.id;

        // Find the rent record
        const rent = await Rent.findById(rentId);
        if (!rent) {
            return res.status(404).json({ success: false, message: "Rent record not found" });
        }

        // Check if already paid
        if (rent.status === 'paid') {
            return res.status(400).json({ success: false, message: "This rent is already marked as paid" });
        }

        // Update rent details
        rent.status = 'paid';
        rent.paymentMethod = 'cash';
        rent.paymentDate = new Date();

        await rent.save();

        return res.status(200).json({
            success: true,
            message: "Rent marked as paid successfully (cash payment)",
            data: rent
        });

    } catch (error) {
        console.error("Error marking rent as paid:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/onlinePayment/:id', authMiddleware, async (req, res) => {
    try {
        const rentId = req.params.id;
        const userId = req.user.id;

        // Fetch the rent record
        const rent = await Rent.findById(rentId).populate({
            path: 'tenantId',
            populate: { path: 'roomId', model: 'rooms' }
        });

        if (!rent) {
            return res.status(404).json({ success: false, message: 'Rent record not found' });
        }

        // Make sure the user owns this rent record
        if (String(rent.tenantId.userId) !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to pay this rent' });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Rent for ${rent.month}/${rent.year}`,
                            description: `Room: ${rent.tenantId.roomId.roomNumber}`,
                        },
                        unit_amount: rent.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&rentId=${rent._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata: {
                rentId: rent._id.toString(),
                tenantId: rent.tenantId._id.toString(),
                userId: userId,
            },
        });

        return res.status(200).json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const rentId = session.metadata.rentId;

            await Rent.findByIdAndUpdate(rentId, {
                status: 'paid',
                paymentMethod: 'stripe',
                paymentDate: new Date(),
                PaymentId: session.payment_intent,
            });
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});


router.get('/verifyPayment', authMiddleware, async (req, res) => {
    try {
        const { session_id, rentId } = req.query; // pass rentId along with session_id

        if (!session_id || !rentId) {
            return res.status(400).json({ success: false, message: 'Missing session_id or rentId' });
        }

        // Retrieve the Stripe session
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            // Mark the rent record as paid
            const rent = await Rent.findByIdAndUpdate(rentId, {
                status: 'paid',
                paymentMethod: 'stripe',
                PaymentId: session.payment_intent,
                paymentDate: new Date()
            }, { new: true });

            return res.json({ success: true, message: 'Payment verified and updated', rent });
        } else {
            return res.json({ success: false, message: 'Payment not completed yet.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});




module.exports = router