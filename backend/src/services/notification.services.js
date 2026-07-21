const firebase = require("../config/firebase");
const db = require("../../db");

const sendNotificationToAdmin = async (token, notificationId, title, body) => {
  try {
    console.log("Sending to:", token);

    const message = {
      token,

      data: {
        type: "NEW_NOTIFICATION",
        notificationId: String(notificationId),
        title,
        body,
      },

      android: {
        priority: "high",
      },
    };

    const response = await firebase.messaging.send(message);

    console.log("FCM SUCCESS:", response);

    return response;
  } catch (err) {
    if (err.code === "messaging/registration-token-not-registered") {
      console.log("Removing invalid token");

      await db.execute(
        `
            DELETE FROM admin_devices
            WHERE fcm_token = ?
            `,
        [token],
      );

      return;
    }

    throw err;
  }
};

const sendStopNotification = async (token, notificationId) => {
  try {
    console.log("Sending STOP_NOTIFICATION to:", token);

    const message = {
      token,
      data: {
        type: "STOP_NOTIFICATION",
        notificationId: String(notificationId),
      },
      android: {
        priority: "high",
      },
    };

    console.log("STOP MESSAGE:", JSON.stringify(message, null, 2));

    const response = await firebase.messaging.send(message);

    console.log("STOP RESPONSE:", response);

    return response;
  } catch (err) {
    console.error("STOP_NOTIFICATION ERROR:", err);
    throw err;
  }
};

module.exports = {
  sendNotificationToAdmin,
  sendStopNotification,
};
