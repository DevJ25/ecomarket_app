-- Crear la base de datos
DROP DATABASE IF EXISTS EcoMarket_app;
CREATE DATABASE EcoMarket_app;
USE EcoMarket_app;

-- =============================================
-- TABLA: Roles
-- =============================================

CREATE TABLE Roles (
    rol_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from Usuarios;
-- =============================================
-- TABLA: Usuarios
-- =============================================
CREATE TABLE Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    rol_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    esta_activo BOOLEAN DEFAULT TRUE,
    es_verificado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id)
);

-- =============================================
-- TABLA: Categorias
-- =============================================
CREATE TABLE Categorias (
    categoria_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    esta_activa BOOLEAN DEFAULT TRUE
);

-- =============================================
-- TABLA: Productos
-- =============================================
CREATE TABLE Productos (
    producto_id INT PRIMARY KEY AUTO_INCREMENT,
    vendedor_id INT NOT NULL,
    categoria_id INT NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    precio_original DECIMAL(10,2),
    stock INT NOT NULL DEFAULT 0,
    imagen_principal VARCHAR(255),
    imagenes_secundarias JSON,
    es_organico BOOLEAN DEFAULT FALSE,
    es_vegano BOOLEAN DEFAULT FALSE,
    certificaciones JSON,
    peso DECIMAL(8,2),
    unidad_medida VARCHAR(20),
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    total_calificaciones INT DEFAULT 0,
    esta_activo BOOLEAN DEFAULT TRUE,
    esta_verificado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_vendedor (vendedor_id),
    INDEX idx_activo_verificado (esta_activo, esta_verificado)
);

-- =============================================
-- TABLA: CarritoCompras
-- =============================================
CREATE TABLE CarritoCompras (
    carrito_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

-- =============================================
-- TABLA: ItemsCarrito
-- =============================================
CREATE TABLE ItemsCarrito (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    carrito_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES CarritoCompras(carrito_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    UNIQUE KEY unique_carrito_producto (carrito_id, producto_id)
);

-- =============================================
-- TABLA: Cupones (DEBE CREARSE ANTES DE Ordenes)
-- =============================================
CREATE TABLE Cupones (
    cupon_id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    tipo_descuento ENUM('porcentaje', 'monto_fijo') NOT NULL,
    valor_descuento DECIMAL(10,2) NOT NULL,
    maximo_descuento DECIMAL(10,2),
    min_compra DECIMAL(10,2) DEFAULT 0,
    usos_maximos INT,
    usos_actuales INT DEFAULT 0,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo_activo (codigo, esta_activo)
);

-- =============================================
-- TABLA: Ordenes (AHORA SÍ PUEDE REFERENCIAR Cupones)
-- =============================================
CREATE TABLE Ordenes (
    orden_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) NOT NULL,
    costo_envio DECIMAL(10,2) DEFAULT 0,
    direccion_envio TEXT NOT NULL,
    ciudad_envio VARCHAR(100) NOT NULL,
    pais_envio VARCHAR(100) NOT NULL,
    codigo_postal_envio VARCHAR(20) NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia') NOT NULL,
    cupon_id INT NULL,
    descuento_aplicado DECIMAL(10,2) DEFAULT 0,
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (cupon_id) REFERENCES Cupones(cupon_id),
    INDEX idx_usuario_estado (usuario_id, estado)
);

-- =============================================
-- TABLA: DetallesOrden
-- =============================================
CREATE TABLE DetallesOrden (
    detalle_id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    INDEX idx_orden (orden_id)
);

-- =============================================
-- TABLA: Reseñas
-- =============================================
CREATE TABLE Reseñas (
    reseña_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    orden_id INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    es_verificado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    UNIQUE KEY unique_usuario_producto_orden (usuario_id, producto_id, orden_id),
    INDEX idx_producto_calificacion (producto_id, calificacion)
);

-- =============================================
-- TABLA: Wishlist
-- =============================================
CREATE TABLE Wishlist (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    UNIQUE KEY unique_usuario_producto (usuario_id, producto_id)
);

-- =============================================
-- TABLA: CuponesUsados
-- =============================================
CREATE TABLE CuponesUsados (
    cupon_usado_id INT PRIMARY KEY AUTO_INCREMENT,
    cupon_id INT NOT NULL,
    usuario_id INT NOT NULL,
    orden_id INT NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cupon_id) REFERENCES Cupones(cupon_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    UNIQUE KEY unique_cupon_orden (cupon_id, orden_id)
);

-- =============================================
-- NUEVAS TABLAS PARA REQUERIMIENTOS FALTANTES
-- =============================================

-- TABLA: SeguimientoEnvios
CREATE TABLE SeguimientoEnvios (
    seguimiento_id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT NOT NULL,
    estado_envio ENUM('preparando', 'en_transito', 'en_reparto', 'entregado', 'devuelto') DEFAULT 'preparando',
    ubicacion_actual VARCHAR(255),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_estimada_entrega DATE,
    codigo_seguimiento VARCHAR(100) UNIQUE,
    transportista VARCHAR(100),
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    INDEX idx_orden_estado (orden_id, estado_envio)
);

-- TABLA: Notificaciones
CREATE TABLE Notificaciones (
    notificacion_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('orden', 'envio', 'promocion', 'sistema') NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_leida TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    INDEX idx_usuario_leida (usuario_id, leida)
);

-- TABLA: Devoluciones
CREATE TABLE Devoluciones (
    devolucion_id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT NOT NULL,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    motivo TEXT NOT NULL,
    estado ENUM('solicitada', 'en_revision', 'aprobada', 'rechazada', 'reembolsada') DEFAULT 'solicitada',
    monto_reembolso DECIMAL(10,2),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    comentario_admin TEXT,
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    INDEX idx_estado (estado)
);

-- TABLA: TransaccionesPagos
CREATE TABLE TransaccionesPagos (
    transaccion_id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia') NOT NULL,
    estado ENUM('pendiente', 'completado', 'fallido', 'reembolsado') DEFAULT 'pendiente',
    monto DECIMAL(10,2) NOT NULL,
    id_transaccion_proveedor VARCHAR(255),
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    UNIQUE KEY unique_orden_transaccion (orden_id)
);

-- TABLA: ProductoCupones
CREATE TABLE ProductoCupones (
    producto_cupon_id INT PRIMARY KEY AUTO_INCREMENT,
    cupon_id INT NOT NULL,
    producto_id INT NOT NULL,
    FOREIGN KEY (cupon_id) REFERENCES Cupones(cupon_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id),
    UNIQUE KEY unique_cupon_producto (cupon_id, producto_id)
);

-- =============================================
-- INSERCIÓN DE DATOS INICIALES
-- =============================================
INSERT INTO Roles (nombre_rol, descripcion)
VALUES ('ROLE_USER','Comprador'), ('ROLE_SELLER','Vendedor'), ('ROLE_ADMIN','Administrador');
select * from Usuarios;

-- Insertar roles básicos
INSERT INTO Roles (nombre_rol, descripcion) VALUES 
('administrador', 'Administrador completo del sistema'),
('vendedor', 'Usuario que vende productos en la plataforma'),
('comprador', 'Usuario que compra productos');

-- Insertar categorías de ejemplo
INSERT INTO Categorias (nombre_categoria, descripcion) VALUES 
('Frutas Orgánicas', 'Frutas cultivadas de manera orgánica y sostenible'),
('Verduras Ecológicas', 'Verduras frescas de cultivo ecológico'),
('Productos Lácteos', 'Lácteos orgánicos y de producción responsable'),
('Panadería Artesanal', 'Productos de panadería hechos de forma artesanal'),
('Bebidas Naturales', 'Jugos y bebidas naturales sin conservantes');

-- Insertar usuario administrador por defecto (password: Admin123)
INSERT INTO Usuarios (rol_id, nombre, apellido, email, password_hash, telefono, esta_activo, es_verificado) 
VALUES (1, 'Admin', 'Sistema', 'admin@ecomarket.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890', TRUE, TRUE);

-- Insertar cupón de ejemplo
INSERT INTO Cupones (codigo, descripcion, tipo_descuento, valor_descuento, maximo_descuento, min_compra, usos_maximos, fecha_inicio, fecha_fin) 
VALUES ('BIENVENIDA10', 'Cupón de bienvenida del 10% de descuento', 'porcentaje', 10.00, 50.00, 100.00, 1000, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));










-- =============================================
-- INSERCIÓN DE DATOS INICIALES (Continuación y Corrección)
-- =============================================

-- 1. Roles (Asegurar IDs consistentes, asumiendo que los primeros 3 roles ya existen con IDs 1, 2, 3)
-- NOTA: Si los 'Insertar roles básicos' anteriores se ejecutaron, los IDs deberían ser 1, 2, 3.
-- Si se usaron los primeros 'ROLE_USER', 'ROLE_SELLER', 'ROLE_ADMIN' y luego los segundos, se corregirán los IDs.

-- Verificación de Roles existentes (Si los IDs no son 1, 2, 3, ajuste las inserciones de Usuarios)
-- ID 1: Administrador
-- ID 2: Vendedor
-- ID 3: Comprador

-- Limpiamos inserciones duplicadas y usamos las que tienen nombres más claros (asumiendo: 1=administrador, 2=vendedor, 3=comprador)
-- Si los roles ya se insertaron, omitir este bloque o borrar y re-insertar.
-- DROP TABLE IF EXISTS Roles; ... Recrear Roles...
-- INSERT INTO Roles (nombre_rol, descripcion) VALUES ('administrador', 'Administrador completo del sistema');
-- INSERT INTO Roles (nombre_rol, descripcion) VALUES ('vendedor', 'Usuario que vende productos en la plataforma');
-- INSERT INTO Roles (nombre_rol, descripcion) VALUES ('comprador', 'Usuario que compra productos');


-- 2. Categorías (Asumiendo IDs 1 a 5 ya insertados)
-- ID 1: Frutas Orgánicas
-- ID 2: Verduras Ecológicas
-- ID 3: Productos Lácteos
-- ID 4: Panadería Artesanal
-- ID 5: Bebidas Naturales


-- 3. Usuarios (Vendedores y Compradores)

-- Vendedores (rol_id = 2)
-- Password 'Vendedor123'
INSERT INTO Usuarios (rol_id, nombre, apellido, email, password_hash, telefono, direccion, ciudad, pais, esta_activo, es_verificado) 
VALUES 
(2, 'Ana', 'García', 'ana.garcia@vendedor.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3001112233', 'Calle 10 # 45-67', 'Medellín', 'Colombia', TRUE, TRUE),
(2, 'Pedro', 'Martínez', 'pedro.martinez@vendedor.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3004445566', 'Avenida Sur 8-12', 'Bogotá', 'Colombia', TRUE, TRUE),
(2, 'Luisa', 'Rojas', 'luisa.rojas@vendedor.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3007778899', 'Carrera 70 # 3A-25', 'Cali', 'Colombia', TRUE, TRUE);
-- IDs de Vendedores serán 2, 3, 4 (asumiendo Admin es ID 1)

-- Compradores (rol_id = 3)
-- Password 'Comprador123'
INSERT INTO Usuarios (rol_id, nombre, apellido, email, password_hash, telefono, direccion, ciudad, pais, esta_activo, es_verificado) 
VALUES 
(3, 'Carlos', 'López', 'carlos.lopez@comprador.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3101234567', 'Transversal 50 # 15-30', 'Medellín', 'Colombia', TRUE, TRUE),
(3, 'Elena', 'Vargas', 'elena.vargas@comprador.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3109876543', 'Calle 120 # 6-80', 'Bogotá', 'Colombia', TRUE, TRUE);
-- IDs de Compradores serán 5, 6


-- 4. Productos (20 Productos)

-- Vendedor Ana García (ID: 2)
INSERT INTO Productos (vendedor_id, categoria_id, nombre_producto, descripcion, precio, precio_original, stock, es_organico, peso, unidad_medida) VALUES 
(2, 1, 'Manzanas Red Delicious Orgánicas', 'Manzanas frescas y crujientes, cultivadas sin pesticidas.', 5.50, 6.00, 150, TRUE, 1.00, 'kg'), -- 1
(2, 2, 'Espinacas Ecológicas Frescas', 'Hojas de espinaca recién recolectadas, ideales para ensaladas.', 3.20, NULL, 200, TRUE, 0.50, 'atado'), -- 2
(2, 3, 'Yogurt Griego Natural Orgánico', 'Yogurt espeso y cremoso, solo con leche y cultivos orgánicos.', 8.90, NULL, 80, TRUE, 0.75, 'unidad'), -- 3
(2, 1, 'Banano Criollo Orgánico', 'Banano dulce y de pequeño tamaño, cultivado de forma tradicional.', 2.80, 3.00, 250, TRUE, 1.00, 'kg'), -- 4
(2, 5, 'Jugo de Naranja 100% Natural', 'Jugo recién exprimido, sin azúcares ni conservantes añadidos.', 4.50, NULL, 60, FALSE, 1.00, 'litro'), -- 5
(2, 2, 'Tomates Cherry Ecológicos', 'Pequeños y dulces tomates cherry, perfectos para picar.', 6.50, 7.00, 120, TRUE, 0.50, 'bandeja'), -- 6
(2, 3, 'Queso Campesino Orgánico', 'Queso fresco, bajo en sal y 100% orgánico.', 12.00, NULL, 50, TRUE, 0.40, 'unidad'); -- 7

-- Vendedor Pedro Martínez (ID: 3)
INSERT INTO Productos (vendedor_id, categoria_id, nombre_producto, descripcion, precio, precio_original, stock, es_organico, es_vegano, peso, unidad_medida) VALUES 
(3, 4, 'Pan Integral de Masa Madre', 'Pan de harina integral, fermentación lenta y horneado en piedra.', 7.50, NULL, 40, FALSE, TRUE, 0.80, 'unidad'), -- 8
(3, 1, 'Uvas Verdes Orgánicas sin Semilla', 'Uvas frescas y dulces para un snack saludable.', 9.90, 10.50, 100, TRUE, TRUE, 0.50, 'caja'), -- 9
(3, 2, 'Zanahorias Baby Ecológicas', 'Zanahorias pequeñas y tiernas, ideales para cocinar o crudas.', 3.90, NULL, 180, TRUE, TRUE, 0.50, 'bolsa'), -- 10
(3, 5, 'Agua de Coco Pura', 'Agua de coco joven, rehidratante natural.', 5.20, NULL, 90, FALSE, TRUE, 0.33, 'litro'), -- 11
(3, 4, 'Galletas de Avena y Miel Artesanales', 'Galletas horneadas con avena integral y endulzadas con miel.', 4.80, NULL, 75, FALSE, FALSE, 0.25, 'paquete'), -- 12
(3, 1, 'Aguacates Hass Orgánicos', 'Aguacates cremosos y listos para comer.', 15.00, 16.50, 60, TRUE, TRUE, 1.00, 'kg'), -- 13
(3, 2, 'Pimientos Rojos Ecológicos', 'Pimientos dulces y grandes, ideales para asar.', 7.20, NULL, 110, TRUE, TRUE, 0.60, 'kg'); -- 14

-- Vendedor Luisa Rojas (ID: 4)
INSERT INTO Productos (vendedor_id, categoria_id, nombre_producto, descripcion, precio, precio_original, stock, es_organico, es_vegano, peso, unidad_medida) VALUES 
(4, 3, 'Leche de Almendras Fortificada', 'Bebida vegetal de almendras, sin lactosa ni azúcares añadidos.', 6.70, NULL, 130, FALSE, TRUE, 1.00, 'litro'), -- 15
(4, 4, 'Baguette Rústica', 'Pan francés con corteza crujiente y miga suave.', 3.00, NULL, 55, FALSE, TRUE, 0.30, 'unidad'), -- 16
(4, 5, 'Té Verde Matcha Orgánico', 'Té en polvo de alta calidad, fuente de antioxidantes.', 22.50, 25.00, 30, TRUE, TRUE, 0.10, 'lata'), -- 17
(4, 2, 'Coliflor Orgánica', 'Cabeza de coliflor fresca y de gran tamaño.', 5.90, NULL, 70, TRUE, TRUE, 1.00, 'unidad'), -- 18
(4, 1, 'Fresas Orgánicas', 'Fresas dulces y jugosas, recién cosechadas.', 8.50, NULL, 95, TRUE, TRUE, 0.50, 'bandeja'), -- 19
(4, 3, 'Mantequilla Ghee Clarificada', 'Mantequilla clarificada, sin lactosa y con un alto punto de humo.', 18.00, NULL, 45, FALSE, FALSE, 0.20, 'frasco'); -- 20


-- 5. CarritoCompras (Compradores: Carlos ID 5, Elena ID 6)
INSERT INTO CarritoCompras (usuario_id) VALUES (5), (6);
-- IDs de Carritos serán 1, 2

-- 6. ItemsCarrito (Comprador Carlos tiene 3 ítems en el carrito)
INSERT INTO ItemsCarrito (carrito_id, producto_id, cantidad, precio_unitario) VALUES 
(1, 1, 2, 5.50),  -- Manzanas
(1, 8, 1, 7.50),  -- Pan Integral
(1, 15, 3, 6.70); -- Leche de Almendras


-- 7. Órdenes (Carlos realiza 1 orden, Elena realiza 1 orden)
-- Orden 1 (Carlos, usa cupón BIENVENIDA10 que ofrece 10% de descuento máx 50)
-- Subtotal: (2*5.50) + (1*7.50) + (3*6.70) = 11.00 + 7.50 + 20.10 = 38.60
-- Descuento: 10% de 38.60 = 3.86 (Aplica el cupón BIENVENIDA10, cupon_id = 1)
-- Subtotal con desc: 38.60 - 3.86 = 34.74
-- Impuestos (ej. 10%): 3.47
-- Total: 34.74 + 3.47 + 5.00 (Costo Envío) = 43.21
INSERT INTO Ordenes (usuario_id, estado, total, subtotal, impuestos, costo_envio, direccion_envio, ciudad_envio, pais_envio, codigo_postal_envio, metodo_pago, cupon_id, descuento_aplicado) VALUES 
(5, 'procesando', 43.21, 38.60, 3.47, 5.00, 'Transversal 50 # 15-30', 'Medellín', 'Colombia', '050010', 'tarjeta', 1, 3.86); -- ID 1

-- Orden 2 (Elena, sin cupón)
-- Subtotal: (1*9.90) + (2*14.00) = 9.90 + 28.00 = 37.90 (Producto 14 es Pimientos, pero vamos a usar producto 13: Aguacates Orgánicos $15.00)
-- Subtotal: (1*9.90) + (2*15.00) = 9.90 + 30.00 = 39.90
-- Impuestos (ej. 10%): 3.99
-- Total: 39.90 + 3.99 + 8.00 (Costo Envío) = 51.89
INSERT INTO Ordenes (usuario_id, estado, total, subtotal, impuestos, costo_envio, direccion_envio, ciudad_envio, pais_envio, codigo_postal_envio, metodo_pago) VALUES 
(6, 'entregado', 51.89, 39.90, 3.99, 8.00, 'Calle 120 # 6-80', 'Bogotá', 'Colombia', '110211', 'paypal'); -- ID 2


-- 8. DetallesOrden (Detalles para las Órdenes 1 y 2)
-- Orden 1 (Carlos)
INSERT INTO DetallesOrden (orden_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(1, 1, 2, 5.50, 11.00),
(1, 8, 1, 7.50, 7.50),
(1, 15, 3, 6.70, 20.10);

-- Orden 2 (Elena)
INSERT INTO DetallesOrden (orden_id, producto_id, cantidad, precio_unitario, subtotal) VALUES 
(2, 9, 1, 9.90, 9.90), -- Uvas
(2, 13, 2, 15.00, 30.00); -- Aguacates


-- 9. Reseñas (Elena deja una reseña en un producto de su Orden 2)
INSERT INTO Reseñas (usuario_id, producto_id, orden_id, calificacion, comentario, es_verificado) VALUES
(6, 13, 2, 5, 'Los aguacates estaban frescos y en su punto, perfectos para el guacamole.', TRUE);

-- 10. Wishlist (Carlos añade 2 productos a su lista de deseos)
INSERT INTO Wishlist (usuario_id, producto_id) VALUES 
(5, 5), -- Jugo de Naranja
(5, 17); -- Té Verde Matcha

-- 11. CuponesUsados (Carlos usó el cupón en Orden 1)
INSERT INTO CuponesUsados (cupon_id, usuario_id, orden_id) VALUES 
(1, 5, 1);

-- 12. SeguimientoEnvios
INSERT INTO SeguimientoEnvios (orden_id, estado_envio, ubicacion_actual, codigo_seguimiento, transportista, fecha_estimada_entrega) VALUES 
(1, 'en_transito', 'Centro de Distribución Medellín', 'EMKT2025001COL', 'ServiEntrega', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(2, 'entregado', 'Dirección final del cliente', 'EMKT2025002COL', 'RapiEnvío', DATE_ADD(NOW(), INTERVAL -2 DAY));

-- 13. Notificaciones
INSERT INTO Notificaciones (usuario_id, titulo, mensaje, tipo) VALUES 
(5, 'Tu orden está en camino', 'La orden #1 ha sido enviada.', 'envio'),
(6, 'Tu pedido fue entregado', 'La orden #2 ha sido marcada como entregada.', 'orden'),
(5, 'Nueva promoción', '¡Descuento de 20% en Lácteos esta semana!', 'promocion');

-- 14. Devoluciones (Elena solicita una devolución para un producto de la Orden 2)
INSERT INTO Devoluciones (orden_id, usuario_id, producto_id, cantidad, motivo, estado, monto_reembolso, fecha_resolucion) VALUES 
(2, 6, 9, 1, 'Las uvas llegaron magulladas y con sabor extraño.', 'aprobada', 9.90, NOW());

-- 15. TransaccionesPagos
INSERT INTO TransaccionesPagos (orden_id, metodo_pago, estado, monto, id_transaccion_proveedor) VALUES 
(1, 'tarjeta', 'completado', 43.21, 'TXN1234567890'),
(2, 'paypal', 'completado', 51.89, 'PPX9876543210');

-- 16. ProductoCupones (Asociar un cupón a productos específicos)
INSERT INTO ProductoCupones (cupon_id, producto_id) VALUES
(1, 1),  -- Cupón BIENVENIDA10 aplica a Manzanas
(1, 2);  -- Cupón BIENVENIDA10 aplica a Espinacas










CREATE OR REPLACE VIEW Vista_Resumen_Ordenes AS
SELECT
    o.orden_id,
    o.estado,
    o.fecha_orden,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_comprador,
    u.email AS email_comprador,
    o.total,
    o.subtotal,
    o.costo_envio,
    o.metodo_pago,
    o.direccion_envio,
    s.estado_envio,
    s.codigo_seguimiento
FROM
    Ordenes o
JOIN
    Usuarios u ON o.usuario_id = u.usuario_id
LEFT JOIN
    SeguimientoEnvios s ON o.orden_id = s.orden_id;
    
    
    
    
    
    
    
    
    
    CREATE OR REPLACE VIEW Vista_Historial_Reseñas AS
SELECT
    r.reseña_id,
    r.calificacion,
    r.comentario,
    r.fecha_creacion,
    r.es_verificado,
    p.producto_id,
    p.nombre_producto,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_comprador,
    u.email AS email_comprador,
    r.orden_id
FROM
    Reseñas r
JOIN
    Productos p ON r.producto_id = p.producto_id
JOIN
    Usuarios u ON r.usuario_id = u.usuario_id;
    
    
    
    
    
    
    
    
    
    
    
    -- Actualiza la calificación promedio y el total de calificaciones para los productos reseñados.
UPDATE Productos p
JOIN (
    SELECT
        producto_id,
        AVG(calificacion) AS nuevo_promedio,
        COUNT(reseña_id) AS total_resenas
    FROM
        Reseñas
    GROUP BY
        producto_id
) AS r_stats ON p.producto_id = r_stats.producto_id
SET
    p.calificacion_promedio = r_stats.nuevo_promedio,
    p.total_calificaciones = r_stats.total_resenas;

-- Verificación: El Producto 13 debería tener una calificación de 5.00 y 1 reseña.
-- SELECT producto_id, nombre_producto, calificacion_promedio, total_calificaciones FROM Productos WHERE total_calificaciones > 0;



-- =============================================
-- 1. TRIGGER: DESPUÉS DE INSERTAR una Reseña
-- =============================================
DELIMITER //
CREATE TRIGGER tr_after_insert_reseña
AFTER INSERT ON Reseñas
FOR EACH ROW
BEGIN
    -- Recalcula el promedio y el total de reseñas para el producto afectado
    UPDATE Productos
    SET
        calificacion_promedio = (
            SELECT AVG(calificacion)
            FROM Reseñas
            WHERE producto_id = NEW.producto_id
        ),
        total_calificaciones = (
            SELECT COUNT(reseña_id)
            FROM Reseñas
            WHERE producto_id = NEW.producto_id
        )
    WHERE producto_id = NEW.producto_id;
END;
//
DELIMITER ;

-- =============================================
-- 2. TRIGGER: DESPUÉS DE ACTUALIZAR una Reseña (por si se cambia la calificación)
-- =============================================
DELIMITER //
CREATE TRIGGER tr_after_update_reseña
AFTER UPDATE ON Reseñas
FOR EACH ROW
BEGIN
    -- Solo si la calificación ha cambiado
    IF OLD.calificacion <> NEW.calificacion THEN
        -- Recalcula el promedio para el producto afectado
        UPDATE Productos
        SET
            calificacion_promedio = (
                SELECT AVG(calificacion)
                FROM Reseñas
                WHERE producto_id = NEW.producto_id
            )
        WHERE producto_id = NEW.producto_id;
    END IF;
END;
//
DELIMITER ;

-- =============================================
-- 3. TRIGGER: DESPUÉS DE ELIMINAR una Reseña
-- =============================================
DELIMITER //
CREATE TRIGGER tr_after_delete_reseña
AFTER DELETE ON Reseñas
FOR EACH ROW
BEGIN
    -- Recalcula el promedio y el total de reseñas para el producto afectado
    UPDATE Productos
    SET
        calificacion_promedio = (
            SELECT IFNULL(AVG(calificacion), 0) -- Usa IFNULL para evitar NULL si no quedan reseñas
            FROM Reseñas
            WHERE producto_id = OLD.producto_id
        ),
        total_calificaciones = (
            SELECT COUNT(reseña_id)
            FROM Reseñas
            WHERE producto_id = OLD.producto_id
        )
    WHERE producto_id = OLD.producto_id;
END;
//
DELIMITER ;






-- =============================================
-- 4. TRIGGER: DESPUÉS DE INSERTAR un Item en DetallesOrden (Reduce Stock)
-- =============================================
DELIMITER //
CREATE TRIGGER tr_after_insert_detalle_orden
AFTER INSERT ON DetallesOrden
FOR EACH ROW
BEGIN
    -- Reduce el stock del producto en la tabla Productos
    UPDATE Productos
    SET stock = stock - NEW.cantidad
    WHERE producto_id = NEW.producto_id;
END;
//
DELIMITER ;










-- =============================================
-- 5. TRIGGER: DESPUÉS DE ACTUALIZAR una Orden (Manejo de Cancelación)
-- =============================================
DELIMITER //
CREATE TRIGGER tr_after_update_orden_stock
AFTER UPDATE ON Ordenes
FOR EACH ROW
BEGIN
    -- Verifica si el estado de la orden cambió a 'cancelado'
    IF OLD.estado <> 'cancelado' AND NEW.estado = 'cancelado' THEN
        -- Reintegra el stock de todos los productos de esta orden
        UPDATE Productos p
        JOIN DetallesOrden do ON p.producto_id = do.producto_id
        SET p.stock = p.stock + do.cantidad
        WHERE do.orden_id = NEW.orden_id;
    
    -- Opcional: Si una orden cancelada se reactiva (por ejemplo, 'pendiente'/'procesando'), se resta el stock de nuevo
    ELSEIF OLD.estado = 'cancelado' AND NEW.estado <> 'cancelado' THEN
        UPDATE Productos p
        JOIN DetallesOrden do ON p.producto_id = do.producto_id
        SET p.stock = p.stock - do.cantidad
        WHERE do.orden_id = NEW.orden_id;
    END IF;
END;
//
DELIMITER ;