const db = require("../models/db");

exports.createGuest = async (req, res) => {
  const { name, phone, email, room_id } = req.body;
  try {
    await db.query("INSERT INTO guest (name, phone, email, room_id) VALUES (?, ?, ?, ?)", [name, phone, email, room_id]);
    res.status(201).json({ message: "Guest added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGuestsByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT g.* FROM guest g JOIN room r ON g.room_id = r.id WHERE r.pg_id = ?",
      [pgId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
