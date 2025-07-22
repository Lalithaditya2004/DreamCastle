const db = require("../models/db");

exports.createPG = async (req, res) => {
  const { OwnerID , WardenID, Nofloors , Revenue, Name , Address , City  } = req.body;
  try {
    await db.query("INSERT INTO pg ( OwnerID , WardenID, Nofloors , Revenue, Name , Address , City ) VALUES (?, ?, ? , ?, ?, ?, ?)", [ OwnerID , WardenID, Nofloors , Revenue, Name , Address , City ]);
    res.status(201).json({ message: "PG created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getAllPGs = async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM pg");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



exports.getPGsByOwnerId = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM pg WHERE OwnerID = ?", [ownerId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePG = async (req, res) => {
  const { pgId } = req.params;
  try {
    await db.query("DELETE FROM pg WHERE PGId = ?", [pgId]);
    res.json({ message: "PG deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePGDetails = async (req, res) => {
  const { pgId } = req.params;
  const { Name, Address, City, Nofloors } = req.body;
  try {
    await db.query(
      "UPDATE pg SET Name = ?, Address = ?, City = ?, Nofloors = ? WHERE PGId = ?",
      [Name, Address, City, Nofloors, pgId]
    );
    res.json({ message: "PG details updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePGRevenue = async (req, res) => {
  const { pgId } = req.params;
  const { Revenue } = req.body;
  try {
    await db.query("UPDATE pg SET Revenue = ? WHERE PGId = ?", [Revenue, pgId]);
    res.json({ message: "Revenue updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWardenID = async (req, res) => {
  const { pgId } = req.params;
  const { WardenID } = req.body;
  try {
    await db.query("UPDATE pg SET WardenID = ? WHERE PGId = ?", [WardenID, pgId]);
    res.json({ message: "WardenID updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};