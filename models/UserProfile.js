const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 4,
  },
  lastName: {
    type: String,
    maxLength: 50,
    minLength: 4,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email address" + value);
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("ENTER A STRONG PASSWORD");
      }
    },
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  bio: {
    type: String,
  },
  photoUrl: {
    type: String,
    default:
      "https://cdn.vectorstock.com/i/1000v/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.avif",
  },
  preferredLanguages: [String],
  interestedTopics: [String],
  socialMedia: [String],
  education: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      institution: {
        type: String,
      },
      degree: {
        type: String,
      },
      to: {
        type: String,
      },
      from: {
        type: String,
      },
    },
  ],
  workExperience: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      jobTitle: {
        type: String,
      },
      company: {
        type: String,
      },
      to: {
        type: String,
      },
      from: {
        type: String,
      },
    },
  ],
});
userProfileSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "SIMPLI@TRAIN", {
    expiresIn: "1hr",
  });
  return token;
};
userProfileSchema.methods.validatePassword = async function (password) {
  const userPassword = this.password;
  const cmp = await bcrypt.compare(password, userPassword);
  return cmp;
};
module.exports = mongoose.model("User", userProfileSchema);
