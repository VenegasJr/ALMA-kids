// Public image discovery. Uses only photographs already visible on each page.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const origin='https://www.almakids.cl';
const today='2026-11-22';
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(m=>[m[1].toLowerCase(),decode(m[3])]));
const absolute=src=>new URL(src,origin+'/').href;
function dimensions(b){
  if(b.toString('ascii',1,4)==='PNG')return{width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
  if(b[0]===255&&b[1]===216){
    let i=2;
    while(i+9<b.length){
      if(b[i]!==255){i++;continue;}
      const marker=b[i+1];if(marker===255){i++;continue;}
      if(marker===216||marker===217){i+=2;continue;}
      const size=b.readUInt16BE(i+2);
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker))return{width:b.readUInt16BE(i+7),height:b.readUInt16BE(i+5)};
      if(size<2)break;i+=2+size;
    }
  }
  if(b.toString('ascii',8,12)==='WEBP'){
    const kind=b.toString('ascii',12,16);
    if(kind==='VP8X')return{width:1+b.readUIntLE(24,3),height:1+b.readUIntLE(27,3)};
    if(kind==='VP8L'){const n=b.readUInt32LE(21);return{width:1+(n&16383),height:1+((n>>>14)&16383)};}
    if(kind==='VP8 ')return{width:b.readUInt16LE(26)&16383,height:b.readUInt16LE(28)&16383};
  }
  throw new Error('Dimensiones de imagen no reconocidas');
}
function setMeta(html,kind,key,value){
  const pattern=new RegExp(`<meta\\s+[^>]*${kind}=["']${key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'][^>]*>`, 'gi');
  const tag=`<meta ${kind}="${key}" content="${escape(value)}">`;
  if(pattern.test(html))return html.replace(pattern,tag);
  return html.replace(/<\/head>/i,`  ${tag}\n</head>`);
}
function updateBusinessImages(node){
  if(!node||typeof node!=='object')return;
  const types=[].concat(node['@type']||[]);
  if(types.includes('LocalBusiness')&&node['@id']===origin+'/#localbusiness'){
    node.image=['montaje-inflable-pastel-1280.jpg','portada-tipi-plaza-blanda.webp','montaje-pastel-caballito.jpg'].map(n=>origin+'/imagenes/'+n);
    // Keep the separate logo property for brand identification.
  }
  for(const value of Object.values(node))if(value&&typeof value==='object'){
    if(Array.isArray(value))value.forEach(updateBusinessImages);else updateBusinessImages(value);
  }
}
export async function optimizeImages(){
  let sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
  const entries=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  const summary={pages:entries.length,preferredImages:0,imageReferences:0,uniqueImages:0,changedPages:[],withoutPhoto:[],selections:[]};
  const unique=new Set();
  const replacements=new Map();
  for(const entry of entries){
    const loc=decode(entry[1].match(/<loc>([^<]+)<\/loc>/)[1]);
    const url=new URL(loc);if(url.origin!==origin||url.pathname.startsWith('/propuestas/'))throw new Error('Solo URLs públicas del sitemap');
    const relative=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1))+(path.extname(url.pathname)?'':'.html');
    const file=path.join(root,relative);let html=await fs.readFile(file,'utf8');const before=html;
    const body=(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)||html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)||[])[1]||'';
    const photos=[];const seen=new Set();
    for(const match of body.matchAll(/<img\b[^>]*>/gi)){
      const a=attrs(match[0]);if(!a.src)continue;
      const image=new URL(a.src,origin+'/');
      if(image.origin!==origin||!/^\/imagenes\/.*\.(jpe?g|png|webp)$/i.test(image.pathname)||/(?:^|\/)(?:logo[-_ ]|ak-icono|favicon|google-maps|placeholder|sello|badge)/i.test(image.pathname))continue;
      const clean=origin+image.pathname;if(seen.has(clean))continue;
      const bytes=await fs.readFile(path.join(root,decodeURIComponent(image.pathname.slice(1))));
      const size=dimensions(bytes);if(size.width<250||size.height<250)continue;
      seen.add(clean);photos.push({url:clean,alt:a.alt||'Montaje de juegos de ALMA Kids',...size});
    }
    if(relative==='index.html')photos.sort((a,b)=>Number(b.url.endsWith('/montaje-inflable-pastel-1280.jpg'))-Number(a.url.endsWith('/montaje-inflable-pastel-1280.jpg')));
    const photo=photos[0];
    if(photo){
      const media=photo.url.endsWith('.webp')?'image/webp':photo.url.endsWith('.png')?'image/png':'image/jpeg';
      for(const[k,v]of Object.entries({'og:image':photo.url,'og:image:secure_url':photo.url,'og:image:type':media,'og:image:width':photo.width,'og:image:height':photo.height,'og:image:alt':photo.alt}))html=setMeta(html,'property',k,v);
      for(const[k,v]of Object.entries({'twitter:card':'summary_large_image','twitter:image':photo.url,'twitter:image:alt':photo.alt}))html=setMeta(html,'name',k,v);
      if(!/<meta\s+[^>]*name=["']robots["']/i.test(html))html=setMeta(html,'name','robots','index, follow, max-image-preview:large');
      html=html.replace(/\s*<script type="application\/ld\+json" id="alma-imagen-principal">[\s\S]*?<\/script>/g,'');
      const title=decode((html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||'ALMA Kids');
      const graph={'@context':'https://schema.org','@graph':[
        {'@type':'WebPage','@id':loc+'#webpage',url:loc,name:title,inLanguage:'es-CL',isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#localbusiness'},primaryImageOfPage:{'@id':loc+'#imagen-principal'}},
        {'@type':'ImageObject','@id':loc+'#imagen-principal',contentUrl:photo.url,url:photo.url,width:photo.width,height:photo.height,caption:photo.alt}
      ]};
      html=html.replace(/<\/head>/i,`  <script type="application/ld+json" id="alma-imagen-principal">${JSON.stringify(graph,null,2).replaceAll('<','\\u003c')}</script>\n</head>`);
      summary.preferredImages++;summary.selections.push({page:loc,image:photo.url,width:photo.width,height:photo.height});
    }else summary.withoutPhoto.push(loc);
    html=html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(full,open,text,close)=>{
      const node=JSON.parse(text);const old=JSON.stringify(node);updateBusinessImages(node);
      return JSON.stringify(node)===old?full:open+JSON.stringify(node,null,2).replaceAll('<','\\u003c')+close;
    });
    if(html.split(/<body\b/i)[1]!==before.split(/<body\b/i)[1])throw new Error('La optimización no debe alterar el contenido visible');
    if(html!==before){await fs.writeFile(file,html);summary.changedPages.push(relative);}
    let fragment=entry[1].replace(/\s*<image:image>[\s\S]*?<\/image:image>/g,'');
    if(html!==before)fragment=/<lastmod>/.test(fragment)?fragment.replace(/<lastmod>[^<]+<\/lastmod>/,`<lastmod>${today}</lastmod>`):fragment+`<lastmod>${today}</lastmod>`;
    // One stable URL per photo; every listed photo is present in the initial HTML.
    for(const p of photos.slice(0,12)){fragment+=`<image:image><image:loc>${escape(p.url)}</image:loc></image:image>`;unique.add(p.url);summary.imageReferences++;}
    replacements.set(entry[0],'<url>'+fragment+'</url>');
  }
  sitemap=sitemap.replace(/<urlset\s+([^>]+)>/,(_m,atts)=>`<urlset ${atts.replace(/\s+xmlns:image="[^"]*"/g,'')} xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`);
  sitemap=sitemap.replace(/<url>[\s\S]*?<\/url>/g,x=>replacements.get(x)||x);
  await fs.writeFile(path.join(root,'sitemap.xml'),sitemap);
  summary.uniqueImages=unique.size;return summary;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await optimizeImages(),null,2));
