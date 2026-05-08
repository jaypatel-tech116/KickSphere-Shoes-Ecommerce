const LOGO_URL = "https://res.cloudinary.com/jay-patel/image/upload/Small_Logo_wrf1ms.png";
const BASE_URL = process.env.FRONTEND_URL || "https://kicksphere-shoes-ecommerce.vercel.app";

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000; margin: 0; padding: 0; color: #fff; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1f1f1f; border-radius: 12px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
    .header { padding: 40px 20px; text-align: center; background-color: #000000; border-bottom: 1px solid #1f1f1f; }
    .content { padding: 40px 30px; line-height: 1.6; text-align: center; }
    .footer { padding: 30px; text-align: center; border-top: 1px solid #1f1f1f; font-size: 12px; color: #a0a0a0; background-color: #050505; }
    .button { display: inline-block; padding: 14px 35px; background-color: #e8000d; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 25px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(232, 0, 13, 0.3); }
    .otp-container { background: #111; border: 1px dashed #e8000d; border-radius: 12px; padding: 30px; margin: 25px 0; }
    .otp { font-size: 36px; font-weight: 800; color: #e8000d; letter-spacing: 8px; margin: 0; user-select: all; -webkit-user-select: all; }
    .copy-text { font-size: 12px; color: #666; margin-top: 10px; font-style: italic; }
    h1 { font-size: 28px; margin-bottom: 20px; color: #fff; font-weight: 700; }
    p { margin-bottom: 15px; color: #a0a0a0; font-size: 16px; }
    .accent { color: #e8000d; }
    .divider { height: 1px; background: #1f1f1f; margin: 30px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${BASE_URL}" target="_blank" style="text-decoration: none;">
        <img src="${LOGO_URL}" alt="KickSphere" width="150" border="0" style="display: block; margin: 0 auto; border: none; outline: none; text-decoration: none;">
      </a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} KickSphere. All rights reserved.</p>
      <p><a href="${BASE_URL}" style="color: #e8000d; text-decoration: none;">Visit Store</a> • <a href="${BASE_URL}/profile" style="color: #e8000d; text-decoration: none;">Account</a></p>
      <p style="margin-top: 10px;">Elevating your sneaker game since day one.</p>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmail = (name, otp = null) => baseTemplate(`
  <h1>Welcome to the Tribe, <span class="accent">${name}</span>!</h1>
  <p>We're thrilled to have you join KickSphere, the ultimate destination for sneakerheads.</p>
  
  ${otp ? `
    <div class="divider"></div>
    <p>To verify your account, please use the code below:</p>
    <div class="otp-container">
      <div class="otp">${otp}</div>
      <div class="copy-text">Click and drag to copy code</div>
    </div>
  ` : ''}

  <p>Explore our exclusive collection and stay ahead of the game with the latest drops.</p>
  <a href="${BASE_URL}" class="button">Start Exploring</a>
`);

export const otpEmail = (otp, type = "verification") => baseTemplate(`
  <h1>Secure Your Account</h1>
  <p>Your ${type === "verification" ? "account verification" : "password reset"} code is:</p>
  
  <div class="otp-container">
    <div class="otp">${otp}</div>
    <div class="copy-text">Click and drag to copy code</div>
  </div>

  <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
  <div style="margin-top: 20px;">
    <p style="font-size: 13px;">Need help? <a href="mailto:support@kicksphere.com" style="color: #e8000d;">Contact Support</a></p>
  </div>
`);

export const orderEmail = (order) => baseTemplate(`
  <h1>Order Confirmed!</h1>
  <p>Thanks for your purchase, <span class="accent">#${order._id.toString().slice(-8).toUpperCase()}</span> is being processed.</p>
  <div style="margin: 30px 0; background: #111; padding: 20px; border-radius: 8px;">
    <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.amount}</p>
    <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentmethod}</p>
  </div>
  <a href="${BASE_URL}/orders" class="button">View My Orders</a>
`);
