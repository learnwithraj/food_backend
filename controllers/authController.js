const admin = require("firebase-admin");
const User = require("./../models/User");
const { generateToken } = require("../middleware/jwt");

const handleCreateUser = async (req, res) => {
  const user = req.body;

  try {
   
    await admin.auth().getUserByEmail(user.email);
    return res
      .status(400)
      .json({ status: false, message: "Email already registered" });
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
    
      return res.status(500).json({
        status: false,
        message: "Failed to create user, Please try again",
      });
    }


    const existingUserWithPhone = await User.findOne({ phone: user.phone });
    if (existingUserWithPhone) {
      return res
        .status(400)
        .json({ status: false, message: "Phone Number already exists" });
    }

    
    let response;
    try {
      response = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false,
      });

      // Create the user in MongoDB
      const newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        password: user.password,
        uid: response.uid,
        userType: "Client",
        verification: false,
      });

      await newUser.save();
      return res
        .status(201)
        .json({ status: true, message: "Account created successfully" });
    } catch (error) {
      
      if (response && response.uid) {
        try {
          await admin.auth().deleteUser(response.uid);
        } catch (deleteError) {
          console.error(
            "Failed to delete Firebase user",
            deleteError
          );
        }
      }

      return res.status(500).json({
        status: false,
        message: "Failed to create user, Please try again",
      });
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
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
    const payload = {
      id: user._id,
      // email: user.email,
      uid: user.uid,
      userType: user.userType,
    };
    const userToken = generateToken(payload);
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, userToken });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
module.exports = { handleCreateUser, handleLoginuser };
