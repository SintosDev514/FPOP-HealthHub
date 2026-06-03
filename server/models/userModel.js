import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpAt: { type: Number, default: 0 },
  role: { type: String, required: true, default: "patient" },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  avatar: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  specialty: { type: String, default: "" },
  schedule: { type: Object, default: {} },
  isSuspended: { type: Boolean, default: false },
});

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;
