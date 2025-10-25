// src/services/networkService.js
import PC from "../models/PC.js";

/**
 * Mark a PC as online (heartbeat or ping received)
 */
export const markPCOnline = async (pcId) => {
  try {
    await PC.findByIdAndUpdate(pcId, {
      status: "online",
      lastActive: new Date(),
    });
  } catch (err) {
    console.error("Error marking PC online:", err.message);
  }
};

/**
 * Mark a PC as offline (no heartbeat or ping)
 */
export const markPCOffline = async (pcId) => {
  try {
    await PC.findByIdAndUpdate(pcId, { status: "offline" });
  } catch (err) {
    console.error("Error marking PC offline:", err.message);
  }
};
