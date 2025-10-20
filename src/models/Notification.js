import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  title: { type: String },
  message: { type: String },
  level: { type: String, enum: ["info","warning","critical"], default: "info" },
  pc: { type: Schema.Types.ObjectId, ref: "PC" },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

export default mongoose.model("Notification", NotificationSchema);
