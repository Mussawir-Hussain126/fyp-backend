// src/services/automationService.js
import Task from "../models/Task.js";
import axios from "axios";
import { markPCOnline, markPCOffline } from "./networkService.js";

/**
 * Send a queued task to a PC agent.
 * (You can later replace this HTTP logic with MQTT, WebSocket, etc.)
 */
export const dispatchTaskToAgent = async (task) => {
  try {
    const pc = await Task.findById(task._id).populate("pc");
    if (!pc || !pc.pc) throw new Error("PC not found");

    const agentUrl = `http://${pc.pc.ipAddress}:4000/agent/tasks`;

    await axios.post(agentUrl, {
      taskId: pc._id,
      command: pc.command,
      params: pc.params,
    });

    task.status = "running";
    await task.save();
    await markPCOnline(pc.pc._id);

    console.log("✅ Task dispatched to agent:", agentUrl);
    return true;
  } catch (err) {
    console.warn("⚠️  Task dispatch failed:", err.message);
    if (task?.pc) await markPCOffline(task.pc);
    return false;
  }
};
