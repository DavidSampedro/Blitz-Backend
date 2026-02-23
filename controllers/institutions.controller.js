const db = require("../config/db");
const { v4: uuidv4 } = require("uuid"); // 👈 Descomentado para que funcione el ID

// ==========================================
// 1. CREAR INSTITUCIÓN
// ==========================================
exports.createInstitution = async (req, res) => {
  try {
    const {
      nombre,
      direccion,
      lat,
      lng,
      jornada,
      estudiantes,
      group_id,
      campaign_id,
      maps_url
    } = req.body;

    const result = await db.query(
      `INSERT INTO institutions
       (id, nombre, direccion, lat, lng, jornada, estudiantes, group_id, campaign_id, maps_url) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`, // 👈 Corregido: Agregado el 'id' 
      [uuidv4(), nombre, direccion, lat, lng, jornada, estudiantes, group_id, campaign_id, maps_url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 2. LISTAR TODAS LAS INSTITUCIONES
// ==========================================
exports.getInstitutions = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, g.nombre as grupo
      FROM institutions i
      LEFT JOIN groups g ON g.id = i.group_id
      ORDER BY i.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 3. OBTENER UNA SOLA INSTITUCIÓN POR ID
// ==========================================
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM institutions WHERE id=$1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 4. OBTENER INSTITUCIONES DE UN GRUPO ESPECÍFICO (La nueva función)
// ==========================================
exports.getInstitutionsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    // Usamos un LEFT JOIN con la tabla de deliveries para sumar las cantidades
    const query = `
      SELECT i.*, 
      COALESCE(SUM(d.cantidad), 0) as total_entregado
      FROM institutions i
      LEFT JOIN deliveries d ON i.id = d.institution_id
      WHERE i.group_id = $1
      GROUP BY i.id
      ORDER BY i.nombre ASC
    `;
    const result = await db.query(query, [groupId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 5. ACTUALIZAR INSTITUCIÓN
// ==========================================
exports.updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      direccion,
      lat,
      lng,
      jornada,
      estudiantes,
      entregados,
      group_id
    } = req.body;

    const result = await db.query(
      `UPDATE institutions SET
       nombre=$1,
       direccion=$2,
       lat=$3,
       lng=$4,
       jornada=$5,
       estudiantes=$6,
       entregados=$7,
       group_id=$8
       WHERE id=$9
       RETURNING *`,
      [nombre, direccion, lat, lng, jornada, estudiantes, entregados, group_id, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 6. ELIMINAR INSTITUCIÓN
// ==========================================
exports.deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM institutions WHERE id=$1", [id]);

    res.json({ message: "Institución eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};