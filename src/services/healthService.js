import PC from "../models/PC.js";

/**
 * simple health checker placeholder:
 * ping or request each PC agent
 */
export const checkAllPCHealth = async () => {
  // TODO: implement practical checks
  const pcs = await PC.find();
  // For now, return a summary
  return pcs.map(p => ({ id: p._id, ip: p.ipAddress, status: p.status }));
};
