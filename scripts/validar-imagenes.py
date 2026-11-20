"""Valida imágenes visibles, metadatos y sitemap público sin editar archivos."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from html import unescape
import json,re,xml.etree.ElementTree as E

ROOT=Path(__file__).resolve().parents[1];BASE='https://www.almakids.cl'
S='http://www.sitemaps.org/schemas/sitemap/0.9';I='http://www.google.com/schemas/sitemap-image/1.1'
class Page(HTMLParser):
    def __init__(self,text):super().__init__();self.tags=[];self.feed(text)
    def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
    def find(self,name):return[a for t,a in self.tags if t==name]
tree=E.fromstring((ROOT/'sitemap.xml').read_text());urls=[];photos=set();count=0
for item in tree.findall(f'{{{S}}}url'):
    url=item.find(f'{{{S}}}loc').text;urls.append(url)
    assert url.startswith(BASE+'/')and'/propuestas/'not in url
    rel=urlsplit(url).path.lstrip('/')or'index.html'
    if not Path(rel).suffix:rel+='.html'
    text=(ROOT/rel).read_text();p=Page(text)
    refs={BASE+'/'+urlsplit(a['src']).path.lstrip('/')for a in p.find('img')if a.get('src')}
    met={a.get('property',a.get('name')):a.get('content')for a in p.find('meta')}
    for im in item.findall(f'{{{I}}}image/{{{I}}}loc'):
        assert im.text in refs,(url,'imagen no visible',im.text)
        asset=ROOT/unquote(urlsplit(im.text).path.lstrip('/'));assert asset.is_file()
        photos.add(im.text)
    blocks=[json.loads(m[1])for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>([\s\S]*?)</script>',text)]
    matching=re.search(r'<script type="application/ld\+json" id="alma-imagen-principal">([\s\S]*?)</script>',text)
    if matching:
        graph=json.loads(matching[1])['@graph'];page=next(x for x in graph if x['@type']=='WebPage');photo=next(x for x in graph if x['@type']=='ImageObject')
        assert page['url']==url and page['primaryImageOfPage']['@id']==photo['@id']
        assert met['og:image']==met['twitter:image']==photo['contentUrl']
        assert photo['contentUrl']in refs and 'logo-alma'not in photo['contentUrl']
        assert int(met['og:image:width'])==photo['width']>=250
        assert int(met['og:image:height'])==photo['height']>=250
        assert met['og:image:alt']==photo['caption']and len(photo['caption'])>10
        assert 'max-image-preview:large'in met.get('robots','')
        count+=1
assert len(urls)==len(set(urls))==66
assert count>=55 and len(photos)>=16
for name in ['index.html','juegos-inflables-rancagua.html']:
    text=(ROOT/name).read_text();assert '"primaryImageOfPage"'in text
    assert re.search(r'property="og:image" content="'+re.escape(BASE)+r'/imagenes/montaje-inflable-pastel-1280.jpg"',text)
empresa=(ROOT/'empresas.html').read_text()
assert not re.search(r'\$\s*8[.,]000|\$\s*400[.,]000|\$\s*476[.,]000|m[ií]nimo\s+(?:de\s+)?50',empresa,re.I)
assert 'streetAddress'not in(ROOT/'index.html').read_text()
print(json.dumps({'public_pages':len(urls),'pages_with_preferred_photo':count,'unique_visible_images_in_sitemap':len(photos),'private_proposal_excluded':True,'public_corporate_prices_absent':True},ensure_ascii=False))
