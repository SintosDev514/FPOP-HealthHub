import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: 0 },
  verifyOtpExpAt: { type: Number, default: 0 },
  role: { type: String, required: true, default: "Patient" },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, defult: "" },
  resetOtpeExpAt: { type: Number, deafult: "" },
});

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;
