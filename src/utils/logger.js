// Logger utility
// very small logger wrapper (extendable)
export const logInfo = (msg, obj = null) => {
  console.log("[INFO]", new Date().toISOString(), msg, obj || "");
};

export const logError = (msg, obj = null) => {
  console.error("[ERROR]", new Date().toISOString(), msg, obj || "");
};
