const db = require("../models/db");

exports.createRoom = async (req, res) => {
  const { RoomNo, FloorNo, Beds, Vacancies, last_cleaned, Status, PGId } = req.body;
  try {
    await db.query(
      "INSERT INTO room (RoomNo, FloorNo, Beds, Vacancies, last_cleaned, Status, PGId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [RoomNo, FloorNo, Beds, Vacancies, last_cleaned, Status, PGId]
    );
    res.status(201).json({ message: "Room added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomsByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM room WHERE PGId = ?", [pgId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomsByFloorInPG = async (req, res) => {
  const { pgId, floorNo } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM room WHERE PGId = ? AND FloorNo = ?",
      [pgId, floorNo]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomByNumberInPG = async (req, res) => {
  const { pgId, roomNo } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM room WHERE PGId = ? AND RoomNo = ?",
      [pgId, roomNo]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};