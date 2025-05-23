// Importa las dependencias principales
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configura el rate limiting para evitar abusos (100 requests por 15 minutos por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por IP
});

// Middlewares globales
app.use(cors()); // Permite solicitudes desde otros orígenes (CORS)
app.use(express.json()); // Permite recibir JSON en las peticiones
app.use(limiter); // Aplica el rate limiting

// Middleware para validar JWT en rutas protegidas
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    // Verifica el token usando la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Token inválido
      }
      req.user = user; // Adjunta el usuario al request
      next();
    });
  } else {
    res.sendStatus(401); // No se envió token
  }
}

// Endpoint de salud para verificar que el gateway está activo
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Proxy para Auth Service (registro, login, etc.)
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL, // Redirige a la URL del Auth Service
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' }, // Mantiene el path
}));

// Proxy para Users Service (ejemplo, aún no implementado)
// Protegido por JWT
app.use('/api/users', authenticateJWT, createProxyMiddleware({
  target: process.env.USERS_SERVICE_URL, // Redirige a la URL del User Service
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
}));

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
}); 