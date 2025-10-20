// This service is responsible for dispatching tasks to PC agents.
// Implementation depends on how agents communicate (HTTP polling, WebSocket, SSH, Ansible, etc.)

import Task from "../models/Task.js";
import axios from "axios"; // if using HTTP push to agent
import { markPCOnline } from "./networkService.js";

export const dispatchTaskToAgent = async (task) => {
  // stub: find the PC address and try to send
  const pc = await task.populate("pc").execPopulate();
  const agentUrl = `http://${pc.ipAddress}:4000/agent/tasks`; // example agent endpoint
  try {
    // Try send (if your agent supports it)
    await axios.post(agentUrl, { taskId: task._id, command: task.command, params: task.params }, { timeout: 5000 });
    task.status = "running";
    await task.save();
    return true;
  } catch (err) {
    console.warn("Dispatch failed:", err.message);
    return false;
  }
};

// You can also add Ansible / PowerShell / SSH orchestration here later.
