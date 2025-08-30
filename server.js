require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

const subscriberSchema = new mongoose.Schema({
  email: String,
  subscribedAt: { type: Date, default: Date.now }
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gender: String,
  destination: String,
  package: String,
  date: String,
  notes: String,
  registeredAt: { type: Date, default: Date.now }
});
const Registration = mongoose.model("Registration", registrationSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Newsletter Subscription
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.send("Already Subscribed!");

    await Subscriber.create({ email });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"TravelNest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to TravelNest!",
      html: `<p>Thanks for subscribing to TravelNest updates! 🌍</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Welcome email sent");
    res.send("🎉 Subscription Successful!");
  } catch (error) {
    console.error("❌ Subscription Error:", error);
    res.status(500).send("Something went wrong");
  }
});

// Contact Form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: "New Contact Message - TravelNest",
    html: `
      <h3>You've got a new message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Contact form email sent.");
    res.redirect("/");
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
