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

exports.getAllPGs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pg");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


 