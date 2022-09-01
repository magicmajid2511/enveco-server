const express = require("express");
const app = express();
require("dotenv").config();
require("./config/database");
require("./config")(app)

const carRoute = require("./routes/carRoute");
const authRoute = require("./routes/authRoute");
const rentalRoute = require("./routes/rentalRoute");

app.use(express.json());

app.use("/api/cars/", carRoute);
app.use("/api/users/", authRoute);
app.use("/api/rentals/", rentalRoute);


const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log("\x1b[36m%s\x1b[0m", `Server is running on port ${port}`)
);
