import mongoose from "mongoose";
const { Schema } = mongoose;

const LogSchema = new Schema({
  action: { type: String, required: true },
  pc: { type: Schema.Types.ObjectId, ref: "PC" },
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Log", LogSchema);
