import notificationModel from "../models/notificationModel.js";

const listNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notif = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );
    if (!notif) {
      return res.json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, notification: notif });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { listNotifications, markRead, markAllRead };
