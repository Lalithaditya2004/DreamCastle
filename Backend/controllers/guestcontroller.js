const db = require("../models/db");

exports.createGuest = async (req, res) => {
  const {
    AadharID, G_name, RoomId, Fee, Fee_status,
    DOJ, DOL, Phno, DOP, PGId
  } = req.body;

  try {
    await db.query(
      "INSERT INTO guest (AadharID, G_name, RoomId, Fee, Fee_status, DOJ, DOL, Phno, DOP, PGId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [AadharID, G_name, RoomId, Fee, Fee_status, DOJ, DOL, Phno, DOP, PGId]
    );
    res.status(201).json({ message: "Guest added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGuestsByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM guest WHERE PGId = ?",
      [pgId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGuestsByRoomNumber = async (req, res) => {
  const { pgId, roomNumber } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT g.* 
       FROM guest g
       JOIN room r ON g.RoomId = r.RoomId
       WHERE r.PGId = ? AND r.RoomNo = ?`,
      [pgId, roomNumber]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGuestsByFloorNumber = async (req, res) => {
  const { pgId, floorNumber } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT g.*
       FROM guest g
       JOIN room r ON g.RoomId = r.RoomId
       WHERE r.PGId = ? AND r.FloorNo = ?`,
      [pgId, floorNumber]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



