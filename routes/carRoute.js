const express = require("express");
const router = express.Router();
const NodeGeocoder = require("node-geocoder");
const Car = require("../models/carModel");

router.get("/getallcars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.send(cars);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/addcar", async (req, res) => {
  try {
    const options = {
      provider: "google",
      apiKey: process.env.GOOGLE_MAPS_KEY,
      formatter: null,
    };

    const geocoder = NodeGeocoder(options);

    // Using callback
    const loc = await geocoder.geocode(
      `${req.body.countryName}, ${req.body.stateName}`
    );

    req.body = {
      ...req.body,
      latitude: loc[0].latitude,
      longitude: loc[0].longitude,
    };

    const newCar = new Car(req.body);
    await newCar.save();
    res.send("Car added successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/editcar", async (req, res) => {
  try {
    await Car.findByIdAndUpdate(req.body._id, req.body);
    res.send("Car edited successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/deletecar", async (req, res) => {
  try {
    await Car.findOneAndDelete({ _id: req.body.carid });
    res.send("Car deleted successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
