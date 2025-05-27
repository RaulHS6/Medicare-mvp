const User = require('../models/userModel');
const UserProfile = require('../models/userModel');

const userController = {
  // Listar usuarios con filtros
  async listUsers(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        is_active: req.query.is_active === 'true' ? true : 
                  req.query.is_active === 'false' ? false : undefined,
        search: req.query.search
      };
      
      const users = await User.list(filters);
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // Obtener usuario por ID
  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Obtener perfil del usuario actual
  async getCurrentUserProfile(req, res) {
    try {
      const profile = await UserProfile.findByAuthId(req.user.id);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
  },

  // Obtener perfil de usuario por ID
  async getUserProfile(req, res) {
    try {
      const profile = await UserProfile.findById(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
  },

  // Crear nuevo usuario
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const existingUser = await User.findByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const newUser = await User.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar usuario
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const updatedUser = await User.update(id, userData);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  // Eliminación lógica (soft delete)
  async softDeleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const deletedUser = await User.softDelete(id);
      res.json({ message: 'Usuario eliminado lógicamente', user: deletedUser });
    } catch (error) {
      next(error);
    }
  },

  // Eliminación permanente (hard delete)
  async hardDeleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await User.hardDelete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Actualizar rol de usuario
  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const updatedUser = await User.updateRole(id, role);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  // Actualizar perfil de usuario
  async updateUserProfile(req, res) {
    try {
      const { name, profile_info, is_active } = req.body;
      const updatedProfile = await UserProfile.update(req.params.id, {
        name,
        profile_info,
        is_active
      });
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  },

  // Eliminar perfil de usuario
  async softDeleteProfile(req, res) {
    try {
      const deletedProfile = await UserProfile.softDelete(req.params.id);
      if (!deletedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json({ message: 'Profile soft deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
  },

  // Eliminar perfil de usuario permanentemente
  async hardDeleteProfile(req, res) {
    try {
      const deletedProfile = await UserProfile.hardDelete(req.params.id);
      if (!deletedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json({ message: 'Profile permanently deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
  },

  // Listar perfiles de usuario
  async listProfiles(req, res) {
    try {
      const filters = {
        role: req.query.role,
        is_active: req.query.is_active === 'true',
        search: req.query.search
      };
      const profiles = await UserProfile.list(filters);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: 'Error listing profiles', error: error.message });
    }
  },

  // Actualizar información del perfil de usuario
  async updateProfileInfo(req, res) {
    try {
      const updatedProfile = await UserProfile.updateProfile(req.params.id, req.body);
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile info', error: error.message });
    }
  },

  // Crear nuevo perfil de usuario
  async createUserProfile(req, res) {
    try {
      const { name, profile_info } = req.body;
      const profileData = {
        auth_user_id: req.user.id,
        name,
        profile_info
      };
      const newProfile = await UserProfile.create(profileData);
      res.status(201).json(newProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error creating profile', error: error.message });
    }
  }
};

module.exports = userController; 