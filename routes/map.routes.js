const router = require("express").Router();
const db = require("../config/db");
const axios = require("axios");

/*// 🤖 RUTA SECRETA: Ejecutar solo una vez para llenar la base de datos
router.get("/migrar-coordenadas", async (req, res) => {
  try {
    // 1. Buscamos las instituciones que NO tienen latitud todavía
    const { rows } = await db.query("SELECT id, maps_url FROM institutions WHERE lat IS NULL");
    let actualizados = 0;

    for (let inst of rows) {
      if (!inst.maps_url) continue;

      try {
        // 2. Axios visita el link corto y sigue las redirecciones hasta el link largo real
        const response = await axios.get(inst.maps_url);
        const urlFinal = response.request.res.responseUrl; // Aquí está el link completo con números

        // 3. Extraemos las coordenadas con una expresión regular (buscamos el @lat,lng)
        const match = urlFinal.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);

          // 4. Guardamos en la base de datos
          await db.query("UPDATE institutions SET lat = $1, lng = $2 WHERE id = $3", [lat, lng, inst.id]);
          actualizados++;
        }
      } catch (error) {
        console.log(`No se pudo extraer de la ID ${inst.id}`);
      }
    }
    
    res.json({ mensaje: `¡Migración completada! Se actualizaron ${actualizados} ubicaciones.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

// 2. LA RUTA PARA EL MAPA (Lo que lee React)
router.get("/locations", async (req, res) => {
  try {
    const query = `
      SELECT 
        i.id, i.nombre, i.maps_url, i.lat, i.lng, g.nombre as grupo,
        CASE WHEN d.id IS NOT NULL THEN 'entregado' ELSE 'pendiente' END as estado
      FROM institutions i
      JOIN grupos g ON i.grupo_id = g.id
      LEFT JOIN entregas d ON i.id = d.institution_id
      WHERE i.lat IS NOT NULL
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;