const db = require("../../db");

exports.registerToken = async (req, res) => {
  try {
    const { adminName, fcmToken } = req.body;

    await db.execute(
      `
      INSERT INTO admin_devices
      (
        admin_name,
        fcm_token
      )
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      fcm_token = VALUES(fcm_token)
      `,
      [adminName, fcmToken]
    );
console.log("Fcm token recieved",req.body );
    res.json({
      success: true,
      message: "Token saved successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};