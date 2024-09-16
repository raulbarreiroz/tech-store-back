const { poolPromise, sql } = require("../config/db");
const { createImagen, deleteImagen } = require("../config/abs");

class ProductoRepositorio {
  async getProductos() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute("sp_leer_producto");
      return result.recordset;
    } catch (err) {
      throw err;
    }
  }

  async getProductoById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_producto", sql.Int, id)
        .execute("sp_leer_producto");
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  }

  async getProductosActivos() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute("sp_leer_productos_activos");
      return result.recordset;
    } catch (err) {
      throw err;
    }
  }

  async createProducto(nombre, descripcion, imagen, precio) {
    try {
      let blobUrl = undefined;
      if (imagen) {
        blobUrl = await createImagen(imagen);
      }

      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("nombre", sql.VarChar(50), nombre)
        .input("descripcion", sql.VarChar(100), descripcion || null)
        .input("imagen_url", sql.VarChar(sql.MAX), blobUrl || null)
        .input("precio", sql.Float, precio || null)
        .execute("sp_inserta_producto");
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
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
    let blobUrl;
    try {
      if (!imagenUrl && !imagen) {
        // producto sin imagen, al editar tampoco se asigno una
        // en este caso hay que verificar si el producto tiene imagen en base
        const producto = await this.getProductoById(id);
        if (producto?.imagen_url) {
          await deleteImagen(producto?.imagen_url);
        }
        blobUrl = "";
      } else if (!imagenUrl && imagen) {
        // producto sin imagen que al editar se le asigno una
        blobUrl = await createImagen(imagen);
      } else if (imagenUrl && !imagen) {
        // producto con imagen, que al editar no se modificó
        blobUrl = imagenUrl;
      } else if (imagenUrl && imagen) {
        // producto con imagen, que al editar se le asigno otra
        await deleteImagen(imagenUrl);
        blobUrl = await createImagen(imagen);
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_producto", sql.Int, id)
        .input("nombre", sql.VarChar(50), nombre || null)
        .input("estado", sql.VarChar(20), estado || null)
        .input("descripcion", sql.VarChar(100), descripcion || null)
        .input("precio", sql.Float, precio || null)
        .input("imagen_url", sql.NVarChar(sql.MAX), blobUrl)
        .execute("sp_modifica_producto");            
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteProducto(id) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id_producto", sql.Int, id)
      .execute("sp_dar_baja_producto");
    return result.recordset[0];
  }
}

module.exports = new ProductoRepositorio();
