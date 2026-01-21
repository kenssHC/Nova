-- ============================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- Nova E-Commerce - Perfumería y Cuidado Personal
-- ============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: categorias
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: productos
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_compra DECIMAL(10, 2) NOT NULL CHECK (precio_compra >= 0),
  precio_venta DECIMAL(10, 2) NOT NULL CHECK (precio_venta >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen_url TEXT,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: ventas
-- ============================================
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_venta DECIMAL(10, 2) NOT NULL CHECK (precio_venta >= 0),
  precio_compra DECIMAL(10, 2) NOT NULL CHECK (precio_compra >= 0),
  ganancia DECIMAL(10, 2) NOT NULL,
  fecha_venta TIMESTAMPTZ DEFAULT NOW(),
  cliente_nombre TEXT
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_ventas_producto ON ventas(producto_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta DESC);

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Actualizar updated_at en productos
-- ============================================
DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN: Validar stock antes de venta
-- ============================================
CREATE OR REPLACE FUNCTION validar_stock_antes_venta()
RETURNS TRIGGER AS $$
DECLARE
  stock_actual INTEGER;
BEGIN
  SELECT stock INTO stock_actual
  FROM productos
  WHERE id = NEW.producto_id;
  
  IF stock_actual < NEW.cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', stock_actual, NEW.cantidad;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Validar stock antes de insertar venta
-- ============================================
DROP TRIGGER IF EXISTS validar_stock_trigger ON ventas;
CREATE TRIGGER validar_stock_trigger
  BEFORE INSERT ON ventas
  FOR EACH ROW
  EXECUTE FUNCTION validar_stock_antes_venta();

-- ============================================
-- FUNCIÓN: Restar stock automáticamente al vender
-- ============================================
CREATE OR REPLACE FUNCTION restar_stock_automatico()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE productos
  SET stock = stock - NEW.cantidad
  WHERE id = NEW.producto_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Restar stock después de venta
-- ============================================
DROP TRIGGER IF EXISTS restar_stock_trigger ON ventas;
CREATE TRIGGER restar_stock_trigger
  AFTER INSERT ON ventas
  FOR EACH ROW
  EXECUTE FUNCTION restar_stock_automatico();

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública de categorías
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categorias;
CREATE POLICY "Permitir lectura pública de categorías"
  ON categorias FOR SELECT
  USING (true);

-- Política: Permitir lectura pública de productos activos
DROP POLICY IF EXISTS "Permitir lectura pública de productos activos" ON productos;
CREATE POLICY "Permitir lectura pública de productos activos"
  ON productos FOR SELECT
  USING (activo = true);

-- Política: Permitir todas las operaciones autenticadas en categorías
DROP POLICY IF EXISTS "Permitir todas las operaciones autenticadas en categorías" ON categorias;
CREATE POLICY "Permitir todas las operaciones autenticadas en categorías"
  ON categorias FOR ALL
  USING (auth.role() = 'authenticated');

-- Política: Permitir todas las operaciones autenticadas en productos
DROP POLICY IF EXISTS "Permitir todas las operaciones autenticadas en productos" ON productos;
CREATE POLICY "Permitir todas las operaciones autenticadas en productos"
  ON productos FOR ALL
  USING (auth.role() = 'authenticated');

-- Política: Permitir todas las operaciones autenticadas en ventas
DROP POLICY IF EXISTS "Permitir todas las operaciones autenticadas en ventas" ON ventas;
CREATE POLICY "Permitir todas las operaciones autenticadas en ventas"
  ON ventas FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- DATOS INICIALES: Categorías
-- ============================================
INSERT INTO categorias (nombre) VALUES
  ('Perfumes'),
  ('Cremas Corporales'),
  ('Cremas Faciales'),
  ('Shampoo'),
  ('Acondicionador'),
  ('Jabones'),
  ('Maquillaje'),
  ('Cuidado de Manos'),
  ('Cuidado de Pies'),
  ('Otros')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- VISTA: Productos con información de categoría
-- ============================================
CREATE OR REPLACE VIEW productos_con_categoria AS
SELECT 
  p.id,
  p.nombre,
  p.descripcion,
  p.precio_compra,
  p.precio_venta,
  p.precio_venta - p.precio_compra AS ganancia_unitaria,
  p.stock,
  p.imagen_url,
  p.activo,
  p.created_at,
  p.updated_at,
  c.id AS categoria_id,
  c.nombre AS categoria_nombre
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id;

-- ============================================
-- VISTA: Estadísticas de ventas por producto
-- ============================================
CREATE OR REPLACE VIEW estadisticas_ventas_producto AS
SELECT 
  p.id AS producto_id,
  p.nombre AS producto_nombre,
  COUNT(v.id) AS total_ventas,
  SUM(v.cantidad) AS unidades_vendidas,
  SUM(v.ganancia) AS ganancia_total,
  AVG(v.ganancia) AS ganancia_promedio,
  MAX(v.fecha_venta) AS ultima_venta
FROM productos p
LEFT JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificar que todo se creó correctamente
SELECT 'Tablas creadas:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('categorias', 'productos', 'ventas');

SELECT 'Políticas RLS creadas:' as info;
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
