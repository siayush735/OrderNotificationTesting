const express = require("express");
const dotenv = require("dotenv");
const orderRoutes = require("./src/routes/order.routes.js");
const db = require("./db.js");
const adminRoutes = require("./src/routes/admin.routes");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notification Server Running",
  });
});

// Database Connection Test
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS currentTime");

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.post('/api/admin/register-token', (req, res) => {
  console.log('BODY:', req.body);

  res.json({
    success: true,
    message: 'Route hit successfully'
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
