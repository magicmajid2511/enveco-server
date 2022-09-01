const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Rental = require("../models/rentalModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const charge = await stripe.charges.create(
      {
        amount: req.body.totalAmount * 100,
        currency: "USD",
        customer: customer.id,
        receipt_email: token.email,
        description: "Car rental",
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (charge) {
      req.body.transactionId = charge.source.id;
      const newBooking = new Rental(req.body);
      await newBooking.save();

      const car = await Car.findById({ _id: req.body.car });
      await Car.updateOne(car, {
        $push: { bookedTimeSlots: req.body.bookedTimeSlots },
      });

      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: token.email,
        subject: "Car Rental confirmation",
        text: "You have successfully booked your car via Envceco",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.send("Booking successfully");
    } else {
      res.status(400).json("Payment failed");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.get("/userRentals", async (req, res) => {
  try {
    const bookings = await Rental.find().populate("car");
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
