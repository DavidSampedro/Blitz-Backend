/*const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.getGroups = async (req,res)=>{
 try{
  const result = await db.query("SELECT * FROM groups");
  res.json(result.rows);
 }catch(err){
  res.status(500).json(err.message);
 }
};

exports.createGroup = async (req,res)=>{
 try{
  const { nombre, lider, campaign_id } = req.body;

  const result = await db.query(
   "INSERT INTO groups(id,nombre,lider,campaign_id) VALUES($1,$2,$3,$4) RETURNING *",
   [uuidv4(), nombre, lider, campaign_id]
  );

  res.json(result.rows[0]);

 }catch(err){
  res.status(500).json(err.message);
 }
};*/

const db = require("../config/db"); // Usando tu ruta exacta
const { v4: uuidv4 } = require("uuid");

// 1. OBTENER GRUPOS (Tu código mejorado con ORDER BY)
exports.getGroups = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM groups ORDER BY nombre ASC");
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({ error: err.message }); // Mejor enviar JSON que string pelado
  }
};

// 2. CREAR GRUPO (Tu código intacto)
exports.createGroup = async (req, res) => {
  try {
    // Si campaign_id no viene del frontend, le ponemos null por defecto
    const { nombre, lider, campaign_id = null } = req.body;

    const result = await db.query(
      "INSERT INTO groups(id, nombre, lider, campaign_id) VALUES($1, $2, $3, $4) RETURNING *",
      [uuidv4(), nombre, lider, campaign_id]
    );

    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. ELIMINAR GRUPO (NUEVO - Necesario para la papelera de React)
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params; // Capturamos el ID de la URL
    
    // ON DELETE CASCADE en tu BD hará que se borren sus miembros e instituciones automáticamente
    const result = await db.query(
      "DELETE FROM groups WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    res.json({ message: "Grupo eliminado con éxito", deleted: result.rows[0] });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};