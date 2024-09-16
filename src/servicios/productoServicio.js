const productoRepositorio = require("../repositorios/productoRepositorio");
const Producto = require("../modelos/productoModelo");
const Categoria = require("../modelos/categoriaModelo");

class ProductoServicio {
  async getProductos() {
    const productos = await productoRepositorio.getProductos();
    return productos?.map(
      (producto) =>
        new Producto(
          producto?.id_producto,
          producto?.nombre,
          producto?.descripcion,
          producto?.fecha_creacion,
          producto?.estado,
          producto?.imagen_url,
          producto?.precio,
          producto?.categorias
        )
    );
  }

  async getProductoById(id) {
    const producto = await productoRepositorio.getProductoById(id);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return new Producto(
      producto?.id_producto,
      producto?.nombre,
      producto?.descripcion,
      producto?.fecha_creacion,
      producto?.estado,
      producto?.imagen_url,
      producto?.precio,
      producto?.categorias
    );
  }

  async getProductosActivos(id) {
    const productos = await productoRepositorio.getProductosActivos();
    return productos?.map((producto) => {
      const categorias = [];
      if (producto?.categorias) {
        const categoriasList = JSON.parse(producto?.categorias);
        if (categoriasList) {
          categoriasList?.forEach((categoria) => {
            categorias?.push(
              new Categoria(
                categoria?.id_categoria,
                categoria?.nombre_categoria,
                categoria?.descripcion_categoria,
                categoria?.fecha_creacion_categoria,
                categoria?.estado_categoria,
                categoria?.id_relacion
              )
            );
          });
        }
      }
      return new Producto(
        producto?.id_producto,
        producto?.nombre_producto,
        producto?.descripcion_producto,
        producto?.fecha_creacion_producto,
        producto?.estado_producto,
        producto?.imagen_url_producto,
        producto?.precio_producto,
        categorias
      );
    });
  }

  async createProducto(nombre, descripcion, imagen, precio) {
    const producto = await productoRepositorio.createProducto(
      nombre,
      descripcion,
      imagen,
      precio
    );

    return new Producto(
      producto?.id_producto,
      producto?.nombre,
      producto?.descripcion,
      producto?.fecha_creacion,
      producto?.estado,
      producto?.imagen_url,
      producto?.precio,
      producto?.categorias
    );
  }

  async updateProducto(
    id,
    nombre,
    estado,
    descripcion,
    imagenUrl,
    precio,
    imagen
  ) {
    const producto = await productoRepositorio.updateProducto(
      id,
      nombre,
      estado,
      descripcion,
      imagenUrl,
      precio,
      imagen
    );
    if (!producto) {
      throw new Error("Error al actualizar el producto");
    }
    return new Producto(
      producto?.id_producto,
      producto?.nombre,
      producto?.descripcion,
      producto?.fecha_creacion,
      producto?.estado,
      producto?.imagen_url,
      producto?.precio,
      producto?.categorias
    );
  }

  async deleteProducto(id) {
    const producto = await productoRepositorio.deleteProducto(id);
    if (!producto) {
      throw new Error("Error al eliminar el producto");
    }
    return new Producto(
      producto?.id_producto,
      producto?.nombre,
      producto?.descripcion,
      producto?.fecha_creacion,
      producto?.estado,
      producto?.imagen_url,
      producto?.precio,
      producto?.categorias
    );
  }
}

module.exports = new ProductoServicio();
