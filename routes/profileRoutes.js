const express = require("express");
const User = require("../models/UserProfile");
const router = express.Router();
const { userAuth } = require("../middleware/auth");

router.post("/", userAuth, async (req, res) => {
  try {
    const profile = new User(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", userAuth, async (req, res) => {
  try {
    const profile = req.user;
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile

// Delete Profile

router.patch("/edit", userAuth, async (req, res) => {
  try {
    const profile = req.user;
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const {
      firstName,
      lastName,
      age,
      gender,
      address,
      bio,
      preferredLanguages,
      socialMedia,
      interestedTopics,
    } = req.body;

    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (age) profile.age = age;
    if (gender) profile.gender = gender;
    if (address) profile.address = address;
    if (bio) profile.bio = bio;
    if (socialMedia) profile.socialMedia = socialMedia;
    if (preferredLanguages) profile.preferredLanguages = preferredLanguages;
    if (interestedTopics) profile.interestedTopics = interestedTopics;
    await profile.save();

    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/education", userAuth, async (req, res) => {
  try {
    const profile = req.user;
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { institution, degree, from, to } = req.body;

    if (!institution || !degree || !from || !to) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEducation = { institution, degree, from, to };
    profile.education.push(newEducation); // Add to array

    await profile.save();
    res.status(201).json({ message: "Education added successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.patch("/education/:id", userAuth, async (req, res) => {
  try {
    const profile = req.user;
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const educationEntry = profile.education.id(req.params.id); // Find by ObjectId
    if (!educationEntry)
      return res.status(404).json({ message: "Education entry not found" });

    const { institution, degree, from, to } = req.body;

    if (institution) educationEntry.institution = institution;
    if (degree) educationEntry.degree = degree;
    if (from) educationEntry.from = from;
    if (to) educationEntry.to = to;

    await profile.save();
    res.json({ message: "Education updated successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.patch("/work-experience/:id", userAuth, async (req, res) => {
  try {
    const profile = req.user;
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const workEntry = profile.workExperience.id(req.params.id); // Find by ObjectId
    if (!workEntry)
      return res
        .status(404)
        .json({ message: "Work experience entry not found" });

    const { jobTitle, company, from, to } = req.body;

    if (jobTitle) workEntry.jobTitle = jobTitle;
    if (company) workEntry.company = company;
    if (from) workEntry.from = from;
    if (to) workEntry.to = to;

    await profile.save();
    res.json({ message: "Work experience updated successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/work-experience", userAuth, async (req, res) => {
  try {
    const profile = req.user;
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { jobTitle, company, from, to } = req.body;

    if (!jobTitle || !company || !from || !to) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newWork = { jobTitle, company, from, to };
    profile.workExperience.push(newWork); // Add to array

    await profile.save();
    res
      .status(201)
      .json({ message: "Work experience added successfully", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
