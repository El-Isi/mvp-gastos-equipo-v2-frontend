# Integraciones — Gastos Equipo v2

## Resumen

Este documento describe las integraciones del MVP "Gastos Equipo v2" con los servicios reales de Konfío, así como los gaps identificados donde no existe un servicio real disponible.

---

## Servicios reales integrados

### 1. auth-service (seed-auth)

| Campo | Valor |
|---|---|
| **Base URL** | `https://auth.konfio.mx/api/v1` |
| **Variables de entorno** | `AUTH_SERVICE_URL`, `AUTH_SERVICE_API_KEY` |
| **Estado** | ✅ Integrado |

#### Endpoints utilizados

| Método | Path | Uso en el MVP |
|---|---|---|
| `POST` | `/auth/login` | Login de miembros del equipo TSO |
| `POST` | `/auth/refresh` | Renovación automática de tokens expirados |
| `POST` | `/auth/logout` | Cierre de sesión |
| `GET` | `/auth/me` | Obtener datos del usuario autenticado (nombre, rol) |

#### Patrón de integración

```typescript
// src/lib/auth-service.ts
const response = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/me`, {
  headers: {
    Authorization: `Bearer ${token}`,
    'x-api-key': process.env.AUTH_SERVICE_API_KEY!,
  },
});
```

#### Notas
- El MVP actualmente **no tiene pantalla de login ni middleware de autenticación**. Se recomienda agregar un middleware en `src/middleware.ts` que valide el JWT contra el auth-service antes de permitir acceso a la app.
- Los miembros del equipo (`MEMBERS` en `constants.ts`) están hardcodeados. Idealmente se obtendrían del endpoint `/auth/me` o de un servicio de usuarios.

---

### 2. notification-service (seed-notifications)

| Campo | Valor |
|---|---|
| **Base URL** | `https://notifications.konfio.mx/api/v1` |
| **Variables de entorno** | `NOTIFICATIONS_URL`, `NOTIFICATIONS_API_KEY` |
| **Estado** | ✅ Disponible para integrar |

#### Endpoints disponibles

| Método | Path | Uso potencial en el MVP |
|---|---|---|
| `POST` | `/notifications/email` | Notificar al aprobador cuando se registra un gasto nuevo |
| `POST` | `/notifications/sms` | Notificar al miembro cuando su gasto fue aprobado/rechazado |

#### Patrón de integración

```typescript
// src/lib/notification-service.ts
const response = await fetch(`${process.env.NOTIFICATIONS_URL}/notifications/email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-api-key': process.env.NOTIFICATIONS_API_KEY!,
  },
  body: JSON.stringify({
    to: approverEmail,
    subject: 'Nuevo gasto pendiente de aprobación',
    body: `Se registró un gasto de ${amount} en la categoría ${category}.`,
  }),
});
```

#### Notas
- Actualmente el MVP no envía notificaciones. Se recomienda disparar un email al cambiar el status de un gasto (en `onCycleStatus`) y al crear uno nuevo.

---

## Gaps identificados (sin servicio real disponible)

### GAP-1: Servicio de persistencia de gastos

| Campo | Detalle |
|---|---|
| **Funcionalidad requerida** | CRUD de gastos (crear, leer, actualizar, eliminar) |
| **Estado actual** | Los gastos se almacenan en estado local del componente React (`useState`) con datos mock en `DEFAULT_EXPENSES` |
| **Impacto** | Los datos se pierden al recargar la página |
| **Recomendación** | Crear un backend NestJS con PostgreSQL o conectar con un servicio de datos interno de Konfío cuando esté disponible |
| **Archivo afectado** | `src/components/gastos-equipo.tsx`, `src/lib/constants.ts` |

```typescript
// TODO: Reemplazar estado local con llamadas a API real
// Actualmente en gastos-equipo.tsx:
const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
// Debería ser:
// const { data: expenses } = await fetch(`${API_URL}/expenses?cursor=${cursor}&limit=20`);
```

### GAP-2: Servicio de gestión de miembros/equipo

| Campo | Detalle |
|---|---|
| **Funcionalidad requerida** | Lista de miembros del equipo TSO con roles (aprobador, colaborador) |
| **Estado actual** | Lista hardcodeada en `MEMBERS` dentro de `src/lib/constants.ts` |
| **Impacto** | No se pueden agregar/quitar miembros sin modificar código |
| **Recomendación** | Obtener miembros desde el auth-service o un servicio de equipos cuando esté disponible |
| **Archivo afectado** | `src/lib/constants.ts` |

### GAP-3: Servicio de almacenamiento de archivos (comprobantes)

| Campo | Detalle |
|---|---|
| **Funcionalidad requerida** | Subir fotos/PDFs de comprobantes de gasto |
| **Estado actual** | No implementado |
| **Impacto** | No se pueden adjuntar evidencias a los gastos |
| **Recomendación** | Integrar con un servicio de storage (S3, GCS) cuando esté disponible |

### GAP-4: Servicio de reportes/exportación

| Campo | Detalle |
|---|---|
| **Funcionalidad requerida** | Exportar gastos a CSV/Excel para contabilidad |
| **Estado actual** | No implementado |
| **Impacto** | El equipo de finanzas no puede descargar reportes |
| **Recomendación** | Implementar endpoint de exportación en el backend cuando exista |

---

## Arquitectura de integración recomendada

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Frontend      │────▶│   API Backend        │────▶│  auth-service       │
│   (Next.js)     │     │   (NestJS - GAP)     │     │  (Konfío real)      │
│                 │     │                      │     └─────────────────────┘
│                 │     │  /expenses CRUD      │
│                 │     │  /reports            │────▶┌─────────────────────┐
│                 │     │                      │     │  notification-svc   │
└─────────────────┘     └──────────────────────┘     │  (Konfío real)      │
                               │                     └─────────────────────┘
                               ▼
                        ┌──────────────────────┐
                        │  PostgreSQL (GAP)    │
                        └──────────────────────┘
```

## Patrones aplicados

- ✅ **API Integration Pattern**: Headers `Authorization: Bearer` + `x-api-key` para servicios internos
- ✅ **Auth Pattern**: JWT con refresh tokens del auth-service
- ✅ **Error Handling Pattern**: Preparado para filtro global de excepciones cuando se agregue backend NestJS
- ✅ **Pagination Pattern**: Cursor-based pagination lista para implementar en el listado de gastos

---

## Variables de entorno requeridas

Ver `.env.example` para la lista completa con valores de ejemplo.
