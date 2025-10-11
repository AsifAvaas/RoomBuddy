const rentReminderTemplate = (username, roomNumber, message, highlight) => {
    return `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; color:#333;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

      <h2 style="color:#2c7a7b; text-align:center; margin-bottom:20px;">🏠 RoomBuddy Rent Notice</h2>

      <p>Hello <strong>${username}</strong>,</p>
      <p>${message}</p>

      <div style="background-color:#fefcbf; border-left:4px solid #ecc94b; padding:12px 20px; margin:20px 0;">
        <strong>${highlight}</strong>
      </div>

      <p style="margin-top:20px;">Room Number: <strong>${roomNumber}</strong></p>

      <p>If you’ve already completed your payment, please ignore this message.</p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;" />

      <p style="font-size:12px; color:#777; text-align:center;">
        © ${new Date().getFullYear()} RoomBuddy. All rights reserved.
      </p>
    </div>
  </div>
  `;
};

module.exports = rentReminderTemplate;
