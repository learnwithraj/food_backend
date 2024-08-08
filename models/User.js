const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Firstname is required"],
    },
    lastName: {
      type: String,
      required: [true, "Lastname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    fcm: {
      type: String,
      required: false,
      default: "none",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    verification: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      required: [true, "Usertype is required"],
      enum: ["Admin", "Client"],
      default: "Client",
    },
    // profile: {
    //   type: String,
    //   // required: true,
    //   default:
    //     "https://firebasestorage.googleapis.com/v0/b/food-app-429415.appspot.com/o/users%2Fuser-icon.png?alt=media&token=ebda2c0e-b153-486f-8eef-869a312ed237",
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
