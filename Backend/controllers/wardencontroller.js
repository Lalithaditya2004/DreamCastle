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

 exports.getWardensByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT w.* 
      FROM warden w 
      JOIN pg p ON p.WardenId = w.UserId 
      WHERE p.PGId = ?
    `, [pgId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a warden
exports.deleteWarden = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("DELETE FROM warden WHERE UserId = ?", [userId]);
    res.json({ message: "Warden deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update sal_status of a warden
exports.updateSalaryStatus = async (req, res) => {
  const { userId } = req.params;
  const { Sal_status } = req.body;
  try {
    await db.query("UPDATE warden SET Sal_status = ? WHERE UserId = ?", [Sal_status, userId]);
    res.json({ message: "Salary status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update details of a warden
exports.updateWarden = async (req, res) => {
  const { userId } = req.params;
  const { Name, Password, Email, Phno, Salary,} = req.body;
  try {
    await db.query(
      `UPDATE warden SET Name = ?, Password = ?, Email = ?, Phno = ?, Salary = ? WHERE UserId = ?`,
      [Name, Password, Email, Phno, Salary,  userId]
    );
    res.json({ message: "Warden details updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};