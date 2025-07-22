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
  const { pgId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT o.* 
       FROM owner o
       JOIN pg p ON o.UserID = p.OwnerID
       WHERE p.PGId = ?`,
      [pgId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateOwner = async (req, res) => {
  const { userId } = req.params;
  const { Name, Password, phone, email } = req.body;
  try {
    await db.query(
      "UPDATE owner SET Name = ?, Password = ?, Phno = ?, Email = ? WHERE UserID = ?",
      [Name, Password, phone, email, userId]
    );
    res.json({ message: "Owner updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
