const firebase = require("../config/firebase");
const db = require("../../db");

const sendNotificationToAdmin = async (token, title, body) => {
  try {

    const message = {
      token,
      data: {
        type: "NEW_NOTIFICATION",
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

      await db.execute(
        `DELETE FROM admin_devices WHERE fcm_token=?`,
        [token]
      );

      return;
    }

    throw err;
  }
};

const sendStopNotification = async (token) => {
  try {

    const message = {
      token,
      data: {
        type: "STOP_NOTIFICATION",
      },
      android: {
        priority: "high",
      },
    };

    return await firebase.messaging.send(message);

  } catch (err) {
    throw err;
  }
};

module.exports = {
  sendNotificationToAdmin,
  sendStopNotification,
};
