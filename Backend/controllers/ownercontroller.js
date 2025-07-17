const db = require("../models/db");

exports.createOwner = async (req, res) => {
  const { Name, Password, phone, email} = req.body;
  try {
    await db.query("INSERT INTO owner ( Name, Password, Phno, Email) VALUES (?, ?, ?, ?)", [ Name, Password, phone, email]);
    res.status(201).json({ message: "Owner added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOwners = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM owner");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
