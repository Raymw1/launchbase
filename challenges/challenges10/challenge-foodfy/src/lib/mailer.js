const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "94562f537c158a",
    pass: "af008be3643d8b"
  }
});

module.exports = transport;
