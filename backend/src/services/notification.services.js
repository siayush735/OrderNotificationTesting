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
const sendStopNotification = async (
  token,
  notificationId
) => {

  try {

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

    return await firebase.messaging.send(message);

  } catch (err) {

    console.error(err);

  }

};

module.exports = {
  sendNotificationToAdmin,
  sendStopNotification,
};