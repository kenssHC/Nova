-- ============================================
-- SISTEMA DE DESCUENTOS PARA PRODUCTOS
-- ============================================
-- Este script agrega soporte para descuentos porcentuales en productos
-- Ejecutar en Supabase: SQL Editor

-- 1. AGREGAR COLUMNAS DE DESCUENTO A LA TABLA productos
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS descuento_porcentaje INTEGER DEFAULT 0 CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
ADD COLUMN IF NOT EXISTS descuento_activo BOOLEAN DEFAULT false;

-- 2. AGREGAR COMENTARIOS PARA DOCUMENTACIÓN
COMMENT ON COLUMN productos.descuento_porcentaje IS 'Porcentaje de descuento aplicado al producto (0-100)';
COMMENT ON COLUMN productos.descuento_activo IS 'Indica si el descuento está activo para este producto';

-- 3. CREAR ÍNDICE PARA PRODUCTOS CON DESCUENTO ACTIVO (para consultas más rápidas)
CREATE INDEX IF NOT EXISTS idx_productos_descuento_activo 
ON productos(descuento_activo) 
WHERE descuento_activo = true;

-- 4. VERIFICAR LOS CAMBIOS
-- Ejecuta esta consulta para confirmar que las columnas se agregaron correctamente:
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'productos' 
  AND column_name IN ('descuento_porcentaje', 'descuento_activo');

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 
-- 1. Las políticas RLS existentes en la tabla 'productos' seguirán funcionando
-- 2. Los productos existentes tendrán descuento_porcentaje = 0 y descuento_activo = false por defecto
-- 3. La restricción CHECK asegura que el descuento esté entre 0 y 100
-- 4. El índice mejora el rendimiento al filtrar productos con descuento activo
--
-- ============================================
-- QUERIES DE PRUEBA (Opcional)
-- ============================================

-- Ver todos los productos con sus descuentos
SELECT 
  id,
  nombre,
  precio_venta,
  descuento_porcentaje,
  descuento_activo,
  CASE 
    WHEN descuento_activo AND descuento_porcentaje > 0 
    THEN precio_venta * (1 - descuento_porcentaje / 100.0)
    ELSE precio_venta
  END AS precio_final
FROM productos
WHERE activo = true
ORDER BY created_at DESC;

-- Ver solo productos con descuento activo
SELECT 
  nombre,
  precio_venta AS precio_original,
  descuento_porcentaje,
  precio_venta * (1 - descuento_porcentaje / 100.0) AS precio_con_descuento,
  precio_venta - (precio_venta * (1 - descuento_porcentaje / 100.0)) AS ahorro
FROM productos
WHERE descuento_activo = true 
  AND descuento_porcentaje > 0
  AND activo = true;

-- ============================================
-- ROLLBACK (Si necesitas revertir los cambios)
-- ============================================
-- ⚠️ ADVERTENCIA: Esto eliminará las columnas y todos los datos de descuentos
-- Solo descomenta si realmente necesitas revertir:
--
-- DROP INDEX IF EXISTS idx_productos_descuento_activo;
-- ALTER TABLE productos DROP COLUMN IF EXISTS descuento_activo;
-- ALTER TABLE productos DROP COLUMN IF EXISTS descuento_porcentaje;
