/**
 * Script de prueba para verificar la conexión con Supabase
 * 
 * Para ejecutar:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env.local
 * 2. Ejecuta: npx tsx test-supabase-connection.ts
 * 
 * Si no tienes tsx instalado: npm install -D tsx
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Cargar variables de entorno desde .env.local
config({ path: '.env.local' })

async function testConnection() {
  console.log('🔍 Verificando conexión con Supabase...\n')

  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan variables de entorno')
    console.error('   Asegúrate de tener configurado .env.local con:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY\n')
    process.exit(1)
  }

  console.log('✅ Variables de entorno encontradas')
  console.log(`   URL: ${supabaseUrl}\n`)

  // Crear cliente
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Test 1: Verificar categorías
    console.log('📋 Test 1: Verificar tabla categorías...')
    const { data: categorias, error: errorCategorias } = await supabase
      .from('categorias')
      .select('*')
      .limit(5)

    if (errorCategorias) {
      console.error('❌ Error al consultar categorías:', errorCategorias.message)
      return
    }

    console.log(`✅ Categorías encontradas: ${categorias?.length || 0}`)
    if (categorias && categorias.length > 0) {
      console.log('   Ejemplos:', categorias.slice(0, 3).map(c => c.nombre).join(', '))
    }
    console.log('')

    // Test 2: Verificar productos
    console.log('📦 Test 2: Verificar tabla productos...')
    const { data: productos, error: errorProductos } = await supabase
      .from('productos')
      .select('*')
      .limit(5)

    if (errorProductos) {
      console.error('❌ Error al consultar productos:', errorProductos.message)
      return
    }

    console.log(`✅ Estructura de productos OK (${productos?.length || 0} productos)`)
    console.log('')

    // Test 3: Verificar ventas
    console.log('💰 Test 3: Verificar tabla ventas...')
    const { data: ventas, error: errorVentas } = await supabase
      .from('ventas')
      .select('*')
      .limit(5)

    if (errorVentas) {
      console.error('❌ Error al consultar ventas:', errorVentas.message)
      return
    }

    console.log(`✅ Estructura de ventas OK (${ventas?.length || 0} ventas)`)
    console.log('')

    // Test 4: Verificar Storage
    console.log('🖼️  Test 4: Verificar Storage...')
    const { data: buckets, error: errorBuckets } = await supabase
      .storage
      .listBuckets()

    if (errorBuckets) {
      console.error('❌ Error al verificar buckets:', errorBuckets.message)
      return
    }

    const productosBucket = buckets?.find(b => b.name === 'productos-images')
    
    if (productosBucket) {
      console.log('✅ Bucket "productos-images" encontrado')
      console.log(`   Público: ${productosBucket.public ? 'Sí' : 'No'}`)
    } else {
      console.log('⚠️  Bucket "productos-images" no encontrado')
      console.log('   Créalo siguiendo las instrucciones en SUPABASE-SETUP.md')
    }
    console.log('')

    // Resumen final
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 ¡Conexión con Supabase exitosa!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✨ Todo está listo para continuar con el desarrollo\n')

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    process.exit(1)
  }
}

// Ejecutar test
testConnection()
