const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");


// CREAR
exports.createChurch = async (req,res)=>{
 try{
  const {
   nombre,
   direccion,
   lat,
   lng,
   pastor,
   orador,
   companero,
   horario,
   minutos,
   campaign_id
  } = req.body;

  const result = await db.query(
   `INSERT INTO churches
   (id,nombre,direccion,lat,lng,pastor,orador,companero,horario,minutos,campaign_id)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
   RETURNING *`,
   [uuidv4(),nombre,direccion,lat,lng,pastor,orador,companero,horario,minutos,campaign_id]
  );

  res.json(result.rows[0]);

 }catch(err){
  res.status(500).json(err.message);
 }
};


// LISTAR
exports.getChurches = async (req,res)=>{
 try{
  const result = await db.query(`
   SELECT *
   FROM churches
   ORDER BY created_at DESC
  `);

  res.json(result.rows);

 }catch(err){
  res.status(500).json(err.message);
 }
};


// OBTENER UNA
exports.getOne = async (req,res)=>{
 try{
  const { id } = req.params;

  const result = await db.query(
   "SELECT * FROM churches WHERE id=$1",
   [id]
  );

  res.json(result.rows[0]);

 }catch(err){
  res.status(500).json(err.message);
 }
};


// ACTUALIZAR
exports.updateChurch = async (req,res)=>{
 try{
  const { id } = req.params;

  const {
   nombre,
   direccion,
   lat,
   lng,
   pastor,
   orador,
   companero,
   horario,
   minutos
  } = req.body;

  const result = await db.query(
   `UPDATE churches SET
   nombre=$1,
   direccion=$2,
   lat=$3,
   lng=$4,
   pastor=$5,
   orador=$6,
   companero=$7,
   horario=$8,
   minutos=$9
   WHERE id=$10
   RETURNING *`,
   [nombre,direccion,lat,lng,pastor,orador,companero,horario,minutos,id]
  );

  res.json(result.rows[0]);

 }catch(err){
  res.status(500).json(err.message);
 }
};


// ELIMINAR
exports.deleteChurch = async (req,res)=>{
 try{
  const { id } = req.params;

  await db.query("DELETE FROM churches WHERE id=$1",[id]);

  res.json("Iglesia eliminada");

 }catch(err){
  res.status(500).json(err.message);
 }
};