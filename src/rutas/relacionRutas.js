const express = require("express");
const router = express.Router();
const relacionControlador = require("../controlador/relacionControlador");

// POST /producto
router.post("/", relacionControlador.createRelacion.bind(relacionControlador));

// DELETE /producto/:id
router.delete(
  "/:id",
  relacionControlador.deleteRelacion.bind(relacionControlador)
);

// DELETE
router.delete(
  "/producto/:id",
  relacionControlador.deleteRelacionesPorProducto.bind(relacionControlador)
);

module.exports = router;
