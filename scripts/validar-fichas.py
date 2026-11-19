from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import urlsplit,unquote
import json,re,sys,xml.etree.ElementTree as E

root=Path(__file__).resolve().parent.parent
checks=[]
def check(value,label):
 if not value:raise AssertionError(label)
 checks.append(label)
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.path=path;self.text=path.read_text();self.elements=[];self.feed(self.text)
 def handle_starttag(self,tag,attrs):self.elements.append((tag,dict(attrs)))
 def find(self,tag):return[a for t,a in self.elements if t==tag]
 def graph(self):
  all=[]
  for m in re.finditer(r'<script[^>]+type="application/ld\+json"[^>]*>([\s\S]*?)</script>',self.text):
   data=json.loads(m[1]);all.extend(data.get('@graph',[data]))
  return all
 def visible(self):return unescape(re.sub('<[^>]+>',' ',re.sub(r'<script[^>]*>[\s\S]*?</script>','',self.text)))

pages=[Page(p)for p in sorted((root/'juegos').glob('*.html'))]
check(len(pages)==23,'23 fichas: 21 servicios y 2 grupos de opciones')
seen=set();individual={}
for p in pages:
 canonical=[a['href']for a in p.find('link')if a.get('rel')=='canonical']
 expected='https://www.almakids.cl/juegos/'+p.path.stem
 check(canonical==[expected],f'Canonical propia {p.path.name}')
 check(len(p.find('h1'))==1,f'Un título principal {p.path.name}')
 check('application/ld+json'in p.text and len(p.visible())>1000,f'Información disponible sin JavaScript {p.path.name}')
 service=next(n for n in p.graph()if n.get('@type')in ['Service','Product'])
 check(service['@id']==expected+'#servicio',f'Entidad correspondiente a la ficha {p.path.name}')
 check(service['name']in p.visible(),f'Nombre visible y datos estructurados coinciden {p.path.name}')
 if service['offers']['@type']=='Offer':individual[p.path.stem]=service
 check('aggregateRating'not in p.text and 'InStock'not in p.text,f'Sin reseñas o disponibilidad inventadas {p.path.name}')
 for tag,attr in [('a','href'),('img','src'),('script','src'),('link','href')]:
  for el in p.find(tag):
   raw=el.get(attr,'');url=urlsplit(raw)
   if not raw or url.scheme or url.netloc or not url.path:continue
   target=root/unquote(url.path).lstrip('/')if url.path.startswith('/')else p.path.parent/unquote(url.path)
   if target.is_dir():target=target/'index.html'
   if not target.exists()and not target.suffix:target=target.with_suffix('.html')
   check(target.is_file(),f'Recurso interno {p.path.name}: {url.path}')
 for a in p.find('a'):
  href=a.get('href','')
  if href.startswith('https://wa.me/'):
   check(href.startswith('https://wa.me/56969073306'),f'WhatsApp oficial {p.path.name}')
 check(expected not in seen,f'Sin canonical duplicada {p.path.name}');seen.add(expected)
check(len(individual)==21,'21 servicios con precio individual')

home=Page(root/'index.html');graph=home.graph()
check('Todos nuestros servicios incluyen'not in home.visible(),'Sin promesa universal de cuatro horas')
check(len(re.findall(r'<article class="catalogo-card[ "]',home.text))==16,'16 tarjetas reales presentes en HTML inicial')
check(home.text.count('id="catalogo-grid"')==1 and home.text.count('id="cotizador"')==1,'Catálogo y cotizador únicos')
check(home.text.count('id="alma-datos-servicios"')==1,'Una fuente estructurada de catálogo en portada')
check('reviewCount'not in home.text and 'G-XXXXXXXXXX'not in home.text,'Sin cifra antigua de reseñas ni etiqueta de prueba')
faqs=next(g for g in graph if g.get('@type')=='FAQPage')['mainEntity']
check(len(faqs)==6,'Seis preguntas estructuradas reflejan las seis preguntas visibles')
for q in faqs:check(q['name']in home.visible(),'Pregunta estructurada presente en portada')
guide=Page(root/'elegir-juegos-infantiles.html');check('cumpleaños de un año'in guide.visible(),'Guía responde una consulta real por edad')
sitemap=E.fromstring((root/'sitemap.xml').read_text());urls=[n.text for n in sitemap.findall('.//{*}loc')]
check(len(urls)==len(set(urls))==65,'65 URLs únicas en sitemap')
check(seen<=set(urls),'Todas las fichas en el sitemap')
robots=(root/'robots.txt').read_text()
for bot in ['Googlebot','Bingbot','OAI-SearchBot','PerplexityBot']:check(f'User-agent: {bot}'in robots,f'Acceso explícito para {bot}')
check('Sitemap: https://www.almakids.cl/sitemap.xml'in robots,'Robots enlaza el sitemap publicado')

# Compare against the actual workbook delivered to the owner, without editing it.
if '--excel' in sys.argv:
 import openpyxl,warnings
 warnings.filterwarnings('ignore')
 book=Path(sys.argv[sys.argv.index('--excel')+1]);w=openpyxl.load_workbook(book,data_only=True)
 for row in w['Catálogo'].iter_rows(min_row=8,max_row=28,values_only=True):
  name,sku,category,amount,kind,unit,duration=row[:7]
  check(sku in individual,'Servicio del Excel tiene ficha: '+sku)
  item=individual[sku];offer=item['offers'];value=offer.get('price',offer.get('priceSpecification',{}).get('minPrice'))
  check(value==amount,'Precio web/Excel: '+sku)
  if duration:check(duration in item['description'],'Duración web/Excel: '+sku)
  check((kind=='Desde')==('priceSpecification'in offer),'Precio fijo/desde coincide: '+sku)
print(json.dumps({'checks_passed':len(checks),'individual_services':len(individual),'sitemap_urls':len(urls)},ensure_ascii=False))
