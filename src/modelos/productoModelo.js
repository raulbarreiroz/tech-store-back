class Producto {
  constructor(
    idProducto,
    nombre,
    descripcion,
    fechaCreacion,
    estado,
    imagen,
    precio,
    categorias
  ) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.categorias = categorias;
    this.imagen = imagen;
    this.precio = precio;
  }
}

module.exports = Producto;
