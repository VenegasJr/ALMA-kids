#!/usr/bin/env python3
"""Notifica las URL públicas a IndexNow; sin --enviar solo valida la carga."""
import argparse
import json
from pathlib import Path
import re
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = 'www.almakids.cl'
BASE = 'https://' + HOST

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--enviar', action='store_true')
args = parser.parse_args()
key = (ROOT / 'indexnow-key.txt').read_text().strip()
assert re.fullmatch(r'[a-zA-Z0-9-]{8,128}', key), 'Clave IndexNow inválida'
urls = [item.text for item in ET.parse(ROOT / 'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert urls and len(urls) == len(set(urls)) <= 10000
assert all(url.startswith(BASE + '/') for url in urls)
payload = {'host': HOST, 'key': key, 'keyLocation': BASE + '/indexnow-key.txt', 'urlList': urls}
if not args.enviar:
    print(f'Carga válida: {len(urls)} URL públicas. No se ha enviado ninguna solicitud.')
else:
    with urllib.request.urlopen(payload['keyLocation'], timeout=30) as response:
        assert response.status == 200
        assert response.read().decode().strip() == key, 'La clave publicada no coincide'
    request = urllib.request.Request('https://api.indexnow.org/indexnow',
        data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json; charset=utf-8'})
    with urllib.request.urlopen(request, timeout=60) as response:
        print(json.dumps({'http_status': response.status, 'url_count': len(urls),
            'result': 'Recibido; la indexación no está garantizada.'}, ensure_ascii=False))
