import Notification from "../models/Notification.js";
import PC from "../models/PC.js";
import { formatResponse } from "../utils/response.js";

/**
 * GET /api/notifications
 * Private (Admin)
 */
export const listNotifications = async (req, res, next) => {
  try {
    const { unread } = req.query;
    const filter = {};
    if (unread === "true") filter.read = false;

    const items = await Notification.find(filter)
      .populate("pc", "name ipAddress")
      .sort({ sentAt: -1 });

    res.json(formatResponse(true, "notifications list", items));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications
 * Private (Admin)
 */
export const createNotification = async (req, res, next) => {
  try {
    const { title, message, level = "info", pc } = req.body;
    if (!title || !message) {
      return res.status(400).json(formatResponse(false, "title and message required"));
    }
    if (pc) {
      const pcDoc = await PC.findById(pc);
      if (!pcDoc) return res.status(404).json(formatResponse(false, "PC not found"));
    }

    const notif = await Notification.create({ title, message, level, pc });
    res.json(formatResponse(true, "notification created", notif));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Private (Admin)
 */
export const markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json(formatResponse(false, "notification not found"));
    res.json(formatResponse(true, "notification marked read", notif));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Private (Admin)
 */
export const removeNotification = async (req, res, next) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json(formatResponse(false, "notification not found"));
    res.json(formatResponse(true, "notification removed", deleted));
  } catch (err) {
    next(err);
  }
};
