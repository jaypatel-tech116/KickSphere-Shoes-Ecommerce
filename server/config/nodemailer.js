import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
dotenv.config();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// We keep the name 'transporter' and the 'sendMail' method 
// so we don't have to change the code in other files.
const transporter = {
  sendMail: async ({ to, subject, html }) => {
    try {
      const msg = {
        to,
        from: process.env.EMAIL_USER, // MUST be your verified Single Sender in SendGrid
        subject,
        html,
      };
      const response = await sgMail.send(msg);
      return response;
    } catch (error) {
      console.error("SendGrid Error:", error.response ? error.response.body : error.message);
      throw error;
    }
  },
  verify: () => Promise.resolve(true)
};

export default transporter;