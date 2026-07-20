const db = require("../../db");

const {
  sendNotificationToAdmin,
  sendStopNotification,
} = require("../services/notification.services");

exports.sendNotification = async (req, res) => {
  try {
    const { title, body } = req.body;

    const [result] = await db.execute(
      `
      INSERT INTO notification_send
      (
        title,
        body,
        status
      )
      VALUES
      (
        ?,
        ?,
        'PENDING'
      )
      `,
      [title, body]
    );

    const notificationId = result.insertId;

    const [admins] = await db.execute(`
      SELECT fcm_token
      FROM admin_devices
    `);

    for (const admin of admins) {
      await sendNotificationToAdmin(
        admin.fcm_token,
        notificationId,
        title,
        body
      );
    }

    res.json({
      success: true,
      notificationId,
    });

  } catch (err) {
    console.log(err.code);
    console.log(err.message);
    throw err;
}
};

exports.acknowledgeNotification = async (req, res) => {
  try {

    const notificationId = req.params.id;

    const adminName =
      req.body.adminName || "Admin";

    const [result] = await db.execute(
      `
      UPDATE notification_send
      SET
        status='ACKNOWLEDGED',
        acknowledged_by=?
      WHERE
        id=?
        AND status='PENDING'
      `,
      [
        adminName,
        notificationId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Already acknowledged",
      });
    }

console.log(response);
    const [admins] = await db.execute(`
      SELECT fcm_token
      FROM admin_devices
    `);

   console.log("Sending STOP to", admins.length, "devices");

for (const admin of admins) {
  await sendStopNotification(
    admin.fcm_token,
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


exports.getLatestNotification = async (req, res) => {
  try {

    const [rows] = await db.execute(`
      SELECT
        id,
        title,
        body,
        status,
        acknowledged_by,
        created_at
      FROM notification_send
      WHERE status='PENDING'
      ORDER BY id DESC
      LIMIT 1
    `);

    res.json({
      success: true,
      notification: rows.length
        ? rows[0]
        : null,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};