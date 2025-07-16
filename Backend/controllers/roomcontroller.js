const db = require("../models/db");

exports.createRoom = async (req, res) => {
  const { room_no, type, rent, pg_id } = req.body;
  try {
    await db.query("INSERT INTO room (room_no, type, rent, pg_id) VALUES (?, ?, ?, ?)", [room_no, type, rent, pg_id]);
    res.status(201).json({ message: "Room added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomsByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM room WHERE pg_id = ?", [pgId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
