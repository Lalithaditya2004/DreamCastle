const db = require("../models/db");

exports.createWarden = async (req, res) => {
  const { Name , Password , Email , Phno , Salary , Sal_status } = req.body;
  try {
    await db.query("INSERT INTO warden (Name , Password , Email , Phno , Salary , Sal_status) VALUES (?, ?, ?, ?, ?, ?)", [ Name , Password , Email , Phno , Salary , Sal_status]);
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

 