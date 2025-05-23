-- Script de inicialización para la tabla 'users' en PostgreSQL
-- Se ejecuta automáticamente al levantar el contenedor de la base de datos
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'paciente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 