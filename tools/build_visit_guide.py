#!/usr/bin/env python3
"""Genera la guía corta de visitas del Planner a partir del radar de sistemas."""
from __future__ import annotations
import csv, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RADAR = ROOT / 'data' / 'radar_sistemas.csv'
OUT = ROOT / 'data' / 'visit_guide.js'

def main() -> None:
    systems = []
    with RADAR.open(encoding='utf-8-sig', newline='') as fh:
        for row in csv.DictReader(fh):
            value = row['Sistema a revisar']
            if value not in systems:
                systems.append(value)
    guide = {
        'source': 'Excelencia Operativa · Liderar con intención',
        'systems': systems,
        'visits': [
            {'id':'VPP','name':'VPP · Planificación','when':'1 por tienda / período','action':'Verificar lo documentable y priorizar el siguiente desarrollo.','question':'¿Qué dato, retro o riesgo debe cambiar el plan de esta tienda?'},
            {'id':'OBS','name':'Observación y capacitación','when':'1 por tienda / período + según necesidad','action':'Observar, enseñar y practicar una conducta del líder en el turno.','question':'¿Qué hará el líder distinto en el próximo pico para sostener el estándar?'},
            {'id':'CON','name':'Conexión rápida','when':'Cuando sea necesario','action':'Conectar, quitar una barrera y acelerar el resultado.','question':'¿Qué conversación breve desbloquea el resultado hoy?'},
            {'id':'CDD','name':'Desempeño y desarrollo · CDD','when':'1 por período con cada gerente · 10 en total','action':'Conversar sobre desempeño, aspiración y siguiente experiencia de desarrollo.','question':'¿Qué capacidad debe construir el gerente y cómo sabremos que la está aplicando?'}
        ]
    }
    OUT.write_text('window.VISIT_GUIDE='+json.dumps(guide,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

if __name__ == '__main__': main()
