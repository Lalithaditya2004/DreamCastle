const db = require("../models/db");

exports.createWorker = async (req, res) => {
  const { name, role, phone, pg_id } = req.body;
  try {
    await db.query("INSERT INTO worker (name, role, phone, pg_id) VALUES (?, ?, ?, ?)", [name, role, phone, pg_id]);
    res.status(201).json({ message: "Worker added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkersByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM worker WHERE pg_id = ?", [pgId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
