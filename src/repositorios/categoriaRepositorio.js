const { poolPromise, sql } = require("../config/db");

class CategoriaRepositorio {
  async getCategorias() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute("sp_leer_categoria");
      return result.recordset;
    } catch (err) {
      throw err;
    }
  }

  async getCategoriaById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_categoria", sql.Int, id)
        .execute("sp_leer_categoria");
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  }

  async createCategoria(nombre, descripcion) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("nombre", sql.VarChar(50), nombre)
        .input("descripcion", sql.VarChar(100), descripcion || null)
        .execute("sp_inserta_categoria");
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async updateCategoria(id, nombre, estado, descripcion) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_categoria", sql.Int, id)
        .input("nombre", sql.VarChar(50), nombre || null)
        .input("estado", sql.VarChar(20), estado || null)
        .input("descripcion", sql.VarChar(100), descripcion || null)
        .execute("sp_modifica_categoria");
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteCategoria(id) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id_categoria", sql.Int, id)
      .execute("sp_dar_baja_categoria");
  }
}

module.exports = new CategoriaRepositorio();
