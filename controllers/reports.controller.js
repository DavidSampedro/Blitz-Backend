const db = require("../config/db");

exports.getGlobalReport = async (req, res) => {
  try {
    // 1. KPIs Principales (En una sola consulta para eficiencia)
    const kpis = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM institutions)::INT as total_instituciones,
        60000::INT as meta_estudiantes, 
        COALESCE((SELECT SUM(cantidad) FROM deliveries), 0)::INT as total_entregado,
        (SELECT COUNT(*) FROM groups)::INT as total_grupos,
        (SELECT COUNT(*) FROM members)::INT as total_voluntarios
    `);
        //COALESCE((SELECT SUM(estudiantes) FROM institutions), 0)::INT as meta_estudiantes, -- para definir la meta con sumas


    // 2. Entregas por Día (Para el gráfico de líneas)
    const porDia = await db.query(`
      SELECT fecha, SUM(cantidad) as total 
      FROM deliveries 
      GROUP BY fecha 
      ORDER BY fecha ASC 
      LIMIT 30
    `);

    // 3. Rendimiento por Grupo (Usando tu vista progreso_grupos)
    const porGrupo = await db.query(`SELECT nombre, total_entregado::INT FROM progreso_grupos ORDER BY total_entregado DESC`);

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