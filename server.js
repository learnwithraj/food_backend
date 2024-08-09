const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey_FoodApp.json");
// const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

const categoryRoutes = require("./routes/category");
app.use("/api/category", categoryRoutes);
const offerRoutes = require("./routes/offer");
app.use("/api/offer", offerRoutes);
const foodRoutes = require("./routes/food");
app.use("/api/food", foodRoutes);
const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);
const addressRoutes = require("./routes/address");
app.use("/api/address", addressRoutes);
const orderRoutes = require("./routes/order");
app.use("/api/order", orderRoutes);
const ratingRoutes = require("./routes/rating");
app.use("/api/rating", ratingRoutes);
const promoSliderRoutes = require("./routes/promoSlider");
app.use("/api/slider", promoSliderRoutes);

//connection of mongodb
mongoose
  .connect(process.env.MONGO_URL_CLOUD)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((e) => {
    console.log(e);
  });

//starting server on port
app.listen(PORT, () => {
  console.log(`We are live in ${PORT}`);
});
