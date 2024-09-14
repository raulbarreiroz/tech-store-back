const express = require("express");
const bodyParser = require("body-parser");
const productoRutas = require("./rutas/productoRutas");
const categoriaRutas = require("./rutas/categoriaRutas");
const relacionRutas = require("./rutas/relacionRutas");
const errorHandler = require("./middleware/errorHandler");
const compresion = require("compression");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const cors = require("cors");

app.use(cors());

// Rutas de usuario
app.use("/producto", productoRutas);
app.use("/categoria", categoriaRutas);
app.use("/relacion", relacionRutas);

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware de compresion de petición
app.use(compresion({ level: 6, threshold: 1000 }));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
