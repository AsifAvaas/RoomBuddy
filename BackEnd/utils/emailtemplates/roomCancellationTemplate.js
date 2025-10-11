const roomCancalationTemplate = (username, roomNumber, floor, bedNo, moveInDate) => {
    return `
          <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; color:#333;">
            <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

              <h2 style="color:#e53e3e; text-align:center; margin-bottom:20px;">🛑 Subscription Cancelled</h2>

              <p>Hello <strong>${username}</strong>,</p>
              <p>Your room subscription at <strong>RoomBuddy</strong> has been successfully cancelled.</p>

              <div style="background-color:#fff5f5; border-left:4px solid #e53e3e; padding:15px; margin:20px 0;">
                <p><strong>Room Number:</strong> ${roomNumber}</p>
                <p><strong>Floor:</strong> ${floor}</p>
                <p><strong>Bed No:</strong> ${bedNo}</p>
                <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toDateString()}</p>
                <p><strong>Cancellation Date:</strong> ${new Date().toDateString()}</p>
              </div>

              <p>If you wish to rebook a room in the future, simply log in and choose an available room from our listings.</p>

              <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;" />

              <p style="font-size:12px; color:#777; text-align:center;">
                © ${new Date().getFullYear()} RoomBuddy. All rights reserved.
              </p>
            </div>
          </div>
        `;




};

module.exports = roomCancalationTemplate;
