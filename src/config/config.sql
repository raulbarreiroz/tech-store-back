-- pasos realizados en Azure Portal
-- use master
-- create database inventario;
-- use cuestionario;

-- Requerimientos

/*
productos		: almacenar información inherente a los productos del inventario
categorias		: información por la cual se clasifican los productos
modificacion	: guarda un registro de las modificaciones que se hicieron a productos 
				  con sus respectivas categorias
*/

-- Paso 1: Modelado de datos
/*
Entidades claves:
producto			:	representa el producto
categoria			:	representa la categoria
productoXcategoria	:	represneta la relación entre el producto y la categoría
						(relación muchos a muchos)

--  Paso 1: Diagrama Entidad-Relación (ER)
- producto:
id_producto			(PK, int)
nombre				(varchar)
descripcion			(varchar)
fecha_creacion		(datetime)
estado				(varchar)

- categoria:
id_categoria		(PK, int)
nombre				(varchar)
fecha_creacion		(datetima)
estado				(varchar)

- productoXcategoria:
id					(PK, int)
id_producto			(FK, int)
id_categoria			(FK, int)
fecha_creacion		(datetime)
estado				(datetime)

-- el estado podría ser otra tabla (catálogo)

- modificacion:
id_modificacion		(PK, int)
id_producto			(FK, int)
id_categoria		(FK, int)
fecha_creacion		(datetime)
accion				(varchar) -- esta accion podría ser otra catalogo, para estandarizar, pero por tiempo se lo manejará como un campo

- Relaciones:
Un producto puede tener una o varias categorias (relación muchos a muchos)

*/

-- Paso 2: Implementación de la Base de Datos
-- Creación de Talas 
-- Tabla producto
DROP TABLE IF EXISTS producto;
CREATE TABLE producto (
	id_producto		INT	PRIMARY KEY IDENTITY(1, 1),	
	nombre			VARCHAR(50) NOT NULL,
	descripcion		VARCHAR(100),
	fecha_creacion	DATETIME NOT NULL,	
	estado			VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
)

DROP TABLE IF EXISTS categoria
CREATE TABLE categoria (
	id_categoria	INT	PRIMARY KEY IDENTITY(1, 1),
	nombre			VARCHAR(50) NOT NULL,
	descripcion		VARCHAR(100) NULL,
	fecha_creacion	DATETIME NOT NULL,
	estado			VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
)

DROP TABLE IF EXISTS productoXcategoria;
CREATE TABLE productoXcategoria (
	id_relacion		INT	PRIMARY KEY IDENTITY(1, 1),
	id_producto		INT NOT NULL,
	id_categoria	INT NOT NULL,
	FOREIGN KEY	(id_producto)	REFERENCES producto(id_producto),
	FOREIGN KEY	(id_categoria)	REFERENCES categoria(id_categoria)
	-- id_usuario	INT
	--FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
)

-- Índices: se recomienda en columnas con una alta tasa de consulta para mejorar rendimiento
CREATE INDEX idx_producto_fecha_creacion	ON producto(fecha_creacion)
CREATE INDEX idx_categoria_fecha_creacion	ON categoria(fecha_creacion)

-- Paso 3: Optimización 

-- SPs: para evitar que las aplicaciones ejecuten consultas directa (seguridad y rendimiento)

-- tabla producto
-- EXEC sp_inserta_producto 'TOSHIBA T300', 'Laptop de gama media'
--CREATE PROCEDURE sp_inserta_producto
CREATE PROCEDURE sp_leer_producto
	@id_producto	int		=	NULL
AS
BEGIN
	IF @id_producto IS NULL
	BEGIN
		SELECT	id_producto, nombre, descripcion,
				fecha_creacion, estado
		FROM	producto
	END
	ELSE
	BEGIN
		SELECT	id_producto, nombre, descripcion,
				fecha_creacion, estado
		FROM	producto
		WHERE	id_producto = @id_producto
	END	
END

ALTER PROCEDURE sp_inserta_producto
	@nombre			VARCHAR(50),
	@descripcion	VARCHAR(100) = NULL
AS
BEGIN
	INSERT INTO producto(nombre, descripcion, fecha_creacion)
	VALUES (@nombre, @descripcion, GETDATE())

	DECLARE @id_producto int = (SELECT SCOPE_IDENTITY())

	EXEC sp_leer_producto @id_producto
END

--EXEC sp_modifica_producto 1, NULL, 'ACTIVO'
--EXEC sp_modifica_producto 3, 'Iphone 13 PRO MAX', NULL, 'celular gama alta'
--CREATE PROCEDURE sp_modifica_producto
ALTER PROCEDURE sp_modifica_producto
	@id_producto	int,
	@nombre			VARCHAR(50)		= NULL,
	@estado			VARCHAR(20)		= NULL,
	@descripcion	VARCHAR(100)	= NULL	
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_producto;
	SELECT	*
	INTO	#tmp_producto
	FROM	inventario.dbo.fn_valida_id_producto(@id_producto)

	IF (SELECT COUNT(id_producto) FROM #tmp_producto) = 0
	BEGIN 
		SELECT 'ID INGRESADA NO EXISTE'
	END
	ELSE
	BEGIN
		IF @nombre is NULL
		BEGIN
			SET @nombre = (select top 1 nombre from #tmp_producto)
		END

		IF @estado is NULL
		BEGIN
			SET @estado = (select top 1 estado from #tmp_producto)
		END

		IF @descripcion is NULL
		BEGIN
			SET @descripcion = (select top 1 descripcion from #tmp_producto)
		END

		DROP TABLE IF EXISTS #tmp_producto;
		UPDATE	producto
		SET		nombre		=	@nombre,
				descripcion	=	@descripcion,
				estado		=	@estado
		WHERE	id_producto	=	@id_producto

		EXEC sp_leer_producto @id_producto
	END
END

ALTER PROCEDURE sp_dar_baja_producto
	@id_producto	int	
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_producto;
	SELECT	*
	INTO	#tmp_producto
	FROM	inventario.dbo.fn_valida_id_producto(@id_producto)

	IF (SELECT COUNT(id_producto) FROM #tmp_producto) = 0
	BEGIN 
		SELECT 'ID INGRESADA NO EXISTE'
	END
	ELSE
	BEGIN	
		EXEC sp_modifica_producto @id_producto, NULL, 'INACTIVO'	
	END
END

-- CRUD de tabla producto
/*
EXEC sp_inserta_producto 'Iphone 15 pro max', 'celular gama alta'
EXEC sp_modifica_producto 4, 'Iphone 15 PRO MAX'
EXEC sp_dar_baja_producto 4
*/

-- tabla categoria
-- EXEC sp_inserta_producto 'TOSHIBA T300', 'Laptop de gama media'
--CREATE PROCEDURE sp_inserta_producto
CREATE PROCEDURE sp_leer_categoria
	@id_categoria	int		=	NULL
AS
BEGIN
	IF @id_categoria IS NULL
	BEGIN
		SELECT	id_categoria, nombre, descripcion,
				fecha_creacion, estado
		FROM	categoria
	END
	ELSE
	BEGIN
		SELECT	id_categoria, nombre, descripcion,
				fecha_creacion, estado
		FROM	categoria
		WHERE	id_categoria = @id_categoria
	END	
END

CREATE PROCEDURE sp_inserta_categoria
	@nombre			VARCHAR(50),
	@descripcion	VARCHAR(100) = NULL
AS
BEGIN
	INSERT INTO categoria(nombre, descripcion, fecha_creacion)
	VALUES (@nombre, @descripcion, GETDATE())

	DECLARE @id_categoria int = (SELECT SCOPE_IDENTITY())

	EXEC sp_leer_categoria @id_categoria
END

ALTER PROCEDURE sp_modifica_categoria
	@id_categoria	int,
	@nombre			VARCHAR(50)		= NULL,
	@estado			VARCHAR(20)		= NULL,
	@descripcion	VARCHAR(100)	= NULL	
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_categoria
	SELECT	*
	INTO	#tmp_categoria
	FROM	inventario.dbo.fn_valida_id_categoria(@id_categoria)

	IF (SELECT COUNT(id_categoria) FROM #tmp_categoria) = 0
	BEGIN 
		SELECT 'ID INGRESADA NO EXISTE'
	END
	ELSE
	BEGIN
		IF @nombre is NULL
		BEGIN
			SET @nombre = (select top 1 nombre from #tmp_categoria)
		END

		IF @estado is NULL
		BEGIN
			SET @estado = (select top 1 estado from #tmp_categoria)
		END

		IF @descripcion is NULL
		BEGIN
			SET @descripcion = (select top 1 descripcion from #tmp_categoria)
		END

		DROP TABLE IF EXISTS #tmp_categoria;
		UPDATE	categoria
		SET		nombre			=	@nombre,
				descripcion		=	@descripcion,
				estado			=	@estado
		WHERE	id_categoria	=	@id_categoria

		EXEC sp_leer_categoria @id_categoria
	END
END

ALTER PROCEDURE sp_dar_baja_categoria
	@id_categoria	int	
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_categoria;
	SELECT	*
	INTO	#tmp_categoria
	FROM	inventario.dbo.fn_valida_id_categoria(@id_categoria)

	IF (SELECT COUNT(id_categoria) FROM #tmp_categoria) = 0
	BEGIN 
		SELECT 'ID INGRESADA NO EXISTE'
	END
	ELSE
	BEGIN	
		EXEC sp_modifica_categoria @id_categoria, NULL, 'INACTIVO'	
	END
END

-- CRUD de tabla producto
/*
EXEC sp_inserta_categoria 'Celular', 'dedicada a terminales moviles'
EXEC sp_inserta_categoria 'Laptop', 'dedicada a terminales moviles'
EXEC sp_inserta_categoria 'Computador de escritorio', 'dedicada a terminales moviles'
EXEC sp_modifica_categoria 2, 'Categoria pertenece a terminales moviles'
EXEC sp_dar_baja_categoria 2
select * from categoria;
*/

-- tabla: productoXcategoria
--CREATE PROCEDURE sp_leer_productoXcategoria
ALTER PROCEDURE sp_leer_productoXcategoria
	@id_productoXcategoria	int		=	NULL
AS
BEGIN
	IF @id_productoXcategoria IS NULL
	BEGIN
		SELECT	id_relacion, id_producto, id_categoria			
		FROM	productoXcategoria
	END
	ELSE
	BEGIN
		SELECT	id_relacion, id_producto, id_categoria			
		FROM	productoXcategoria
		WHERE	id_relacion = @id_productoXcategoria
	END	
END

--CREATE PROCEDURE sp_inserta_productoXcategoria
ALTER PROCEDURE sp_inserta_productoXcategoria
	@id_producto	int,
	@id_categoria	int
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_producto;
	SELECT	*
	INTO	#tmp_producto
	FROM	inventario.dbo.fn_valida_id_producto(@id_producto)

	IF (SELECT COUNT(id_producto) FROM #tmp_producto) = 0
	BEGIN 
		SELECT 'ID_PRODUCTO INGRESADA NO EXISTE'
	END

	DROP TABLE IF EXISTS #tmp_categoria
	SELECT	*
	INTO	#tmp_categoria
	FROM	inventario.dbo.fn_valida_id_categoria(@id_categoria)

	IF (SELECT COUNT(id_categoria) FROM #tmp_categoria) = 0
	BEGIN 
		SELECT 'ID_CATEGORIA INGRESADA NO EXISTE'
	END

	IF 
		(SELECT COUNT(id_producto) FROM #tmp_producto) > 0
			AND
		(SELECT estado FROM #tmp_producto) = 'ACTIVO'
			AND
		(SELECT COUNT(id_categoria) FROM #tmp_categoria) > 0
			AND
		(SELECT estado FROM #tmp_categoria) = 'ACTIVO'
	BEGIN		
		INSERT INTO productoXcategoria(id_producto, id_categoria)
		VALUES (@id_producto, @id_categoria)
	END		

	DROP TABLE IF EXISTS #tmp_producto
	DROP TABLE IF EXISTS #tmp_categoria

	DECLARE @id_productoXcategoria int = (SELECT SCOPE_IDENTITY())

	EXEC sp_leer_productoXcategoria @id_productoXcategoria
END

ALTER PROCEDURE sp_dar_baja_productoXcategoria
	@id_productoXcategoria	int	
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_productoXcategoria;
	SELECT	*
	INTO	#tmp_productoXcategoria
	FROM	productoXcategoria
	WHERE	id_relacion = @id_productoXcategoria

	IF (SELECT COUNT(id_categoria) FROM #tmp_productoXcategoria) = 0
	BEGIN 
		SELECT 'ID RELACION INGRESADA NO EXISTE'
	END
	ELSE
	BEGIN	
		DELETE FROM productoXcategoria WHERE id_relacion = @id_productoXcategoria		
	END
END

CREATE PROCEDURE sp_dar_baja_relacion_de_producto
	@id_producto	int	
AS
BEGIN
	DROP TABLE IF EXISTS #tmp_productoXcategoria;
	SELECT	*
	INTO	#tmp_productoXcategoria
	FROM	productoXcategoria
	WHERE	id_producto = @id_producto

	IF (SELECT COUNT(id_categoria) FROM #tmp_productoXcategoria) = 0
	BEGIN 
		SELECT 'ID PRODUCTO INGRESADA NO EXISTE'
	END
	ELSE
	BEGIN	
		DELETE FROM productoXcategoria WHERE id_producto = @id_producto
	END
END

select * from producto
select * from categoria
select * from productoXcategoria where id_producto = 19
-- 28, 29

EXEC sp_inserta_categoria 'Celular', 'Dispositivos móviles'
EXEC sp_inserta_categoria 'Laptop', 'Dispositivos móviles (computadoras)'
EXEC sp_inserta_categoria 'Samsung', 'Fabricante de celular coreano'
EXEC sp_inserta_categoria 'Iphone', 'Fabricante de celular americano'
EXEC sp_modifica_categoria 7, NULL, 'ACTIVO', 'Ceular fabricado por Apple'
EXEC sp_inserta_categoria 'Apple', 'Fabricante de tecnología americano'
EXEC sp_inserta_categoria 'Descuento', 'Producto con descuento'

EXEC sp_inserta_producto 'HUAWEI P30'
EXEC sp_inserta_producto 'Iphone 13 pro max'
EXEC sp_inserta_producto 'Iphone 15 pro max'
EXEC sp_inserta_producto 'MSI GAMER'
EXEC sp_inserta_producto 'TOSHIBA P13'
EXEC sp_inserta_producto 'Samsung S20'
EXEC sp_inserta_producto 'Samsung S5'

EXEC sp_inserta_productoXcategoria 8, 4
EXEC sp_inserta_productoXcategoria 8, 7
EXEC sp_inserta_productoXcategoria 8, 9
EXEC sp_inserta_productoXcategoria 9, 4
EXEC sp_inserta_productoXcategoria 9, 7
EXEC sp_inserta_productoXcategoria 9, 9
EXEC sp_inserta_productoXcategoria 9, 8
EXEC sp_inserta_productoXcategoria 10, 5
EXEC sp_inserta_productoXcategoria 11, 5
EXEC sp_inserta_productoXcategoria 12, 6
EXEC sp_inserta_productoXcategoria 12, 4
EXEC sp_inserta_productoXcategoria 13, 6
EXEC sp_inserta_productoXcategoria 13, 4

--CREATE PROCEDURE sp_leer_productos_activos
ALTER PROCEDURE sp_leer_productos_activos
AS
BEGIN
	SELECT		p.id_producto,
				p.nombre nombre_producto,
				p.descripcion descripcion_producto,
				p.fecha_creacion fecha_creacion_producto,
				p.estado estado_producto,
				(	
					SELECT	pxc.id_relacion,
							c.id_categoria,
							c.nombre nombre_categoria,
							c.descripcion descripcion_categoria,
							c.fecha_creacion fecha_creacion_categoria,
							c.estado estado_categoria
					FROM	productoXcategoria pxc
					JOIN	(SELECT * FROM categoria WHERE estado = 'ACTIVO') c
						ON	pxc.id_categoria = c.id_categoria
					WHERE	pxc.id_producto = p.id_producto
					FOR		JSON PATH
				) AS categorias
	FROM		producto p
	WHERE		p.estado = 'ACTIVO'
	ORDER BY	p.nombre
END