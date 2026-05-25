# PRD: Gastos Equipo TSO v2

## Resumen Ejecutivo
Aplicación web para que el equipo TSO (Expedientes) de Konfío registre, visualice y gestione gastos operativos. Ofrece un dashboard con resúmenes por categoría y miembro, una lista detallada con filtros, y un flujo de aprobación simplificado con tres estados (pendiente, aprobado, rechazado).

## Problema
El equipo TSO carece de una herramienta centralizada para registrar y dar seguimiento a gastos operativos (software, hardware, viajes, comidas, servicios). Sin visibilidad consolidada, los líderes no pueden identificar patrones de gasto, aprobar solicitudes ágilmente ni controlar el presupuesto del equipo.

## Usuarios Objetivo
- **Miembros del equipo TSO** (Isidro, Samantha, Kiko, Carlos, Ana, Jorge): registran gastos individuales.
- **Líder/Manager del equipo**: revisa el dashboard consolidado, aprueba o rechaza gastos.

## Solución Propuesta
El prototipo implementa una SPA con dos vistas principales:

1. **Dashboard**: tarjetas resumen (total, aprobados, pendientes), gráficos de barras por categoría y por miembro, y lista de los últimos 5 gastos.
2. **Lista**: tabla completa de gastos con columnas de descripción, miembro, categoría, fecha, monto y acciones (cambiar estatus, editar, eliminar).
3. **Modal de formulario**: permite crear o editar un gasto con campos de miembro, categoría, descripción, monto, fecha y estatus.
4. **Filtros**: por categoría (6 opciones) y por miembro del equipo, con opción de limpiar.

## Flujos de Usuario Detectados
1. **Registrar gasto**: clic en "+ Nuevo gasto" → completar formulario → guardar → el gasto aparece en dashboard y lista.
2. **Editar gasto**: clic en ícono de edición en la fila → modal con datos precargados → modificar → guardar cambios.
3. **Cambiar estatus**: clic en el botón de estatus de la fila → cicla entre pendiente → aprobado → rechazado.
4. **Eliminar gasto**: clic en ícono de eliminar → el registro se remueve inmediatamente.
5. **Filtrar gastos**: seleccionar categoría y/o miembro en los dropdowns → dashboard y lista se actualizan.
6. **Alternar vistas**: clic en "Dashboard" o "Lista" en el header para cambiar la perspectiva.
7. **Reset demo**: restaura los datos de ejemplo al estado inicial.

## Métricas de Éxito Sugeridas
- Tiempo promedio para registrar un gasto < 30 segundos.
- % de gastos con estatus actualizado dentro de 24 horas de registro > 80%.
- Adopción: 100% de los 6 miembros del equipo usan la herramienta en el primer mes.
- Reducción de consultas manuales de presupuesto al líder en ≥ 50%.

## Supuestos del Prototipo
- Los 6 miembros del equipo están hardcodeados; no hay gestión dinámica de usuarios.
- No existe autenticación; cualquier persona con el URL puede ver y modificar datos.
- Los datos se persisten con `window.storage` (localStorage del prototipo), no hay backend.
- Las 6 categorías de gasto son fijas y cubren las necesidades del equipo.
- El flujo de aprobación es un simple ciclo de estados sin roles diferenciados.
- No hay límites de presupuesto, alertas ni reglas de negocio de aprobación.

## Links
- **Frontend desplegado**: https://mvp-gastos-equipo-v2-frontend.vercel.app
- **Repositorio**: https://github.com/El-Isi/mvp-gastos-equipo-v2-frontend