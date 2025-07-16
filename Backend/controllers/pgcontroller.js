const db = require("../models/db");

exports.createPG = async (req, res) => {
  const { name, address, city } = req.body;
  try {
    await db.query("INSERT INTO pg (Name, Address, City) VALUES (?, ?, ?)", [name, address, city]);
    res.status(201).json({ message: "PG created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPGs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pg");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
