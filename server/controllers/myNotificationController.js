import notificationModel from "../models/notificationModel.js";

const myNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    const unread = await notificationModel.countDocuments({ userId: req.user.id, read: false });
    res.json({ success: true, notifications, unread });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const myMarkRead = async (req, res) => {
  try {
    const notif = await notificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
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

const myMarkAllRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { myNotifications, myMarkRead, myMarkAllRead };
