const db = require('../config/database');
const bcrypt = require('bcrypt');
const axios = require('axios');

class UserProfile {
  static async validateAuthUser(authUserId) {
    try {
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/users/${authUserId}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  static async findById(id) {
    const query = `
      SELECT up.* 
      FROM user_profiles up
      WHERE up.id = $1 AND up.deleted_at IS NULL
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByAuthId(authUserId) {
    const query = `
      SELECT up.* 
      FROM user_profiles up
      WHERE up.auth_user_id = $1 AND up.deleted_at IS NULL
    `;
    const result = await db.query(query, [authUserId]);
    return result.rows[0];
  }

  static async create(profileData) {
    const { auth_user_id, name, profile_info } = profileData;
    
    // Validar que el usuario existe en Auth Service
    const isValid = await this.validateAuthUser(auth_user_id);
    if (!isValid) {
      throw new Error('User not found in Auth Service');
    }
    
    const query = `
      INSERT INTO user_profiles (auth_user_id, name, profile_info) 
      VALUES ($1, $2, $3) 
      RETURNING id, auth_user_id, name, profile_info, created_at
    `;
    const result = await db.query(query, [auth_user_id, name, profile_info]);
    return result.rows[0];
  }

  static async update(id, profileData) {
    const { name, profile_info, is_active } = profileData;
    const query = `
      UPDATE user_profiles 
      SET name = COALESCE($1, name),
          profile_info = COALESCE($2, profile_info),
          is_active = COALESCE($3, is_active)
      WHERE id = $4 AND deleted_at IS NULL 
      RETURNING id, auth_user_id, name, profile_info, is_active, updated_at
    `;
    const result = await db.query(query, [name, profile_info, is_active, id]);
    return result.rows[0];
  }

  static async softDelete(id) {
    const query = `
      UPDATE user_profiles 
      SET deleted_at = CURRENT_TIMESTAMP,
          is_active = false
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING id, auth_user_id, deleted_at
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async hardDelete(id) {
    const query = 'DELETE FROM user_profiles WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async list(filters = {}) {
    let query = `
      SELECT up.* 
      FROM user_profiles up
      WHERE up.deleted_at IS NULL
    `;
    const values = [];
    let paramCount = 1;

    if (filters.is_active !== undefined) {
      query += ` AND up.is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND up.name ILIKE $${paramCount}`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY up.created_at DESC';

    const result = await db.query(query, values);
    return result.rows;
  }

  static async updateProfile(id, profileInfo) {
    const query = `
      UPDATE user_profiles 
      SET profile_info = profile_info || $1::jsonb
      WHERE id = $2 AND deleted_at IS NULL 
      RETURNING id, auth_user_id, profile_info
    `;
    const result = await db.query(query, [JSON.stringify(profileInfo), id]);
    return result.rows[0];
  }
}

module.exports = UserProfile; 