const productoServicio = require("../servicios/productoServicio");
const relacionServicio = require("../servicios/relacionServicio");

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
      const { nombre, descripcion, precio, categorias } = req.body;
      const imagen = req.file;
      const producto = await productoServicio.createProducto(
        nombre,
        descripcion,
        imagen,
        precio
      );

      if (producto && categorias?.length) {
        for (const categoria of categorias) {
          const relacion = await relacionServicio?.createRelacion(
            producto?.idProducto,
            categoria?.idCategoria
          );
          producto?.categorias?.map((cat) => {
            if (cat?.idCategoria === categoria?.idCategoria) {
              cat.idRelacionConProducto = relacion?.idRelacion;
            }
            return cat;
          });
        }
      }

      res.status(201).json(producto);
    } catch (error) {
      next(error);
    }
  }

  async updateProducto(req, res, next) {
    try {
      const id = parseInt(req.params.id, 0);
      let imagen = req.file;
      const { nombre, estado, descripcion, imagenUrl, precio, categorias } =
        req.body;

      const producto = await productoServicio.updateProducto(
        id,
        nombre,
        estado,
        descripcion,
        imagenUrl,
        precio,
        imagen
      );

      try {
        await relacionServicio?.deleteRelacionesProducto(id);

        if (categorias?.length > 0) {
          for (const categoria of categorias) {
            const relacion = await relacionServicio?.createRelacion(
              id,
              categoria?.idCategoria
            );
            categoria.idRelacionConProducto = relacion?.idRelacion;
          }
        }
      } catch (err) {
        console.log(err);
      }

      res.json(producto?.categorias);
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
