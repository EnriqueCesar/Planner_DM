# Planner DM 4.0 · Excelencia Operativa

Guía visual para liderar resultados a través de otros. La agenda inicia a las 08:00 en tienda, protege espacio para lo inesperado y organiza una zona por día.

## Cuatro nombres de visita

| Visita | Para qué sirve | Cierre esperado |
|---|---|---|
| VPP · Planificación | Verificar y priorizar el siguiente desarrollo. | Prioridad, dueño y fecha. |
| Observación y capacitación | Ver, enseñar y practicar el estándar con el líder. | Conducta observable en el siguiente pico. |
| Conexión rápida | Quitar una barrera y acelerar el resultado. | Compromiso breve y seguimiento. |
| Desempeño y desarrollo · CDD | Conversar de desempeño, aspiración y crecimiento. | Siguiente experiencia de desarrollo. |

Cada período programa **una CDD con cada uno de los 10 gerentes**. Los apoyos administrativos, PPK, junta regional y espacios inesperados se muestran en la agenda, pero no compiten en el filtro de nombre de visita.

## Regla de operación

- Lunes y martes: administrativo + 1–2 tiendas.
- Miércoles a domingo: 1–3 tiendas, operación y coaching.
- Una visita de ciclo por tienda cada 10 días.
- Una sola zona por ruta: Izcalli o Coacalco–Ecatepec.
- Salida de cada visita: **práctica, dueño, fecha y evidencia en 72 h**.

## Datos y mantenimiento

- `tools/build_visit_guide.py` genera la guía breve desde `data/radar_sistemas.csv`.
- `.github/workflows/cleanup-obsolete.yml` audita siempre y solo elimina, bajo ejecución manual, los archivos autorizados en `tools/obsolete-files.json`.
- `CMS/Planner_DM_4_0_CMS.xlsx` concentra agenda, CDD, acciones, soportes y radar de sistemas.
