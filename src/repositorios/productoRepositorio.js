const { poolPromise, sql } = require("../config/db");

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

  async createProducto(nombre, descripcion) {
    try {
      console.log("aqui");
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("nombre", sql.VarChar(50), nombre)
        .input("descripcion", sql.VarChar(100), descripcion || null)
        .execute("sp_inserta_producto");
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async updateProducto(id, nombre, estado, descripcion) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_producto", sql.Int, id)
        .input("nombre", sql.VarChar(50), nombre || null)
        .input("estado", sql.VarChar(20), estado || null)
        .input("descripcion", sql.VarChar(100), descripcion || null)
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
