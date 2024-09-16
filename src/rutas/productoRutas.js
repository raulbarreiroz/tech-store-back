const express = require("express");
const router = express.Router();
const productoControlador = require("../controlador/productoControlador");
const multer = require("multer");

// multer almacenará archivos temporales
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // directorio temporal
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const post = multer({ storage: storage });
const put = multer({ storage: storage });

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
router.post("/", post.single("imagen"), productoControlador.createProducto);

// PUT /producto/:id
router.put("/:id", post.single("imagen"), productoControlador?.updateProducto);

// DELETE /producto/:id
router.delete(
  "/:id",
  productoControlador.deleteProducto.bind(productoControlador)
);

module.exports = router;
