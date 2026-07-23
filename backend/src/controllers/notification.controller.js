const db = require("../../db");

const {
  sendNotificationToAdmin,
  sendStopNotification,
} = require("../services/notification.services");

exports.sendNotification = async (req, res) => {

  try {

    const { title, body } = req.body;
 const notificationId = Date.now().toString();
    const [admins] = await db.execute(`
      SELECT fcm_token
      FROM admin_devices
    `);

    for (const admin of admins) {

      await sendNotificationToAdmin(
        admin.fcm_token,
        title,
        body,
        notificationId
      );

    }

    res.json({
      success: true,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

exports.acknowledgeNotification = async (req, res) => {

  try {

    const [admins] = await db.execute(`
      SELECT fcm_token
      FROM admin_devices
    `);

    for (const admin of admins) {

      await sendStopNotification(
        admin.fcm_token
      );

    }

    res.json({
      success: true,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


const deleteToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const [result] = await db.execute(
      `
      DELETE FROM admin_devices
      WHERE fcm_token = ?
      `,
      [token]
    );

    return res.json({
      success: true,
      deletedRows: result.affectedRows,
      message:
        result.affectedRows > 0
          ? "Token deleted successfully"
          : "Token not found",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


