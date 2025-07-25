const db = require("../models/db");

exports.createRoom = async (req, res) => {
  const { RoomNo, FloorNo, Beds, last_cleaned, Status, PGId } = req.body;
  try {
    await db.query(
      "INSERT INTO room (RoomNo, FloorNo, Beds, Vacancies, last_cleaned, Status, PGId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [RoomNo, FloorNo, Beds, Beds, last_cleaned, Status, PGId]
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

exports.getVacantRooms = async (req, res) => {
  const { pgId } = req.params;
  const { floor, date, beds, status } = req.query;

  let query = `
    SELECT r.*
    FROM room r
    LEFT JOIN guest g ON r.RoomId = g.RoomId
    WHERE r.PGId = ? 
      AND (g.DOL < ? OR g.DOL IS NULL)
  `;
  const values = [pgId, date || new Date().toISOString().slice(0, 10)];

  if (floor) {
    query += " AND r.FloorNo = ?";
    values.push(floor);
  }

  if (beds) {
    query += " AND r.Beds = ?";
    values.push(beds);
  }

  if (status) {
    query += " AND r.Status = ?";
    values.push(status);
  }

  try {
    const [rows] = await db.query(query, values);
    const filtered = rows.filter((room) => {
      return room.Status !== "Full"; 
    });
    res.json(status ? rows : filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCleaningStatus = async (req, res) => {
  const { pgId, floorNo } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT RoomNo, last_cleaned FROM room WHERE PGId = ? AND FloorNo = ?",
      [pgId, floorNo]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};