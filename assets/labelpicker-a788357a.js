import{O as p,C as O,c as V,d as W,e as F,f as H,g as e,S as $}from"./style-f13b2bee.js";class Y{static async UpdateLabel(g,u,U,S){const I=await p.scene.items.getItems(f=>f.attachedTo===g.id&&f.type==="TEXT"&&f.metadata[`${O.EXTENSIONID}/direction`]===k(u.Direction)),v=I.find(f=>f.text.plainText===u.Name);if(v)await p.scene.items.deleteItems([v.id]);else{let f=function(m,h){const w=m.max.y-m.min.y,t=m.min.x-10,a=m.max.x+10,o=m.min.y,n=o+w,s=Math.abs(n-o)/2,T=r.max.x-r.min.x,y=10;return c!==0&&(h==="Top"||h==="Bottom")?[[e.MOVE,t+s,o],[e.QUAD,t,o,t,o+s],[e.LINE,t,n-s],[e.QUAD,t,n,t+s,n],[e.LINE,a-s,n],[e.QUAD,a,n,a,n-s],[e.QUAD,a,o,a-s,o],[e.CLOSE]]:h==="Top"?[[e.MOVE,t+s,o],[e.QUAD,t,o,t,o+s],[e.QUAD,t,n,t+s,n],[e.LINE,t+(T-y)/2,n],[e.LINE,t+(T-y)/2+y/2,n+y],[e.LINE,t+(T-y)/2+y,n],[e.LINE,t+(T-y)/2,n],[e.QUAD,t,n,t+s,n],[e.LINE,a-s,n],[e.QUAD,a,n,a,n-s],[e.QUAD,a,o,a-s,o],[e.CLOSE]]:h==="Bottom"?[[e.MOVE,t+s,o],[e.QUAD,t,o,t,o+s],[e.QUAD,t,n,t+s,n],[e.QUAD,t,n,t+s,n],[e.LINE,a-s,n],[e.QUAD,a,n,a,n-s],[e.QUAD,a,o,a-s,o],[e.LINE,t+(T-y)/2,o],[e.LINE,t+(T-y)/2+y/2,o-y],[e.LINE,t+(T-y)/2+y,o],[e.LINE,t+(T-y)/2,o],[e.CLOSE]]:h==="Left"?[[e.MOVE,t+s,o],[e.QUAD,t,o,t,o+s],[e.LINE,t,n-s],[e.QUAD,t,n,t+s,n],[e.LINE,a-s,n],[e.QUAD,a,n,a,(n+o)/2+5],[e.LINE,g.position.x,g.position.y],[e.LINE,a,(n+o)/2-5],[e.QUAD,a,o,a-s,o],[e.LINE,t+s,o],[e.CLOSE]]:[[e.MOVE,t+s,o],[e.QUAD,t,o,t,(n+o)/2-5],[e.QUAD,t,n,t,(n+o)/2+5],[e.LINE,t,(n+o)/2-5],[e.LINE,g.position.x,g.position.y],[e.LINE,t,(n+o)/2+5],[e.QUAD,t,n,t+s,n],[e.LINE,a-s,n],[e.QUAD,a,n,a,n-s],[e.QUAD,a,o,a-s,o],[e.CLOSE]]},x=function(m,h){const t=document.createElement("canvas").getContext("2d");if(!t)throw new Error("Canvas 2D context is not supported.");return t.font=h,t.measureText(m).width},M=function(m,h){const t=document.createElement("canvas").getContext("2d");if(!t)throw new Error("Canvas 2D context is not supported.");t.font=h;const a=t.measureText(m);return a.actualBoundingBoxAscent+a.actualBoundingBoxDescent},c=0,d=0;if(I.length>0){const m=await p.scene.items.getItemBounds([I[0].id]);d=m.max.y-m.min.y;for(let h=0;h<I.length+1;h++){let w=!1;if(w=I.some(t=>t.metadata[`${O.EXTENSIONID}/place`]===h),!w){c=h;break}}}const N=await p.scene.grid.getDpi(),r=V(g,N),C=W(g.id,u.Id),A="#242424",D=parseInt(U),b=D+"px Roboto",R=+S/100,l=x(u.Name,b),L=M("AjTg",b),E={};E[`${O.EXTENSIONID}/place`]=c,E[`${O.EXTENSIONID}/comboid`]=C,E[`${O.EXTENSIONID}/direction`]=k(u.Direction);const i=F().fillColor(u.Color).plainText(u.Name).fillOpacity(R).strokeWidth(1.75).strokeColor("black").strokeOpacity(1).build();i.position={x:g.position.x,y:g.position.y},i.attachedTo=g.id,i.visible=!!g.visible,i.locked=!0,i.metadata=E,i.disableAttachmentBehavior=["ROTATION","SCALE"],i.type="TEXT",i.text.type="PLAIN",i.text.style.fontWeight=600,i.text.style.fontSize=D,i.text.style.textAlign="CENTER",i.text.style.fontFamily="Roboto",u.Direction=="Top"&&(i.position.x-=l/2,i.position.y=r.min.y-(L+20),I.length>0&&c!==0&&(i.position.y-=d*c,console.log(d))),u.Direction=="Bottom"&&(i.position.x-=l/2,i.position.y=r.max.y-L/2+45,I.length>0&&c!==0&&(i.position.y+=d*c)),u.Direction=="Right"&&(i.position.x=r.max.x+15,i.position.y-=L/2,I.length>0&&c!==0&&(i.position.y+=d*c)),u.Direction=="Left"&&(i.position.x=r.min.x-15,i.position.x-=l+15,i.position.y-=L/2,I.length>0&&c!==0&&(i.position.y-=d*c)),await p.scene.items.addItems([i]);const G=await p.scene.items.getItems(m=>m.metadata[`${O.EXTENSIONID}/comboid`]===C),P=await p.scene.items.getItemBounds(G.map(m=>m.id)),q=f(P,u.Direction),Q=H().commands(q).strokeOpacity(0).fillOpacity(R).fillColor(A).build();Q.attachedTo=G[0].id,Q.disableHit=!0,Q.disableAttachmentBehavior=["ROTATION","SCALE"],await p.scene.items.addItems([Q])}function k(f){switch(f){case"Top":return 601;case"Bottom":return 602;case"Right":return 603;case"Left":return 604;default:throw new Error("Invalid direction")}}}}p.onReady(async()=>{document.documentElement.style.borderRadius="16px",document.documentElement.style.height="100%";const X=window.location.search,u=new URLSearchParams(X).get("contextmenu");let U=[];const S=await p.player.getSelection(),I=await p.scene.items.getItems(S);S?.length===1&&(U=await p.scene.items.getItems(c=>c.attachedTo===I[0].id&&c.type==="TEXT"));const v=await p.theme.getTheme();$(v,document),p.theme.onChange(c=>{$(c,document)});const x=(await p.room.getMetadata())[`${O.EXTENSIONID}/metadata_marks`]?.saveData;if(x&&x.Labels?.length>0){let c=function(l){l==="#1"?(d.style.display="",N.style.display="none",r.style.display="none"):l==="#2"?(d.style.display="none",N.style.display="",r.style.display="none"):(d.style.display="none",N.style.display="none",r.style.display="")};const d=document.querySelector("#label-list1"),N=document.querySelector("#label-list2"),r=document.querySelector("#label-list3"),C=document.createElement("button");C.className="categoryButton",C.onclick=()=>c("#1");const A=document.createElement("button");A.className="categoryButton",A.onclick=()=>c("#2");const D=document.createElement("button");D.className="categoryButton",D.onclick=()=>c("#3");const b=document.querySelector(".footered");b.appendChild(C),b.appendChild(A),b.appendChild(D),u&&(d.classList.remove("btn-group"),d.classList.add("context-btn-group"),N.classList.remove("btn-group"),N.classList.add("context-btn-group"),r.classList.remove("btn-group"),r.classList.add("context-btn-group")),x.Groups.forEach(l=>{switch(l.Num){case"#1":C.innerText=l.Name;break;case"#2":A.innerText=l.Name;break;case"#3":D.innerText=l.Name;break;default:throw new Error("Invalid Group")}}),x.Labels.forEach(l=>{if(l.Active){const L=U.find(i=>i.text.plainText===l.Name),E=document.createElement("button");E.id=`toggle-${l.Id}`,E.className=`group1${L?" highlight":""}`,E.value=l.Name,E.title=l.Name,E.textContent=l.Name,l.Group==="#1"?d.appendChild(E):l.Group==="#2"?N.appendChild(E):r.appendChild(E)}}),document.querySelectorAll(".group1").forEach(l=>{l.addEventListener("click",async L=>await M(L.currentTarget))}),c("#1")}else document.querySelector("#label-list1").innerHTML=`
        <div>
        No labels found.
        </div>`;async function M(c){const d=c.id.substring(7),N=x.Labels.find(r=>r.Id===d);S?.length===1&&(c.className=c.className==="group1"?"group1 highlight":"group1"),I.forEach(async r=>{await Y.UpdateLabel(r,N,x.Distance,x.Opacity)})}});
