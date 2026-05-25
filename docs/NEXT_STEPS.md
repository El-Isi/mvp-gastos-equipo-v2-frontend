# Próximos Pasos para Producción: Gastos Equipo TSO v2

## 1. Autenticación y Autorización
**Qué falta**: No hay login ni roles. Cualquier usuario puede ver, editar y eliminar gastos de otros. Se necesita integrar el SSO de Konfío (o similar), definir rol "miembro" (solo sus gastos) y rol "aprobador" (cambia estatus de cualquier gasto).
**Por qué importa**: Sin esto, los datos carecen de integridad y trazabilidad. No se puede auditar quién aprobó qué.
**Complejidad**: 🔴 Alta

## 2. Validaciones y Manejo de Errores
**Qué falta**: La validación del formulario es mínima (solo verifica descripción y monto > 0). No hay validación de fechas futuras, montos máximos, caracteres especiales, ni feedback visual de errores. Eliminar no pide confirmación. El ciclo de estatus no tiene restricciones lógicas.
**Por qué importa**: Datos inconsistentes generan reportes incorrectos y pérdida de confianza.
**Complejidad**: 🟢 Baja

## 3. Testing (Unit / Integration / E2E)
**Qué falta**: No se detectan archivos de test. Se necesitan tests unitarios para lógica de cálculos (totales, filtros, breakdowns), tests de integración para los componentes (formulario, lista, dashboard) y tests E2E para los flujos principales.
**Por qué importa**: Cualquier cambio puede romper funcionalidad sin red de seguridad.
**Complejidad**: 🟡 Media

## 4. Observabilidad (Logs, Métricas, Alertas)
**Qué falta**: Sin logging de acciones de usuario, sin métricas de uso (gastos creados/día, tiempo en pantalla), sin alertas ante errores. El archivo `notification-service.ts` existe pero probablemente es un placeholder.
**Por qué importa**: Sin observabilidad no se puede medir adopción ni detectar problemas.
**Complejidad**: 🟡 Media

## 5. Seguridad
**Qué falta**: Sin HTTPS enforcement explícito, sin protección CSRF, sin sanitización de inputs contra XSS, sin rate limiting. Los datos se almacenan en localStorage (accesibles desde consola del navegador).
**Por qué importa**: Datos financieros del equipo podrían ser manipulados o exfiltrados.
**Complejidad**: 🟡 Media

## 6. Escalabilidad y Performance
**Qué falta**: Todos los datos viven en memoria/localStorage. Con cientos de gastos históricos la UI podría degradarse. No hay paginación en la lista, ni lazy loading, ni virtualización de filas.
**Por qué importa**: Si otros equipos adoptan la herramienta, el volumen de datos crecerá significativamente.
**Complejidad**: 🟡 Media

## 7. Integraciones Reales de Konfío
**Qué falta**: Conectar con un backend real (API REST o la infraestructura de Konfío). Los archivos `api-client.ts`, `auth-service.ts` y `INTEGRATIONS.md` sugieren que la estructura está preparada pero sin implementación real. Se necesita: persistencia en base de datos, integración con sistemas contables/ERP, y potencialmente con el directorio de empleados.
**Por qué importa**: Sin persistencia real, los datos se pierden al limpiar el navegador.
**Complejidad**: 🔴 Alta

## 8. UX y Accesibilidad
**Qué falta**: Sin atributos ARIA, sin navegación por teclado en el modal, sin indicadores de foco visibles, sin soporte para lectores de pantalla. La vista de lista no es responsive en pantallas < 768px (grid de 7 columnas). Los colores de contraste en textos grises (#636E72 sobre #0A0A0F) podrían no pasar WCAG AA. No hay confirmación al eliminar ni undo.
**Por qué importa**: Accesibilidad es obligatoria para productos de Konfío y mejora la experiencia para todos.
**Complejidad**: 🟡 Media