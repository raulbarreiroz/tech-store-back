class Producto {
  constructor(
    idProducto,
    nombre,
    descripcion,
    fechaCreacion,
    estado,
    imagenUrl,
    precio,
    categorias,
    cantidad
  ) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.imagenUrl = imagenUrl;
    this.precio = precio;
    this.categorias = categorias;
    this.cantidad = cantidad;
  }
}

module.exports = Producto;
