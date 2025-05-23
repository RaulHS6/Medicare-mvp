// Importa las dependencias necesarias
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

// Exporta una función que recibe el pool de PostgreSQL y retorna el router de Express
export default function(pool) {
  const router = express.Router();

  // Endpoint para registrar un nuevo usuario
  // Valida que el email sea válido y la contraseña tenga al menos 6 caracteres
  router.post('/register',
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
      // Verifica si hay errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, role } = req.body;
      try {
        // Hashea la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);
        // Inserta el usuario en la base de datos
        const result = await pool.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
          [email, hashedPassword, role || 'paciente']
        );
        // Devuelve el usuario creado (sin la contraseña)
        res.status(201).json(result.rows[0]);
      } catch (err) {
        // Si hay un error (por ejemplo, email duplicado), lo retorna
        res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
      }
    }
  );

  // Endpoint para login de usuario
  // Valida que el email sea válido y que la contraseña exista
  router.post('/login',
    body('email').isEmail(),
    body('password').exists(),
    async (req, res) => {
      // Verifica si hay errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        // Busca el usuario por email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          // Si no existe, retorna error
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const user = result.rows[0];
        // Compara la contraseña ingresada con la almacenada (hasheada)
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        // Aquí se puede agregar lógica MFA (autenticación de dos factores)
        // Genera un token JWT con el id y rol del usuario
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Devuelve el token y los datos básicos del usuario
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
      } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
      }
    }
  );

  // Endpoint base para MFA (estructura, aún no implementado)
  router.post('/verify-mfa', (req, res) => {
    // Aquí se implementará la lógica de verificación MFA en el futuro
    res.json({ message: 'MFA endpoint (por implementar)' });
  });

  // Retorna el router con todas las rutas definidas
  return router;
} 