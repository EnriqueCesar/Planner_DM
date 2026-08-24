#!/usr/bin/env python3
"""Elimina únicamente archivos aprobados explícitamente en obsolete-files.json."""
from __future__ import annotations
import argparse,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--apply',action='store_true');args=parser.parse_args()
    files=json.loads((ROOT/'tools'/'obsolete-files.json').read_text())['files']
    for name in files:
        target=(ROOT/name).resolve()
        if ROOT not in target.parents or '..' in Path(name).parts: raise ValueError(f'Ruta no permitida: {name}')
        if target.exists():
            print(('ELIMINADO' if args.apply else 'SIMULACIÓN')+f': {name}')
            if args.apply: target.unlink()
        else: print(f'NO EXISTE: {name}')
if __name__=='__main__': main()
