const admin = require("firebase-admin");
const User = require("./../models/User");
const { generateToken } = require("../middleware/jwt");

const handleCreateUser = async (req, res) => {
  const user = req.body;

  try {
    await admin.auth().getUserByEmail(user.email);
    return res.status(400).json({ message: "Email already registered" });
  } catch (error) {
    if (error.code == "auth/user-not-found") {
      try {
        const response = await admin.auth().createUser({
          email: user.email,
          password: user.password,
          emailVerified: false,
          disabled: false,
        });

        const newUser = new User({
          username: user.username,
          phone: user.phone,
          email: user.email,
          password: user.password,
          uid: response.uid,
          userType: "Client",
        });

        await newUser.save();
        res
          .status(201)
          .json({ status: true, message: "Account created successfully" });
      } catch (error) {
        return res.status(500).json({
          status: false,
          message: "Error creating user",
          error: error.message,
        });
      }
    }
  }
};

const handleLoginuser = async (req, res) => {
  // const { email, password } = req.body;
  try {
    const user = await User.findOne(
      { email: req.body.email },
      { __v: 0, updatedAt: 0, createdAt: 0 }
    );
    if (!user || !(await user.comparePassword(req.body.password))) {
      res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      userType: user.userType,
    };
    const userToken = generateToken(payload);
    const { password, email, ...others } = user._doc;

    res.status(200).json({ ...others, userToken });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};
module.exports = { handleCreateUser, handleLoginuser };
