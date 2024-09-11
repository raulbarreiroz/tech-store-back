const express = require("express");
const router = express.Router();
const productoControlador = require("../controlador/productoControlador");

// GET /producto
router.get("/", productoControlador.getProductos.bind(productoControlador));

// GET /producto/activo
router.get(
  "/activo",
  productoControlador.getProductosActivos.bind(productoControlador)
);

// GET /producto/:id
router.get(
  "/:id",
  productoControlador.getProductoById.bind(productoControlador)
);

// POST /producto
router.post("/", productoControlador.createProducto.bind(productoControlador));

// PUT /producto/:id
router.put(
  "/:id",
  productoControlador.updateProducto.bind(productoControlador)
);

// DELETE /producto/:id
router.delete(
  "/:id",
  productoControlador.deleteProducto.bind(productoControlador)
);

module.exports = router;
