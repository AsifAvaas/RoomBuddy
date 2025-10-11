const verifyEmailTemplate = (username, url) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px; color:#333;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color:#2c7a7b; text-align:center; margin-bottom:20px;">Welcome to RoomBuddy 🎉</h2>
      
      <p>Hello <strong>${username}</strong>,</p>
      <p>Thank you for registering! Please confirm your email address by clicking the button below:</p>

      <p style="text-align:center; margin:30px 0;">
        <a href="${url}" 
           style="background-color:#2c7a7b; color:#fff; padding:12px 24px; 
                  text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
          Verify Email
        </a>
      </p>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break:break-all;">
        <a href="${url}">${url}</a>
      </p>

      <p><strong>Note:</strong> This link will expire in <span style="color:#e53e3e;">30 minutes</span>.</p>

      <p>If you didn’t create an account, you can safely ignore this email.</p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;" />

      <p style="font-size:12px; color:#777; text-align:center;">
        © ${new Date().getFullYear()} RoomBuddy. All rights reserved.
      </p>
    </div>
  </div>
  `;
};

module.exports = verifyEmailTemplate;