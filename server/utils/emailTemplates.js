const LOGO_URL = "https://res.cloudinary.com/jay-patel/image/upload/v1776829338/jayma8jlxapensoy6c1w.jpg"; // Using the user's logo from earlier

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000; margin: 0; padding: 0; color: #fff; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1f1f1f; }
    .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid #1f1f1f; }
    .logo { height: 50px; }
    .content { padding: 40px 30px; line-height: 1.6; }
    .footer { padding: 30px; text-align: center; border-top: 1px solid #1f1f1f; font-size: 12px; color: #a0a0a0; }
    .button { display: inline-block; padding: 14px 30px; background-color: #e8000d; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .otp { font-size: 32px; font-weight: bold; color: #e8000d; letter-spacing: 5px; margin: 20px 0; }
    .order-item { border-bottom: 1px solid #1f1f1f; padding: 10px 0; }
    h1 { font-size: 24px; margin-bottom: 20px; color: #fff; }
    p { margin-bottom: 15px; color: #a0a0a0; }
    .accent { color: #e8000d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="KickSphere" class="logo">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} KickSphere. All rights reserved.</p>
      <p>Elevating your sneaker game.</p>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmail = (name) => baseTemplate(`
  <h1>Welcome to the Tribe, <span class="accent">${name}</span>!</h1>
  <p>We're thrilled to have you join KickSphere, the ultimate destination for sneakerheads.</p>
  <p>Explore our exclusive collection and stay ahead of the game with the latest drops.</p>
  <a href="${process.env.FRONTEND_URL || 'http://localhost:5176'}" class="button">Start Exploring</a>
`);

export const otpEmail = (otp, type = "verification") => baseTemplate(`
  <h1>Secure Your Account</h1>
  <p>Your ${type === "verification" ? "account verification" : "password reset"} code is:</p>
  <div class="otp">${otp}</div>
  <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
`);

export const orderEmail = (order) => baseTemplate(`
  <h1>Order Confirmed!</h1>
  <p>Thanks for your purchase, <span class="accent">#${order._id.toString().slice(-8).toUpperCase()}</span> is being processed.</p>
  <div style="margin: 30px 0;">
    <p><strong>Total Amount:</strong> ₹${order.amount}</p>
    <p><strong>Payment Method:</strong> ${order.paymentmethod}</p>
  </div>
  <a href="${process.env.FRONTEND_URL || 'http://localhost:5176'}/orders" class="button">View My Orders</a>
`);
