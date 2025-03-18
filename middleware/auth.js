const jwt = require("jsonwebtoken");
const User = require("../models/UserProfile");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("Please login again!");
    }
    const decodedData = await jwt.verify(token, "SIMPLI@TRAIN");
    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Please logon again");
    }
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
};

module.exports = {
  userAuth,
};
