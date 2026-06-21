const db = require("../../db");

const {
 sendNewOrderNotification
} = require("../services/notification.services");

exports.createOrder = async (
 req,
 res
) => {

 try {

   const {
      customer_name,
      total_amount
   } = req.body;

   const [result] =
      await db.execute(
        `
        INSERT INTO orders
        (
          customer_name,
          total_amount,
          status
        )
        VALUES
        (
          ?,
          ?,
          'PENDING'
        )
      `,
      [customer_name, total_amount]
   );

   const orderId = result.insertId;

   const [admins] =
     await db.execute(
       `
       SELECT fcm_token
       FROM admin_devices
       `
     );

   for(const admin of admins){

      await sendNewOrderNotification(
         admin.fcm_token,
         orderId
      );
   }

   res.json({
      success:true,
      orderId
   });

 } catch(err){

   res.status(500).json({
      success:false,
      message:err.message
   });

 }
};