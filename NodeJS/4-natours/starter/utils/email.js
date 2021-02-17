// npm install nodemailer -- to send emails using nodejs
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: '<test@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  console.log(mailOptions);
  await transporter.sendMail(mailOptions);
  // await transporter.sendMail(mailOptions, (error) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log('Message sent:');
  // });
};

module.exports = sendEmail;

// mailtrap- to check the mails how they look in production
// mailtrap.io  -- Safe Email Testing for Staging & Development
// Mail sending is not working.. couldn't debug, need to check more and more
