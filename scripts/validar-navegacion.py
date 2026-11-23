"""Comprueba los destinos públicos que respaldan los posibles enlaces de sitio."""
from pathlib import Path
from urllib.parse import urlsplit
from lxml import html
import json,re,xml.etree.ElementTree as E

root=Path(__file__).resolve().parents[1];origin='https://www.almakids.cl'
destinations={'/servicios':'Juegos y sets','/como-reservar':'Cómo reservar','/contacto':'Contacto'}
def local(url):
 p=urlsplit(url).path
 return root/('index.html'if p=='/'else p.lstrip('/')+(''if Path(p).suffix else'.html'))
tree=E.fromstring((root/'sitemap.xml').read_text())
urls=[n.text for n in tree.findall('{*}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls)==len(set(urls))==69
titles=set();checked=0
for route,name in destinations.items():
 assert origin+route in urls
 p=local(route);doc=html.fromstring(p.read_text())
 title=doc.xpath('string(//title)');assert title and title not in titles;titles.add(title)
 assert len(doc.xpath('//h1'))==1
 assert 'ALMA Kids'in doc.xpath('string(//h1)')or route=='/servicios'
 assert doc.xpath('//link[@rel="canonical"]/@href')==[origin+route]
 assert len(doc.xpath('//meta[@name="description"]/@content'))==1
 assert 100<=len(doc.xpath('//meta[@name="description"]/@content')[0])<=210
 assert not any('noindex'in v for v in doc.xpath('//meta[@name="robots"]/@content'))
 for block in doc.xpath('//script[@type="application/ld+json"]/text()'):json.loads(block)
 for a in doc.xpath('//a[@href]'):
  href=a.get('href');u=urlsplit(href)
  if u.scheme or u.netloc:continue
  target=p if not u.path else local(href)
  assert target.exists(),(route,href,'destino inexistente')
  if u.fragment:assert html.fromstring(target.read_text()).xpath('//*[@id=$id]',id=u.fragment),(route,href,'ancla inexistente')
  checked+=1
 for img in doc.xpath('//img[@src]'):
  assert (root/urlsplit(img.get('src')).path.lstrip('/')).is_file()
  assert img.get('alt')
 nav=doc.xpath('//nav[@aria-label="Navegación principal"]')[0]
 assert set(destinations)<=set(nav.xpath('.//a/@href'))
netlify=(root/'netlify.toml').read_text()
for route in destinations:
 assert re.search(r'from = "'+re.escape(route)+r'"\s+to = "'+re.escape(route)+r'.html"\s+status = 200',netlify)
home=html.fromstring((root/'index.html').read_text())
nav=home.xpath('//nav[@aria-label="Navegación principal"]')[0]
assert set(destinations)<=set(nav.xpath('.//a/@href'))
assert len(home.xpath('//footer//a[@href="/servicios"]'))==1
services=html.fromstring((root/'servicios.html').read_text())
assert len(services.xpath('//article[@class="principal-card"]'))==16
contact=html.fromstring((root/'contacto.html').read_text());text=contact.text_content()
for value in ['08:00 a 23:00','20:00','+56 9 6907 3306','+56 9 2060 9796','sin local de atención al público']:assert value in text
assert not contact.xpath('//iframe')
assert not any('/propuestas/'in href for href in home.xpath('//a/@href')+services.xpath('//a/@href'))
print(json.dumps({'main_pages':3,'sitemap_urls':len(urls),'internal_links_checked':checked,'native_html_navigation':True,'dedicated_routes_200':True,'corporate_prices_private':True},ensure_ascii=False))
