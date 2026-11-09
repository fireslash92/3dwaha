// التصادم بين الأقدام والأشكال
'use strict';

/* =========================================================
   Collision: circle feet vs rect / circle / ellipse
   ========================================================= */
function resolve(px,py,r,list,W,H){
  for(let iter=0;iter<4;iter++){
    let hit=false;
    for(const c of list){
      if(c.t==='r'){
        const qx=clamp(px,c.x,c.x+c.w),qy=clamp(py,c.y,c.y+c.h);
        const dx=px-qx,dy=py-qy,d2=dx*dx+dy*dy;
        if(d2<r*r){hit=true;
          if(d2>1e-8){const d=Math.sqrt(d2);px+=dx/d*(r-d);py+=dy/d*(r-d);}
          else{const l=px-c.x,rt=c.x+c.w-px,t=py-c.y,b=c.y+c.h-py,m=Math.min(l,rt,t,b);
            if(m===l)px=c.x-r;else if(m===rt)px=c.x+c.w+r;else if(m===t)py=c.y-r;else py=c.y+c.h+r;}
        }
      }else if(c.t==='c'){
        const dx=px-c.x,dy=py-c.y,d=Math.hypot(dx,dy),min=c.r+r;
        if(d<min){hit=true;if(d>1e-6){px=c.x+dx/d*min;py=c.y+dy/d*min;}else py=c.y+min;}
      }else if(c.t==='k'){
        const q=corridorClamp(px,py);if(q){px=q.x;py=q.y;}
      }else{
        const k=c.rx/c.ry,dx=px-c.x,dy=(py-c.y)*k,d=Math.hypot(dx,dy),min=c.rx+r;
        if(d<min){hit=true;if(d>1e-6){px=c.x+dx/d*min;py=c.y+dy/d*min/k;}else py=c.y+min/k;}
      }
    }
    if(!hit)break;
  }
  return {x:clamp(px,r,W-r),y:clamp(py,r,H-r)};
}
