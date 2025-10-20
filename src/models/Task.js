import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema({
  pc: { type: Schema.Types.ObjectId, ref: "PC", required: true },
  command: { type: String, required: true },
  params: { type: Object, default: {} },
  status: { type: String, enum: ["pending","running","success","failed"], default: "pending" },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  result: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.model("Task", TaskSchema);
