const db = require("../models/db");

// Create a new worker
exports.createWorker = async (req, res) => {
  const { Name, Phno, Salary, Sal_status, Job, ReportsTo, AadharId, PGId } = req.body;
  try {
    await db.query(
      `INSERT INTO worker (Name, Phno, Salary, Sal_status, Job, ReportsTo, AadharId, PGId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [Name, Phno, Salary, Sal_status, Job, ReportsTo, AadharId, PGId]
    );
    res.status(201).json({ message: "Worker added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all workers under a specific PG
exports.getWorkersByPG = async (req, res) => {
  const { pgId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        w.Name AS WorkerName,
        w.Phno,
        w.Salary,
        w.Sal_status,
        w.Job,
        w.AadharId,
        ward.Name AS ReportsTo
      FROM worker w
      LEFT JOIN warden ward ON w.ReportsTo = ward.UserId
      WHERE w.PGId = ?
    `, [pgId]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controllers/workerController.js
exports.getWorkersByJob = async (req, res) => {
  const { pgId, job } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        w.Name AS WorkerName,
        w.Phno,
        w.Salary,
        w.Sal_status,
        w.Job,
        w.AadharId,
        ward.Name AS ReportsTo
      FROM worker w
      LEFT JOIN warden ward ON w.ReportsTo = ward.UserId
      WHERE w.PGId = ? AND w.Job = ?
    `, [pgId, job]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWorker = async (req, res) => {
  const { aadharId } = req.params;
  try {
    const [result] = await db.query("DELETE FROM worker WHERE AadharId = ?", [aadharId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json({ message: "Worker deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSalaryStatus = async (req, res) => {
  const { aadharId } = req.params;
  const { Sal_status } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE worker SET Sal_status = ? WHERE AadharId = ?",
      [Sal_status, aadharId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json({ message: "Salary status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWorker = async (req, res) => {
  const { aadharId } = req.params;
  const { Name, Phno, Salary, Job, ReportsTo } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE worker 
       SET Name = ?, Phno = ?, Salary = ?, Job = ?, ReportsTo = ? 
       WHERE AadharId = ?`,
      [Name, Phno, Salary, Job, ReportsTo, aadharId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }
    res.json({ message: "Worker details updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
