import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// We keep the name 'transporter' and the 'sendMail' method 
// so we don't have to change the code in other files.
const transporter = {
  sendMail: async ({ from, to, subject, html }) => {
    try {
      // Resend 'from' address rules:
      // In testing (onboarding), you must use 'onboarding@resend.dev'
      // and 'to' must be your own email.
      const data = await resend.emails.send({
        from: 'KickSphere <onboarding@resend.dev>',
        to,
        subject,
        html,
      });
      return data;
    } catch (error) {
      console.error("Resend Error:", error);
      throw error;
    }
  },
  verify: () => Promise.resolve(true) // Mock verify for health checks
};

export default transporter;