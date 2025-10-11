const cron = require('node-cron');
const Tenant = require('../models/TenantModel');
const Rent = require('../models/RentModel');
const Room = require('../models/RoomModel');
const sendMail = require('./sendMail');
const rentReminderTemplate = require('./emailtemplates/rentReminderTemplate');

cron.schedule('0 0 * * *', async () => {
    console.log('🏠 Running daily rent check...');

    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        // Get all active tenants
        const tenants = await Tenant.find({ isActive: true }).populate('userId roomId');
        // console.log(tenants)
        for (const tenant of tenants) {
            const rentRecord = await Rent.findOne({
                tenantId: tenant._id,
                month: currentMonth,
                year: currentYear,
            });

            // 1️⃣ Create rent record if not found
            if (!rentRecord) {
                const newRent = new Rent({
                    tenantId: tenant._id,
                    month: currentMonth,
                    year: currentYear,
                    amount: tenant.roomId.rent,
                    paymentMethod: 'none',
                    status: 'pending',
                });
                await newRent.save();

                const html = rentReminderTemplate(
                    tenant.userId.username,
                    tenant.roomId.roomNumber,
                    `Your rent for <strong>${today.toLocaleString('default', { month: 'long' })}</strong> is now due.`,
                    `Please make your payment by the <strong>10th of this month</strong>.`
                );

                await sendMail(
                    tenant.userId.email,
                    `💰 Rent Due - Room ${tenant.roomId.roomNumber}`,
                    html
                );
                // console.log("sent mail to ", tenant.userId.email)
                continue;
            }

            // 2️⃣ Handle unpaid rent
            if (rentRecord.status === 'pending') {
                const day = today.getDate();

                if (day === 1) {
                    const html = rentReminderTemplate(
                        tenant.userId.username,
                        tenant.roomId.roomNumber,
                        `This is a reminder that your rent for <strong>${today.toLocaleString('default', { month: 'long' })}</strong> is due.`,
                        `Please complete your payment before the <strong>10th</strong> to avoid late fees.`
                    );
                    await sendMail(tenant.userId.email, '🏠 Rent Reminder', html);
                    // console.log("Sent mail to ", tenant.userId.email)
                }

                else if (day === 10) {
                    const html = rentReminderTemplate(
                        tenant.userId.username,
                        tenant.roomId.roomNumber,
                        `Your rent is still pending.`,
                        `⚠️ This is your final warning. Please clear your dues immediately to avoid eviction by the <strong>15th</strong>.`
                    );
                    await sendMail(tenant.userId.email, '⚠️ Rent Payment Warning', html);
                    // console.log("sent mail to for pending",)
                }

                else if (day === 15) {
                    // Evict tenant
                    tenant.isActive = false;
                    await tenant.save();

                    // Free up room slot
                    const room = await Room.findById(tenant.roomId);
                    if (room) {
                        room.available_slots += 1;
                        await room.save();
                    }

                    const html = rentReminderTemplate(
                        tenant.userId.username,
                        tenant.roomId.roomNumber,
                        `Your rent for <strong>${today.toLocaleString('default', { month: 'long' })}</strong> remains unpaid.`,
                        `❌ Your room has been vacated as of <strong>${today.toDateString()}</strong>.`
                    );

                    await sendMail(
                        tenant.userId.email,
                        '❌ Room Eviction Notice',
                        html
                    );
                }
            }
        }

        console.log('✅ Rent reminder job completed.');
    } catch (err) {
        console.error('Error in rent reminder job:', err);
    }
}, {
    timezone: 'Asia/Dhaka'
});
