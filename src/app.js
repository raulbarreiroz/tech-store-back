const express = require("express");
const bodyParser = require("body-parser");
const productoRutas = require("./rutas/productoRutas");
const categoriaRutas = require("./rutas/categoriaRutas");
const relacionRutas = require("./rutas/relacionRutas");
const errorHandler = require("./middleware/errorHandler");

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

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb" }));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
