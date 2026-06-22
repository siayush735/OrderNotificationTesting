const firebase = require("../config/firebase");

const sendNewOrderNotification = async (
  fcmToken,
  orderId
) => {
  try {

const message = {
  token: fcmToken,

  data: {
    type: 'NEW_ORDER',
    orderId: String(orderId),
    title: 'New Order Received',
    body: `Order #${orderId}`,
  },

  android: {
    priority: 'high',
  },
};

const response =
  await firebase.messaging.send(message);

    console.log(
      "FCM SUCCESS:",
      response
    );

    return response;

  } catch (err) {

    console.error(
      "FCM ERROR:",
      err
    );

  }
};

module.exports = {
  sendNewOrderNotification,
};