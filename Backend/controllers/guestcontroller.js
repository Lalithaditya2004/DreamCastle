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
exports.deleteGuest = async (req, res) => {
  const { aadharId } = req.params;
  try {
    await db.query("DELETE FROM guest WHERE AadharID = ?", [aadharId]);
    res.json({ message: "Guest deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFeeStatus = async (req, res) => {
  const { aadharId } = req.params;
  const { Fee_status } = req.body;
  const DOP = new Date().toISOString().split('T')[0];
  try {
    await db.query(
      "UPDATE guest SET Fee_status = ?, DOP = ? WHERE AadharID = ?",
      [Fee_status, DOP, aadharId]
    );
    res.json({ message: "Fee status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDOL = async (req, res) => {
  const { aadharId } = req.params;
  const { DOL } = req.body;
  try {
    await db.query(
      "UPDATE guest SET DOL = ? WHERE AadharID = ?",
      [DOL, aadharId]
    );
    res.json({ message: "Date of leaving updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGuestDetails = async (req, res) => {
  const { aadharId } = req.params;
  const {
    G_name, RoomId, Fee, Fee_status, DOJ, DOL, Phno, DOP, PGId
  } = req.body;
  try {
    await db.query(
      `UPDATE guest 
       SET G_name = ?, RoomId = ?, Fee = ?, Fee_status = ?, DOJ = ?, DOL = ?, Phno = ?, DOP = ?, PGId = ?
       WHERE AadharID = ?`,
      [G_name, RoomId, Fee, Fee_status, DOJ, DOL, Phno, DOP, PGId, aadharId]
    );
    res.json({ message: "Guest details updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPendingGuestsByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM guest WHERE PGId = ? AND Fee_status = 'Pending'",
      [pgId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignRoomToGuest = async (req, res) => {
  const { aadharId } = req.params;
  const { roomId } = req.body;

  try {
    // Check room has vacancy
    const [[room]] = await db.query(
      "SELECT Vacancies FROM room WHERE RoomId = ?",
      [roomId]
    );

    if (!room || room.Vacancies <= 0) {
      return res.status(400).json({ error: "No vacancies in this room" });
    }

    // Update guest details
    await db.query(
      "UPDATE guest SET RoomId = ?, Fee_status = 'Paid' WHERE AadharID = ?",
      [roomId, aadharId]
    );

    // Decrement room vacancy
    await db.query(
      "UPDATE room SET Vacancies = Vacancies - 1 WHERE RoomId = ?",
      [roomId]
    );

    res.json({ message: "Room assigned to guest successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

