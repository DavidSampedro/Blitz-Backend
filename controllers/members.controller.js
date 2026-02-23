const db = require("../config/db");

// Listar miembros de un grupo
exports.getMembersByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await db.query(
      "SELECT * FROM members WHERE group_id = $1 ORDER BY nombre ASC", 
      [groupId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agregar un miembro
exports.addMember = async (req, res) => {
  try {
    const { nombre, telefono, group_id } = req.body;
    const result = await db.query(
      "INSERT INTO members (nombre, telefono, group_id) VALUES ($1, $2, $3) RETURNING *",
      [nombre, telefono, group_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un miembro
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM members WHERE id = $1", [id]);
    res.json({ message: "Miembro eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};