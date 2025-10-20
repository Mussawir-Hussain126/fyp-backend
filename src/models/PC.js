import mongoose from "mongoose";
const { Schema } = mongoose;

const PCSchema = new Schema({
  name: { type: String, required: true },
  ipAddress: { type: String, required: true },
  macAddress: { type: String },
  status: { type: String, enum: ["online","offline","unknown"], default: "unknown" },
  lastActive: { type: Date },
  os: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PC", PCSchema);
