import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {ITEMS,STUDY,MODELS} from './catalogo.js';
import {PACKS,PERSONAL_DEFAULT,BALL_PALETTES,normalizeExperience,buildQuote} from './experience.js';
import {normalizeLayout} from './layout.js';
import {itemFootprint,studyFootprint,footprintsOverlap,alignTatamiToEntry,evaluateSpace,dimensionGuides} from './geometry.js';

const $=id=>document.getElementById(id);
const number=new Intl.NumberFormat('es-CL',{minimumFractionDigits:2,maximumFractionDigits:2});
const fm=n=>`${number.format(n)} m`;
const view=$('view'),canvas=$('scene'),labels=$('labels');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});}
catch(e){$('load-error').hidden=false;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.setClearColor('#e8ece6');renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();scene.fog=new THREE.Fog('#e8ece6',24,48);
const camera=new THREE.PerspectiveCamera(38,1,.05,160);
camera.position.set(10,10,12);
const controls=new OrbitControls(camera,canvas);controls.target.set(0,.35,0);controls.enableDamping=true;controls.dampingFactor=.1;controls.minDistance=1.2;controls.maxDistance=85;controls.maxPolarAngle=Math.PI*.49;
scene.add(new THREE.HemisphereLight('#ffffff','#9baf97',.85));
const sun=new THREE.DirectionalLight('#fff4e5',2.2);sun.position.set(-5,12,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;scene.add(sun);
const fill=new THREE.DirectionalLight('#edf2ff',.9);fill.position.set(6,5,-6);scene.add(fill);

const studio=new THREE.Scene();studio.add(new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshBasicMaterial({color:'#b8bcb9',side:THREE.BackSide})));
for(const [x,y,z,rx,ry,w,h]of [[0,8,0,Math.PI/2,0,10,8],[-8,2,1,0,Math.PI/2,5,7],[6,3,-7,0,Math.PI/4,7,5]]){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:'#fffdf5',side:THREE.DoubleSide}));panel.position.set(x,y,z);panel.rotation.set(rx,ry,0);studio.add(panel);}
const pmrem=new THREE.PMREMGenerator(renderer),studioTarget=pmrem.fromScene(studio);scene.environment=studioTarget.texture;scene.environmentIntensity=.65;pmrem.dispose();
function grainTexture(kind='fine'){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),image=ctx.createImageData(256,256);
 for(let i=0;i<256*256;i++){const x=i%256,y=Math.floor(i/256);const seed=((i*1103515245+12345)>>>8)%256;let value=128+(seed-128)*(kind==='cloth'?.32:.14);if(kind==='cloth')value+=((x%4<2?1:-1)+(y%4<2?1:-1))*12;image.data[i*4]=image.data[i*4+1]=image.data[i*4+2]=value;image.data[i*4+3]=255;}ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='cloth'?8:4,kind==='cloth'?8:4);return t;
}
const fineGrain=grainTexture(),clothGrain=grainTexture('cloth');
const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.68,...extra});
const ballMaterial=color=>personal.pelotas==='transparentes'?new THREE.MeshPhysicalMaterial({color,roughness:.08,transmission:.65,thickness:.018,ior:1.4,transparent:true,opacity:.5,depthWrite:false}):material(color,{roughness:.42});
const white=new THREE.MeshPhysicalMaterial({color:'#fffdf8',roughness:.36,clearcoat:.16,clearcoatRoughness:.42,bumpMap:fineGrain,bumpScale:.0025});
const ivory=material('#ece8df',{bumpMap:clothGrain,bumpScale:.002}),blush=material('#deb9c8',{roughness:.88,bumpMap:clothGrain,bumpScale:.002}),beige=material('#d8c7ae',{roughness:.9,bumpMap:clothGrain,bumpScale:.002}),sage=material('#b4c8bb'),wood=material('#ad8c65',{bumpMap:fineGrain,bumpScale:.003}),dark=material('#5a6460');
const TATAMI_DEFAULT={columns:6,rows:4,palette:'rosa',thickness:.02};
let tatamiConfig={...TATAMI_DEFAULT},renderMode=true,restoredState=false;
let personal={...PERSONAL_DEFAULT},selectedPackId='set-grand',room=normalizeExperience().room,experienceReady=false;
function mesh(geo,mat,parent,pos=[0,0,0]){const o=new THREE.Mesh(geo,mat);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function rounded(w,h,d,r=.06){
 const geo=new THREE.BoxGeometry(w,h,d,8,6,8),p=geo.attributes.position;
 r=Math.min(r,w/2,h/2,d/2);
 const inner=new THREE.Vector3(w/2-r,h/2-r,d/2-r),v=new THREE.Vector3(),c=new THREE.Vector3(),delta=new THREE.Vector3();
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);c.set(Math.max(-inner.x,Math.min(inner.x,v.x)),Math.max(-inner.y,Math.min(inner.y,v.y)),Math.max(-inner.z,Math.min(inner.z,v.z)));delta.copy(v).sub(c);if(delta.lengthSq())delta.normalize().multiplyScalar(r);v.copy(c).add(delta);p.setXYZ(i,v.x,v.y,v.z);}
 geo.computeVertexNormals();return geo;
}
const box=(p,w,h,d,mat,pos,r=.06)=>mesh(rounded(w,h,d,r),mat,p,pos);
function ball(parent,scale,pos,mat){const o=mesh(new THREE.SphereGeometry(1,24,16),mat,parent,pos);o.scale.set(...scale);return o;}
function rod(parent,a,b,r,mat){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);const o=mesh(new THREE.CylinderGeometry(r,r,start.distanceTo(end),14),mat,parent,start.clone().add(end).multiplyScalar(.5).toArray());o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return o;}
function polyline(parent,points,color,options={}){const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const mat=options.dashed?new THREE.LineDashedMaterial({color,dashSize:.12,gapSize:.075,transparent:true,opacity:options.opacity??1}):new THREE.LineBasicMaterial({color,transparent:true,opacity:options.opacity??1,depthTest:options.depthTest??true});const o=new THREE.Line(geo,mat);if(options.dashed)o.computeLineDistances();parent.add(o);return o;}
function net(parent,width,height,position,rotation=0){
 const g=new THREE.Group();g.position.set(...position);g.rotation.y=rotation;
 mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshStandardMaterial({color:'#f8f8ed',transparent:true,opacity:.09,side:THREE.DoubleSide,depthWrite:false}),g,[0,0,0]);
 const points=[];for(let x=-width/2;x<=width/2+.001;x+=.045)points.push(x,-height/2,0,x,height/2,0);for(let y=-height/2;y<=height/2+.001;y+=.045)points.push(-width/2,y,0,width/2,y,0);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:'#fffef8',transparent:true,opacity:.5})));parent.add(g);
}
// Reuse the original logo from the page, including in the offline HTML.
// The panels sit within the existing equipment bounds and follow its transform.
const brandCanvas=document.createElement('canvas');brandCanvas.width=1024;brandCanvas.height=512;
const brandContext=brandCanvas.getContext('2d'),brandTexture=new THREE.CanvasTexture(brandCanvas);
brandTexture.colorSpace=THREE.SRGBColorSpace;brandTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const brandImage=document.querySelector('img.brand');
function paintBrand(){
 if(!brandImage.naturalWidth)return;
 brandContext.fillStyle='#ffffff';brandContext.fillRect(0,0,1024,512);
 const scale=Math.min(992/brandImage.naturalWidth,480/brandImage.naturalHeight),w=brandImage.naturalWidth*scale,h=brandImage.naturalHeight*scale;
 brandContext.drawImage(brandImage,(1024-w)/2,(512-h)/2,w,h);brandTexture.needsUpdate=true;
}
brandImage.addEventListener('load',paintBrand);paintBrand();
function brandedCastle(model){
 const p=({referencia:castleReference,rosa:castleRosa,grandpeque:castleGrand})[model]();
 const c={
  grandpeque:{left:-1.62244,right:1.62244,back:-2.13936,front:.72936,y:1.96,width:.90,r:.16,sideR:.145,frontArch:.23,sideArch:.08},
  rosa:{left:-1.04968,right:.208432,back:-1.20208,front:.171856,y:1.40,width:.55,r:.10,sideR:.10,frontArch:0,sideArch:0},
  referencia:{left:-.7144,right:.7144,back:-1.0954,front:.25,y:1.38,width:.55,r:.095,sideR:.095,frontArch:0,sideArch:0}
 }[model];
 const {left,right,back,front,y,width}=c,cx=(left+right)/2,cz=(back+front)/2;
 const curve=(a,b,middleY)=>new THREE.CatmullRomCurve3([new THREE.Vector3(...a),new THREE.Vector3((a[0]+b[0])/2,middleY,(a[2]+b[2])/2),new THREE.Vector3(...b)]);
 const label=(path,normal,radius)=>{
  const r=radius+.003,vertices=[],uv=[],indices=[],nx=32,ny=24,length=path.getLength();
  // Preserve the original artwork's 2:1 aspect on the curved PVC surface.
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
   const u=i/nx,v=j/ny,center=path.getPointAt(.5+(u-.5)*width/length),angle=(v-.5)*(width/2)/r;
   vertices.push(center.x+normal[0]*r*Math.cos(angle),center.y+r*Math.sin(angle),center.z+normal[1]*r*Math.cos(angle));uv.push(u,v);
  }
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,d=a+nx+2,cc=a+nx+1;indices.push(a,b,d,a,d,cc);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
  const logo=mesh(geo,new THREE.MeshBasicMaterial({map:brandTexture,toneMapped:false}),p);logo.name='Logo ALMA Kids';logo.castShadow=false;
 };
 label(curve([left,y,front],[right,y,front],y+c.frontArch),[0,1],c.r);
 label(curve([right,y,back],[left,y,back],y+c.frontArch),[0,-1],c.r);
 label(curve([right,y,front],[right,y,back],y+c.sideArch),[1,0],c.sideR);
 label(curve([left,y,back],[left,y,front],y+c.sideArch),[-1,0],c.sideR);
 return p;
}
// A softly inflated deck and subtle welded joints add detail within the
// existing photo-derived exterior dimensions. Interior surface geometry is illustrative.
function inflatedDeck(parent,width,depth,height,centerZ,channels){
 const nx=channels*8,nz=24,verts=[],uvs=[],indices=[];
 const y=(u,t)=>height+.010+Math.pow(Math.sin(u*channels*Math.PI),2)*.014*Math.sin(t*Math.PI);
 for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const u=i/nx,t=j/nz;verts.push((u-.5)*width,y(u,t),centerZ+(t-.5)*depth);uvs.push(u,t);}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(a,c,b,b,c,d);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,white,parent);
 for(let i=1;i<channels;i++){const u=i/channels,pts=[];for(let j=0;j<=nz;j++){const t=j/nz;pts.push([(u-.5)*width,y(u,t)+.001,centerZ+(t-.5)*depth]);}polyline(parent,pts,'#cdd0c9',{opacity:.5});}
}
function towerSeams(parent,x,z,r,levels){for(const y of levels){const seam=mesh(new THREE.TorusGeometry(r,.0026,5,40),material('#d9dcd4',{roughness:.52}),parent,[x,y,z]);seam.rotation.x=Math.PI/2;seam.castShadow=false;}}
function castleReference(){
 const p=new THREE.Group(),W=1.8288,D=2.5908,H=2.286,back=-D/2,bodyFront=.45;
 box(p,W,.28,bodyFront-back,white,[0,.14,(bodyFront+back)/2],.1);
 for(let x=-.65;x<=.66;x+=.25)polyline(p,[[x,.283,back+.16],[x,.286,bodyFront-.1]],'#dddcd7',{opacity:.6});
 const turret=()=>new THREE.LatheGeometry([new THREE.Vector2(.13,0),new THREE.Vector2(.18,.08),new THREE.Vector2(.195,.18),new THREE.Vector2(.16,.31),new THREE.Vector2(.09,.46),new THREE.Vector2(.008,.646)],32);
 for(const x of [-W/2+.2,W/2-.2])for(const z of [back+.2,bodyFront-.2]){
   mesh(new THREE.CylinderGeometry(.14,.145,1.48,30),white,p,[x,.9,z]);mesh(turret(),white,p,[x,H-.646,z]);
 }
 for(const z of [back+.2,bodyFront-.2]){const b=mesh(new THREE.CylinderGeometry(.095,.095,W-.4,24),white,p,[0,1.38,z]);b.rotation.z=Math.PI/2;}
 for(const x of [-W/2+.2,W/2-.2]){const b=mesh(new THREE.CylinderGeometry(.095,.095,bodyFront-back-.4,24),white,p,[x,1.38,(bodyFront+back)/2]);b.rotation.x=Math.PI/2;net(p,bodyFront-back-.4,1.0,[x,.86,(bodyFront+back)/2],Math.PI/2);}
 net(p,W-.4,1.0,[0,.86,back+.2]);
 box(p,1.1,.12,1.2,white,[0,.20,.83],.05).rotation.x=.24;
 for(const x of [-.56,.56]){const rail=box(p,.18,.24,1.2,white,[x,.35,.82],.08);rail.rotation.x=.24;}
 box(p,1.3,.13,.25,white,[0,.08,D/2-.07],.065);
 inflatedDeck(p,W-.48,bodyFront-back-.34,.28,(bodyFront+back)/2,5);
 for(const x of [-W/2+.2,W/2-.2])for(const z of [back+.2,bodyFront-.2])towerSeams(p,x,z,.143,[.36,1.61]);
 return p;
}
function castleGrand(){
 const p=new THREE.Group(),W=3.99288,D=4.99872,H=2.83464;
 const back=-D/2,slideDepth=1.50,front=D/2-slideDepth,bodyDepth=front-back,centerZ=(back+front)/2;
 box(p,W,.46,bodyDepth,white,[0,.23,centerZ],.20);
 for(let x=-1.5;x<=1.5;x+=.33)polyline(p,[[x,.466,back+.25],[x,.466,front-.16]],'#d7d8d4',{opacity:.65});
 const cap=()=>new THREE.LatheGeometry([new THREE.Vector2(.24,0),new THREE.Vector2(.29,.08),new THREE.Vector2(.34,.22),new THREE.Vector2(.34,.40),new THREE.Vector2(.22,.59),new THREE.Vector2(.008,.85)],40);
 for(const x of [-W/2+.37,W/2-.37])for(const z of [back+.36,front-.27]){
   const shaftH=H-.85-.30;mesh(new THREE.CylinderGeometry(.26,.31,shaftH,32),white,p,[x,.30+shaftH/2,z]);mesh(cap(),white,p,[x,H-.85,z]);
 }
 for(const z of [back+.36,front-.27]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-W/2+.36,1.96,z),new THREE.Vector3(0,2.19,z),new THREE.Vector3(W/2-.36,1.96,z)]);mesh(new THREE.TubeGeometry(curve,36,.16,18,false),white,p);}
 for(const x of [-W/2+.37,W/2-.37]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,1.96,back+.36),new THREE.Vector3(x,2.04,centerZ),new THREE.Vector3(x,1.96,front-.27)]);mesh(new THREE.TubeGeometry(curve,32,.145,16,false),white,p);net(p,bodyDepth-.60,1.40,[x,1.18,centerZ],Math.PI/2);}
 net(p,W-.68,1.4,[0,1.18,back+.36]);
 // The video shows an open front and a broad, softly curved inflatable ramp.
 const sw=3.10896,sz=front+slideDepth/2-.04;
 const surface=(u,t)=>{const smooth=t*t*(3-2*t),rib=Math.pow(Math.max(0,Math.sin((u*9%1)*Math.PI)),.65)*.027;return .10+.44*(1-smooth)+rib;};
 const nx=72,nz=48,verts=[],indices=[];
 for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const u=i/nx,t=j/nz;verts.push((u-.5)*sw,surface(u,t),front+t*slideDepth);}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(a,c,b,b,c,d);}
 // Close the perimeter down to the flat underside, so the ramp has volume.
 const boundary=[];for(let i=0;i<=nx;i++)boundary.push(i);for(let j=1;j<=nz;j++)boundary.push(j*(nx+1)+nx);for(let i=nx-1;i>=0;i--)boundary.push(nz*(nx+1)+i);for(let j=nz-1;j>0;j--)boundary.push(j*(nx+1));
 for(let k=0;k<boundary.length;k++){const a=boundary[k],b=boundary[(k+1)%boundary.length],c=verts.length/3;verts.push(verts[a*3],.025,verts[a*3+2],verts[b*3],.025,verts[b*3+2]);indices.push(a,b,c+1,a,c+1,c);}
 const rampGeo=new THREE.BufferGeometry();rampGeo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));rampGeo.setIndex(indices);const rampUV=[];for(let k=0;k<verts.length;k+=3)rampUV.push(verts[k]/sw+.5,(verts[k+2]-front)/slideDepth);rampGeo.setAttribute('uv',new THREE.Float32BufferAttribute(rampUV,2));rampGeo.computeVertexNormals();mesh(rampGeo,white,p);
 for(const sign of [-1,1]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(sign*(sw/2-.04),.70,front-.07),new THREE.Vector3(sign*(sw/2-.04),.48,front+slideDepth*.5),new THREE.Vector3(sign*(sw/2-.04),.20,D/2-.06)]);mesh(new THREE.TubeGeometry(curve,32,.13,16,false),white,p);}
 for(let k=1;k<9;k++){const pts=[];for(let j=0;j<=30;j++){const t=j/30;pts.push([(k/9-.5)*sw,surface(k/9,t)+.002,front+t*slideDepth]);}polyline(p,pts,'#d6d5cf',{opacity:.45});}
 box(p,sw+.03,.14,.25,white,[0,.08,D/2-.055],.065);
 inflatedDeck(p,3.10896,3.10896,.46,centerZ,9);
 for(const x of [-W/2+.37,W/2-.37])for(const z of [back+.36,front-.27])towerSeams(p,x,z,.269,[.54,1.88]);
 // Basketball hoop shown in the supplied product image; dimensions illustrative.
 box(p,.52,.36,.055,white,[0,1.74,back+.43],.035);
 const hoop=mesh(new THREE.TorusGeometry(.19,.026,12,40),white,p,[0,1.57,back+.68]);hoop.rotation.x=Math.PI/2;
 for(let i=0;i<10;i++){const a=i*Math.PI/5;polyline(p,[[Math.cos(a)*.19,1.57,back+.68+Math.sin(a)*.19],[Math.cos(a+.16)*.105,1.31,back+.68+Math.sin(a+.16)*.105]],'#ebece6',{opacity:.85});}
 return p;
}
function castleRosa(){
 // ROSA has a side ball pool and an offset slide, unlike the first reference.
 // Outer dimensions come from the photo; interior allocation is schematic.
 const p=new THREE.Group(),W=2.49936,D=2.80416,H=2.258568,back=-D/2;
 const poolWidth=.841248,poolDepth=1.79832,slideLength=1.030224,slideWidth=.798576;
 const left=-W/2,bodyRight=W/2-poolWidth,bodyWidth=bodyRight-left,bodyFront=back+D-slideLength,bodyDepth=bodyFront-back;
 const cx=(left+bodyRight)/2,cz=(back+bodyFront)/2;
 box(p,bodyWidth,.30,bodyDepth,white,[cx,.15,cz],.11);
 for(let x=left+.22;x<bodyRight-.1;x+=.23)polyline(p,[[x,.305,back+.18],[x,.305,bodyFront-.12]],'#d6d7d2',{opacity:.65});
 const turret=()=>new THREE.LatheGeometry([new THREE.Vector2(.13,0),new THREE.Vector2(.18,.08),new THREE.Vector2(.195,.18),new THREE.Vector2(.16,.31),new THREE.Vector2(.09,.46),new THREE.Vector2(.008,.646)],32);
 for(const x of [left+.2,bodyRight-.2])for(const z of [back+.2,bodyFront-.2]){
   const shaftH=H-.646-.15;
   mesh(new THREE.CylinderGeometry(.145,.15,shaftH,30),white,p,[x,.15+shaftH/2,z]);mesh(turret(),white,p,[x,H-.646,z]);
 }
 for(const z of [back+.2,bodyFront-.2]){const b=mesh(new THREE.CylinderGeometry(.10,.10,bodyWidth-.4,24),white,p,[cx,1.40,z]);b.rotation.z=Math.PI/2;}
 for(const x of [left+.2,bodyRight-.2]){const b=mesh(new THREE.CylinderGeometry(.10,.10,bodyDepth-.4,24),white,p,[x,1.40,cz]);b.rotation.x=Math.PI/2;}
 const deck=new THREE.Group();deck.position.x=cx;p.add(deck);inflatedDeck(deck,bodyWidth-.36,bodyDepth-.34,.30,cz,5);
 for(const x of [left+.2,bodyRight-.2])for(const z of [back+.2,bodyFront-.2])towerSeams(p,x,z,.147,[.36,1.59]);
 net(p,bodyWidth-.4,1.03,[cx,.88,back+.2]);
 net(p,bodyDepth-.4,1.03,[left+.2,.88,cz],Math.PI/2);
 // Side wall with a crawl-through arch toward the integral pool.
 const wall=new THREE.Group();wall.position.set(bodyRight-.2,.32,cz);wall.rotation.y=Math.PI/2;
 const half=(bodyDepth-.4)/2,r=.57912/2,straight=.28,wallHeight=1.03;
 const s=new THREE.Shape();s.moveTo(-half,0);s.lineTo(-r,0);s.lineTo(-r,straight);s.absarc(0,straight,r,Math.PI,0,true);s.lineTo(r,0);s.lineTo(half,0);s.lineTo(half,wallHeight);s.lineTo(-half,wallHeight);s.closePath();
 mesh(new THREE.ShapeGeometry(s),new THREE.MeshStandardMaterial({color:'#f8f8f0',transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false}),wall);
 const netPoints=[];
 for(let x=-half;x<=half;x+=.045)for(let y=0;y<wallHeight;y+=.045){const inside=Math.abs(x)<r&&(y<straight||x*x+(y-straight)**2<r*r&&y>=straight);if(!inside)netPoints.push(x,y,0,x,Math.min(y+.039,wallHeight),0);}
 for(let y=0;y<=wallHeight;y+=.045)for(let x=-half;x<half;x+=.045){const inside=Math.abs(x)<r&&(y<straight||x*x+(y-straight)**2<r*r&&y>=straight);if(!inside)netPoints.push(x,y,0,Math.min(x+.039,half),y,0);}
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.Float32BufferAttribute(netPoints,3));wall.add(new THREE.LineSegments(ng,new THREE.LineBasicMaterial({color:'#fffef7',transparent:true,opacity:.65})));
 const arch=[new THREE.Vector3(-r,0,.01),new THREE.Vector3(-r,straight,.01)];for(let i=0;i<=24;i++){const a=Math.PI-Math.PI*i/24;arch.push(new THREE.Vector3(r*Math.cos(a),straight+r*Math.sin(a),.01));}arch.push(new THREE.Vector3(r,0,.01));mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arch),40,.035,10,false),white,wall);p.add(wall);
 // Offset slide at the front-left, with rounded inflatable rails.
 const sx=left+.15+slideWidth/2,sz=bodyFront+slideLength/2-.03;
 const slide=box(p,slideWidth,.12,slideLength+.08,white,[sx,.22,sz],.05);slide.rotation.x=.30;
 for(const x of [sx-slideWidth/2+.06,sx+slideWidth/2-.06]){const rail=box(p,.16,.24,slideLength+.10,white,[x,.36,sz],.075);rail.rotation.x=.30;}
 box(p,slideWidth+.06,.12,.23,white,[sx,.07,D/2-.06],.055);
 // D-shaped pool hugs the right side. Its low perimeter is not a second SKU.
 const flatX=bodyRight-.015,poolZ=cz+.02,rx=poolWidth-.08,rz=poolDepth/2-.07;
 const shape=new THREE.Shape();shape.moveTo(flatX,poolZ-rz);const poolCurve=[];
 for(let i=0;i<=48;i++){const a=-Math.PI/2+Math.PI*i/48;const x=flatX+rx*Math.cos(a),z=poolZ+rz*Math.sin(a);shape.lineTo(x,z);poolCurve.push(new THREE.Vector3(x,.14,z));}shape.lineTo(flatX,poolZ-rz);shape.closePath();
 const floor=mesh(new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:false}),white,p,[0,.105,0]);floor.rotation.x=Math.PI/2;
 mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(poolCurve),70,.10,16,false),white,p);
 // Pastel balls are illustrative; no number or capacity is inferred from the photo.
 const colors=BALL_PALETTES[personal.pelotas];
 colors.forEach((c,j)=>{const positions=[];for(let k=j;k<380&&positions.length<30;k+=3){const u=(k*73%367)/367,v=(k*131%373)/373;const x=.12+u*(rx-.22),z=(v-.5)*(2*rz-.18);if((x/rx)**2+(z/rz)**2<.80)positions.push([flatX+x,.15+(k%3)*.025,poolZ+z]);}const inst=new THREE.InstancedMesh(new THREE.SphereGeometry(.048,12,10),ballMaterial(c),positions.length);positions.forEach((v,i)=>inst.setMatrixAt(i,new THREE.Matrix4().makeTranslation(...v)));inst.castShadow=true;inst.receiveShadow=true;p.add(inst);});
 return p;
}
function pool(){
 const p=new THREE.Group(),w=1.5;
 box(p,w,.09,w,white,[0,.045,0],.04);
 for(const x of [-.68,.68])box(p,.14,.4,1.5,white,[x,.2,0],.06);
 for(const z of [-.68,.68])box(p,1.5,.4,.14,white,[0,.2,z],.06);
 const colors=BALL_PALETTES[personal.pelotas];
 const geo=new THREE.SphereGeometry(.055,12,10);
 colors.forEach((c,j)=>{const inst=new THREE.InstancedMesh(geo,ballMaterial(c),38);const m=new THREE.Matrix4();for(let i=0;i<38;i++){const k=i*colors.length+j;const x=((k*73%251)/251-.5)*1.18,z=((k*113%257)/257-.5)*1.18,y=.16+(k%3)*.042;m.makeTranslation(x,y,z);inst.setMatrixAt(i,m);}inst.castShadow=true;inst.receiveShadow=true;p.add(inst);});
 return p;
}
function horse(unicorn=false,variant='saltarin'){
 const p=new THREE.Group(),skin=unicorn?ivory:material('#b9906e'),mane=unicorn?material('#c9b6d1'):material('#735743');
 ball(p,[.17,.23,.29],[0,.38,.02],skin);
 for(const x of [-.105,.105])for(const z of [-.16,.20]){const leg=mesh(new THREE.CylinderGeometry(.055,.067,.28,18),skin,p,[x,.17,z]);leg.rotation.x=z<0?-.12:.12;}
 ball(p,[.13,.23,.12],[0,.58,-.19],skin);ball(p,[.135,.15,.18],[0,.73,-.26],skin);ball(p,[.12,.09,.13],[0,.67,-.39],skin);
 for(const x of [-.085,.085]){const ear=ball(p,[.043,.105,.04],[x,.88,-.25],skin);ear.rotation.z=x<0?-.2:.2;ball(p,[.014,.02,.02],[x*1.45,.77,-.33],dark);}
 for(let i=0;i<5;i++)ball(p,[.07,.055,.04],[0,.82-i*.05,-.12+i*.006],mane);
 const tail=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.49,.25),new THREE.Vector3(0,.45,.39),new THREE.Vector3(0,.27,.42)]);mesh(new THREE.TubeGeometry(tail,12,.035,8,false),mane,p);
 box(p,.24,.05,.20,unicorn?blush:beige,[0,.58,.04],.025);
 if(unicorn){const horn=mesh(new THREE.ConeGeometry(.04,.22,16),material('#d6bc8c'),p,[0,.96,-.36]);horn.rotation.x=-.22;}
 if(variant==='balancin')for(const x of [-.15,.15]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.08,-.42),new THREE.Vector3(x,.025,0),new THREE.Vector3(x,.08,.42)]);mesh(new THREE.TubeGeometry(curve,20,.035,10,false),wood,p);rod(p,[x,.05,-.16],[x,.12,-.16],.025,wood);rod(p,[x,.05,.20],[x,.12,.20],.025,wood);}
 return p;
}
function softplay(){
 const p=new THREE.Group();
 for(let i=0;i<3;i++)box(p,.65,.12*(i+1),.26,ivory,[-.63,.06*(i+1),-.35+i*.25],.04);
 const arch=new THREE.Shape();arch.moveTo(-.37,0);arch.lineTo(-.37,.28);arch.absarc(0,.28,.37,Math.PI,0,true);arch.lineTo(.37,0);arch.lineTo(.22,0);arch.lineTo(.22,.28);arch.absarc(0,.28,.22,0,Math.PI,false);arch.lineTo(-.22,0);arch.closePath();
 const ar=mesh(new THREE.ExtrudeGeometry(arch,{depth:.55,bevelEnabled:true,bevelSegments:3,bevelSize:.025,bevelThickness:.025,steps:1}),beige,p,[.2,0,-.5]);
 const vertices=[-.4,0,-.4,.4,0,-.4,-.4,.35,-.4,.4,.35,-.4,-.4,0,.45,.4,0,.45];
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex([0,2,3,0,3,1,2,4,5,2,5,3,0,4,2,1,3,5,0,1,5,0,5,4]);geo.computeVertexNormals();mesh(geo,blush,p,[.55,0,.5]);
 return p;
}
function tipi(){
 const p=new THREE.Group();
 const top=[0,1.6,0],corners=[[-.6,0,-.6],[.6,0,-.6],[.6,0,.6],[-.6,0,.6]];
 const cloth=material('#f5efe4',{side:THREE.DoubleSide});
 for(let i=0;i<4;i++){rod(p,corners[i],[0,1.72,0],.022,wood);if(i!==2){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...corners[i]),new THREE.Vector3(...corners[(i+1)%4]),new THREE.Vector3(...top)]);geo.computeVertexNormals();mesh(geo,cloth,p);}}
 for(const pts of [[[-.6,0,.6],[-.14,0,.6],top],[[.6,0,.6],[.14,0,.6],top]]){const geo=new THREE.BufferGeometry().setFromPoints(pts.map(a=>new THREE.Vector3(...a)));geo.computeVertexNormals();mesh(geo,cloth,p);}
 return p;
}
function tatami(){
 const p=new THREE.Group(),{columns,rows,palette,thickness}=tatamiConfig,colors=palette==='beige'?['#c7b99f','#c8cbcc']:['#f2eddb','#d8abbc'];
 const geometry=rounded(.60,thickness,.60,.003);
 for(let c=0;c<2;c++){const spots=[];for(let x=0;x<columns;x++)for(let z=0;z<rows;z++)if((x+z)%2===c)spots.push([(x-(columns-1)/2)*.6,thickness/2,(z-(rows-1)/2)*.6]);if(!spots.length)continue;const inst=new THREE.InstancedMesh(geometry,material(colors[c],{roughness:.98,bumpMap:clothGrain,bumpScale:.0015}),spots.length);spots.forEach((pos,i)=>inst.setMatrixAt(i,new THREE.Matrix4().makeTranslation(...pos)));inst.instanceMatrix.needsUpdate=true;inst.computeBoundingBox();inst.castShadow=true;inst.receiveShadow=true;p.add(inst);}
 // Fine interlocking seams follow a true 0.60 m pitch. They do not change area.
 const width=columns*.6,depth=rows*.6,seamColor=palette==='beige'?'#9a9c97':'#b997a3';
 for(let k=1;k<columns;k++){const pts=[];for(let j=0;j<=rows*20;j++){const z=-depth/2+j*.03;pts.push([-width/2+k*.6+(Math.floor(j/2)%2?.005:-.005),thickness+.0008,z]);}polyline(p,pts,seamColor,{opacity:.45});}
 for(let k=1;k<rows;k++){const pts=[];for(let j=0;j<=columns*20;j++){const x=-width/2+j*.03;pts.push([x,thickness+.0008,-depth/2+k*.6+(Math.floor(j/2)%2?.005:-.005)]);}polyline(p,pts,seamColor,{opacity:.45});}
 return p;
}
function welcome(){
 const p=new THREE.Group();for(const x of [-.31,.31])box(p,.035,1.2,.035,wood,[x,.64,0],.006);for(const y of [.2,1.23])box(p,.66,.035,.04,wood,[0,y,0],.006);box(p,.68,.04,.40,wood,[0,.02,0],.005);
 const c=document.createElement('canvas');c.width=512;c.height=768;const ctx=c.getContext('2d');ctx.fillStyle='#fff8f5';ctx.fillRect(0,0,512,768);for(let x=0;x<512;x+=32)for(let y=0;y<768;y+=32){if((x/32+y/32)%2===0){ctx.fillStyle='#ecc7d5';ctx.fillRect(x,y,32,32);}}ctx.fillStyle='#fffaf6';ctx.fillRect(36,38,440,690);ctx.textAlign='center';ctx.fillStyle='#b45480';ctx.font='italic 45px Georgia';ctx.fillText('Bienvenidos',256,175);ctx.font='italic 30px Georgia';ctx.fillText('a jugar con',256,230);ctx.fillStyle='#dd3787';ctx.font='bold 42px Arial';ctx.fillText('ALMA KIDS',256,355);ctx.fillStyle='#75746e';ctx.font='22px Arial';ctx.fillText('Un espacio para disfrutar',256,480);ctx.font='18px Arial';ctx.fillText('Supervisión de un adulto',256,590);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const sign=mesh(new THREE.PlaneGeometry(.54,.87),new THREE.MeshStandardMaterial({map:texture,roughness:.9,side:THREE.DoubleSide}),p,[0,.73,.025]);return p;
}
function tarp(){const p=new THREE.Group();const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#328bbc';ctx.fillRect(0,0,128,128);for(let y=8;y<128;y+=16)for(let x=8;x<128;x+=16){ctx.strokeStyle='#76b8d6';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(24,36);t.colorSpace=THREE.SRGBColorSpace;box(p,5.4,.008,8.4,material('#ffffff',{map:t,roughness:.65,bumpMap:t,bumpScale:.001}),[0,.004,0],.003);return p;}
function rug(){const p=new THREE.Group();const o=mesh(new THREE.CylinderGeometry(.575,.575,.025,64),material(({rosa:'#d6b7bf',celeste:'#b7d4de',gris:'#c7c9c6'})[personal.alfombra],{roughness:1}),p,[0,.0125,0]);return p;}
function pillows(){const p=new THREE.Group();const pillow=box(p,.4,.16,.4,personal.cojin==='opcion1'?blush:beige,[0,.10,0],.075);pillow.rotation.y=.12;return p;}
function shoes(){const p=new THREE.Group();for(const y of [.04,.3])box(p,.7,.045,.35,ivory,[0,y,0],.012);for(const x of [-.33,.33])box(p,.035,.35,.32,ivory,[x,.175,0],.012);for(const x of [-.2,0,.2])ball(p,[.055,.045,.11],[x,.09,0],sage);return p;}
function bubble(){const p=new THREE.Group();box(p,.3,.23,.29,dark,[0,.12,0],.025);const ring=mesh(new THREE.TorusGeometry(.09,.018,12,36),ivory,p,[0,.15,.15]);for(let i=0;i<8;i++){const a=i*Math.PI/4;mesh(new THREE.TorusGeometry(.015,.006,6,12),beige,p,[Math.sin(a)*.075,.15+Math.cos(a)*.075,.153]);}rod(p,[-.13,.18,0],[-.13,.3,0],.012,dark);rod(p,[.13,.18,0],[.13,.3,0],.012,dark);rod(p,[-.13,.3,0],[.13,.3,0],.012,dark);return p;}
let activeModelId='grandpeque';
const makers={castle:()=>brandedCastle(activeModelId),pool,horse:()=>horse(false,personal.caballo),unicorn:()=>horse(true,personal.unicornio),softplay,tipi,tatami,rug,pillows,shoe:shoes,bubble,welcome,tarp};
const leaderSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');leaderSvg.classList.add('label-leaders');labels.append(leaderSvg);
const records=[];
for(const spec of ITEMS){
 const raw=makers[spec.kind](),bound=new THREE.Box3().setFromObject(raw),size=bound.getSize(new THREE.Vector3()),center=bound.getCenter(new THREE.Vector3());raw.position.set(-center.x,-bound.min.y,-center.z);
 const root=new THREE.Group();root.add(raw);scene.add(root);
 const mats=new Map();raw.traverse(o=>{if(o.material){const src=Array.isArray(o.material)?o.material:[o.material];const cloned=src.map(m=>{if(!mats.has(m)){const cp=m.clone();cp.userData.baseOpacity=cp.opacity;mats.set(m,cp);}return mats.get(m);});o.material=Array.isArray(o.material)?cloned:cloned[0];}});
 const label=document.createElement('div');label.className='object-label';label.innerHTML=`<b>${spec.n}</b><span class="label-name">${spec.short}</span>`;labels.append(label);
 const leader=document.createElementNS('http://www.w3.org/2000/svg','line');leader.setAttribute('stroke','#7a887c');leader.setAttribute('stroke-width','1');leader.setAttribute('opacity','.55');leaderSvg.append(leader);
 const rec={...structuredClone(spec),root,rawSize:size,opacity:100,visible:true,label,leader,materials:[...mats.values()]};root.userData.item=rec;records.push(rec);applyTransform(rec);
}
function applyTransform(rec){rec.root.scale.set(rec.size[0]/rec.rawSize.x,rec.size[2]/rec.rawSize.y,rec.size[1]/rec.rawSize.z);rec.root.position.set(rec.position[0],rec.id==='alfombra'?.006:rec.id==='cojines'?.045:rec.id==='tatami'?.016:rec.id==='lona'?.005:.04,rec.position[1]);rec.root.rotation.y=rec.rotation;rec.root.visible=rec.visible;for(const m of rec.materials){m.opacity=m.userData.baseOpacity*rec.opacity/100;m.transparent=m.opacity<1;m.depthWrite=m.opacity>=.98;}rec.root.updateMatrixWorld(true);}

const grassCanvas=document.createElement('canvas');grassCanvas.width=grassCanvas.height=512;const grassContext=grassCanvas.getContext('2d');grassContext.fillStyle='#9aa97d';grassContext.fillRect(0,0,512,512);for(let i=0;i<20000;i++){const x=(i*73.137)%512,y=(i*131.253)%512;grassContext.strokeStyle=i%3?'#82986c':'#b0ba90';grassContext.lineWidth=.6+(i%3)*.35;grassContext.beginPath();grassContext.moveTo(x,y);grassContext.lineTo(x+(i%5-2)*.65,y-2-i%4);grassContext.stroke();}
function grassMap(w,d){const t=new THREE.CanvasTexture(grassCanvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w,d);t.colorSpace=THREE.SRGBColorSpace;return t;}
const floor=mesh(new THREE.PlaneGeometry(36,36),material('#dce5cf',{map:grassMap(36,36),roughness:1}),scene,[0,-.015,0]);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.castShadow=false;floor.userData.floor=true;
let halfW=STUDY.roomWidth/2,halfD=STUDY.roomDepth/2;
const plot=mesh(new THREE.PlaneGeometry(STUDY.roomWidth,STUDY.roomDepth),material('#dce5cf',{map:grassMap(STUDY.roomWidth,STUDY.roomDepth),roughness:1}),scene,[0,-.008,0]);plot.rotation.x=-Math.PI/2;plot.castShadow=false;
const gridPoints=[];for(let x=-halfW;x<=halfW;x++)gridPoints.push(x,.002,-halfD,x,.002,halfD);for(let z=-halfD;z<=halfD;z++)gridPoints.push(-halfW,.002,z,halfW,.002,z);
const gridGeometry=new THREE.BufferGeometry();gridGeometry.setAttribute('position',new THREE.Float32BufferAttribute(gridPoints,3));const grid=new THREE.LineSegments(gridGeometry,new THREE.LineBasicMaterial({color:'#b8c9b3',transparent:true,opacity:.65}));scene.add(grid);
const roomBoundary=new THREE.Group();scene.add(roomBoundary);
const zone=new THREE.Group();scene.add(zone);
const zoneMat=new THREE.MeshBasicMaterial({color:'#60aa94',transparent:true,opacity:.1,side:THREE.DoubleSide,depthWrite:false});
function clearGroup(g){while(g.children.length){const o=g.children[0];g.remove(o);o.traverse(c=>{c.geometry?.dispose();if(c.material&&!Array.isArray(c.material)&&c.material!==zoneMat)c.material.dispose();});}}
function updateZone(){
 clearGroup(zone);const c=records[0];zone.visible=$('show-zone').checked&&c.visible&&!renderMode;if(!zone.visible)return;
 const b=studyFootprint(c,STUDY),w=b.width,d=b.depth,offset=(STUDY.front-STUDY.back)/2;
 zone.position.set(c.position[0],0,c.position[1]);zone.rotation.y=c.rotation;
 const plane=mesh(new THREE.PlaneGeometry(w,d),zoneMat,zone,[0,.015,offset]);plane.rotation.x=-Math.PI/2;plane.castShadow=false;
 const left=-w/2,right=w/2,back=offset-d/2,front=offset+d/2;
 polyline(zone,[[left,.022,back],[right,.022,back],[right,.022,front],[left,.022,front],[left,.022,back]],'#4d8e78',{dashed:true});
 // Direction of entry. This is a graphic limit, not a physical fence.
 const entranceX=activeModelId==='rosa'?-.28*c.size[0]:0;
 for(let i=0;i<3;i++){const z=c.size[1]/2+.45+i*.35;polyline(zone,[[entranceX-.17,.03,z],[entranceX,.03,z+.18],[entranceX+.17,.03,z]],'#6a9f8a',{opacity:.75});}
}

function bush(parent,x,z,spines=false){const g=new THREE.Group();g.position.set(x,0,z);for(let i=0;i<7;i++){const a=i*2.4;ball(g,[.33,.36,.3],[Math.sin(a)*.32,.3+(i%2)*.12,Math.cos(a)*.3],material(i%2?'#86a17c':'#6f8e68'));}if(spines)for(let i=0;i<8;i++){const a=i*.8;const thorn=mesh(new THREE.ConeGeometry(.025,.25,7),material('#826c56'),g,[Math.sin(a)*.5,.35,Math.cos(a)*.5]);thorn.rotation.z=.9;thorn.rotation.y=a;}parent.add(g);return g;}
const garden=new THREE.Group();scene.add(garden);bush(garden,-7.8,-3.1);bush(garden,-7.8,-1.9);bush(garden,7.8,3.8);
const trunk=mesh(new THREE.CylinderGeometry(.12,.18,3.6,12),wood,garden,[-8.4,1.8,-4.4]);ball(garden,[1.2,.9,1.1],[-8.4,3.3,-4.4],material('#8ba782'));
const hazards=new THREE.Group();scene.add(hazards);bush(hazards,-3.1,-1.25,true);
for(let i=0;i<4;i++){const shard=mesh(new THREE.ConeGeometry(.07,.25+(i%2)*.12,3),material('#ba897b',{metalness:.2}),hazards,[-.25+(i%2)*.16,.12,.6+Math.floor(i/2)*.16]);shard.rotation.z=.28;}
polyline(hazards,[[-3.8,2.05,-1.1],[-1.4,2.05,-1.1],[-.3,2.0,-1.1]],'#b16f68');
for(const [x,z]of [[-3.1,-1.25],[-.2,.7]]){const o=mesh(new THREE.RingGeometry(.58,.61,48),new THREE.MeshBasicMaterial({color:'#b34d43',transparent:true,opacity:.75,side:THREE.DoubleSide}),hazards,[x,.04,z]);o.rotation.x=-Math.PI/2;}
hazards.visible=false;
const wet=new THREE.Group();scene.add(wet);for(let i=0;i<6;i++){const puddle=mesh(new THREE.CircleGeometry(.35+(i%3)*.12,32),new THREE.MeshBasicMaterial({color:'#7daab4',transparent:true,opacity:.32,depthWrite:false}),wet,[-2.9+(i%3)*1.05,.035,-1.9+Math.floor(i/3)*1.5]);puddle.rotation.x=-Math.PI/2;puddle.scale.y=.6;}wet.visible=false;

let selected=records[0],measuring=false,moving=false,measurePoints=[],activeView='general',lastFrameFocus=null,lastViewportWidth=0,lastViewportHeight=0;
const boxHelper=new THREE.Box3Helper(new THREE.Box3(),'#d45c95');boxHelper.material.transparent=true;boxHelper.material.opacity=.65;scene.add(boxHelper);
const dimensions=new THREE.Group();scene.add(dimensions);const dimLabels=[];
for(let i=0;i<3;i++){const el=document.createElement('div');el.className='dimension-label';labels.append(el);dimLabels.push({el,pos:new THREE.Vector3()});}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),v3=new THREE.Vector3();
const measurementGroup=new THREE.Group();scene.add(measurementGroup);
function project(pos){const v=pos.clone().project(camera);return {x:(v.x+1)/2*view.clientWidth,y:(1-v.y)/2*view.clientHeight,inFront:v.z>-1&&v.z<1};}
function extent(rec){return new THREE.Box3().setFromObject(rec.root);}
function updateDimensions(){
 clearGroup(dimensions);if(!selected)return;
 const guides=dimensionGuides(selected,selected.root.position.y),names={width:'Ancho',depth:'Largo',height:'Alto'};
 for(const [i,guide]of guides.entries()){
  polyline(dimensions,guide.line,'#a53d70',{depthTest:false});
  for(const tick of guide.ticks)polyline(dimensions,tick,'#a53d70',{depthTest:false});
  dimLabels[i].pos.set(...guide.label);dimLabels[i].el.textContent=`${names[guide.axis]} ${fm(guide.value)}`;
 }
 boxHelper.box.copy(extent(selected));boxHelper.visible=selected.visible&&!renderMode;
 dimensions.visible=selected.visible&&$('show-dimensions').checked;
 $('toggle-dimensions').setAttribute('aria-pressed',String($('show-dimensions').checked));
 updateEquipmentCard();
}
function updateEquipmentCard(){
 if(!selected)return;const r=selected,model=r.kind==='castle'?MODELS[activeModelId]:null;
 $('equipment-title').textContent=r.name;
 for(const [id,value]of [['width',r.size[0]],['depth',r.size[1]],['height',r.size[2]]])$('equipment-'+id).textContent=fm(value);
 $('equipment-origin').textContent=r.edited?'Medidas ajustadas en esta propuesta':model?'Cotas de la foto':r.origin;
 $('equipment-source').textContent=sourceCaption(r);
 $('equipment-scope').textContent=model?'Estas son las medidas exteriores del inflable. El espacio de instalación también debe contemplar acceso, anclajes, soplador y separaciones.':r.kind==='tatami'?`${tatamiConfig.columns*tatamiConfig.rows} piezas de 60 × 60 cm. Cada pieza aporta 0,36 m²; el espesor es provisional.`:r.estimated?'Las medidas provisionales de este accesorio están identificadas por separado de las cotas de los inflables.':'Estas son las medidas del elemento; la huella total incluye los demás juegos del montaje.';
 $('photo-conversion').hidden=!model;
 $('restore-photo-size').hidden=!model||!r.edited;
 if(model){
  const exact=new Intl.NumberFormat('es-CL',{maximumFractionDigits:6}),axes=['Ancho','Largo','Alto'];
  $('conversion-list').replaceChildren(...model.photoDimensions.values.map((feet,i)=>{const row=document.createElement('div'),label=document.createElement('span'),value=document.createElement('span');label.textContent=`${axes[i]} · ${exact.format(feet)} pies`;value.textContent=`${exact.format(model.size[i])} m`;row.append(label,value);return row;}));
  const ref={grandpeque:'assets/referencia-grand-peque.png',rosa:'assets/referencia-castillo.png',referencia:'assets/referencia-inicial.png'}[activeModelId];
  if($('equipment-reference').dataset.photo!==ref){$('equipment-reference').src=ref;$('equipment-reference').dataset.photo=ref;}
  $('equipment-reference').alt=`Cotas originales de ${model.name}`;
 }
}
function sourceCaption(r){return r.edited?'Medidas ingresadas en esta revisión. Pendientes de contrastar con el equipo real.':r.source;}
function select(rec){selected=rec;$('selected-title').textContent=`${rec.n}. ${rec.name}`;$('selected-source').textContent=sourceCaption(rec);for(const [id,value]of [['size-width',rec.size[0]],['size-depth',rec.size[1]],['size-height',rec.size[2]],['position-x',rec.position[0]],['position-z',rec.position[1]]])$(id).value=String(value);$('opacity').value=rec.opacity;$('opacity-value').value=`${rec.opacity} %`;$('edit-error').hidden=true;for(const id of ['size-width','size-depth','size-height'])$(id).disabled=rec.kind==='tatami';refreshRows();updateDimensions();}
function refreshRows(){
 let count=0;
 for(const r of records){const row=$(`layer-${r.id}`);row?.classList.toggle('is-selected',r===selected);if(row)row.querySelector('.layer-name').textContent=r.name;const check=$(`visible-${r.id}`);if(check){check.checked=r.visible;check.setAttribute('aria-label',`Mostrar ${r.name}`);}if(r.visible)count++;r.label.classList.toggle('selected',r===selected);const tr=$(`table-${r.id}`);if(tr){tr.classList.toggle('is-selected',r===selected);tr.querySelector('button').textContent=`${r.n}. ${r.name}`;tr.querySelector('[data-col=width]').textContent=number.format(r.size[0]);tr.querySelector('[data-col=depth]').textContent=number.format(r.size[1]);tr.querySelector('[data-col=height]').textContent=number.format(r.size[2]);tr.querySelector('[data-col=origin]').textContent=r.edited?'Ingresadas en esta revisión':r.origin;tr.querySelector('[data-col=visible]').textContent=r.visible?'Visible':'Oculto';}}
 $('visible-count').textContent=`${count} de ${records.length} visibles`;
}
function makeUI(){for(const r of records){
 const row=document.createElement('div');row.className='layer-row';row.id=`layer-${r.id}`;
 const check=document.createElement('input');check.type='checkbox';check.id=`visible-${r.id}`;check.checked=r.visible;check.setAttribute('aria-label',`Mostrar ${r.name}`);
 check.addEventListener('change',()=>{r.visible=check.checked;markCustom();applyTransform(r);refreshRows();updateDimensions();updateZone();review();saveState();});
 const sw=document.createElement('span');sw.className='swatch';sw.style.setProperty('--swatch',r.color);
 const id=document.createElement('span');id.className='layer-id';id.textContent=r.n;
 const button=document.createElement('button');button.type='button';button.className='layer-name';button.textContent=r.name;button.addEventListener('click',()=>select(r));
 row.append(check,id,sw,button);$('layers').append(row);
 const tr=document.createElement('tr');tr.id=`table-${r.id}`;tr.innerHTML=`<td><button type="button">${r.n}. ${r.name}</button></td><td data-col="width"></td><td data-col="depth"></td><td data-col="height"></td><td data-col="origin" class="source-status${r.estimated?' estimated':''}"></td><td data-col="visible"></td>`;tr.querySelector('button').addEventListener('click',()=>{select(r);view.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});$('items-table').append(tr);
}}
function review(){
 const issues=[];const c=records[0];
 if(c.visible&&$('show-zone').checked){const z=studyFootprint(c,STUDY);for(const r of records){if(!r.visible||r===c||['tatami','rug','pillows','tarp'].includes(r.kind))continue;if(footprintsOverlap(itemFootprint(r),z))issues.push(`${r.short.toLowerCase()} dentro de la zona de estudio del castillo`);}}
 // Soft surfaces and pillows intentionally under their corresponding equipment.
 const solid=records.filter(r=>r.visible&&!['tatami','rug','pillows','tarp'].includes(r.kind));
 for(let i=0;i<solid.length;i++)for(let j=i+1;j<solid.length;j++){if(footprintsOverlap(itemFootprint(solid[i]),itemFootprint(solid[j]),.035))issues.push(`superposición en planta: ${solid[i].short.toLowerCase()} y ${solid[j].short.toLowerCase()}`);}
 if(hazards.visible)issues.push('arbustos con espinas, puntas y cable superior en el ejemplo de riesgo');
 if(wet.visible)issues.push('pasto mojado: revisar humedad antes de instalar');
 if(room.enabled&&records.some(r=>r.visible&&(extent(r).min.x< -halfW||extent(r).max.x>halfW||extent(r).min.z< -halfD||extent(r).max.z>halfD)))issues.push(`hay equipos fuera del terreno ilustrado de ${room.width} × ${room.depth} m`);
 const el=$('review');el.classList.toggle('warning',issues.length>0);
 el.textContent=issues.length?`Revisar distribución: ${issues.join('; ')}.`:'No se observan cruces con la zona de estudio en esta distribución. Esto no confirma que el lugar sea apto para instalar.';
 refreshExperience();
}
const STORAGE='alma-kids-juegos-rev3-v1';
let castleStates={};
function castleSnapshot(){const r=records[0];return {size:[...r.size],position:[...r.position],rotation:r.rotation,visible:r.visible,opacity:r.opacity,edited:!!r.edited};}
function validCastle(s){return s&&Array.isArray(s.size)&&s.size.length===3&&s.size.every(v=>Number.isFinite(v)&&v>0&&v<=15)&&Array.isArray(s.position)&&s.position.length===2&&s.position.every(v=>Number.isFinite(v)&&Math.abs(v)<=15)&&Number.isFinite(s.rotation)&&Number.isFinite(s.opacity)&&s.opacity>=10&&s.opacity<=100;}
function state(){castleStates[activeModelId]=castleSnapshot();return {schema:'alma-kids-juegos-rev3-v1',units:'metres',experience:{packId:selectedPackId,personal,room},model:activeModelId,tatami:tatamiConfig,castles:castleStates,items:records.map(r=>({id:r.id,size:r.size,position:r.position,rotation:r.rotation,visible:r.visible,opacity:r.opacity,edited:!!r.edited})),environment:{hazards:hazards.visible,wet:wet.visible,zone:$('show-zone').checked,labels:$('show-labels').checked,dimensions:$('show-dimensions').checked,render:renderMode}};}
function saveState(){try{localStorage.setItem(STORAGE,JSON.stringify(state()));}catch{}}
function validTatami(c){return c&&Number.isInteger(c.columns)&&c.columns>=1&&c.columns<=16&&Number.isInteger(c.rows)&&c.rows>=1&&c.rows<=16&&['rosa','beige'].includes(c.palette)&&Number.isFinite(c.thickness)&&c.thickness>0&&c.thickness<.2;}
function updateTatamiUI(){
 $('tatami-error').hidden=true;
 $('tatami-columns').value=tatamiConfig.columns;$('tatami-rows').value=tatamiConfig.rows;$('tatami-palette').value=tatamiConfig.palette;
 const count=tatamiConfig.columns*tatamiConfig.rows,w=tatamiConfig.columns*.6,d=tatamiConfig.rows*.6;
 $('tatami-summary').textContent=`${count} piezas · ${number.format(w)} × ${number.format(d)} m · ${number.format(count*.36)} m²`;
}
function rebuildTatami({persist=true}={}){
 const rec=records.find(r=>r.id==='tatami');scene.remove(rec.root);
 const geos=new Set();rec.root.traverse(o=>{if(o.geometry)geos.add(o.geometry);});geos.forEach(g=>g.dispose());rec.materials.forEach(m=>m.dispose());
 const raw=tatami(),b=new THREE.Box3().setFromObject(raw),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());raw.position.set(-c.x,-b.min.y,-c.z);const root=new THREE.Group();root.add(raw);scene.add(root);
 const mats=new Map();raw.traverse(o=>{if(o.material){if(!mats.has(o.material)){const cp=o.material.clone();cp.userData.baseOpacity=cp.opacity;mats.set(o.material,cp);}o.material=mats.get(o.material);}});
 Object.assign(rec,{root,rawSize:s,materials:[...mats.values()],size:[tatamiConfig.columns*.6,tatamiConfig.rows*.6,tatamiConfig.thickness],source:`${tatamiConfig.columns*tatamiConfig.rows} piezas de 0,60 × 0,60 m: ${number.format(tatamiConfig.columns*tatamiConfig.rows*.36)} m². Cantidad de montaje, sujeta a disponibilidad. Espesor de ${fm(tatamiConfig.thickness)} provisional.`,edited:false});root.userData.item=rec;applyTransform(rec);updateTatamiUI();select(selected);review();if(persist)saveState();
}
$('apply-tatami').addEventListener('click',()=>{const candidate={...tatamiConfig,columns:$('tatami-columns').valueAsNumber,rows:$('tatami-rows').valueAsNumber,palette:$('tatami-palette').value};if(!validTatami(candidate)){$('tatami-error').textContent='Usa filas y columnas enteras entre 1 y 16.';$('tatami-error').hidden=false;return;}markCustom();tatamiConfig=candidate;$('tatami-error').hidden=true;rebuildTatami();});
$('align-tatami').addEventListener('click',()=>{const t=records.find(r=>r.id==='tatami'),aligned=alignTatamiToEntry(records[0],t.size,activeModelId);t.position=aligned.position;t.rotation=aligned.rotation;t.visible=true;applyTransform(t);select(t);review();saveState();fileStatus('Tatami alineado con la entrada del modelo. Las piezas conservan sus medidas.');});
function setRenderMode(on,{persist=true}={}){renderMode=on;$('render-mode').setAttribute('aria-pressed',on);grid.visible=!on;garden.visible=!on;updateDimensions();updateZone();if(persist)saveState();}
$('render-mode').addEventListener('click',()=>setRenderMode(!renderMode));
function applyVideoPreset({persist=true}={}){
 selectedPackId='libre';
 switchModel('grandpeque',{saveCurrent:false,persist:false,frame:false});records.forEach(restoreOne);
 for(const r of records){r.visible=['castillo','tatami','cartel','lona'].includes(r.id);applyTransform(r);}select(records[0]);setRenderMode(true,{persist:false});hazards.visible=wet.visible=false;$('show-hazards').checked=$('wet-ground').checked=false;updateZone();review();go('general',records[0]);if(persist)saveState();
}
function applyAccessoriesPreset(){selectedPackId='libre';records.forEach(restoreOne);records.forEach(r=>{r.visible=r.id!=='lona';applyTransform(r);});select(records[0]);setRenderMode(false,{persist:false});updateZone();review();go('general');saveState();}
$('layout-video').addEventListener('click',()=>applyVideoPreset());$('layout-accessories').addEventListener('click',applyAccessoriesPreset);
function applyLayout(s){
 const exp=s.experience||normalizeExperience();selectedPackId=exp.packId;personal={...exp.personal};room={...exp.room};
 castleStates=structuredClone(s.castles);switchModel(s.model,{saveCurrent:false,persist:false,frame:false});
 tatamiConfig={...s.tatami};rebuildTatami({persist:false});
 for(const v of s.items){const r=records.find(r=>r.id===v.id);Object.assign(r,structuredClone(v));applyTransform(r);}
 const e=s.environment;hazards.visible=e.hazards;wet.visible=e.wet;$('show-hazards').checked=e.hazards;$('wet-ground').checked=e.wet;
 for(const [id,key]of [['show-zone','zone'],['show-labels','labels'],['show-dimensions','dimensions']])$(id).checked=e[key];
 clearMeasurement();applyPersonalAppearance();syncExperienceFields();updateRoomScene();setRenderMode(e.render,{persist:false});select(records[0]);updateTatamiUI();updateZone();review();go('general');
}
function normalized(s,options){
 const result=normalizeLayout(s,records.map(r=>r.id),Object.keys(MODELS),options);result.experience=normalizeExperience(s.experience);
 const pack=PACKS[result.experience.packId];if(pack.items&&(result.items.some(r=>r.visible!==pack.items.includes(r.id))||(pack.model&&result.model!==pack.model)))result.experience.packId='libre';
 if(PACKS[result.experience.packId].fixedAnimals)result.experience.personal.caballo=result.experience.personal.unicornio='saltarin';return result;
}
function restoreState(){try{const raw=localStorage.getItem(STORAGE)||localStorage.getItem('alma-kids-juegos-rev2-v1')||localStorage.getItem('alma-kids-juegos-rev1-v1');if(!raw)return;applyLayout(normalized(JSON.parse(raw),{storage:true}));restoredState=true;}catch{fileStatus('No se pudo recuperar el montaje anterior. Se muestra la propuesta inicial.',true);}}
function fileStatus(message,error=false){$('file-status').textContent=message;$('file-status').classList.toggle('error',error);}
function buildLayout(){return {...state(),revision:4,channel:'beta',tatami:{...tatamiConfig,pieceWidthM:.6,pieceDepthM:.6,pieces:tatamiConfig.columns*tatamiConfig.rows,widthM:tatamiConfig.columns*.6,depthM:tatamiConfig.rows*.6,areaM2:tatamiConfig.columns*tatamiConfig.rows*.36},notice:'Modo beta. Modelo de estudio. Las medidas estimadas y las distancias deben verificarse. No acredita seguridad de instalación.',sources:records.map(r=>({id:r.id,origin:r.edited?'Ingresadas en esta revisión':r.origin,estimated:r.estimated||!!r.edited})),study:STUDY};}
function downloadBlob(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
$('load-layout').addEventListener('click',()=>$('layout-file').click());
$('layout-file').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{if(file.size>512*1024)throw new Error('El archivo supera el máximo de 512 KB.');const candidate=normalized(JSON.parse(await file.text()));const backup=normalized(structuredClone(buildLayout()));
 try{applyLayout(candidate);}catch(err){applyLayout(backup);throw err;}
 saveState();fileStatus('Distribución cargada. Medidas, piezas y posiciones recuperadas.');
 }catch(err){fileStatus(err instanceof SyntaxError?'El archivo no contiene una distribución JSON válida.':err.message||'No se pudo cargar la distribución.',true);}finally{e.target.value='';}
});
function validateAndEdit(){
 const r=selected;const s=[$('size-width').valueAsNumber,$('size-depth').valueAsNumber,$('size-height').valueAsNumber],pos=[$('position-x').valueAsNumber,$('position-z').valueAsNumber];
 if(s.some((n,i)=>!Number.isFinite(n)||n<(i===2?.001:.05)||n>(i===2?8:15))||pos.some(n=>!Number.isFinite(n)||Math.abs(n)>15)){$('edit-error').textContent='Ingresa medidas positivas y posiciones entre −15 y 15 m.';$('edit-error').hidden=false;return;}
 if(s.some((n,i)=>Math.abs(n-r.size[i])>1e-6))r.edited=true;
 markCustom();r.size=s;r.position=pos;applyTransform(r);select(r);updateZone();review();saveState();
}
for(const id of ['size-width','size-depth','size-height','position-x','position-z'])$(id).addEventListener('change',validateAndEdit);
$('apply-edit').addEventListener('click',validateAndEdit);
$('opacity').addEventListener('input',()=>{selected.opacity=Number($('opacity').value);$('opacity-value').value=`${selected.opacity} %`;applyTransform(selected);saveState();});
$('rotate-item').addEventListener('click',()=>{selected.rotation+=Math.PI/2;applyTransform(selected);updateDimensions();updateZone();review();saveState();});
function restoreOne(r){if(r.id==='tatami'){tatamiConfig={...TATAMI_DEFAULT};r.position=[...ITEMS.find(i=>i.id==='tatami').position];r.rotation=0;r.visible=true;r.opacity=100;rebuildTatami({persist:false});return;}const original=r.id==='castillo'?{...ITEMS[0],...MODELS[activeModelId]}:ITEMS.find(s=>s.id===r.id);r.size=[...original.size];r.position=[...original.position];r.rotation=original.rotation;r.opacity=100;r.visible=true;r.edited=false;applyTransform(r);}
$('restore-item').addEventListener('click',()=>{restoreOne(selected);select(selected);updateZone();review();saveState();});
$('restore-all').addEventListener('click',()=>{castleStates={};applyPack('set-grand');});
$('show-zone').addEventListener('change',()=>{updateZone();saveState();});$('show-dimensions').addEventListener('change',()=>{updateDimensions();saveState();});
$('toggle-dimensions').addEventListener('click',()=>{$('show-dimensions').checked=!$('show-dimensions').checked;updateDimensions();saveState();});
$('focus-equipment').addEventListener('click',()=>{go('general',selected);view.scrollIntoView({behavior:'instant',block:'start'});});
$('restore-photo-size').addEventListener('click',()=>{if(selected.kind!=='castle')return;selected.size=[...MODELS[activeModelId].size];selected.edited=false;applyTransform(selected);select(selected);updateZone();review();saveState();});$('show-labels').addEventListener('change',saveState);
$('show-hazards').addEventListener('change',()=>{hazards.visible=$('show-hazards').checked;review();saveState();});$('wet-ground').addEventListener('change',()=>{wet.visible=$('wet-ground').checked;review();saveState();});
$('save-layout').addEventListener('click',()=>{downloadBlob(new Blob([JSON.stringify(buildLayout(),null,2)],{type:'application/json'}),'ALMA-Kids-juegos-distribucion-rev-4.json');fileStatus('Distribución preparada para descargar. Puedes recuperarla con Cargar distribución.');});
let exporting=false;
$('save-image').addEventListener('click',async()=>{
 const button=$('save-image'),w=view.clientWidth,h=view.clientHeight,ratio=renderer.getPixelRatio(),enabled=controls.enabled;
 exporting=true;button.disabled=true;controls.enabled=false;
 try{
 const factor=Math.min(1920/w,1800/h),out=document.createElement('canvas'),header=104,footer=140;
 out.width=Math.round(w*factor);out.height=Math.round(h*factor)+header+footer;
 renderer.setPixelRatio(1);renderer.setSize(out.width,out.height-header-footer,false);renderer.render(scene,camera);
 const ctx=out.getContext('2d');ctx.fillStyle='#fffdfb';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(canvas,0,header);
 const logo=document.querySelector('img.brand');if(logo.complete&&logo.naturalWidth)ctx.drawImage(logo,24,18,100,68);
 ctx.fillStyle='#8b2855';ctx.font='600 25px Arial';ctx.fillText('ALMA Kids · '+PACKS[selectedPackId].name,145,43);ctx.fillStyle='#617167';ctx.font='16px Arial';ctx.fillText('Modo beta · Distribución referencial · '+(renderMode?'Vista render':'Vista técnica'),145,72);
 ctx.save();ctx.beginPath();ctx.rect(0,header,out.width,h*factor);ctx.clip();
 ctx.strokeStyle='#7a887c';ctx.lineWidth=factor;for(const line of leaderSvg.querySelectorAll('line')){if(line.style.display==='none')continue;ctx.beginPath();ctx.moveTo(Number(line.getAttribute('x1'))*factor,header+Number(line.getAttribute('y1'))*factor);ctx.lineTo(Number(line.getAttribute('x2'))*factor,header+Number(line.getAttribute('y2'))*factor);ctx.stroke();}
 for(const el of labels.querySelectorAll('.object-label,.dimension-label')){
 if(el.hidden||getComputedStyle(el).display==='none')continue;const rect=el.getBoundingClientRect(),base=view.getBoundingClientRect();
 const x=(rect.left-base.left)*factor,y=header+(rect.top-base.top)*factor,ww=rect.width*factor,hh=rect.height*factor;
 ctx.fillStyle='rgba(255,253,251,.95)';ctx.fillRect(x,y,ww,hh);ctx.strokeStyle='#d9c5cc';ctx.strokeRect(x,y,ww,hh);ctx.fillStyle='#813657';ctx.font=Math.max(12,12*factor)+'px Arial';ctx.fillText((el.classList.contains('object-label')?[el.querySelector('b')?.textContent,el.querySelector('.label-name')?.textContent].filter(Boolean).join(' · '):el.innerText.replace(/\n/g,' ')),x+5*factor,y+hh*.67,Math.max(1,ww-10*factor));
 }
 ctx.restore();const bottom=out.height-footer;ctx.fillStyle='#fffdfb';ctx.fillRect(0,bottom,out.width,footer);ctx.fillStyle='#4e6257';ctx.font='17px Arial';
 ctx.fillText(records.find(r=>r.id==='tatami').visible?'Tatami: '+$('tatami-summary').textContent:'Montaje sin tatami visible',24,bottom+30);ctx.font='15px Arial';ctx.fillText(room.enabled?'Espacio indicado: '+number.format(room.width)+' × '+number.format(room.depth)+' m; altura libre '+(room.height===null?'por confirmar':fm(room.height))+'.':'Medidas del lugar por confirmar.',24,bottom+55);const castle=records[0];ctx.fillText(castle.visible?'Inflable: '+castle.size.map(n=>number.format(n)).join(' × ')+' m (ancho × largo × alto). '+(castle.edited?'Medidas ajustadas.':'Cotas de la foto.'):'Sin inflable en este montaje.',24,bottom+80);ctx.fillText('Distribución referencial. Instalación y separaciones pendientes de revisión.',24,bottom+106);
 const blob=await new Promise(resolve=>out.toBlob(resolve,'image/png'));if(!blob)throw new Error('No se pudo generar la imagen.');downloadBlob(blob,'ALMA-Kids-'+selectedPackId+'-beta-rev-4.png');fileStatus('Imagen preparada para descargar.');
 }catch(err){fileStatus('No se pudo exportar la imagen. '+err.message,true);}finally{renderer.setPixelRatio(ratio);renderer.setSize(w,h,false);controls.enabled=enabled;button.disabled=false;exporting=false;}
});

function updateModelReferences(){
 $('model-select').value=activeModelId;
 document.querySelectorAll('[data-model-reference]').forEach(el=>{el.hidden=el.dataset.modelReference!==activeModelId;});
 $('active-model-badge').textContent=MODELS[activeModelId].short;
 document.title=`ALMA Kids · ${MODELS[activeModelId].short} · Modo beta`;
}
function switchModel(id,{saveCurrent=true,persist=true,frame=true}={}){
 if(!MODELS[id])return;
 if(saveCurrent)castleStates[activeModelId]=castleSnapshot();
 activeModelId=id;const rec=records[0];scene.remove(rec.root);
 const geometries=new Set();rec.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());rec.materials.forEach(m=>m.dispose());
 const raw=makers.castle(),bound=new THREE.Box3().setFromObject(raw),size=bound.getSize(new THREE.Vector3()),center=bound.getCenter(new THREE.Vector3());raw.position.set(-center.x,-bound.min.y,-center.z);
 const root=new THREE.Group();root.add(raw);scene.add(root);const mats=new Map();
 raw.traverse(o=>{if(o.material){const src=Array.isArray(o.material)?o.material:[o.material];const cloned=src.map(m=>{if(!mats.has(m)){const cp=m.clone();cp.userData.baseOpacity=cp.opacity;mats.set(m,cp);}return mats.get(m);});o.material=Array.isArray(o.material)?cloned:cloned[0];}});
 const saved=validCastle(castleStates[id])?castleStates[id]:{size:MODELS[id].size,position:ITEMS[0].position,rotation:0,opacity:100,visible:true,edited:false};
 Object.assign(rec,MODELS[id],{root,rawSize:size,materials:[...mats.values()],size:[...saved.size],position:[...saved.position],rotation:saved.rotation,opacity:saved.opacity,visible:saved.visible!==false,edited:!!saved.edited});root.userData.item=rec;rec.label.innerHTML=`<b>${rec.n}</b><span class="label-name">${rec.short}</span>`;
 applyTransform(rec);updateModelReferences();select(rec);updateZone();review();if(frame)go('general',rec);if(persist)saveState();
}
$('model-select').addEventListener('change',e=>{selectedPackId='libre';switchModel(e.target.value);});

function boundingVisible(){const b=new THREE.Box3();for(const r of records)if(r.visible)b.union(extent(r));if(b.isEmpty())b.setFromCenterAndSize(new THREE.Vector3(),new THREE.Vector3(5,3,5));return b;}
function go(which,focus=null){
 lastFrameFocus=focus;const bounds=focus?extent(focus):boundingVisible(),center=bounds.getCenter(new THREE.Vector3());
 let direction;switch(which){case 'plan':direction=new THREE.Vector3(0,1,.001);break;case 'front':direction=new THREE.Vector3(0,.16,1);break;case 'side':direction=new THREE.Vector3(1,.16,0);break;default:direction=new THREE.Vector3(1.12,.66,1.45);}direction.normalize();
 const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right).normalize();
 const tanV=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanH=tanV*camera.aspect;let distance=1;
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const v=new THREE.Vector3(x,y,z).sub(center),depth=v.dot(direction);distance=Math.max(distance,depth+Math.abs(v.dot(right))/tanH,depth+Math.abs(v.dot(up))/tanV);}
 distance*=1.12;controls.target.copy(center);camera.position.copy(center).add(direction.multiplyScalar(distance));controls.update();activeView=which;
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===which));}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view,lastFrameFocus)));
$('focus-all').addEventListener('click',()=>go('general'));$('focus-selected').addEventListener('click',()=>{go('general',selected);view.scrollIntoView({behavior:'instant',block:'start'});});
function setMode(mode){if(mode==='measure')setRenderMode(false);measuring=mode==='measure';moving=mode==='move';$('measure').setAttribute('aria-pressed',measuring);$('move').setAttribute('aria-pressed',moving);$('measurement').hidden=!measuring;view.classList.toggle('measuring',measuring);view.classList.toggle('moving',moving);$('interaction-hint').textContent=measuring?'Selecciona dos puntos del modelo para medir':moving?'Arrastra el juego que quieres mover sobre el suelo':'Arrastra para girar · rueda o pellizca para acercar';if(!measuring)clearMeasurement();}
$('measure').addEventListener('click',()=>setMode(measuring?'normal':'measure'));$('move').addEventListener('click',()=>setMode(moving?'normal':'move'));
function clearMeasurement(){measurePoints=[];clearGroup(measurementGroup);$('measure-result').hidden=true;$('measure-hint').textContent='Selecciona el primer punto sobre un juego o el suelo.';}
$('clear-measure').addEventListener('click',clearMeasurement);document.addEventListener('keydown',e=>{if(e.key==='Escape')setMode('normal');});
function pick(e){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(records.filter(r=>r.visible).map(r=>r.root),true).find(h=>h.object.isMesh);if(hit){let parent=hit.object;while(parent&&!parent.userData.item)parent=parent.parent;return {...hit,item:parent?.userData.item};}return raycaster.intersectObject(floor)[0]||null;}
function addMeasure(point){if(measurePoints.length===2)clearMeasurement();measurePoints.push(point.clone());const m=new THREE.MeshBasicMaterial({color:'#d52680',depthTest:false});const mark=mesh(new THREE.SphereGeometry(.045,16,12),m,measurementGroup,point.toArray());mark.renderOrder=20;if(measurePoints.length===1){$('measure-hint').textContent='Ahora selecciona el segundo punto.';return;}polyline(measurementGroup,measurePoints.map(p=>p.toArray()),'#d52680',{depthTest:false});const [a,b]=measurePoints;$('measure-result').hidden=false;$('measure-horizontal').textContent=fm(Math.hypot(a.x-b.x,a.z-b.z));$('measure-distance').textContent=fm(a.distanceTo(b));$('measure-height').textContent=fm(Math.abs(a.y-b.y));$('measure-hint').textContent='Medida sobre el modelo esquemático. Otro clic inicia una nueva medición.';}
let down=null,drag=null;
const groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};if(!moving)return;const hit=pick(e);if(hit?.item){select(hit.item);const p=new THREE.Vector3();raycaster.ray.intersectPlane(groundPlane,p);drag={item:hit.item,offsetX:hit.item.position[0]-p.x,offsetZ:hit.item.position[1]-p.z};controls.enabled=false;canvas.setPointerCapture(e.pointerId);}});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const p=new THREE.Vector3();if(raycaster.ray.intersectPlane(groundPlane,p)){drag.item.position=[Math.max(-15,Math.min(15,Math.round((p.x+drag.offsetX)*10)/10)),Math.max(-15,Math.min(15,Math.round((p.z+drag.offsetZ)*10)/10))];applyTransform(drag.item);$('position-x').value=drag.item.position[0];$('position-z').value=drag.item.position[1];updateDimensions();updateZone();review();}});
canvas.addEventListener('pointerup',e=>{if(drag){drag=null;controls.enabled=true;saveState();refreshRows();return;}if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const hit=pick(e);if(!hit)return;if(measuring)addMeasure(hit.point);else if(hit.item)select(hit.item);});
canvas.addEventListener('pointercancel',()=>{drag=null;controls.enabled=true;});

function size(){const w=view.clientWidth,h=view.clientHeight;const changed=lastViewportWidth&&Math.abs(w/h-lastViewportWidth/lastViewportHeight)>.05;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();lastViewportWidth=w;lastViewportHeight=h;if(changed)go(activeView,lastFrameFocus);}
// Customer experience. The advanced geometry editor remains available below.
function markCustom(){if(!experienceReady)return;selectedPackId='libre';refreshExperience();}
function replaceGeometry(rec,raw){
 scene.remove(rec.root);const geos=new Set();rec.root.traverse(o=>{if(o.geometry)geos.add(o.geometry);});geos.forEach(g=>g.dispose());rec.materials.forEach(m=>m.dispose());
 const bound=new THREE.Box3().setFromObject(raw),rawSize=bound.getSize(new THREE.Vector3()),center=bound.getCenter(new THREE.Vector3());raw.position.set(-center.x,-bound.min.y,-center.z);
 const root=new THREE.Group();root.add(raw);scene.add(root);const mats=new Map();raw.traverse(o=>{if(o.material){const src=Array.isArray(o.material)?o.material:[o.material],cloned=src.map(m=>{if(!mats.has(m)){const cp=m.clone();cp.userData.baseOpacity=cp.opacity;mats.set(m,cp);}return mats.get(m);});o.material=Array.isArray(o.material)?cloned:cloned[0];}});
 Object.assign(rec,{root,rawSize,materials:[...mats.values()]});root.userData.item=rec;applyTransform(rec);
}
function applyPersonalAppearance(){
 for(const id of ['caballo','unicornio']){const r=records.find(r=>r.id===id),kind=personal[id];replaceGeometry(r,horse(id==='unicornio',kind));r.name=(id==='caballo'?'Caballo café':'Unicornio')+' · '+(kind==='saltarin'?'saltarín':'balancín');}
 for(const id of ['piscina','alfombra','cojines']){const r=records.find(r=>r.id===id);replaceGeometry(r,makers[r.kind]());}
 // Only ROSA has a visible integral ball pool in this revision.
 if(activeModelId==='rosa'){castleStates.rosa=castleSnapshot();switchModel('rosa',{saveCurrent:false,persist:false,frame:false});}
 refreshRows();select(selected);
}
function applyPack(id,{persist=true}={}){
 const pack=PACKS[id];if(!pack)return;fileStatus('');
 if(id==='libre'){selectedPackId=id;refreshExperience();if(persist)saveState();return;}
 selectedPackId=id;if(pack.model)switchModel(pack.model,{saveCurrent:false,persist:false,frame:false});
 personal={...PERSONAL_DEFAULT,...personal};if(pack.fixedAnimals)personal.caballo=personal.unicornio=pack.fixedAnimals;
 records.forEach(r=>{if(r.id!=='tatami')restoreOne(r);});
 tatamiConfig={...TATAMI_DEFAULT,palette:tatamiConfig.palette,columns:pack.columns,rows:pack.rows};rebuildTatami({persist:false});
 const positions=pack.model?{castillo:[-1.5,-1.4],piscina:[2,-2.7],motricidad:[2,-.5],tipi:[2.2,1.5],alfombra:[2.2,1.5],cojines:[2.2,1.55],caballo:[1.1,2.9],unicornio:[2.2,3],zapatero:[.9,4.1],burbujas:[3.4,-3.5]}:{piscina:[-1.55,-.1],motricidad:[.3,-.1],tipi:[2,0],alfombra:[2,0],cojines:[2,.05],caballo:[-1,1.3],unicornio:[.1,1.3],zapatero:[2,1.3]};
 for(const r of records){r.visible=pack.items.includes(r.id);r.rotation=0;r.opacity=100;if(positions[r.id])r.position=[...positions[r.id]];applyTransform(r);}
 const t=records.find(r=>r.id==='tatami');if(pack.model){const aligned=alignTatamiToEntry(records[0],t.size,activeModelId);t.position=aligned.position;t.rotation=aligned.rotation;if(id.startsWith('inflable-'))records.find(r=>r.id==='zapatero').position=[records[0].position[0]+records[0].size[0]/2+.7,t.position[1]];}else t.position=[0,0];
 records.forEach(applyTransform);applyPersonalAppearance();hazards.visible=wet.visible=false;$('show-hazards').checked=$('wet-ground').checked=false;$('show-zone').checked=false;$('show-labels').checked=false;
 setRenderMode(true,{persist:false});select(records.find(r=>r.visible&&r.id!=='tatami')||records[0]);updateRoomScene();updateZone();review();go('general');refreshExperience();if(persist)saveState();
}
function updateRoomScene(){
 const w=room.enabled?room.width:STUDY.roomWidth,d=room.enabled?room.depth:STUDY.roomDepth;halfW=w/2;halfD=d/2;
 plot.geometry.dispose();plot.geometry=new THREE.PlaneGeometry(w,d);plot.material.map?.dispose();plot.material.color.set(room.surface==='piso-firme'||room.surface==='interior'?'#eee8e1':'#dce5cf');plot.material.map=room.surface==='piso-firme'||room.surface==='interior'?null:grassMap(w,d);plot.material.needsUpdate=true;
 const pts=[];for(let x=Math.ceil(-halfW);x<=halfW;x++)pts.push(x,.002,-halfD,x,.002,halfD);for(let z=Math.ceil(-halfD);z<=halfD;z++)pts.push(-halfW,.002,z,halfW,.002,z);
 grid.geometry.dispose();grid.geometry=new THREE.BufferGeometry();grid.geometry.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
 clearGroup(roomBoundary);polyline(roomBoundary,[[-halfW,.025,-halfD],[halfW,.025,-halfD],[halfW,.025,halfD],[-halfW,.025,halfD],[-halfW,.025,-halfD]],room.enabled?'#a94179':'#a0b79e',{dashed:!room.enabled,opacity:.9});
 $('room-fields').disabled=!$('use-room').checked;
 $('viewer-grid-caption').textContent=room.enabled?`${number.format(w)} × ${number.format(d)} m`:'Terreno de ejemplo';
}
function syncExperienceFields(){
 for(const key of Object.keys(PERSONAL_DEFAULT))$('personal-'+key).value=personal[key];$('personal-tatami').value=tatamiConfig.palette;
 $('use-room').checked=room.enabled;$('room-fields').disabled=!room.enabled;
 $('room-width').value=room.enabled?room.width:'';$('room-depth').value=room.enabled?room.depth:'';$('room-height').value=room.height??'';$('room-surface').value=room.surface;
}
function spaceMessage(){
 const result=evaluateSpace(records,room),names=ids=>ids.map(id=>records.find(r=>r.id===id).short).join(', '),warnings=[];
 if(result.outside.length)warnings.push(`Sobrepasan el rectángulo indicado: ${names(result.outside)}.`);
 if(result.tooHigh.length)warnings.push(`Superan la altura libre indicada: ${names(result.tooHigh)}.`);
 if(wet.visible)warnings.push('Se indicó pasto mojado: ALMA Kids debe revisar la humedad antes del montaje.');
 if(hazards.visible)warnings.push('La escena incluye ejemplos de arbustos, objetos punzantes y un cable superior.');
 if(!result.count)warnings.push('No hay juegos visibles en el montaje.');
 let message=!room.enabled?'Agrega el ancho y el largo libres de tu lugar. El terreno que ves ahora es solo un ejemplo.':result.outside.length||result.tooHigh.length?'Esta distribución requiere ajustes antes de evaluar su instalación.':'La huella de los objetos dibujados está dentro del espacio indicado. Las separaciones y condiciones de instalación siguen pendientes de revisión.';
 if(room.enabled&&room.height===null)message+=' La altura libre está por confirmar.';
 return {result,warnings,message};
}
function refreshExperience(){
 if(!experienceReady)return;
 const pack=PACKS[selectedPackId],shown=records.filter(r=>r.visible),tatami=records.find(r=>r.id==='tatami');document.title='ALMA Kids · '+pack.name+' · Modo beta';
 $('pack-select').value=selectedPackId;$('montage-title').textContent=pack.name;$('pack-description').textContent=pack.description;$('pack-duration').textContent=pack.hours?`${pack.hours} horas de servicio · montaje y retiro incluidos · disponibilidad por confirmar`:'Propuesta sujeta a cotización y disponibilidad.';
 const {result,warnings,message}=spaceMessage();$('room-result').textContent=message;$('space-footprint').textContent=`Huella del montaje dibujado: ${fm(result.width)} × ${fm(result.depth)}. Altura del objeto más alto: ${fm(result.height)}. Incluye accesorios con medidas provisionales.`;$('montage-dimensions').textContent=`${number.format(result.width)} × ${number.format(result.depth)} m de huella`;
 $('space-status').textContent=warnings.length?'Requiere revisión':room.enabled?'Instalación por revisar':'Medidas por confirmar';document.querySelector('.space-result').classList.toggle('warning',warnings.length>0);$('room-warnings').replaceChildren();for(const text of warnings){const li=document.createElement('li');li.textContent=text;$('room-warnings').append(li);}
 const photo=pack.photo||(records[0].visible?(activeModelId==='rosa'?'/imagenes/castillo-rosa-montaje.jpg':activeModelId==='grandpeque'?'/imagenes/producto-castillo-grand-peque-real.jpg':'assets/referencia-inicial.png'):'/imagenes/portada-tipi-plaza-blanda.webp');
 if($('real-photo').dataset.photo!==photo){$('real-photo').src=photo;$('real-photo').dataset.photo=photo;}$('real-photo').alt=selectedPackId==='alma-active'?'Montaje real ALMA Active del catálogo ALMA Kids':records[0].visible?`Referencia de ${records[0].name}`:'Montaje de plaza blanda del catálogo ALMA Kids';
 $('real-photo-caption').textContent=pack.caption||(activeModelId==='referencia'&&records[0].visible?'Imagen de referencia aportada; este castillo no tiene un SKU de catálogo confirmado.':'Foto del catálogo como referencia visual; la propuesta se detalla en el 3D.');
 $('pack-included').replaceChildren();for(const r of shown){const row=document.createElement('div');row.className='included-item';const no=document.createElement('span');no.className='item-num';no.textContent=r.n;const b=document.createElement('button');b.type='button';b.textContent=r.id==='tatami'?`Tatami · ${tatamiConfig.columns*tatamiConfig.rows} piezas de 60 × 60 cm`:r.name;b.addEventListener('click',()=>{select(r);$('show-labels').checked=true;$('identify').setAttribute('aria-pressed','true');go('general',r);view.scrollIntoView({behavior:'instant',block:'start'});saveState();});row.append(no,b);$('pack-included').append(row);}
 $('pack-included-note').textContent=selectedPackId==='libre'?'Esta es tu propuesta personalizada. Confirma disponibilidad y alcance con ALMA Kids.':`Incluye ${pack.pieces} piezas de tatami (${number.format(pack.pieces*.36)} m²). Los colores y la distribución se confirman al cotizar.`;
 const hasBalls=shown.some(r=>r.id==='piscina')||(records[0].visible&&activeModelId==='rosa'),choices=pack.choices;
 for(const key of Object.keys(PERSONAL_DEFAULT)){
  const included=key==='pelotas'?hasBalls:key==='cojin'?shown.some(r=>r.id==='cojines'):shown.some(r=>r.id===key);$('choice-'+key).hidden=!included;$('personal-'+key).disabled=included&&!choices.includes(key);$('personal-'+key).value=personal[key];
 }
 $('personal-tatami').value=tatamiConfig.palette;document.querySelector('.tatami-color-label').hidden=!tatami.visible;
 $('choice-hint').textContent=pack.fixedAnimals?'Este set incluye caballo y unicornio saltarines. Personaliza los colores de sus otros componentes.':'Solo se muestran opciones de los componentes presentes en tu montaje.';
 const cushion=shown.some(r=>r.id==='cojines');$('cushion-photo').hidden=$('cushion-caption').hidden=!cushion;const cushionSrc=personal.cojin==='opcion1'?'assets/cojin-opcion1.jpg':'assets/cojin-opcion2.png';if($('cushion-photo').dataset.photo!==cushionSrc){$('cushion-photo').src=cushionSrc;$('cushion-photo').dataset.photo=cushionSrc;}$('cushion-photo').alt=personal.cojin==='opcion1'?'Cojín opción 1 del catálogo':'Cojín opción 2 del catálogo';
 $('identify').setAttribute('aria-pressed',String($('show-labels').checked));
 const appliedPersonal={};for(const key of Object.keys(PERSONAL_DEFAULT))if(!$('choice-'+key).hidden)appliedPersonal[key]=personal[key];
 const text=buildQuote({packName:pack.name,modelName:records[0].visible?records[0].name:null,modelSize:records[0].visible?records[0].size:null,modelEdited:!!records[0].edited,items:shown.map(r=>r.name),tatami:tatami.visible?{pieces:tatamiConfig.columns*tatamiConfig.rows,width:tatami.size[0],depth:tatami.size[1],palette:tatamiConfig.palette}:null,personal:appliedPersonal,room,date:$('event-date').value,commune:$('event-commune').value,hours:pack.hours,spaceSummary:room.enabled?[...warnings,!warnings.length?'Huella geométrica dentro del rectángulo; instalación por revisar.':''].filter(Boolean).join(' '):null});
 if($('quote-text').value!==text)$('quote-status').textContent='';$('quote-text').value=text;$('whatsapp-quote').href='https://wa.me/56969073306?text='+encodeURIComponent(text);$('whatsapp-quote').setAttribute('aria-disabled',String(!shown.length));
}
$('pack-select').addEventListener('change',e=>applyPack(e.target.value));
for(const key of Object.keys(PERSONAL_DEFAULT))$('personal-'+key).addEventListener('change',()=>{personal[key]=$('personal-'+key).value;applyPersonalAppearance();updateZone();review();saveState();});
$('personal-tatami').addEventListener('change',()=>{tatamiConfig.palette=$('personal-tatami').value;rebuildTatami({persist:false});review();saveState();});
$('use-room').addEventListener('change',()=>{$('room-fields').disabled=!$('use-room').checked;if(!$('use-room').checked){room.enabled=false;$('room-error').hidden=true;updateRoomScene();review();saveState();}});
$('apply-room').addEventListener('click',()=>{try{const h=$('room-height').value.trim(),candidate={...room,enabled:true,width:$('room-width').valueAsNumber,depth:$('room-depth').valueAsNumber,height:h===''?null:$('room-height').valueAsNumber,surface:$('room-surface').value};room=normalizeExperience({packId:selectedPackId,personal,room:candidate}).room;$('room-error').hidden=true;updateRoomScene();review();go('plan');saveState();}catch(e){$('room-error').textContent=e.message;$('room-error').hidden=false;}});
$('identify').addEventListener('click',()=>{$('show-labels').checked=!$('show-labels').checked;$('identify').setAttribute('aria-pressed',String($('show-labels').checked));saveState();});
for(const id of ['event-date','event-commune'])$(id).addEventListener('input',refreshExperience);
$('whatsapp-quote').addEventListener('click',e=>{if($('whatsapp-quote').getAttribute('aria-disabled')==='true')e.preventDefault();});
$('copy-quote').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('quote-text').value);$('quote-status').textContent='Solicitud copiada. Puedes pegarla en WhatsApp.';}catch{document.querySelector('.quote-preview').open=true;$('quote-text').focus();$('quote-text').select();$('quote-status').textContent='Seleccioné el resumen. Usa Copiar para llevarlo a WhatsApp.';}});
$('event-commune').addEventListener('change',()=>{$('event-commune').value=$('event-commune').value.trim();refreshExperience();});
document.querySelector('.advanced-settings').addEventListener('toggle',e=>document.body.classList.toggle('editing',e.target.open));
const mobileRules=matchMedia('(max-width:760px)');
function applyMobileRules(){document.querySelector('.included-details').open=!mobileRules.matches;}
mobileRules.addEventListener('change',applyMobileRules);applyMobileRules();

new ResizeObserver(size).observe(view);size();restoreState();makeUI();select(records[0]);updateTatamiUI();updateModelReferences();if(!restoredState)applyPack('set-grand',{persist:false});else{updateRoomScene();applyPersonalAppearance();setRenderMode(renderMode,{persist:false});updateZone();review();go('general');}experienceReady=true;syncExperienceFields();refreshExperience();

let last=0;
function animate(now){requestAnimationFrame(animate);if(exporting||now-last<28)return;last=now;controls.update();renderer.render(scene,camera);
 const showLabels=$('show-labels').checked,occupied=[];
 for(const r of [selected,...records.filter(r=>r!==selected)]){r.label.hidden=!r.visible||!showLabels;r.leader.style.display='none';if(r.label.hidden)continue;const b=extent(r),p=b.getCenter(new THREE.Vector3());p.y=b.max.y+.16;const q=project(p);r.label.hidden=!q.inFront||q.x<10||q.x>view.clientWidth-10||q.y<80||q.y>view.clientHeight-35;if(r.label.hidden)continue;let y=q.y;const width=r.label.offsetWidth;for(let step=0;step<3&&occupied.some(o=>Math.abs(o.x-q.x)<(o.width+width)/2+5&&Math.abs(o.y-y)<25);step++)y-=27;y=Math.max(90,y);r.label.style.left=`${q.x}px`;r.label.style.top=`${y}px`;occupied.push({x:q.x,y,width});if(Math.abs(y-q.y)>14){r.leader.style.display='';r.leader.setAttribute('x1',q.x);r.leader.setAttribute('x2',q.x);r.leader.setAttribute('y1',q.y);r.leader.setAttribute('y2',y+10);}}
 const dimensionsVisible=selected.visible&&$('show-dimensions').checked;
 const topLimit=document.querySelector('.view-toolbar').getBoundingClientRect().bottom-view.getBoundingClientRect().top+22;
 for(const d of dimLabels){const p=project(d.pos);d.el.hidden=!dimensionsVisible||!p.inFront;if(d.el.hidden)continue;
  const width=d.el.offsetWidth,x=Math.max(width/2+8,Math.min(view.clientWidth-width/2-8,p.x));let y=Math.max(topLimit,Math.min(view.clientHeight-52,p.y));
  for(let step=0;step<8&&occupied.some(o=>Math.abs(o.x-x)<(o.width+width)/2+6&&Math.abs(o.y-y)<31);step++)y=y+34>view.clientHeight-45?topLimit+step*33:y+34;
  d.el.style.left=`${x}px`;d.el.style.top=`${y}px`;occupied.push({x,y,width});
 }
}
requestAnimationFrame(animate);
