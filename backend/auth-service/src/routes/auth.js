// Importa las dependencias necesarias
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

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

  // Login de usuario con MFA
  router.post('/login',
    body('email').isEmail(),
    body('password').exists(),
    async (req, res) => {
      // Validación de datos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        // Buscar usuario por email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const user = result.rows[0];
        // Comparar contraseña
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // --- Lógica MFA ---
        // 1. Generar código de 6 dígitos
        const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
        // 2. Calcular expiración (5 minutos desde ahora)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // 3. Guardar código y expiración en la base de datos
        await pool.query(
          'UPDATE users SET mfa_code = $1, mfa_expires_at = $2 WHERE id = $3',
          [mfaCode, expiresAt, user.id]
        );

        //logs de verificacion de lectura de variables de entorno
        console.log('MFA_EMAIL_FROM:', process.env.MFA_EMAIL_FROM);
        console.log('MFA_EMAIL_PASS:', process.env.MFA_EMAIL_PASS);
        console.log(mfaCode, expiresAt, user.id);

        // 4. Enviar el código por email usando nodemailer
        // Configura el transporter con tus credenciales de email
        const transporter = nodemailer.createTransport({
          service: 'outlook',
          auth: {
            user: process.env.MFA_EMAIL_FROM,
            pass: process.env.MFA_EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.MFA_EMAIL_FROM,
          to: user.email,
          subject: 'Tu código de verificación MFA',
          text: `Tu código de verificación es: ${mfaCode}`,
        });

        // 5. Responder al frontend que se envió el código
        res.json({ message: 'Se ha enviado un código MFA a tu correo electrónico.' });

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

  // Endpoint interno para validar existencia de usuario por id
  router.get('/internal/user-exists/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT 1 FROM users WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error al validar usuario', details: err.message });
    }
  });

  // Retorna el router con todas las rutas definidas
  return router;
} 