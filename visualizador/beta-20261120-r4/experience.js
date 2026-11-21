// Components cross-checked against the ALMA Kids catalogue and reservation file.
// PEQUE is deliberately not assigned to the unidentified reference castle.
export const PACKS={
 'set-grand':{name:'Set GRAND-PEQUE',model:'grandpeque',hours:4,pieces:24,columns:6,rows:4,photo:'/imagenes/producto-castillo-grand-peque-real.jpg',caption:'Foto real del inflable GRAND-PEQUE. Los demás juegos se muestran en el montaje 3D.',items:['castillo','piscina','motricidad','caballo','unicornio','tipi','tatami','alfombra','cojines','zapatero','burbujas'],choices:['pelotas','caballo','unicornio','alfombra','cojin'],description:'Inflable grande, plaza blanda, rincón tipi y burbujas.'},
 'maximo-rosa':{name:'Set Máximo · ROSA',model:'rosa',hours:4,pieces:24,columns:6,rows:4,photo:'/imagenes/castillo-rosa-montaje.jpg',caption:'Foto real de ROSA, la variante de inflable representada en este set.',items:['castillo','piscina','motricidad','caballo','unicornio','tipi','tatami','alfombra','cojines','zapatero','burbujas'],choices:['pelotas','caballo','unicornio','alfombra','cojin'],description:'ROSA con su piscina integrada, más plaza blanda, tipi y burbujas.'},
 'alma-active':{name:'ALMA Active',model:null,hours:4,pieces:24,columns:8,rows:3,photo:'/imagenes/portada-tipi-plaza-blanda.webp',caption:'Montaje real del catálogo ALMA Kids. Decoración, globos y mobiliario del entorno no incluidos.',items:['piscina','motricidad','caballo','unicornio','tipi','tatami','alfombra','cojines','zapatero'],choices:['pelotas','alfombra','cojin'],description:'Plaza blanda y rincón tipi, con caballo y unicornio saltarines.',fixedAnimals:'saltarin'},
 'inflable-grand':{name:'Inflable GRAND-PEQUE',model:'grandpeque',hours:3,pieces:12,columns:4,rows:3,photo:'/imagenes/producto-castillo-grand-peque-real.jpg',caption:'Foto real del inflable. La decoración del entorno no está incluida.',items:['castillo','tatami','zapatero'],choices:[],description:'Castillo individual con tatami y rincón zapatero.'},
 'inflable-rosa':{name:'Inflable ROSA',model:'rosa',hours:4,pieces:12,columns:4,rows:3,photo:'/imagenes/castillo-rosa-montaje.jpg',caption:'Foto real de ROSA con piscina integrada. Decoración del entorno no incluida.',items:['castillo','tatami','zapatero'],choices:['pelotas'],description:'Inflable con piscina integrada, tatami y rincón zapatero.'},
 libre:{name:'Montaje personalizado',model:null,hours:null,pieces:null,photo:null,items:null,choices:['pelotas','caballo','unicornio','alfombra','cojin'],description:'Distribuye los juegos y consulta tu propuesta con ALMA Kids.'}
};
export const PERSONAL_DEFAULT={pelotas:'rosa',caballo:'balancin',unicornio:'saltarin',alfombra:'rosa',cojin:'opcion1'};
export const BALL_PALETTES={rosa:['#edb6cb','#f8f3ed','#edc9d7'],celeste:['#abdce4','#f8f3ed','#d4e8ec'],blanco:['#faf8f1','#f0eee8','#f9f7f0'],transparentes:['#d9e5e6','#f3f5f2','#e2e8e6']};
export function normalizeExperience(value){
 const v=value||{},r=v.room||{},p=v.personal||{},personal={};
 const choices={pelotas:['rosa','celeste','blanco','transparentes'],caballo:['saltarin','balancin'],unicornio:['saltarin','balancin'],alfombra:['rosa','celeste','gris'],cojin:['opcion1','opcion2']};
 for(const [key,allowed]of Object.entries(choices)){
  const item=p[key]??PERSONAL_DEFAULT[key];if(!allowed.includes(item))throw new Error('Una personalización no es válida.');personal[key]=item;
 }
 const packId=v.packId??'libre';if(!Object.hasOwn(PACKS,packId))throw new Error('El set guardado no está disponible en esta revisión.');
 const enabled=r.enabled??false;if(typeof enabled!=='boolean')throw new Error('Configuración del espacio no válida.');
 const room={enabled,width:r.width??14,depth:r.depth??12,height:r.height??null,surface:r.surface??'sin-confirmar'};
 if(!Number.isFinite(room.width)||room.width<.6||room.width>30||!Number.isFinite(room.depth)||room.depth<.6||room.depth>30||(room.height!==null&&(!Number.isFinite(room.height)||room.height<.6||room.height>10))||!['sin-confirmar','pasto','piso-firme','interior'].includes(room.surface))throw new Error('Revisa las medidas del espacio: ancho y largo de 0,60 a 30 m; altura de 0,60 a 10 m.');
 return {packId,personal,room};
}
export function buildQuote({packName,modelName,modelSize,modelEdited=false,items,tatami,personal,room,date,commune,hours,spaceSummary}){
 const values={rosa:'Rosa pastel',celeste:'Celeste',blanco:'Blanco',transparentes:'Transparentes',saltarin:'Saltarín',balancin:'Balancín',gris:'Gris',opcion1:'Opción 1',opcion2:'Opción 2'};
 const n=new Intl.NumberFormat('es-CL',{maximumFractionDigits:2}),lines=['¡Hola, ALMA Kids! 🤍 Me gustaría cotizar este montaje:','Propuesta del visualizador 3D · Modo beta.',`Montaje: ${packName}.`];
 if(modelName)lines.push(`Inflable: ${modelName}.`);
 if(modelName&&modelSize)lines.push(`Medidas del inflable: ${modelSize.map(v=>n.format(v)).join(' × ')} m (ancho × largo × alto), ${modelEdited?'ajustadas en esta propuesta':'según cotas de la foto'}.`);
 if(hours)lines.push(`Duración del servicio: ${hours} horas.`);
 if(date){const [y,m,d]=date.split('-');lines.push(`Fecha consultada: ${d}-${m}-${y}.`);}
 if(commune.trim())lines.push(`Comuna: ${commune.trim().slice(0,80)}.`);
 lines.push(`Juegos y accesorios: ${items.join(', ')}.`);
 if(tatami)lines.push(`Tatami: ${tatami.pieces} piezas de 60 × 60 cm; ${n.format(tatami.width)} × ${n.format(tatami.depth)} m (${n.format(tatami.pieces*.36)} m²), ${tatami.palette==='beige'?'beige/gris':'rosa/blanco'}.`);
 for(const [label,key]of [['Pelotas','pelotas'],['Caballo','caballo'],['Unicornio','unicornio'],['Alfombra','alfombra'],['Cojín','cojin']])if(personal[key])lines.push(`${label}: ${values[personal[key]]}.`);
 if(room.enabled)lines.push(`Espacio indicado: ${n.format(room.width)} × ${n.format(room.depth)} m; altura libre ${room.height===null?'por confirmar':n.format(room.height)+' m'}. Superficie: ${{'sin-confirmar':'por confirmar',pasto:'pasto','piso-firme':'piso firme',interior:'interior'}[room.surface]}.`);
 else lines.push('Medidas del lugar: por confirmar.');
 if(spaceSummary)lines.push(`Revisión de huella: ${spaceSummary}`);
 lines.push('¿Podrían confirmar disponibilidad, traslado y condiciones de instalación? Muchas gracias ✨');
 return lines.join('\n');
}
