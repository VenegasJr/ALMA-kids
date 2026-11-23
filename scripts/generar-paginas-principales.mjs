import fs from 'node:fs/promises';
import path from 'node:path';

// Páginas útiles por sí mismas, enlazadas desde la navegación pública.
// Google decide qué enlaces de sitio muestra; no existe una etiqueta para activarlos.
export async function buildMainPages({root,origin,products,business,renderPage,price,whatsapp,escape:h}) {
 const crumb=(name,url)=>({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:origin+'/'},{'@type':'ListItem',position:2,name,item:origin+url}]});
 const links=`<a href="/servicios">Juegos y sets</a><a href="/como-reservar">Cómo reservar</a><a href="/empresas">Eventos para empresas</a><a href="/faq.html">Preguntas frecuentes</a><a href="/contacto">Contacto</a>`;
 const trail=name=>`<nav class="ficha-breadcrumb" aria-label="Ubicación"><a href="/">Inicio</a><span>/</span><span>${name}</span></nav>`;
 const hero=(eyebrow,title,text,photo,alt,actions)=>`<section class="principal-hero"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="ficha-intro">${text}</p><div class="principal-actions">${actions}</div></div><figure><img src="/imagenes/${photo}" width="1280" height="960" alt="${alt}" fetchpriority="high" decoding="async"></figure></section>`;
 const button=(url,text)=>`<a class="ficha-button" href="${url}">${text}</a>`;
 const support=`<section class="ficha-section principal-links"><h2>Prepara tu celebración</h2><nav aria-label="Más información">${links}</nav></section>`;
 const cards=items=>`<div class="principal-cards">${items.map(p=>`<article class="principal-card"><a class="principal-card-photo" href="/juegos/${p.id}"><img src="/${h(p.imagen)}" width="800" height="800" alt="${h(p.altImagen||p.nombre)}" loading="lazy" decoding="async"></a><div><h3><a href="/juegos/${p.id}">${h(p.nombre)}</a></h3><p>${h(p.resumen)}</p><p class="principal-price">${h(price(p))}<span>${h(p.duracion)}</span></p><a class="principal-card-link" href="/juegos/${p.id}">Ver componentes y medidas <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div>`;
 const groups=[
  ['sets','Sets para una celebración completa','Combina juegos y accesorios en un mismo montaje. Revisa los componentes y las elecciones de cada set.',products.filter(p=>p.categoria==='packs')],
  ['inflables','Castillos inflables','ROSA, PEQUE y GRAND-PEQUE: compara sus medidas, duración y requisitos de instalación.',products.filter(p=>p.id.startsWith('castillo-'))],
  ['complementos','Piscinas y complementos','Arriendos individuales, motricidad, tipi, burbujas y otros detalles para sumar a tu celebración.',products.filter(p=>p.categoria!=='packs'&&!p.id.startsWith('castillo-'))]
 ];
 const servicesBody=trail('Juegos y sets')+hero('JUEGOS Y SETS ALMA KIDS','Juegos y sets para celebrar a domicilio.','Inflables, plazas blandas y piscinas de pelotas en tonos neutros y pastel. Atendemos en Machalí, Rancagua y otras comunas de O’Higgins, con traslado según el servicio y la ubicación.','montaje-inflable-pastel-1280.jpg','Montaje de castillo inflable blanco y juegos de ALMA Kids',button('#sets','Explorar los sets')+'<a href="/elegir-juegos-infantiles">Ayúdame a elegir</a>')+
  `<nav class="principal-shortcuts" aria-label="Tipos de juegos">${groups.map(([id,name])=>`<a href="#${id}">${name}</a>`).join('')}</nav>`+
  groups.map(([id,name,text,items])=>`<section class="ficha-section" id="${id}"><h2>${name}</h2><p>${text}</p>${cards(items)}</section>`).join('')+
  `<section class="ficha-help"><h2>¿Qué juego cabe en tu espacio?</h2><p>El tamaño del juego no equivale al área libre de instalación. Revisamos fotos, video, medidas, superficie, acceso y electricidad antes de confirmar. El retiro comienza como máximo a las 20:00: servicios de 4 horas hasta las 16:00 de inicio; de 3 horas, hasta las 17:00.</p>${button('/como-reservar','Ver cómo reservar')}<a class="ficha-text-link" href="/empresas">Organizar un evento de empresa</a></section>`+support;
 const steps=[
  ['Cuéntanos tu idea','Indica fecha, comuna, hora de inicio y juego o set. Si aún no decides, cuéntanos las edades de los niños y te orientamos.'],
  ['Muéstranos el lugar','Envía fotos actuales, un video panorámico, medidas y altura disponible. Incluye el acceso desde el estacionamiento, la superficie y el enchufe cuando el equipo lo requiera.'],
  ['Revisamos la factibilidad','La revisión remota es obligatoria. Si quedan dudas que no se resuelven con las imágenes y medidas, coordinamos una visita técnica.'],
  ['Acuerda el detalle','Confirmamos equipos, componentes, elecciones, traslado, horario y valor total. Revisa la cotización y el contrato antes de aceptar.'],
  ['Confirma tu reserva','La confirmación requiere validación técnica, aceptación de la cotización y del contrato, y el abono del 50%. Consultar una fecha no bloquea automáticamente los juegos.'],
  ['Prepárate para recibirnos','Mantén el lugar limpio, seco, nivelado y despejado. El saldo se paga antes de la instalación y debe haber un adulto responsable durante el uso.']
 ];
 const bookingBody=trail('Cómo reservar')+hero('TU CELEBRACIÓN, PASO A PASO','Cómo reservar tus juegos ALMA Kids.','Te acompañamos desde la elección del set hasta el montaje. Primero revisamos la fecha y el lugar para que el servicio se adapte a tu celebración.','portada-tipi-plaza-blanda.webp','Plaza blanda y carpa tipi de ALMA Kids en un montaje pastel',button('/contacto','Consultar mi fecha')+'<a href="/servicios">Ver juegos y sets</a>')+
  `<section class="ficha-section"><h2>De la idea a la reserva confirmada</h2><ol class="principal-steps">${steps.map(([title,text],i)=>`<li><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol></section>`+
  `<section class="principal-split ficha-section"><div><h2>El horario de tu evento</h2><p>El tiempo de uso comienza cuando los equipos quedan instalados, operativos y entregados. Montaje y retiro no se descuentan de la duración contratada.</p><ul><li><strong>4 horas de servicio:</strong> inicio a más tardar a las 16:00.</li><li><strong>3 horas de servicio:</strong> inicio a más tardar a las 17:00.</li><li><strong>Retiro:</strong> comienza como máximo a las 20:00.</li></ul><p>Las consultas y reservas se atienden de lunes a domingo, de 08:00 a 23:00.</p></div><div class="ficha-notice"><h2>Qué enviar por WhatsApp</h2><ul><li>Fecha, comuna y horario tentativo.</li><li>Juego o set y edades de los niños.</li><li>Fotos, video y medidas del lugar.</li><li>Restricciones de acceso o del recinto.</li></ul><p>Para evaluar el espacio, envía imágenes sin personas identificables, documentos ni datos innecesarios.</p></div></section>`+
  `<section class="ficha-help"><h2>Un espacio listo para jugar</h2><p>No se instala sobre pasto mojado ni superficies húmedas. Evita piedras, ramas, arbustos, objetos punzantes y otros obstáculos. La revisión remota es preliminar; al llegar comprobamos nuevamente las condiciones del lugar.</p>${button('/calidad.html','Revisar calidad y seguridad')}<a class="ficha-text-link" href="/faq.html">Consultar pagos, clima y cancelaciones</a></section>`+support;
 const quote='https://wa.me/56969073306?text='+encodeURIComponent('¡Hola, ALMA Kids! Quisiera consultar disponibilidad.\nFecha:\nComuna:\nJuego o set:\nHora de inicio:');
 const coordination='https://wa.me/56920609796?text='+encodeURIComponent('¡Hola, ALMA Kids! Tengo una reserva y necesito coordinar los detalles.');
 const contactBody=trail('Contacto')+hero('CONVERSEMOS 🤍','Contacto y reservas ALMA Kids.','Cuéntanos cuándo y dónde quieres celebrar. Te ayudamos a elegir los juegos y a revisar la disponibilidad y los requisitos de tu espacio.','montaje-pastel-caballito.jpg','Juegos de ALMA Kids sobre tatami rosa y blanco',button(quote,'Cotizar por WhatsApp')+'<a href="/como-reservar">Cómo confirmar mi reserva</a>')+
  `<section class="ficha-section"><h2>El contacto para cada momento</h2><div class="principal-contact-grid"><article><span class="eyebrow">COTIZACIONES Y RESERVAS</span><h3>Preparemos tu celebración</h3><p>Disponibilidad, elección del set, precios y nuevas reservas.</p><a class="principal-phone" href="${quote}">+56 9 6907 3306</a>${button(quote,'Consultar disponibilidad')}</article><article><span class="eyebrow">COORDINACIÓN DE RESERVAS</span><h3>¿Ya tienes tu evento reservado?</h3><p>Coordinemos el acceso, montaje, retiro y detalles de tu reserva.</p><a class="principal-phone" href="${coordination}">+56 9 2060 9796</a>${button(coordination,'Coordinar mi reserva')}</article></div></section>`+
  `<section class="principal-split ficha-section"><div><h2>Horarios y atención a domicilio</h2><p><strong>Consultas y reservas:</strong><br>Lunes a domingo, de 08:00 a 23:00.</p><p><strong>Inicio del retiro de juegos:</strong><br>Como máximo a las 20:00.</p><p>Somos un servicio a domicilio, sin local de atención al público. Tenemos base en Machalí y atendemos en Rancagua y otras comunas de O’Higgins. Confirmamos traslado y acceso antes de reservar.</p><a href="/juegos-inflables-ohiggins.html">Consultar cobertura y traslados</a></div><div><h2>Correo y redes sociales</h2><p><a href="mailto:info.almakids@gmail.com">info.almakids@gmail.com</a></p><nav class="principal-social" aria-label="Redes sociales"><a href="https://www.instagram.com/almakids.cl/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.tiktok.com/@almakids.cl" target="_blank" rel="noopener noreferrer">TikTok</a><a href="https://www.facebook.com/profile.php?id=61580273574247" target="_blank" rel="noopener noreferrer">Facebook</a></nav><p class="ficha-note">Para revisar el servicio o compartir tu experiencia, puedes <a href="https://www.google.com/maps?cid=12787614162186377869" target="_blank" rel="noopener noreferrer">ver las reseñas en Google</a>.</p></div></section>`+support;
 const pages=[
  {url:'/servicios',name:'Juegos y sets',title:'Juegos y sets infantiles en Machalí y Rancagua',description:'Explora los sets, inflables y piscinas de pelotas ALMA Kids. Compara componentes, medidas y duración para tu celebración a domicilio en Machalí y Rancagua.',body:servicesBody,type:'CollectionPage'},
  {url:'/como-reservar',name:'Cómo reservar',title:'Cómo reservar tus juegos y sets',description:'Conoce los pasos para reservar con ALMA Kids: consulta tu fecha, envía fotos del espacio, revisa los horarios y confirma tu celebración con el abono y contrato.',body:bookingBody,type:'WebPage'},
  {url:'/contacto',name:'Contacto',title:'Contacto y reservas en Machalí y Rancagua',description:'Contacta a ALMA Kids por WhatsApp para cotizar o coordinar tu reserva. Consultas de 08:00 a 23:00, todos los días. Juegos y sets a domicilio en O’Higgins.',body:contactBody,type:'ContactPage'}
 ];
 for(const p of pages){
  const graph=[business,{'@type':p.type,'@id':origin+p.url+'#webpage',url:origin+p.url,name:p.name,description:p.description,isPartOf:{'@id':origin+'/#website'},about:{'@id':business['@id']}},crumb(p.name,p.url)];
  if(p.url==='/servicios')graph.push({'@type':'ItemList',name:'Juegos y sets ALMA Kids',itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.nombre,url:origin+'/juegos/'+p.id}))});
  await fs.writeFile(path.join(root,p.url.slice(1)+'.html'),renderPage(p.title,p.description,p.url,p.body,graph));
 }
 // Navegación coherente, sin alterar enlaces de cotización o anclas del contenido.
 const sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
 for(const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)){
  const url=new URL(match[1]);const rel=url.pathname==='/'?'index.html':url.pathname.slice(1)+(path.extname(url.pathname)?'':'.html');
  const file=path.join(root,rel);let html=await fs.readFile(file,'utf8');const before=html;
  const updateLinks=block=>block.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g,(all,attrs,content)=>{
   const label=content.replace(/<[^>]*>/g,'').trim();let target;
   if(['Servicios','Juegos','Juegos y precios','Juegos y sets'].includes(label))target='/servicios';
   if(label==='Cómo reservar')target='/como-reservar';
   if(label==='Contacto')target='/contacto';
   if(!target)return all;
   attrs=attrs.replace(/href=["'][^"']*["']/,'href="'+target+'"');
   if(target==='/servicios')content='Juegos y sets';
   return '<a'+attrs+'>'+content+'</a>';
  });
  html=html.replace(/<nav\b[\s\S]*?<\/nav>/g,updateLinks).replace(/<footer\b[\s\S]*?<\/footer>/g,updateLinks);
  if(rel==='index.html'){
   if(!/<footer\b[\s\S]*?href="\/servicios"/.test(html))html=html.replace('<h4>Enlaces Rápidos</h4>\n                    <ul>','<h4>Enlaces Rápidos</h4>\n                    <ul>\n                        <li><a href="/servicios">Juegos y sets</a></li>');
   // Mantener el bloque breve del inicio y facilitar la lectura de la guía completa.
   if(!html.includes('Ver todos los pasos para reservar'))html=html.replace('<div class="process-actions">','<div class="process-actions">\n                <a class="btn btn-secondary" href="/como-reservar">Ver todos los pasos para reservar</a>');
   html=html.replace('<title>Arriendo Juegos Inflables Rancagua y Machalí | ALMA Kids · Estética Neutra y Pastel</title>','<title>ALMA Kids | Inflables y plazas blandas en Machalí y Rancagua</title>');
   const description='Juegos inflables, plazas blandas y sets en tonos neutros y pastel. Celebraciones a domicilio en Machalí y Rancagua. Conoce los juegos y consulta tu fecha.';
   html=html.replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${description}">`);
   for(const kind of ['og','twitter']){
    const attr=kind==='og'?'property':'name';
    html=html.replace(new RegExp(`<meta ${attr}="${kind}:title"[^>]*>`),`<meta ${attr}="${kind}:title" content="ALMA Kids | Inflables y plazas blandas en Machalí y Rancagua">`);
    html=html.replace(new RegExp(`<meta ${attr}="${kind}:description"[^>]*>`),`<meta ${attr}="${kind}:description" content="${description}">`);
   }
  }
  if(rel==='empresas.html')html=html.replace('<h1 id="empresa-titulo">Un espacio para jugar.<br><em>Un día para compartir.</em></h1>','<h1 id="empresa-titulo">Juegos infantiles para empresas.<br><em>Un día para compartir.</em></h1>');
  if(html!==before)await fs.writeFile(file,html);
 }
}
