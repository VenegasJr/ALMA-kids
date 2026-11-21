// Plan geometry in metres. Angles follow Three.js rotation about the Y axis.
export function rectangleFootprint(width,depth,position,rotation){
 const c=Math.cos(rotation),s=Math.sin(rotation),right=[c,-s],forward=[s,c];
 const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>[position[0]+x*width/2*c+z*depth/2*s,position[1]-x*width/2*s+z*depth/2*c]);
 return {width,depth,position:[...position],rotation,axes:[right,forward],corners};
}
export function itemFootprint(item){return rectangleFootprint(item.size[0],item.size[1],item.position,item.rotation);}
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
