const db = require("../models/db");

exports.createWarden = async (req, res) => {
  const { name, phone, email, pg_id } = req.body;
  try {
    await db.query("INSERT INTO warden (name, phone, email, pg_id) VALUES (?, ?, ?, ?)", [name, phone, email, pg_id]);
    res.status(201).json({ message: "Warden added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWardens = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM warden");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
