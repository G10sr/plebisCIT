/**
 * CONFIGURACIÓN DE BASE DE DATOS
 * 
 * Archivo centralizado para la conexión con PostgreSQL.
 * Utiliza la variable de entorno DATABASE_URL para conectar con la BD.
 * 
 * Importar en otros módulos como:
 * import sql from './db.js'
 */

import postgres from 'postgres'

// Obtener string de conexión de variables de entorno
const connectionString = process.env.DATABASE_URL

// Crear y exportar instancia de conexión a PostgreSQL
const sql = postgres(connectionString)

export default sql