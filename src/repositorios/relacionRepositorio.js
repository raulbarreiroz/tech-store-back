const { poolPromise, sql } = require("../config/db");

class RelacionRepositorio {
  async createRelacion(idProducto, idCategoria) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_producto", sql.Int, idProducto)
        .input("id_categoria", sql.Int, idCategoria)
        .execute("sp_inserta_productoXcategoria");
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteRelacion(id) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id_productoXcategoria", sql.Int, id)
      .execute("sp_dar_baja_productoXcategoria");
  }

  async deleteRelacionesProducto(id) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id_producto", sql.Int, id)
      .execute("sp_dar_baja_relacion_de_producto");
  }
}

module.exports = new RelacionRepositorio();
