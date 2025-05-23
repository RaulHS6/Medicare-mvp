// Importa las dependencias principales
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import authRoutes from './routes/auth.js';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

// Configura la conexión a PostgreSQL usando la URL del .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middlewares globales
app.use(cors()); // Permite solicitudes desde otros orígenes (CORS)
app.use(express.json()); // Permite recibir JSON en las peticiones

// Endpoint de salud para verificar que el servicio está activo
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Rutas de autenticación (registro, login, etc.)
app.use('/api/auth', authRoutes(pool));

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
}); 