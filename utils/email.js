import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw error;
  }
};

export default sendEmail;
