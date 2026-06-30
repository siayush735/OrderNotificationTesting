const firebase = require("../config/firebase");

const sendNotificationToAdmin = async (
    token,
    notificationId,
    title,
    body
) => {

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

    return firebase.messaging.send(message);
};
const firebase = require("../config/firebase");

const sendNotificationToAdmin = async (
  token,
  notificationId,
  title,
  body
) => {
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

    console.log("Firebase code:", err.code);
    console.log("Firebase message:", err.message);
    console.log(err);

    throw err;
  }
};

module.exports = {
  sendNotificationToAdmin,
  sendStopNotification,
};