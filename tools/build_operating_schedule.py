#!/usr/bin/env python3
"""Crea el calendario base de jornada DM: trabajo, descansos, vacaciones e inventario."""
from __future__ import annotations
from datetime import date, timedelta
from pathlib import Path
import json
START, END = date(2026,8,24), date(2026,12,31)
VACATIONS=[(date(2026,9,19),date(2026,9,24)),(date(2026,10,25),date(2026,11,3)),(date(2026,12,16),date(2026,12,18))]
def vacation(d): return next((f'{a:%d %b} al {b:%d %b} · Vacaciones' for a,b in VACATIONS if a<=d<=b),None)
def last(d): return (d+timedelta(days=1)).month!=d.month
def weekend_work(d): return (d.weekday()==5 and d.day<=7) or (d.weekday()==6 and 15<=d.day<=21)
rows=[];d=START
while d<=END:
    v=vacation(d)
    if v: mode,reason='VACACIONES',v
    elif last(d): mode,reason='INVENTARIO MENSUAL','Inventario mensual · cierre de mes'
    elif d.weekday()<5: mode,reason='TRABAJO','Ruta DM · tiendas + seguimiento'
    elif weekend_work(d): mode,reason='OPERACIÓN FIN DE SEMANA','Fin de semana intencional · experiencia y recuperación'
    else: mode,reason='DESCANSO','Descanso programado'
    zone='Izcalli' if d.weekday() in (0,2,4,6) else 'Coacalco–Ecatepec'
    rows.append({'date':d.isoformat(),'mode':mode,'reason':reason,'zone':zone,'stores':2 if mode not in ('DESCANSO','VACACIONES') else 0,'inventory':mode=='INVENTARIO MENSUAL'})
    d+=timedelta(days=1)
Path(__file__).resolve().parents[1].joinpath('data/day_plan.js').write_text('window.DAY_PLAN='+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
