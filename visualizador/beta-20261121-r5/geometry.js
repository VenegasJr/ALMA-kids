// Plan geometry in metres. Angles follow Three.js rotation about the Y axis.
export function rectangleFootprint(width,depth,position,rotation){
 const c=Math.cos(rotation),s=Math.sin(rotation),right=[c,-s],forward=[s,c];
 const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>[position[0]+x*width/2*c+z*depth/2*s,position[1]-x*width/2*s+z*depth/2*c]);
 return {width,depth,position:[...position],rotation,axes:[right,forward],corners};
}
export function itemFootprint(item){return rectangleFootprint(item.size[0],item.size[1],item.position,item.rotation);}
// Pack projected labels into the visible canvas without covering the toolbar.
export function placeSceneLabel(point,width,height,bounds,occupied){
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const left=bounds.left+width/2,right=bounds.right-width/2,top=bounds.top+height/2,bottom=bounds.bottom-height/2;
 const x=clamp(point.x,left,right),y=clamp(point.y,top,bottom),xs=[x,left,right,(left+right)/2],ys=[y];
 for(let v=top;v<=bottom;v+=height+6)ys.push(v);ys.push(bottom);
 let best=null,score=Infinity;
 for(const px of xs)for(const py of ys){
  if(occupied.some(o=>Math.abs(o.x-px)<(o.width+width)/2+5&&Math.abs(o.y-py)<((o.height||26)+height)/2+5))continue;
  const cost=(px-point.x)**2+(py-point.y)**2;
  if(cost<score){best={x:px,y:py,width,height};score=cost;}
 }
 return best||{x,y,width,height};
}
// Technical installation is attached to the castle, outside its photo dimensions.
// Motor size, duct length and power point are illustrative, not measured specs.
export function airInstallation(castle,model='grandpeque'){
 const [w,d]=castle.size,back=-d/2,x=w*.28,big=model==='grandpeque';
 const blowerSize=big?[.44,.55,.48]:[.37,.46,.40];
 const blower=[x,back-1.05],power=[w/2+.70,back-1.65];
 const duct=[[x,.18,back+.035],[x+.025,.15,back-.30],[x,.14,back-.57],[x,.14,blower[1]+.23]];
 const cable=[[x+.15,.11,blower[1]-.05],[x+.30,.023,back-1.28],[w/2+.35,.023,back-1.28],[power[0],.023,back-1.42],[power[0],.28,power[1]]];
 const c=Math.cos(castle.rotation),s=Math.sin(castle.rotation);
 const world=([px,y,pz])=>[castle.position[0]+px*c+pz*s,y,castle.position[1]-px*s+pz*c];
 const record=(id,name,size,position)=>({id,name,short:name,size,position:[world([position[0],0,position[1]])[0],world([position[0],0,position[1]])[2]],rotation:castle.rotation,visible:castle.visible,estimated:true});
 const pathRecord=(id,name,points,pad,height)=>{const xs=points.map(p=>p[0]),zs=points.map(p=>p[2]),minX=Math.min(...xs)-pad,maxX=Math.max(...xs)+pad,minZ=Math.min(...zs)-pad,maxZ=Math.max(...zs)+pad;return record(id,name,[maxX-minX,maxZ-minZ,height],[(minX+maxX)/2,(minZ+maxZ)/2]);};
 return {blower,blowerSize,power,duct,cable,worldDuct:duct.map(world),worldCable:cable.map(world),
  parts:[record('_blower','Soplador trasero',blowerSize,blower),record('_power','Punto eléctrico ilustrativo',[.26,.20,.49],power),pathRecord('_duct','Tubo de aire',duct,.11,.30),pathRecord('_cable','Cable de alimentación',cable,.12,.30)],
  labels:[{text:'Soplador',position:world([blower[0],blowerSize[2]+.12,blower[1]])},{text:'Tubo de aire',position:world([x,.34,back-.36])},{text:'Cable · energía',position:world([power[0],.64,power[1]])}]
 };
}
// Dimension guides use the equipment's own axes, so turning it does not change
// its width/depth labels into the dimensions of an axis-aligned bounding box.
export function dimensionGuides(item,ground=.04){
 const [w,d,h]=item.size,c=Math.cos(item.rotation),s=Math.sin(item.rotation),gap=.27;
 const world=([x,y,z])=>[item.position[0]+x*c+z*s,ground+y,item.position[1]-x*s+z*c];
 return [
  {axis:'width',value:w,line:[[-w/2,.04,d/2+gap],[w/2,.04,d/2+gap]],label:[0,.04,d/2+gap+.10],tick:[0,0,.065]},
  {axis:'depth',value:d,line:[[-w/2-gap,.04,-d/2],[-w/2-gap,.04,d/2]],label:[-w/2-gap-.10,.04,0],tick:[.065,0,0]},
  {axis:'height',value:h,line:[[w/2+gap,0,-d/2],[w/2+gap,h,-d/2]],label:[w/2+gap+.08,h/2,-d/2],tick:[.065,0,0]}
 ].map(guide=>({...guide,line:guide.line.map(world),label:world(guide.label),ticks:guide.line.map(point=>[-1,1].map(sign=>world(point.map((v,i)=>v+sign*guide.tick[i]))))}));
}
export function studyFootprint(item,study){
 const offset=(study.front-study.back)/2;
 const center=[item.position[0]+Math.sin(item.rotation)*offset,item.position[1]+Math.cos(item.rotation)*offset];
 return rectangleFootprint(item.size[0]+2*study.side,item.size[1]+study.back+study.front,center,item.rotation);
}
export function footprintsOverlap(a,b,tolerance=0){
 for(const axis of [...a.axes,...b.axes]){
  const pa=a.corners.map(p=>p[0]*axis[0]+p[1]*axis[1]),pb=b.corners.map(p=>p[0]*axis[0]+p[1]*axis[1]);
  if(Math.min(Math.max(...pa),Math.max(...pb))-Math.max(Math.min(...pa),Math.min(...pb))<=tolerance+1e-9)return false;
 }
 return true;
}
export function alignTatamiToEntry(castle,tatamiSize,model){
 // ROSA's slide is offset to the left in the photographic reference.
 const localX=model==='rosa'?-.28*castle.size[0]:0;
 const localZ=castle.size[1]/2+tatamiSize[1]/2,c=Math.cos(castle.rotation),s=Math.sin(castle.rotation);
 return {position:[castle.position[0]+localX*c+localZ*s,castle.position[1]-localX*s+localZ*c],rotation:castle.rotation};
}
export function evaluateSpace(items,room){
 const visible=items.filter(r=>r.visible),points=visible.flatMap(r=>itemFootprint(r).corners);
 const width=points.length?Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])):0;
 const depth=points.length?Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1])):0;
 const height=visible.length?Math.max(...visible.map(r=>r.size[2])):0;
 const outside=room.enabled?visible.filter(r=>itemFootprint(r).corners.some(([x,z])=>Math.abs(x)>room.width/2+.001||Math.abs(z)>room.depth/2+.001)).map(r=>r.id):[];
 const tooHigh=room.enabled&&room.height!==null?visible.filter(r=>r.size[2]>room.height+.001).map(r=>r.id):[];
 return {width,depth,height,outside,tooHigh,count:visible.length};
}
