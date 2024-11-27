"use server";
import nodemailer from 'nodemailer';

const websiteLink = "https://llis-student-news.vercel.app"

// Assume transporter is already configured
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD, // Using APP_PASSWORD as requested
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const margin = 1;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="text-align: center; color: #0066cc;">Verify Your Email Address</h2>
  <p style="font-size: 16px; color: #555; text-align: center;">Thank you for signing up! Please confirm your email address by entering the verification code on our website.</p>
  <div style="text-align: center; margin: 20px 0;">
    ${token
      .split('')
      .map((char, index) => {
        if (index === 3) {
          return `<span style="
              margin: 0 4px;
              font-weight: bold;
              font-size: 24px;
              color: #0066cc;
              user-select: none;
            "></span><div style="
              display: inline-block;
              margin: 0 ${margin}px;
              width: 40px;
              height: 50px;
              text-align: center;
              border: 2px solid #0066cc;
              border-radius: 5px;
              line-height: 50px;
              font-size: 24px;
              font-weight: bold;
              color: #333;
              user-select: none;
            ">${char}</div>`;
        }
        return `<div style="
            display: inline-block;
            margin: 0 ${margin}px;
            width: 40px;
            height: 50px;
            text-align: center;
            border: 2px solid #0066cc;
            border-radius: 5px;
            line-height: 50px;
            font-size: 24px;
            font-weight: bold;
            color: #333;
            user-select: none;
          ">${char}</div>`;
      })
      .join('')}
  </div>
    </div>
    <p style="font-size: 16px; color: #555; text-align: center;">This link will expire in 1 hour.</p>
  <p style="font-size: 14px; color: #777; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
</div>
    `;

  const userAddress = process.env.USER;

  if (!userAddress) {
    throw new Error('USER environment variable is not set');
  }

  await transporter.sendMail({
    from: {
      name: 'Keeping up with LLIS',
      address: userAddress,
    },
    to: [email],
    subject: 'Verify your email',
    html,
  });
};

export const sendSubscriptionConfirmationEmail = async (email: string, userID: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="text-align: center; color: #0066cc;">Welcome to Keeping up with LLIS!</h2>
      <p style="font-size: 16px; color: #555; text-align: center;">
        Thank you for subscribing to our newsletter! You'll now be among the first to hear about our latest updates, news, and special offers.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${websiteLink}" style="background-color: #0066cc; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Visit Our Website
        </a>
      </div>
      <p style="font-size: 14px; color: #777; text-align: center;">
        If you didn’t subscribe to this newsletter, please ignore this email or <a href="${websiteLink}/unsubscribe?id=${userID}" style="color: #0066cc; text-decoration: none;">unsubscribe here</a>.
      </p>
    </div>
  `;

  const userAddress = process.env.USER;

  if (!userAddress) {
    throw new Error('USER environment variable is not set');
  }

  await transporter.sendMail({
    from: {
      name: 'Keeping up with LLIS',
      address: userAddress,
    },
    to: [email],
    subject: 'Welcome to the Keeping up with LLIS Newsletter!',
    html,
  });
};

export const sendUnsubscriptionConfirmationEmail = async (email: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="text-align: center; color: #cc0000;">You Have Unsubscribed</h2>
      <p style="font-size: 16px; color: #555; text-align: center;">
        We're sorry to see you go! You have successfully unsubscribed from the <strong>Keeping up with LLIS</strong> newsletter.
      </p>
      <p style="font-size: 16px; color: #555; text-align: center;">
        If this was a mistake or you change your mind, you can always <a href="${websiteLink}?subscribe=true&email=${email}" style="color: #0066cc; text-decoration: none;">subscribe again</a>.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${websiteLink}" style="background-color: #0066cc; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Visit Our Website
        </a>
      </div>
      <p style="font-size: 14px; color: #777; text-align: center;">
        If you have any questions or need further assistance, feel free to <a href="${websiteLink}/contact" style="color: #0066cc; text-decoration: none;">contact us</a>.
      </p>
    </div>
  `;

  const userAddress = process.env.USER;

  if (!userAddress) {
    throw new Error('USER environment variable is not set');
  }

  await transporter.sendMail({
    from: {
      name: 'Keeping up with LLIS',
      address: userAddress,
    },
    to: [email],
    subject: 'You’ve Unsubscribed from Keeping up with LLIS',
    html,
  });
};
