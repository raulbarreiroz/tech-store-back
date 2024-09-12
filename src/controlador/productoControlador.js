const productoServicio = require("../servicios/productoServicio");

class ProductoControlador {
  async getProductos(req, res, next) {
    try {
      const productos = await productoServicio.getProductos();
      res.json(productos);
    } catch (error) {
      next(error);
    }
  }

  async getProductosActivos(req, res, next) {
    try {
      const productos = await productoServicio.getProductosActivos();
      res.json(productos);
    } catch (error) {
      next(error);
    }
  }

  async getProductoById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 0);
      const producto = await productoServicio.getProductoById(id);
      res.json(producto);
    } catch (error) {
      next(error);
    }
  }

  async createProducto(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;
      const producto = await productoServicio.createProducto(
        nombre,
        descripcion
      );
      res.status(201).json(producto);
    } catch (error) {
      next(error);
    }
  }

  async updateProducto(req, res, next) {
    try {
      const id = parseInt(req.params.id, 0);
      const { nombre, estado, descripcion } = req.body;
      const producto = await productoServicio.updateProducto(
        id,
        nombre,
        estado,
        descripcion
      );
      res.json(producto);
    } catch (error) {
      next(error);
    }
  }

  async deleteProducto(req, res, next) {
    try {
      const id = parseInt(req.params.id, 0);
      const producto = await productoServicio.deleteProducto(id);
      res.json(producto);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductoControlador();
