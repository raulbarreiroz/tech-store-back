const relacionServicio = require("../servicios/relacionServicio");

class RelacionControlador {
  async createRelacion(req, res, next) {
    try {
      const { idProducto, idCategoria } = req.body;
      const relacion = await relacionServicio.createRelacion(
        idProducto,
        idCategoria
      );
      res.status(201).json(relacion);
    } catch (error) {
      next(error);
    }
  }

  async deleteRelacion(req, res, next) {
    try {
      const id = parseInt(req.params.id, 0);
      const relacion = await relacionServicio.deleteRelacion(id);
      res.json(relacion);
    } catch (error) {
      next(error);
    }
  }

  async deleteRelacionesPorProducto(req, res, next) {
    try {
      const id = parseInt(req.params.id, 0);
      const relacion = await relacionServicio.deleteRelacionesProducto(id);
      res.json(relacion);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RelacionControlador();
