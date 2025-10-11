const bookingConfirmationTemplate = (username, roomNumber, floor, bedNo, rent, moveInDate) => {
    return `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; color:#333;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

      <h2 style="color:#2c7a7b; text-align:center; margin-bottom:20px;">🏡 Booking Confirmed!</h2>

      <p>Hello <strong>${username}</strong>,</p>
      <p>We’re excited to confirm your room booking at <strong>RoomBuddy</strong> 🎉</p>

      <div style="background-color:#e6fffa; border-left:4px solid #2c7a7b; padding:15px; margin:20px 0;">
        <p><strong>Room Number:</strong> ${roomNumber}</p>
        <p><strong>Floor:</strong> ${floor}</p>
        <p><strong>Bed No:</strong> ${bedNo}</p>
        <p><strong>Rent:</strong> ৳${rent}</p>
        <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toDateString()}</p>
      </div>

      <p>Your first month’s rent is now <strong>due</strong>. You can pay online or in cash at the front desk.</p>

      <p>If you have any questions, feel free to reach out to our admin team.</p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;" />

      <p style="font-size:12px; color:#777; text-align:center;">
        © ${new Date().getFullYear()} RoomBuddy. All rights reserved.
      </p>
    </div>
  </div>
  `;
};

module.exports = bookingConfirmationTemplate;
