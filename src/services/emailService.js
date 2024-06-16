const db = require("../models");
require("dotenv").config();
import nodemailer from "nodemailer";

let sendEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Xác nhận đặt lịch khám bệnh" cuongdanga7@gmail.com>', // sender address
    to: dataSend.recieverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: `<h3>Xin chào bệnh nhân ${dataSend.patientName}!</h3>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Vui lòng click vào đường link bên dưới để xác nhận lịch khám bệnh</p>
    <a href=${dataSend.linkConfirm} target='_blank'>Click here</a>
    <p>Xin chân thành cảm ơn</p>
    `, // html body
  });
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

module.exports = {
  sendEmail: sendEmail,
};
