const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { validateRequest } = require('../middleware/validateRequest');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Validaciones
const userValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('role').isIn(['admin', 'doctor', 'paciente']).withMessage('Rol inválido')
];

const profileValidation = [
  body('profile_info').isObject().withMessage('La información del perfil debe ser un objeto')
];

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Rutas principales
router.get('/', roleMiddleware(['admin', 'doctor']), userController.listUsers);
router.get('/:id', roleMiddleware(['admin', 'doctor', 'paciente']), userController.getUserById);
router.post('/', roleMiddleware(['admin']), userValidation, validateRequest, userController.createUser);
router.put('/:id', roleMiddleware(['admin']), userValidation, validateRequest, userController.updateUser);

// Rutas de eliminación
router.delete('/:id/soft', roleMiddleware(['admin']), userController.softDeleteUser);
router.delete('/:id/hard', roleMiddleware(['admin']), userController.hardDeleteUser);

// Rutas de gestión de roles y perfiles
router.patch('/:id/role', 
  roleMiddleware(['admin']),
  body('role').isIn(['admin', 'doctor', 'paciente']).withMessage('Rol inválido'),
  validateRequest,
  userController.updateUserRole
);

router.patch('/:id/profile',
  roleMiddleware(['admin', 'doctor', 'paciente']),
  profileValidation,
  validateRequest,
  userController.updateUserProfile
);

// Rutas públicas (requieren autenticación)
router.get('/me/profile', userController.getCurrentUserProfile);
router.post('/me/profile', userController.createUserProfile);
router.put('/me/profile', userController.updateUserProfile);
router.patch('/me/profile/info', userController.updateProfileInfo);

// Rutas protegidas (requieren rol específico)
router.get('/profiles', roleMiddleware(['admin', 'doctor']), userController.listProfiles);
router.get('/profiles/:id', roleMiddleware(['admin', 'doctor']), userController.getUserProfile);
router.put('/profiles/:id', roleMiddleware(['admin']), userController.updateUserProfile);
router.patch('/profiles/:id/info', roleMiddleware(['admin']), userController.updateProfileInfo);
router.delete('/profiles/:id', roleMiddleware(['admin']), userController.softDeleteProfile);
router.delete('/profiles/:id/permanent', roleMiddleware(['admin']), userController.hardDeleteProfile);

module.exports = router; 