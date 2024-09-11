const categoriaServicio = require("../servicios/categoriaServicio");

class CategoriaControlador {
  async getCategorias(req, res, next) {
    try {
      const categorias = await categoriaServicio.getCategorias();
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async getCategoriaById(req, res, next) {
    try {      
      const id = parseInt(req.params.id, 10);
      const categoria = await categoriaServicio.getCategoriaById(id);
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async createCategoria(req, res, next) {
    try {
      const { nombre, descripcion } = req.body;
      const categoria = await categoriaServicio.createCategoria(
        nombre,
        descripcion
      );
      res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async updateCategoria(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const { nombre, estado, descripcion } = req.body;
      const categoria = await categoriaServicio.updateCategoria(
        id,
        nombre,
        estado,
        descripcion
      );
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategoria(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const categoria = await categoriaServicio.deleteCategoria(id);
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoriaControlador();
