# Documentación de Endpoints - API Gateway

## Descripción
Punto único de entrada para todas las solicitudes externas.  
Redirige las rutas a los microservicios correspondientes, valida JWT y aplica rate limiting.

---

## Endpoints

---

### GET /health

**Descripción:**  
Verifica que el API Gateway está activo.

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

### Proxy /api/auth/*

**Descripción:**  
Redirige todas las rutas `/api/auth/*` al Auth Service.

**URL:**  
`/api/auth/*`

**Headers requeridos:**
- Según lo que requiera el Auth Service (por ejemplo, `Content-Type`, `Authorization`).

**Notas adicionales:**
- El API Gateway no modifica el body ni la respuesta, solo redirige.
- El Auth Service maneja la lógica de autenticación y respuesta.

---

### Proxy /api/users/*

**Descripción:**  
Redirige todas las rutas `/api/users/*` al User Service (cuando esté implementado).

**URL:**  
`/api/users/*`

**Headers requeridos:**
- `Authorization: Bearer <token>`

**Notas adicionales:**
- El API Gateway valida el JWT antes de redirigir la petición.
- El User Service maneja la lógica de usuarios.

---

## Notas generales

- Actualiza este archivo cada vez que agregues, modifiques o elimines un endpoint o una ruta proxy.
- Documenta cualquier middleware especial (autenticación, rate limiting, etc.).
- Si usas Swagger/OpenAPI, puedes poner el link aquí.