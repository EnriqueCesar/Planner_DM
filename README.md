# Planner_DM

Planner anual para Gerente de Distrito Starbucks 2026.

## Objetivo
Dar visibilidad 360° de la agenda del DM: visitas por tienda, periodos de campaña, rituales administrativos, bloqueos de agenda, fines de semana trabajados, ruta logística y exportación a Outlook mediante archivos `.ics`.

## Cómo usar
1. Abre `index.html` en el navegador.
2. Ajusta mes, tipo de visita, fecha de bloqueo o tienda.
3. Presiona **Generar agenda**.
4. Usa **Exportar ICS** para importar a Outlook/Calendar.

## Estructura
- `index.html`: app principal.
- `css/styles.css`: estilo visual.
- `js/data.js`: tiendas, campañas, rituales y reglas.
- `js/app.js`: motor de agenda, rutas, validaciones e ICS.
- `data/agenda_base.json`: datos base editables.

## Reglas incluidas
- 10 tiendas del portafolio Enrique César.
- Ideal: 1 visita por tienda por semana.
- Mínimo: 3 visitas por tienda por mes.
- VPP, Observe & Coach, Conexión rápida y Desarrollo por periodo.
- Lunes administrativos con posibilidad de 1 a 2 tiendas.
- Martes 13:00-14:30 Reunión Centro Norte.
- Al menos 1 sábado y 1 domingo al mes.
- Mes con 5 fines de semana: trabaja 3 días de fin de semana. Mes con 4 fines: trabaja 2.
- Gastos, KPI semanal, capacitación, reuniones de portafolio y 1:1.

## Personalización rápida
Edita `js/data.js` para actualizar tiendas, campañas, gerentes, coordenadas o reglas.
