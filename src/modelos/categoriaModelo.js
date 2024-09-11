class Categoria {
  constructor(
    idCategoria,
    nombre,
    descripcion,
    fechaCreacion,
    estado,
    idRelacionConProducto = null
  ) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.idRelacionConProducto = idRelacionConProducto;
  }
}

module.exports = Categoria;
