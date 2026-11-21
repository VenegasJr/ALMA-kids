// Only measured numeric state is imported. No executable or remote content.
export function normalizeLayout(s,itemIds,modelIds,{storage=false,defaultItems=[]}={}){
 const fail=message=>{throw new Error(message);};
 if(!s||!['alma-kids-juegos-rev1-v1','alma-kids-juegos-rev2-v1','alma-kids-juegos-rev3-v1'].includes(s.schema))fail('Formato de distribución no reconocido.');
 if(s.units!=='metres'&&!(storage&&s.units===undefined))fail('La distribución debe estar expresada en metros.');
 if(!modelIds.includes(s.model))fail('Modelo de inflable no reconocido.');
 const t=s.tatami;
 if(!t||!Number.isInteger(t.columns)||t.columns<1||t.columns>16||!Number.isInteger(t.rows)||t.rows<1||t.rows>16||!['rosa','beige'].includes(t.palette)||!Number.isFinite(t.thickness)||t.thickness<.001||t.thickness>=.2)fail('Cantidad o medidas del tatami no válidas.');
 const tatami={columns:t.columns,rows:t.rows,palette:t.palette,thickness:t.thickness};
 const clean=v=>{
  if(!v||!Array.isArray(v.size)||v.size.length!==3||v.size.some((n,i)=>!Number.isFinite(n)||n<(i===2?.001:.05)||n>(i===2?8:15))||!Array.isArray(v.position)||v.position.length!==2||v.position.some(n=>!Number.isFinite(n)||Math.abs(n)>15)||!Number.isFinite(v.rotation)||!Number.isFinite(v.opacity)||v.opacity<10||v.opacity>100||typeof v.visible!=='boolean'||(v.edited!==undefined&&typeof v.edited!=='boolean'))fail('Hay medidas o posiciones no válidas.');
  return {size:[...v.size],position:[...v.position],rotation:((v.rotation%(2*Math.PI))+2*Math.PI)%(2*Math.PI),opacity:v.opacity,visible:v.visible,edited:!!v.edited};
 };
 if(!Array.isArray(s.items))fail('Faltan elementos de la distribución.');
 const legacy=s.revision===undefined||(Number.isInteger(s.revision)&&s.revision<7);
 let rawItems=[...s.items],migrated=false;
 if(legacy){
  rawItems=rawItems.filter(v=>!['cartel','lona'].includes(v?.id));migrated=rawItems.length!==s.items.length;
  if(itemIds.includes('piscina-mini')&&!rawItems.some(v=>v?.id==='piscina-mini')){
   const d=defaultItems.find(v=>v.id==='piscina-mini');if(!d)fail('Faltan datos de la piscina mini.');
   rawItems.push({id:d.id,size:[...d.size],position:[...d.position],rotation:d.rotation,visible:false,opacity:100,edited:false});migrated=true;
  }
 }
 if(rawItems.length!==itemIds.length)fail('Faltan elementos de la distribución.');
 const seen=new Set(),items=rawItems.map(v=>{if(!v||!itemIds.includes(v.id)||seen.has(v.id))fail('Hay elementos desconocidos o repetidos.');seen.add(v.id);return {id:v.id,...clean(v)};});
 const mat=items.find(v=>v.id==='tatami');
 if(mat.size.some((n,i)=>Math.abs(n-[t.columns*.6,t.rows*.6,t.thickness][i])>.002))fail('El tatami debe conservar piezas de 60 × 60 cm.');
 mat.size=[t.columns*.6,t.rows*.6,t.thickness];
 const castles={};
 if(s.castles!==undefined&&(!s.castles||typeof s.castles!=='object'||Array.isArray(s.castles)))fail('Datos de modelos no válidos.');
 for(const id of Object.keys(s.castles||{})){if(!modelIds.includes(id))fail('Hay un modelo guardado desconocido.');castles[id]=clean(s.castles[id]);}
 const {id,...active}=items.find(v=>v.id==='castillo');castles[s.model]=active;
 const defaults={hazards:false,wet:false,zone:true,labels:true,dimensions:true,render:true,grid:false,snap:false},environment={};
 for(const [key,value]of Object.entries(defaults)){const v=s.environment?.[key];if(v!==undefined&&typeof v!=='boolean')fail('Opciones del entorno no válidas.');environment[key]=v??value;}
 return {schema:'alma-kids-juegos-rev3-v1',units:'metres',model:s.model,tatami,castles,items,environment,migrated};
}
