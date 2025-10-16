import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" }, // extend as needed
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
