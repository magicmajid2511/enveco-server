const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    countryName: { type: String, required: true },
    stateName: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: Number, required: true },
    fuelType: { type: String, required: true },
    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    rentPerHour: { type: Number, required: true },
  },
  { timestamps: true }
);

const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
