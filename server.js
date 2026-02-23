require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // 👈 Añade esto para vincular tu DB
const authRoutes = require("./routes/auth.routes");
const institutionRoutes = require("./routes/institutions.routes");
const churchRoutes = require("./routes/churches.routes");
const deliveryRoutes = require("./routes/deliveries.routes");
const groupsRoutes = require("./routes/groups.routes"); //  Importas tus rutas de grupos
const memberRoutes = require("./routes/members.routes");


const app = express();

//console.log("Groups:", groupRoutes);
//console.log("Institutions:", institutionRoutes);
//console.log("Churches:", churchRoutes);
//console.log("Deliveries:", deliveryRoutes);


app.use(cors());
app.use(express.json());

app.use("/api/institutions", institutionRoutes);
app.use("/api/churches", churchRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes); //  Conectas la ruta /api/groups
app.use("/api/members", memberRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Blitz funcionando 🚀");
});

// 2. Usar la ruta: todas las rutas de grupos empezarán con /api/groups
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/groups", require("./routes/groups.routes"));
app.use("/api/institutions", require("./routes/institutions.routes"));
app.use("/api/churches", require("./routes/churches.routes"));
app.use("/api/deliveries", require("./routes/deliveries.routes"));

// Opcional: Una ruta para probar la DB desde el navegador
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Conexión exitosa", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));