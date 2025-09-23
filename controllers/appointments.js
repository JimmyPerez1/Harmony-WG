const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 465),
  secure: String(process.env.MAIL_SECURE || "true") === "true",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

router.get("/", (req, res) => {
  res.render("appointments/new", { error: "" });
});


router.post("/", async (req, res) => {
  try {
    const { name, email, phone, serviceType, preferredDate, preferredTime, message } = req.body;

    if (!name || !phone || !serviceType) {
      return res.status(400).render("appointments/new", { error: "Please fill required fields." });
    }

    const subject = `New appointment request from ${name}`;
    const text = `
      Name: ${name}
      Email: ${email || ""}
      Phone: ${phone}
      Service: ${serviceType}
      Preferred: ${preferredDate || ""} ${preferredTime || ""}
      Notes: ${message || ""}
      User-Agent: ${req.get("User-Agent") || ""}
    `.trim();

    await transporter.sendMail({
      from: `"Harmony WG" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email || undefined,
      subject,
      text,
    });

    res.render("appointments/success");
  } catch (err) {
    console.error(err);
    res.status(500).render("appointments/new", { error: "Could not send. Try again." });
  }
});

module.exports = router;