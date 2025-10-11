const resetPasswordTemplate = (link) => {
    return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c7a7b;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your account. 
       If this was you, click the button below to reset your password:</p>

    <p style="text-align: center; margin: 20px 0;">
      <a href="${link}" 
         style="background-color: #2c7a7b; color: #fff; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
    </p>

    <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
    <p><a href="${link}">${link}</a></p>

    <p><strong>Note:</strong> This link will expire in 30 minutes.</p>

    <p>If you didn’t request a password reset, you can safely ignore this email.</p>

    <hr style="margin: 20px 0;" />
    <p style="font-size: 12px; color: #777;">
      © ${new Date().getFullYear()} AUST CSE Carnival. All rights reserved.
    </p>
  </div>
  `;
};

module.exports = resetPasswordTemplate;