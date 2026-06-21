import db from "./config/db.js";

try {
  const [rows] = await db.query(
    "SELECT 1 AS test"
  );

  console.log(rows);
} catch (err) {
  console.error(err);
}