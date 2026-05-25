# Tech Brief: Gastos Equipo TSO v2

## Qué se Construyó
Una aplicación frontend Single Page Application que permite al equipo TSO de Konfío gestionar gastos operativos. Incluye un dashboard con métricas agregadas, vista de lista con CRUD completo, filtros dinámicos y un modal de formulario. Los datos se persisten en localStorage del navegador.

## Stack Tecnológico
- **Framework**: Next.js (App Router) con TypeScript
- **Estilos**: Tailwind CSS + CSS-in-JS inline (heredado del prototipo)
- **Fuentes**: Google Fonts (DM Sans, Space Mono)
- **Formato monetario**: `Intl.NumberFormat` con locale `es-MX`
- **Persistencia**: localStorage vía `window.storage`
- **Deployment**: Vercel
- **Containerización**: Dockerfile incluido

## Estructura de Archivos Generados
| Archivo | Propósito |
|---|---|
| `src/components/gastos-equipo.tsx` | Componente principal, orquesta estado global y lógica de negocio |
| `src/components/header.tsx` | Barra superior con navegación y botón de nuevo gasto |
| `src/components/summary-cards.tsx` | Tarjetas de resumen (total, aprobados, pendientes) |
| `src/components/filters.tsx` | Dropdowns de filtro por categoría y miembro |
| `src/components/dashboard-view.tsx` | Vista dashboard con gráficos de barras y últimos gastos |
| `src/components/list-view.tsx` | Vista de tabla con acciones por fila (estatus, editar, eliminar) |
| `src/components/expense-form-modal.tsx` | Modal de creación/edición de gastos |
| `src/lib/constants.ts` | Categorías, miembros, mapeo de estatus y datos demo |
| `src/lib/utils.ts` | Utilidades (formatMoney, generateId, helpers de Tailwind) |
| `src/lib/api-client.ts` | Cliente HTTP preparado para integración con backend |
| `src/lib/auth-service.ts` | Servicio de autenticación (placeholder) |
| `src/lib/notification-service.ts` | Servicio de notificaciones (placeholder) |
| `INTEGRATIONS.md` | Documentación de puntos de integración pendientes |
| `Dockerfile` | Imagen de contenedor para deployment alternativo |
| `.env.example` | Variables de entorno de referencia |

## Variables de Entorno Necesarias
Referirse a `.env.example`. Probables variables:
- `NEXT_PUBLIC_API_URL` — URL del backend cuando exista
- `NEXT_PUBLIC_APP_ENV` — Entorno (development/staging/production)

## Cómo Correr Localmente
```bash
git clone https://github.com/El-Isi/mvp-gastos-equipo-v2-frontend.git
cd mvp-gastos-equipo-v2-frontend
cp .env.example .env.local
npm install
npm run dev
# Abrir http://localhost:3000
```

Con Docker:
```bash
docker build -t gastos-equipo .
docker run -p 3000:3000 gastos-equipo
```

## URLs de Deployment
- **Frontend**: https://mvp-gastos-equipo-v2-frontend.vercel.app
- **Repositorio**: https://github.com/El-Isi/mvp-gastos-equipo-v2-frontend

## Deuda Técnica Conocida
1. **Sin backend**: toda la persistencia es localStorage; no hay API, base de datos ni sincronización entre dispositivos.
2. **Datos hardcodeados**: miembros del equipo y categorías están en `constants.ts`; deberían venir de un servicio.
3. **Estilos inline**: el prototipo usa CSS-in-JS inline extensivo; la migración a Tailwind en los componentes generados puede ser parcial.
4. **Sin estado global robusto**: todo el estado vive en el componente raíz con `useState`; a escala se necesitaría Context, Zustand o similar.
5. **Eliminación sin confirmación**: `deleteExpense` remueve inmediatamente sin diálogo de confirmación ni soft-delete.
6. **Ciclo de estatus sin lógica de negocio**: cualquier usuario puede ciclar entre los 3 estados sin restricciones ni auditoría.
7. **Sin paginación**: la lista renderiza todos los gastos; con volumen alto impactará performance.
8. **Servicios placeholder**: `auth-service.ts`, `notification-service.ts` y `api-client.ts` existen como estructura pero sin implementación funcional.
9. **Sin tests**: no hay archivos de test en el proyecto.