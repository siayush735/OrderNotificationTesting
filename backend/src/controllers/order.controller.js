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

exports.acceptOrder = async (
 req,
 res
) => {

 await db.execute(
 `
 UPDATE orders
 SET status='ACCEPTED'
 WHERE id=?
 `,
 [req.params.id]
 );

 res.json({
   success:true
 });

};

exports.getLatestOrder = async (req, res) => {
  try {

    const [rows] = await db.execute(`
      SELECT
        id,
        customer_name,
        total_amount,
        status,
        created_at
      FROM orders
      WHERE status = 'PENDING'
      ORDER BY id DESC
      LIMIT 1
    `);

    res.json({
      success: true,
      order: rows.length ? rows[0] : null,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.rejectOrder = async (req, res) => {

  try {

    await db.execute(
      `
      UPDATE orders
      SET status='REJECTED'
      WHERE id=?
      `,
      [req.params.id]
    );

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

exports.acceptOrder = async (req, res) => {

  const [result] = await db.execute(
    `
    UPDATE orders
    SET status='ACCEPTED'
    WHERE id=?
    AND status='PENDING'
    `,
    [req.params.id]
  );

  if (result.affectedRows === 0) {

    return res.status(409).json({
      success: false,
      message: "Order already processed",
    });

  }

  res.json({
    success: true,
  });

};
