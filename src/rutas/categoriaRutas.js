const express = require("express");
const router = express.Router();
const categoriaControlador = require("../controlador/categoriaControlador");

// GET /producto
router.get("/", categoriaControlador.getCategorias.bind(categoriaControlador));

// GET /producto/:id
router.get(
  "/:id",
  categoriaControlador.getCategoriaById.bind(categoriaControlador)
);

// POST /producto
router.post("/", categoriaControlador.createCategoria.bind(categoriaControlador));

// PUT /producto/:id
router.put(
  "/:id",
  categoriaControlador.updateCategoria.bind(categoriaControlador)
);

// DELETE /producto/:id
router.delete(
  "/:id",
  categoriaControlador.deleteCategoria.bind(categoriaControlador)
);

module.exports = router;
