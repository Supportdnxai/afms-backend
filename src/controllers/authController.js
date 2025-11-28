import User from "../models/userModel.js";
import axios from "axios";

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ----------------------------------------------------
// REQUEST OTP
// ----------------------------------------------------
export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // -------------------------
    // SEND OTP USING YOUR API
    // -------------------------
    const smsUrl = "http://164.52.205.46/api/v2/SendSMS";

    const message = `OTP for your login request is ${otp}. Please enter this to verify your identity and proceed with the portal. Never share OTPs with anyone else. DIGITAL NEXUS.`;

    const params = {
      SenderId: "DNXAIS",
      Is_Unicode: false,
      Is_Flash: false,
      DataCoding: 0,
      Message: message,
      MobileNumbers: phone.replace("+91", ""), // Send without +91 if required
      ApiKey: "a0gKXuo8TMI6J+N5AFEVZfc2Crb1ITMnm6GjSwjxChk=",
      ClientId: "ced6f772-6fd6-463a-a2da-b12a5b3daf32"
    };

    const response = await axios.get(smsUrl, { params });

    console.log("SMS API Response:", response.data);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      debugOtp: otp // remove in production
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ----------------------------------------------------
// VERIFY OTP
// ----------------------------------------------------
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
