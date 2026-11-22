import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=name=>fs.readFile(new URL('../'+name,import.meta.url),'utf8');
const ctx={window:{}};
vm.runInNewContext(await read('catalogo-datos.js'),ctx);
const catalog=JSON.parse(JSON.stringify(ctx.window.CATALOGO_PRODUCTOS));
class Element {
 constructor(value=''){this.value=value;this.hidden=false;this.listeners={};this.dataset={};this.classList={add(){},remove(){}};}
 addEventListener(name,fn){this.listeners[name]=fn;}
 setAttribute(name,value){this[name]=value;}
 setCustomValidity(value){this.validityMessage=value;this.validationMessage=value;}
 reportValidity(){this.validityReported=true;}
}
class Select extends Element {
 constructor(){super();this.options=[];}
 set innerHTML(html){
  this.options=[...html.matchAll(/<option value="([^"]+)" data-precio="([^"]+)">([^<]+)<\/option>/g)].map(m=>({value:m[1],text:m[3],getAttribute:n=>n==='data-precio'?m[2]:null}));
  if(!this._value)this._value=this.options[0]?.value;
 }
 set value(v){this._value=v;}
 get value(){return this._value;}
 get selectedIndex(){return this.options.findIndex(o=>o.value===this._value);}
}
class Addons extends Element {
 set innerHTML(html){
  this.inputs=[...html.matchAll(/<input type="checkbox" id="([^"]+)" data-precio="([^"]+)" data-nombre="([^"]+)" data-precio-desde="([^"]+)">/g)].map(m=>({id:m[1],checked:false,dataset:{precioDesde:m[4]},getAttribute:n=>({'data-precio':m[2],'data-nombre':m[3]})[n]}));
  this.labels=this.inputs.map(input=>({classList:{add(){},remove(){}},querySelector:()=>input}));
 }
 querySelectorAll(selector){return selector.includes(':checked')?this.inputs.filter(i=>i.checked):this.labels;}
}
async function simulator(products){
 const elements={cotizadorBaseSelect:new Select(),cotizadorAddonsList:new Addons()};
 for(const id of ['cotizadorHorarioAyuda','cotizadorFechaInput','cotizadorHoraInput','cotizadorPiscinaField','cotizadorPiscinaSelect','cotizadorComunaSelect','cotizadorTotalAmount','cotizadorTotalNotes','cotizadorBtnWsp'])elements[id]=new Element();
 elements.cotizadorComunaSelect.value='Rengo';
 const listeners={};
 const document={readyState:'loading',getElementById:id=>elements[id],addEventListener:(n,fn)=>listeners[n]=fn};
 const window={CATALOGO_PRODUCTOS:products};
  vm.runInNewContext(await read('horarios.js'),{window});
  vm.runInNewContext(await read('cotizador.js'),{window,document,Intl,Date,encodeURIComponent,localStorage:{getItem:()=>null},setTimeout});
 listeners.DOMContentLoaded();
 return {elements,recalculate:()=>elements.cotizadorBaseSelect.listeners.change(),message:()=>new URL(elements.cotizadorBtnWsp.href).searchParams.get('text')};
}
const sim=await simulator(catalog),e=sim.elements;
const horse=e.cotizadorAddonsList.inputs.find(x=>x.id==='addon_saltarin');
assert.equal(horse.getAttribute('data-precio'),'17000');
e.cotizadorBaseSelect.value='set-duo';
e.cotizadorFechaInput.value='2026-12-10';e.cotizadorHoraInput.value='15:30';
e.cotizadorPiscinaSelect.value='Mini (1,10 × 1,10 × 0,35 m)';horse.checked=true;
sim.recalculate();
assert.equal(e.cotizadorPiscinaField.hidden,false);
assert(e.cotizadorTotalAmount.textContent.includes('137.000'));
assert.equal(new URL(e.cotizadorBtnWsp.href).pathname,'/56969073306');
for(const item of ['10/12/2026','15:30','Rengo','Mini (1,10 × 1,10 × 0,35 m)','17.000','137.000','Traslado por cotizar'])assert(sim.message().includes(item),item);
e.cotizadorPiscinaSelect.value='Grande (1,50 × 1,50 × 0,40 m)';sim.recalculate();
assert(e.cotizadorTotalAmount.textContent.includes('137.000'));
assert(sim.message().includes('Grande (1,50'));
e.cotizadorBaseSelect.value='pack-alma-mini-play';sim.recalculate();
assert.equal(e.cotizadorPiscinaField.hidden,true);
assert(!sim.message().includes('Piscina de espuma DÚO'));
assert(e.cotizadorTotalAmount.textContent.includes('117.000'));
horse.checked=false;e.cotizadorHoraInput.value='';e.cotizadorFechaInput.value='';sim.recalculate();
assert(e.cotizadorTotalAmount.textContent.includes('100.000'));
assert(sim.message().includes('*Hora de inicio:* Por definir'));
const monitor=e.cotizadorAddonsList.inputs.find(x=>x.id==='addon_monitor');monitor.checked=true;sim.recalculate();
assert(e.cotizadorTotalAmount.textContent.includes('Desde'));
const changed=JSON.parse(JSON.stringify(catalog));changed.find(p=>p.id==='saltarin-balancin').variantes.find(p=>p.id==='caballo-saltarin-cafe').precio=18500;
const updated=await simulator(changed);
assert.equal(updated.elements.cotizadorAddonsList.inputs.find(x=>x.id==='addon_saltarin').getAttribute('data-precio'),'18500','El adicional debe seguir el precio del catálogo');

// El formulario se ejecuta con un navegador simulado: no abre ni envía mensajes reales.
const els={},listeners={},opened=[];
const get=id=>els[id]??=(new Element());
const grid={childElementCount:0,append(){this.childElementCount++;},querySelectorAll(){return[];}};
get('destacados').querySelector=()=>grid;
get('pilot-featured-card').content={cloneNode:()=>({querySelector:()=>new Element()})};
const dialog=get('pilot-quote-dialog');dialog.querySelector=()=>new Element();dialog.showModal=()=>{};dialog.close=()=>dialog.listeners.close?.();
const form=get('pilot-quote-form');form.elements={fecha:new Element('2026-12-10'),comuna:new Element('Machalí'),hora:new Element('15:30'),piscina:new Element('Mini (1,10 × 1,10 × 0,35 m)')};
const hero=new Element();hero.href='https://wa.me/56969073306?text=Hola';
const doc={getElementById:get,querySelector:()=>hero,body:{style:{}},addEventListener:(name,fn)=>listeners[name]=fn};
const pilotWindow={CATALOGO_PRODUCTOS:catalog,open:url=>opened.push(url),obtenerPersonalizacionModal:()=> 'Tatami: Rosa/Blanco'};
vm.runInNewContext(await read('horarios.js'),{window:pilotWindow});
vm.runInNewContext(await read('piloto-2.js'),{window:pilotWindow,document:doc,Intl,Date,URL});
const choose=id=>listeners.click({button:0,target:{closest:()=>({dataset:{catalogoCotizar:id}})},preventDefault(){}});
const submit=()=>form.listeners.submit({preventDefault(){}});
choose('set-duo');assert.equal(get('pilot-pool-field').hidden,false);submit();
let message=new URL(opened.at(-1)).searchParams.get('text');
for(const item of ['10/12/2026','15:30','Machalí','Mini (1,10','Tatami: Rosa/Blanco','120.000'])assert(message.includes(item),item);
choose('pack-alma-mini-play');assert.equal(get('pilot-pool-field').hidden,true);form.elements.hora.value='';submit();
message=new URL(opened.at(-1)).searchParams.get('text');
assert(!message.includes('Piscina de espuma DÚO'));
assert(message.includes('Hora de inicio: Por definir'));
assert(message.includes('100.000'));
const count=opened.length;form.elements.comuna.value='  ';submit();
assert.equal(opened.length,count,'No debe abrir WhatsApp con una comuna vacía');
assert(form.elements.comuna.validityReported);
// Fronteras del horario: nunca se envían solicitudes con horas incompatibles.
form.elements.comuna.value='Machalí';
for(const [id,limit,late]of [['set-duo','16:00','16:01'],['castillo-grand-peque','17:00','17:01']]){
 choose(id);form.elements.hora.value=limit;submit();
 const accepted=opened.length;
 form.elements.hora.value=late;submit();assert.equal(opened.length,accepted);
 assert(form.elements.hora.validityMessage.includes(limit));
 assert.equal(form.elements.hora.value,late,'Conservar la hora para corregirla');
}
monitor.checked=false;
for(const [id,limit,late]of [['set-duo','16:00','16:01'],['castillo-grand-peque','17:00','17:01']]){
 e.cotizadorBaseSelect.value=id;e.cotizadorHoraInput.value=limit;sim.recalculate();
 assert(e.cotizadorBtnWsp.href.startsWith('https://wa.me/'));
 e.cotizadorHoraInput.value=late;sim.recalculate();assert.equal(e.cotizadorBtnWsp.href,'#cotizadorHoraInput');
 let blocked=false;e.cotizadorBtnWsp.listeners.click({preventDefault(){blocked=true;}});assert(blocked);
}
e.cotizadorHoraInput.value='17:00';monitor.checked=true;sim.recalculate();
assert.equal(e.cotizadorHoraInput.max,'16:00','Un monitor de 4 horas amplía la duración a respetar');
e.cotizadorHoraInput.value='';sim.recalculate();assert(e.cotizadorBtnWsp.href.startsWith('https://wa.me/'));
assert(!pilotWindow.ALMA_HORARIOS.revisar('23:00',3).valido);
assert(!pilotWindow.ALMA_HORARIOS.revisar('25:00',3).valido);
console.log('Cotizaciones verificadas: precios del catálogo, totales, fecha, hora, comuna, elección DÚO, campos opcionales y ausencia de datos de prueba enviados.');
