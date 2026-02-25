const db = require("../config/db");

exports.getGlobalReport = async (req, res) => {
  try {
    // 1. KPIs Principales (En una sola consulta para eficiencia)
    const kpis = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM institutions) as total_instituciones,
        (SELECT SUM(estudiantes) FROM institutions) as meta_estudiantes,
        (SELECT SUM(cantidad) FROM deliveries) as total_entregado,
        (SELECT COUNT(*) FROM groups) as total_grupos,
        (SELECT COUNT(*) FROM members) as total_voluntarios
    `);

    // 2. Entregas por Día (Para el gráfico de líneas)
    const porDia = await db.query(`
      SELECT fecha, SUM(cantidad) as total 
      FROM deliveries 
      GROUP BY fecha 
      ORDER BY fecha ASC 
      LIMIT 30
    `);

    // 3. Rendimiento por Grupo (Usando tu vista progreso_grupos)
    const porGrupo = await db.query(`SELECT * FROM progreso_grupos ORDER BY total_entregado DESC`);

    // 4. Cobertura por Jornada (Dato interesante para logística)
    const porJornada = await db.query(`
      SELECT jornada, SUM(entregados) as total 
      FROM institutions 
      GROUP BY jornada
    `);

    res.json({
      summary: kpis.rows[0],
      dailyTrend: porDia.rows,
      groupPerformance: porGrupo.rows,
      jornadaBreakdown: porJornada.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};