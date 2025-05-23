# Documentación de Endpoints - Auth Service

## Descripción
Servicio encargado de la autenticación, registro de usuarios, login, generación de JWT, MFA y control de roles.

---

## Endpoints

---

### POST /api/auth/register

**Descripción:**  
Registra un nuevo usuario en el sistema.

**URL:**  
`POST /api/auth/register`

**Headers requeridos:**
- `Content-Type: application/json`

**Body (request):**
```json
{
  "email": "usuario@correo.com",
  "password": "123456",
  "role": "paciente"
}
```

**Response (éxito):**
- **Status:** `201 Created`
```json
{
  "id": 1,
  "email": "usuario@correo.com",
  "role": "paciente"
}
```

**Response (error):**
- **Status:** `400 Bad Request`
```json
{
  "errors": [
    { "msg": "Email inválido", "param": "email", ... }
  ]
}
```
- **Status:** `500 Internal Server Error`
```json
{
  "error": "Error al registrar usuario",
  "details": "Detalle técnico del error"
}
```

**Roles permitidos:**  
- Público (registro abierto)

**Notas adicionales:**
- El email debe ser único.
- La contraseña se almacena hasheada.

---

### POST /api/auth/login

**Descripción:**  
Permite a un usuario iniciar sesión y obtener un JWT.

**URL:**  
`POST /api/auth/login`

**Headers requeridos:**
- `Content-Type: application/json`

**Body (request):**
```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

**Response (éxito):**
- **Status:** `200 OK`
```json
{
  "token": "jwt_aqui",
  "user": {
    "id": 1,
    "email": "usuario@correo.com",
    "role": "paciente"
  }
}
```

**Response (error):**
- **Status:** `401 Unauthorized`
```json
{
  "error": "Credenciales inválidas"
}
```

**Roles permitidos:**  
- Todos (login público)

**Notas adicionales:**
- El token JWT debe ser guardado por el frontend para futuras peticiones autenticadas.

---

### POST /api/auth/verify-mfa

**Descripción:**  
Endpoint base para la verificación de MFA (autenticación multifactor).  
Actualmente es un placeholder para la futura implementación.

**URL:**  
`POST /api/auth/verify-mfa`

**Headers requeridos:**
- `Content-Type: application/json`

**Body (request):**
```json
{
  "email": "usuario@correo.com",
  "code": "123456"
}
```

**Response (éxito):**
- **Status:** `200 OK`
```json
{
  "message": "MFA endpoint (por implementar)"
}
```

**Roles permitidos:**  
- Todos (según lógica futura)

**Notas adicionales:**
- Implementación futura para MFA por email o app.

---

### GET /health

**Descripción:**  
Verifica que el servicio está activo.

**URL:**  
`GET /health`

**Response (éxito):**
- **Status:** `200 OK`
```json
{ "status": "ok" }
```

**Roles permitidos:**  
- Todos

---

## Notas generales

- Actualiza este archivo cada vez que agregues, modifiques o elimines un endpoint.
- Usa ejemplos claros y actualizados.
- Si usas Swagger/OpenAPI, puedes poner el link aquí.