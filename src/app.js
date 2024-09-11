const express = require("express");
const bodyParser = require("body-parser");
const productoRutas = require("./rutas/productoRutas");
const categoriaRutas = require("./rutas/categoriaRutas")
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rutas de usuario
app.use("/producto", productoRutas);
app.use("/categoria", categoriaRutas)

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
