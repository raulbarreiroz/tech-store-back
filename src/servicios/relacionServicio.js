const relacionRepositorio = require("../repositorios/relacionRepositorio");
const Relacion = require("../modelos/relacionModelo");

class RelacionServicio {
  async createRelacion(idProducto, idCategoria) {
    const relacion = await relacionRepositorio.createRelacion(
      idProducto,
      idCategoria
    );
    return new Relacion(
      relacion?.id_relacion,
      relacion?.id_producto,
      relacion?.id_categoria
    );
  }

  async deleteRelacion(id) {
    await relacionRepositorio.deleteRelacion(id);
  }

  async deleteRelacionesProducto(id) {
    await relacionRepositorio.deleteRelacionesProducto(id);
  }
}

module.exports = new RelacionServicio();
