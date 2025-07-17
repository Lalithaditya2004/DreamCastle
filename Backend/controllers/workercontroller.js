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

