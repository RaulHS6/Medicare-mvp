# Documentación de Endpoints - User Service

## Descripción
Servicio encargado de la gestión de usuarios, incluyendo CRUD, gestión de roles, perfiles y búsqueda.

---

## Endpoints

### GET /api/users
**Descripción:** Lista todos los usuarios con filtros opcionales.

**Query Parameters:**
- `role`: Filtrar por rol (admin, doctor, paciente)
- `is_active`: Filtrar por estado (true/false)
- `search`: Buscar por nombre o email

**Response (éxito):**
```json
[
  {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "role": "paciente",
    "profile_info": {},
    "is_active": true,
    "created_at": "2024-03-20T12:00:00Z"
  }
]
```

### POST /api/users
**Descripción:** Crea un nuevo usuario.

**Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "123456",
  "name": "Nuevo Usuario",
  "role": "paciente",
  "profile_info": {
    "telefono": "123456789",
    "direccion": "Calle Ejemplo 123"
  }
}
```

**Response (éxito):**
```json
{
  "id": 1,
  "email": "nuevo@ejemplo.com",
  "name": "Nuevo Usuario",
  "role": "paciente",
  "profile_info": {
    "telefono": "123456789",
    "direccion": "Calle Ejemplo 123"
  },
  "created_at": "2024-03-20T12:00:00Z"
}
```

### PUT /api/users/:id
**Descripción:** Actualiza un usuario existente.

**Body:**
```json
{
  "name": "Nombre Actualizado",
  "role": "doctor",
  "profile_info": {
    "especialidad": "Cardiología"
  }
}
```

### PATCH /api/users/:id/role
**Descripción:** Actualiza el rol de un usuario.

**Body:**
```json
{
  "role": "doctor"
}
```

### PATCH /api/users/:id/profile
**Descripción:** Actualiza la información del perfil.

**Body:**
```json
{
  "profile_info": {
    "telefono": "987654321",
    "especialidad": "Pediatría"
  }
}
```

### DELETE /api/users/:id/soft
**Descripción:** Eliminación lógica de un usuario (soft delete).

**Response (éxito):**
```json
{
  "message": "Usuario eliminado lógicamente",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "deleted_at": "2024-03-20T12:00:00Z"
  }
}
```

### DELETE /api/users/:id/hard
**Descripción:** Eliminación permanente de un usuario (hard delete).

**Response (éxito):** 204 No Content

---

## Códigos de Error

- `400 Bad Request`: Datos inválidos
- `404 Not Found`: Usuario no encontrado
- `500 Internal Server Error`: Error del servidor

---

## Notas

- Todos los endpoints requieren autenticación (excepto /health)
- Las contraseñas se almacenan hasheadas
- Los perfiles son flexibles y pueden contener cualquier información en formato JSON
- La eliminación lógica mantiene los datos pero marca al usuario como inactivo
- La eliminación permanente borra completamente el registro 