const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// CREAR ENTREGA (Actualizado con Fecha y Sincronización)
exports.createDelivery = async (req, res) => {
  try {
    const { cantidad, group_id, institution_id, fecha } = req.body;

    // 1. Insertamos en la tabla de entregas (Trazabilidad)
    const result = await db.query(
      `INSERT INTO deliveries (id, cantidad, group_id, institution_id, fecha)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [uuidv4(), cantidad, group_id, institution_id, fecha || new Date()]
    );

    // 2. Actualizamos el resumen en la tabla de instituciones
    // Esto permite que las consultas de la tabla sigan siendo rápidas
    await db.query(
      `UPDATE institutions
       SET entregados = COALESCE(entregados, 0) + $1
       WHERE id = $2`,
      [cantidad, institution_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en createDelivery:", err);
    res.status(500).json({ error: err.message });
  }
};

// LISTAR ENTREGAS (Con nombres de grupo e institución)
exports.getDeliveries = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        d.id, 
        d.cantidad, 
        d.fecha, 
        g.nombre as grupo, 
        i.nombre as institucion
      FROM deliveries d
      LEFT JOIN groups g ON g.id = d.group_id
      LEFT JOIN institutions i ON i.id = d.institution_id
      ORDER BY d.fecha DESC, d.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ELIMINAR ENTREGA (¡Importante!: Resta la cantidad al borrar)
exports.deleteDelivery = async (req, res) => {
  const client = await db.connect(); // Usamos una transacción para seguridad
  try {
    await client.query('BEGIN');
    const { id } = req.params;

    // 1. Obtenemos los datos de la entrega antes de borrarla
    const deliveryRes = await client.query(
      "SELECT cantidad, institution_id FROM deliveries WHERE id = $1", 
      [id]
    );

    if (deliveryRes.rows.length > 0) {
      const { cantidad, institution_id } = deliveryRes.rows[0];

      // 2. Restamos la cantidad de la institución para mantener sincronía
      await client.query(
        "UPDATE institutions SET entregados = entregados - $1 WHERE id = $2",
        [cantidad, institution_id]
      );

      // 3. Borramos la entrega
      await client.query("DELETE FROM deliveries WHERE id = $1", [id]);
    }

    await client.query('COMMIT');
    res.json({ message: "Entrega eliminada y stock actualizado" });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// --- ESTADÍSTICAS Y PROGRESO ---

exports.totalGlobal = async (req, res) => {
  try {
    const result = await db.query("SELECT SUM(cantidad) as total FROM deliveries");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.progress = async (req, res) => {
  try {
    const total = await db.query("SELECT SUM(cantidad) as sum FROM deliveries");
    const meta = await db.query("SELECT meta_global FROM campaigns LIMIT 1");

    const entregado = parseInt(total.rows[0].sum) || 0;
    const metaGlobal = meta.rows[0]?.meta_global || 0;

    const porcentaje = metaGlobal > 0 ? ((entregado / metaGlobal) * 100).toFixed(2) : 0;

    res.json({ entregado, meta: metaGlobal, porcentaje });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.byGroup = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.nombre, COALESCE(SUM(d.cantidad), 0) as total
      FROM groups g
      LEFT JOIN deliveries d ON d.group_id = g.id
      GROUP BY g.nombre
      ORDER BY total DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupProgress = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM progreso_grupos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};