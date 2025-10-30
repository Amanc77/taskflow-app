import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  due_date: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Task = models.Task || model("Task", taskSchema);

export default Task;
