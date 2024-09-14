const categoriaRepositorio = require("../repositorios/categoriaRepositorio");
const Categoria = require("../modelos/categoriaModelo");

class CategoriaServicio {
  async getCategorias() {
    const categorias = await categoriaRepositorio.getCategorias();
    return categorias?.map(
      (categoria) =>
        new Categoria(
          categoria.id_categoria,
          categoria.nombre,
          categoria.descripcion,
          categoria.fecha_creacion,
          categoria.estado
        )
    );
  }

  async getCategoriaById(id) {
    const categoria = await categoriaRepositorio.getCategoriaById(id);
    if (!categoria) {
      throw new Error("Categoria no encontrado");
    }
    return new Categoria(
      categoria.id_categoria,
      categoria.nombre,
      categoria.descripcion,
      categoria.fecha_creacion,
      categoria.estado
    );
  }

  async createCategoria(nombre, descripcion) {
    const categoria = await categoriaRepositorio.createCategoria(
      nombre,
      descripcion
    );
    return new Categoria(
      categoria.id_categoria,
      categoria.nombre,
      categoria.descripcion,
      categoria.fecha_creacion,
      categoria.estado
    );
  }

  async updateCategoria(id, nombre, descripcion, fecha_creacion, estado) {
    const categoria = await categoriaRepositorio.updateCategoria(
      id,
      nombre,
      descripcion,
      fecha_creacion,
      estado
    );
    if (!categoria) {
      throw new Error("Error al actualizar la categoria");
    }
    return new Categoria(
      categoria.id_categoria,
      categoria.nombre,
      categoria.descripcion,
      categoria.fecha_creacion,
      categoria.estado
    );
  }

  async deleteCategoria(id) {
    await categoriaRepositorio.deleteCategoria(id);    
  }
}

module.exports = new CategoriaServicio();
