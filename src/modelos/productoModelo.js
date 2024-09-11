class Producto {
  constructor(
    idProducto,
    nombre,
    descripcion,
    fechaCreacion,
    estado,
    categorias
  ) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.categorias = categorias;
  }
}

module.exports = Producto;
