import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const origin='https://www.almakids.cl';
const date='2026-11-22';
const version='20261122-sets04';
const context={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'catalogo-datos.js'),'utf8'),context);
const products=JSON.parse(JSON.stringify(context.window.CATALOGO_PRODUCTOS)).filter(p=>p.activo!==false);
const h=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const plain=v=>String(v).replace(/<[^>]*>/g,' ').replaceAll('&amp;','&').replaceAll('&nbsp;',' ').replace(/\s+/g,' ').trim();
const price=p=>(p.precioDesde?'Desde ':'')+new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(p.precio);
const page=p=>`/juegos/${p.id}`;
const abs=s=>origin+'/'+s.replace(/^\//,'');
const whatsapp=p=>'https://wa.me/56969073306?text='+encodeURIComponent(`¡Hola, ALMA Kids! Me interesa ${p.nombre}. Valor de referencia: ${price(p)}. ${p.duracion}. Quisiera consultar disponibilidad, traslado y espacio necesario.\nFecha:\nComuna:`);
const business={
 '@type':['LocalBusiness','EntertainmentBusiness'],'@id':origin+'/#localbusiness',name:'ALMA Kids Entretenciones Infantiles Ltda.',alternateName:'ALMA Kids',
 url:origin+'/',telephone:'+56969073306',email:'info.almakids@gmail.com',image:['montaje-inflable-pastel-1280.jpg','portada-tipi-plaza-blanda.webp','montaje-pastel-caballito.jpg'].map(n=>abs('imagenes/'+n)),logo:abs('imagenes/logo-alma-kids-marca.jpeg'),
 description:'Arriendo de juegos inflables, plazas blandas y piscinas de pelotas en tonos neutros y pastel, con base en Machalí y atención en Rancagua y la Región de O’Higgins.',
 address:{'@type':'PostalAddress',addressLocality:'Machalí',addressRegion:'Región de O’Higgins',addressCountry:'CL'},
 areaServed:[{'@type':'City',name:'Machalí'},{'@type':'City',name:'Rancagua'},{'@type':'AdministrativeArea',name:'Región de O’Higgins'}],
 openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],opens:'08:00',closes:'20:00'}],
 sameAs:['https://www.instagram.com/almakids.cl/','https://www.facebook.com/profile.php?id=61580273574247','https://www.google.com/maps?cid=12787614162186377869']
};
function offer(p){
 const out={'@type':'Offer',url:origin+page(p),priceCurrency:'CLP',seller:{'@id':business['@id']}};
 if(p.precioDesde)out.priceSpecification={'@type':'PriceSpecification',minPrice:p.precio,priceCurrency:'CLP'};else out.price=p.precio;
 return out;
}
function service(p){
 return {'@type':p.venta?'Product':'Service','@id':origin+page(p)+'#servicio',name:p.nombre,description:`${p.resumen} ${p.duracion}. ${p.requisitos||''}`,url:origin+page(p),
 ...(p.imagen?{image:abs(p.imagen)}:{}),...(p.venta?{brand:{'@type':'Brand',name:'ALMA Kids'}}:{provider:{'@id':business['@id']},areaServed:business.areaServed,serviceType:p.categoriaNombre}),
 offers:p.variantes?{'@type':'OfferCatalog',name:'Opciones y precios',itemListElement:p.variantes.map(v=>offer({...p,...v,precioDesde:false,variantes:undefined}))}:offer(p)
 };
}
const json=graph=>`<script type="application/ld+json" id="alma-datos-servicios">${JSON.stringify({'@context':'https://schema.org','@graph':graph},null,2).replaceAll('<','\\u003c')}</script>`;
const header=`<a class="skip-link" href="#contenido">Saltar al contenido</a><header class="ficha-header"><a href="/" aria-label="ALMA Kids, inicio"><img src="/imagenes/logo-alma-kids-marca.jpeg" width="1254" height="1254" alt="ALMA Kids"></a><nav aria-label="Navegación principal"><a href="/#catalogo">Juegos y precios</a><a href="/elegir-juegos-infantiles">Cómo elegir</a><a href="/faq">Preguntas frecuentes</a></nav></header>`;
const footer=`<footer class="ficha-footer"><div><img src="/imagenes/logo-alma-kids-marca.jpeg" width="1254" height="1254" alt="ALMA Kids" loading="lazy"><p>Entretenciones Infantiles Ltda.<br>Base en Machalí · Región de O’Higgins</p></div><div><h2>Conversemos</h2><a href="https://wa.me/56969073306">WhatsApp +56 9 6907 3306</a><a href="mailto:info.almakids@gmail.com">info.almakids@gmail.com</a><p>Lunes a domingo · 08:00 a 20:00</p></div><div><h2>Información útil</h2><a href="/juegos-inflables-ohiggins">Cobertura y traslados</a><a href="/calidad">Calidad y seguridad</a><a href="/feedback">Evaluar el servicio</a><a href="/privacidad">Privacidad</a></div><p class="ficha-copyright">© 2026 ALMA Kids Entretenciones Infantiles Ltda.</p></footer>`;
function document(title,description,url,body,graph,image){return `<!DOCTYPE html>
<html lang="es-CL"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${h(title)} | ALMA Kids</title><meta name="description" content="${h(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${origin+url}"><meta property="og:type" content="website"><meta property="og:locale" content="es_CL"><meta property="og:title" content="${h(title)} | ALMA Kids"><meta property="og:description" content="${h(description)}"><meta property="og:url" content="${origin+url}"><meta property="og:image" content="${abs(image||'imagenes/logo-alma-kids-marca.jpeg')}"><link rel="icon" type="image/png" href="/imagenes/ak-icono-96.png"><link rel="stylesheet" href="/fichas-juegos.css?v=${version}">${json(graph)}<script src="/medicion-consultas.js?v=${version}" defer></script></head><body class="ficha-page">${header}<main id="contenido">${body}</main>${footer}</body></html>\n`;}
function faqMarkup(faqs){return `<section class="ficha-section"><h2>Antes de reservar</h2><div class="ficha-faq">${faqs.map(([q,a])=>`<details><summary>${h(q)}</summary><p>${a}</p></details>`).join('')}</div></section>`;}
function faqSchema(faqs){return {'@type':'FAQPage',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:plain(a)}}))};}
const guideFaqs=[
 ['¿Qué juegos puedo arrendar para un cumpleaños de un año?',`La piscina de pelotas de espuma está recomendada desde los 6 meses. El <a href="${page(products.find(p=>p.id==='pack-alma-mini-play'))}">set ALMA Mini Play</a> se recomienda de 6 meses a 3 años y ALMA Active, de 6 meses a 5 años. La elección depende de la edad, las capacidades de los niños y el espacio. Siempre se requiere supervisión adulta.`],
 ['¿Qué juego cabe en mi casa o en un espacio de 3 × 3 metros?',`Debemos revisar fotos, video, medidas, acceso y superficie antes de confirmar. El tamaño del juego no equivale al espacio libre necesario: también revisamos la distribución completa y las separaciones indicadas por el fabricante. Un set con tatami de 8,64 m² necesita espacio para su montaje y circulación; no confirmamos que quepa solo por el ancho indicado en la consulta.`],
 ['¿Qué diferencia hay entre el castillo GRAND-PEQUE y el set completo?',`El <a href="/juegos/castillo-grand-peque">castillo individual</a> cuesta $90.000 e incluye 3 horas de uso. El <a href="/juegos/pack-grand-peque">set GRAND-PEQUE</a> cuesta $210.000 e incluye 4 horas, junto con piscina de espuma, motricidad, tipi y los demás componentes indicados en su ficha. El castillo mide 5,00 × 4,00 × 2,83 m. El espacio del montaje completo se valida con fotos y medidas, incluidos accesos, anclajes, soplador y cableado. Ambos necesitan conexión eléctrica.`],
 ['¿Los precios incluyen traslado en Machalí y Rancagua?',`El traslado es gratuito en Machalí y Rancagua al contratar un set o pack completo. Para juegos individuales y otras comunas, se cotiza según la dirección y los accesos. Confirma el valor total antes de reservar.`],
 ['¿Todos los juegos duran cuatro horas?',`La duración depende del servicio: los sets y packs incluyen 4 horas; el castillo GRAND-PEQUE individual, la máquina de burbujas, el tipi, la motricidad y los saltarines o balancines individuales incluyen 3 horas. La piscina individual incluye 3 horas. Los castillos ROSA y PEQUE incluyen 4 horas. Revisa la ficha del servicio; montaje y retiro no se descuentan del tiempo contratado.`],
 ['¿La máquina de burbujas incluye el líquido?',`El arriendo individual de la máquina cuesta $16.000 por 3 horas. El líquido se vende por separado a $6.000 por litro. Los sets Máximo y GRAND-PEQUE incluyen la máquina y 700 ml de líquido, según sus fichas.`],
 ['¿El set MINI PLAY incluye carpa tipi?',`Sí. El set ALMA Mini Play cuesta $100.000 por 4 horas e incluye carpa tipi, un cojín y una alfombra a elección, además de piscina, motricidad, tatami y zapatero. No hay un recargo por el tipi.`],
 ['¿Qué piscina incluye el set DÚO?',`DÚO cuesta $120.000 por 4 horas e incluye una piscina de espuma a elección: grande (1,50 × 1,50 × 0,40 m) o mini (1,10 × 1,10 × 0,35 m), sin cambiar el valor del set. La elección se acuerda al reservar y queda indicada en el contrato.`],
 ['¿Cómo se confirma una reserva?',`Primero revisamos la fecha, comuna, servicio y antecedentes del espacio. La confirmación requiere la validación técnica, aceptación de la cotización, abono del 50% y aceptación o firma del contrato. El saldo se paga antes de la instalación. Las condiciones se informan antes de confirmar.`]
];
const expanded=[];
for(const p of products){
 expanded.push(p);
 for(const v of p.variantes||[]){
  const isAnimal=p.id==='saltarin-balancin';
  expanded.push({...p,...v,variantes:undefined,precioDesde:false,etiquetaPrecio:'Valor arriendo',padre:p.id,
   resumen:isAnimal?`${v.nombre} para complementar la zona de juegos infantiles. Se arrienda por separado y está recomendado de 1 a 4 años.`:`Cartel de bienvenida personalizado de ${v.medidasEspacio}, con diseño temático, nombre y datos del festejado.`,
   incluye:isAnimal?[v.nombre+' limpio y sanitizado','Material suave y de alta resistencia','3 horas de uso']:['Cartel de bienvenida de '+v.medidasEspacio,'Diseño temático con nombre y datos del festejado','Confirmación previa del diseño y de los tiempos de entrega'],
   // Do not use a photograph of a different animal to illustrate the selected model.
   imagen:isAnimal&&v.id!=='caballo-balancin-cafe'?null:p.imagen,
   altImagen:isAnimal?'Caballo balancín café en un montaje de ALMA Kids':p.altImagen
  });
 }
}
const bubble=products.find(p=>p.id==='maquina-burbujas');
expanded.push({id:'liquido-burbujas-1l',nombre:'Líquido para burbujas (1 litro)',categoria:'adicionales',categoriaNombre:'Insumo para burbujas',precio:bubble.suplemento.precio,venta:true,imagen:null,duracion:'Venta por litro',medidasEspacio:'Envase de 1 litro',edadesRecomendadas:'Uso a cargo de un adulto',resumen:'Líquido para complementar el arriendo de la máquina de burbujas. La máquina se arrienda por separado.',incluye:['1 litro de líquido para burbujas'],requisitos:'Coordinar la cantidad requerida junto con el arriendo de la máquina.'});
await fs.mkdir(path.join(root,'juegos'),{recursive:true});
for(const p of expanded){
 const url=page(p),isIndividual=p.id==='castillo-grand-peque';
 const photo=p.imagen?`<figure class="ficha-photo"><img src="${h('/'+p.imagen)}" alt="${h(p.altImagen||p.nombre)}" width="1000" height="1000" fetchpriority="high" decoding="async"><figcaption>${h(p.variantes?'Montaje de referencia. Revisa las opciones que se detallan en esta ficha.':'Fotografía de referencia de ALMA Kids. Contrata los componentes indicados en la ficha; la decoración se cotiza por separado cuando corresponda.')}</figcaption></figure>`:`<div class="ficha-no-photo"><span class="eyebrow">${h(p.venta?'INSUMO POR LITRO':'MODELO INDIVIDUAL')}</span><p>${h(p.nombre)}</p><a href="${h(whatsapp(p))}">Consultar ${p.venta?'cantidad':'foto y disponibilidad de este modelo'}</a></div>`;
 const variants=p.variantes?`<section class="ficha-section"><h2>Opciones y precios</h2><div class="ficha-table-wrap"><table><thead><tr><th scope="col">Opción</th><th scope="col">Valor CLP</th><th scope="col">Ficha</th></tr></thead><tbody>${p.variantes.map(v=>`<tr><th scope="row">${h(v.nombre)}${v.medidasEspacio?' · '+h(v.medidasEspacio):''}</th><td>${h(price(v))}</td><td><a href="${page(v)}">Ver opción</a></td></tr>`).join('')}</tbody></table></div></section>`:'';
 const faqs=[['¿Cuál es la duración y qué está incluido?',`${h(p.duracion)}. ${p.venta?'Se vende el líquido por litro; la máquina se arrienda por separado.':'Los componentes incluidos se detallan en esta ficha. La instalación y el retiro no descuentan tiempo de uso.'}`],['¿Cómo consulto disponibilidad?',`Escríbenos por WhatsApp con fecha, comuna y servicio. ${p.venta?'Coordinamos cantidad y entrega.':'Envía fotos, video y medidas para revisar el espacio antes de confirmar.'}`]];
 const choices=[];
 if(p.incluye.some(x=>/Tatami/i.test(x)))choices.push('Tatami: rosa/blanco o beige/gris.');
 if(p.incluye.some(x=>/pelotas|piscina de espuma/i.test(x)))choices.push('Pelotas: colores acordados con el equipo, sujetos a disponibilidad.');
 if(p.id==='set-duo')choices.push('Piscina de espuma: elige grande o mini al reservar, sin recargo.');
 if(p.incluye.some(x=>/Saltarín o Balancín Unicornio/i.test(x)))choices.push('Unicornio y caballo: saltarín o balancín, según las opciones incluidas en el set.');
 if(p.incluye.some(x=>/Alfombra.*(tipi|carpa)|Alfombra suave/i.test(x)))choices.push('Alfombra para tipi: celeste, gris o rosa, cuando esté incluida.');
 if(p.incluye.some(x=>/cojines|cojín/i.test(x)))choices.push('Cojín: una unidad, a elegir entre las dos opciones disponibles.');
 const body=`<nav class="ficha-breadcrumb" aria-label="Ubicación"><a href="/">Inicio</a><span>/</span><a href="/#catalogo">Juegos y precios</a><span>/</span><span>${h(p.nombre)}</span></nav>
 <section class="ficha-hero">${photo}<div class="ficha-summary"><span class="eyebrow">${h(p.categoriaNombre)}</span><h1>${h(p.nombre)}</h1><p class="ficha-intro">${h(p.resumen)}</p><p class="ficha-price">${h(price(p))}<span>${h(p.duracion)}</span></p><dl class="ficha-specs"><div><dt>${p.venta?'Presentación':'Edad recomendada'}</dt><dd>${h(p.venta?p.medidasEspacio:p.edadesRecomendadas)}</dd></div>${!p.venta?`<div><dt>Espacio y medidas</dt><dd>${h(p.medidasEspacio)}</dd></div>`:''}<div><dt>Cobertura</dt><dd>Base en Machalí; atención en Rancagua y O’Higgins. Traslado según servicio y ubicación.</dd></div></dl><a class="ficha-button" href="${h(whatsapp(p))}" data-producto="${p.id}" target="_blank" rel="noopener noreferrer">Consultar disponibilidad</a><p class="ficha-note">Valores en CLP. Confirmamos disponibilidad, traslado y condiciones antes de reservar.</p>${isIndividual?'<p class="ficha-notice">Este es el castillo individual de 3 horas. <a href="/juegos/pack-grand-peque">Ver el set completo de 4 horas</a>.</p>':''}${p.id==='pack-grand-peque'?'<p class="ficha-notice">Este es el set completo de 4 horas. <a href="/juegos/castillo-grand-peque">Ver solo el castillo de 3 horas</a>.</p>':''}</div></section>
 ${variants}<div class="ficha-detail-grid"><section class="ficha-section"><h2>Qué incluye</h2><ul class="ficha-includes">${p.incluye.map(x=>`<li>${h(x.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ul>${p.suplemento?`<p class="ficha-notice">${h(p.suplemento.nombre)}: ${h(price(p.suplemento))}. <a href="/juegos/liquido-burbujas-1l">Ver el líquido por separado</a>.</p>`:''}</section><section class="ficha-section"><h2>${p.venta?'Coordinación':'Requisitos del lugar'}</h2><p>${h(p.requisitos)}</p>${!p.venta?'<p>Envía fotos, un video y las medidas del espacio y del acceso. La instalación final depende de la revisión técnica y de las condiciones del lugar.</p><p>Los juegos requieren supervisión de un adulto responsable.</p>':''}${choices.length?`<h3>Opciones que podemos coordinar</h3><ul>${choices.map(x=>`<li>${h(x)}</li>`).join('')}</ul>`:''}</section></div>
 ${faqMarkup(faqs)}<section class="ficha-section ficha-help"><h2>Preparemos tu celebración</h2><p>Cuéntanos la fecha y la comuna. Te ayudamos a revisar qué juego se adapta a tu espacio.</p><a class="ficha-button" href="${h(whatsapp(p))}" data-producto="${p.id}">Cotizar por WhatsApp</a><a class="ficha-text-link" href="/elegir-juegos-infantiles">Comparar opciones para mi evento</a></section>`;
 const graph=[business,service(p),{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:origin+'/'},{'@type':'ListItem',position:2,name:'Juegos y precios',item:origin+'/#catalogo'},{'@type':'ListItem',position:3,name:p.nombre,item:origin+url}]},faqSchema(faqs)];
 await fs.writeFile(path.join(root,'juegos',p.id+'.html'),document(p.nombre,`${p.nombre}: ${price(p)}, ${p.duracion.toLowerCase()}. Consulta componentes, medidas y disponibilidad en Machalí y Rancagua.`,url,body,graph,p.imagen));
}

const guideBody=`<section class="ficha-guide-hero"><span class="eyebrow">ELIGE CON CALMA</span><h1>Qué juego elegir para tu celebración</h1><p>Compara edades, espacio y lo que incluye cada servicio de ALMA Kids. Antes de reservar, revisamos las fotos y medidas de tu lugar.</p><a class="ficha-button" href="/#catalogo">Ver todos los juegos y precios</a></section>${faqMarkup(guideFaqs)}<section class="ficha-section"><h2>Comparación rápida de sets</h2><div class="ficha-table-wrap"><table><thead><tr><th scope="col">Set</th><th scope="col">Edad recomendada</th><th scope="col">Duración</th><th scope="col">Precio CLP</th></tr></thead><tbody>${products.filter(p=>p.categoria==='packs').map(p=>`<tr><th scope="row"><a href="${page(p)}">${h(p.nombre)}</a></th><td>${h(p.edadesRecomendadas)}</td><td>${h(p.duracion)}</td><td>${h(price(p))}</td></tr>`).join('')}</tbody></table></div><p>El espacio y las opciones se detallan en cada ficha. Las edades orientan la elección; no reemplazan la supervisión ni la revisión del lugar.</p></section>`;
await fs.writeFile(path.join(root,'elegir-juegos-infantiles.html'),document('Cómo elegir juegos infantiles en Machalí y Rancagua','Compara juegos para cumpleaños de un año, espacio necesario, precios, duración y diferencias entre sets e individuales.','/elegir-juegos-infantiles',guideBody,[business,faqSchema(guideFaqs)]));

// Initial HTML contains the actual catalog; JavaScript adds filters and customization.
let home=await fs.readFile(path.join(root,'index.html'),'utf8');
const cards=products.map(p=>`<article class="catalogo-card ${p.destacado?'destacado':''}" data-id="${p.id}"><a class="catalogo-card-media" href="${page(p)}">${p.badge?`<span class="catalogo-card-badge">${h(p.badge)}</span>`:''}<img src="${h(p.imagen)}" alt="${h(p.altImagen||p.nombre)}" loading="lazy" decoding="async"></a><div class="catalogo-card-body"><div class="catalogo-card-header"><span class="catalogo-card-cat">${h(p.categoriaNombre)}</span><h3 class="catalogo-card-title"><a href="${page(p)}">${h(p.nombre)}</a></h3></div><div class="catalogo-card-chips"><span class="catalogo-chip">${h(p.duracion)}</span><span class="catalogo-chip">${h(p.medidasEspacio)}</span><span class="catalogo-chip">${h(p.edadesRecomendadas)}</span></div><p class="catalogo-card-desc">${h(p.resumen)}</p><div class="catalogo-card-incluye"><strong class="catalogo-incluye-title">Qué incluye</strong><ul>${p.incluye.slice(0,3).map(x=>`<li>${h(x)}</li>`).join('')}</ul></div><div class="catalogo-card-footer"><div class="catalogo-card-price-box"><span class="catalogo-price-label">Valor de referencia</span><div class="catalogo-price-val">${h(price(p))}</div></div><div class="catalogo-card-actions"><a class="btn-catalogo-details" href="${page(p)}">Ver ficha</a><a class="btn-catalogo-wsp" href="${h(whatsapp(p))}" data-catalogo-cotizar="${p.id}" target="_blank" rel="noopener noreferrer">Cotizar</a></div></div></div></article>`).join('\n');
home=home.replace(/(<div id="catalogo-grid"[^>]*>)[\s\S]*?(\n\s*<\/div>\s*<\/div>\s*<\/section>)/,(_match,open,close)=>`${open}\n<!-- INICIO CATALOGO GENERADO -->\n${cards}\n<!-- FIN CATALOGO GENERADO -->${close}`);
home=home.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g,'');
const homeFAQs=[...home.matchAll(/<div class="faq-accordion-item(?: active)?">[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<div class="faq-accordion-body-inner">([\s\S]*?)<\/div>/g)].map(m=>[plain(m[1]),plain(m[2])]);
const offers=expanded.filter(p=>!p.variantes).map(p=>({...offer(p),itemOffered:{'@id':origin+page(p)+'#servicio'}}));
home=home.replace('</head>',`${json([{...business,hasOfferCatalog:{'@type':'OfferCatalog','@id':origin+'/#catalogo-servicios',name:'Juegos, sets y adicionales ALMA Kids',itemListElement:offers}},{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'ALMA Kids',publisher:{'@id':business['@id']}},...expanded.filter(p=>!p.variantes).map(service),faqSchema(homeFAQs)])}\n</head>`);
await fs.writeFile(path.join(root,'index.html'),home);

// Preserve existing indexed URLs and add every new, internally linked service page.
let sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
sitemap=sitemap.replace(/\s*<url><loc>https:\/\/www\.almakids\.cl\/(?:juegos\/[^<]+|elegir-juegos-infantiles)<\/loc>[\s\S]*?<\/url>/g,'');
for(const url of ['/', '/faq.html']){const escaped=(origin+url).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');sitemap=sitemap.replace(new RegExp(`(<loc>${escaped}</loc><lastmod>)[^<]+`),`$1${date}`);}
const additions=[...expanded.map(page),'/elegir-juegos-infantiles'].map(url=>`  <url><loc>${origin+url}</loc><lastmod>${date}</lastmod></url>`).join('\n');
sitemap=sitemap.replace('</urlset>',additions+'\n</urlset>');
await fs.writeFile(path.join(root,'sitemap.xml'),sitemap);
console.log(JSON.stringify({catalogCards:products.length,servicePages:expanded.length,individualServices:expanded.filter(p=>!p.variantes).length,homeFAQs:homeFAQs.length,sitemapUrls:[...sitemap.matchAll(/<loc>/g)].length}));
// Preserve photo metadata and image sitemap entries when catalog pages regenerate.
const {optimizeImages}=await import('./optimizar-imagenes.mjs');
await optimizeImages();
