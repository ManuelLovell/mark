import{O as I,C as Z}from"./constants-e2306cdc.js";import{G as We,S as Ce,a as $e,H as ze,R as Xe}from"./style-c0b8e8d0.js";const Ye="com.battle-system.mark-menu";function Ke(){I.contextMenu.create({id:`${Ye}/context-menu`,icons:[{icon:"/tag1.svg",label:"Mark It",filter:{some:[{key:"layer",value:"CHARACTER",coordinator:"||"},{key:"layer",value:"MOUNT"}]}}],async onClick(o,n){o.items.length==1?await I.popover.open({id:Z.LABELSID,url:"/labelpicker.html",height:250,width:300,anchorElementId:n}):await I.popover.open({id:Z.LABELSID,url:"/labelpicker.html",height:250,width:300,anchorElementId:n})},embed:{url:"/labelpicker.html?contextmenu=true",height:200}})}var D=function(){/*!
* Copyright (c) 2021-2023 Momo Bassit.
* Licensed under the MIT License (MIT)
* https://github.com/mdbassit/Coloris
* Version: 0.19.0
* NPM: https://github.com/melloware/coloris-npm
*/return function(o,n,c){var h=n.createElement("canvas").getContext("2d"),m={r:0,g:0,b:0,h:0,s:0,v:0,a:1},g,i,p,b,C,M,A,S,d,y,L,F,B,E,G,R,le,r={el:"[data-coloris]",parent:"body",theme:"default",themeMode:"light",rtl:!1,wrap:!0,margin:2,format:"hex",formatToggle:!1,swatches:[],swatchesOnly:!1,alpha:!0,forceAlpha:!1,focusInput:!0,selectInput:!1,inline:!1,defaultColor:"#000000",clearButton:!1,clearLabel:"Clear",closeButton:!1,closeLabel:"Close",onChange:function(){},a11y:{open:"Open color picker",close:"Close color picker",clear:"Clear the selected color",marker:"Saturation: {s}. Brightness: {v}.",hueSlider:"Hue slider",alphaSlider:"Opacity slider",input:"Color value field",format:"Color format",swatch:"Color swatch",instruction:"Saturation and brightness selector. Use up, down, left and right arrow keys to select."}},V={},ie="",W={},$=!1;function Y(e){if(typeof e=="object"){var t=function(){switch(a){case"el":ce(e.el),e.wrap!==!1&&K(e.el);break;case"parent":g=n.querySelector(e.parent),g&&(g.appendChild(i),r.parent=e.parent,g===n.body&&(g=null));break;case"themeMode":r.themeMode=e.themeMode,e.themeMode==="auto"&&o.matchMedia&&o.matchMedia("(prefers-color-scheme: dark)").matches&&(r.themeMode="dark");case"theme":e.theme&&(r.theme=e.theme),i.className="clr-picker clr-"+r.theme+" clr-"+r.themeMode,r.inline&&z();break;case"rtl":r.rtl=!!e.rtl,n.querySelectorAll(".clr-field").forEach(function(N){return N.classList.toggle("clr-rtl",r.rtl)});break;case"margin":e.margin*=1,r.margin=isNaN(e.margin)?r.margin:e.margin;break;case"wrap":e.el&&e.wrap&&K(e.el);break;case"formatToggle":r.formatToggle=!!e.formatToggle,T("clr-format").style.display=r.formatToggle?"block":"none",r.formatToggle&&(r.format="auto");break;case"swatches":if(Array.isArray(e.swatches)){var s=[];e.swatches.forEach(function(N,ke){s.push('<button type="button" id="clr-swatch-'+ke+'" aria-labelledby="clr-swatch-label clr-swatch-'+ke+'" style="color: '+N+';">'+N+"</button>")}),T("clr-swatches").innerHTML=s.length?"<div>"+s.join("")+"</div>":"",r.swatches=e.swatches.slice()}break;case"swatchesOnly":r.swatchesOnly=!!e.swatchesOnly,i.setAttribute("data-minimal",r.swatchesOnly);break;case"alpha":r.alpha=!!e.alpha,i.setAttribute("data-alpha",r.alpha);break;case"inline":if(r.inline=!!e.inline,i.setAttribute("data-inline",r.inline),r.inline){var u=e.defaultColor||r.defaultColor;G=se(u),z(),X(u)}break;case"clearButton":typeof e.clearButton=="object"&&(e.clearButton.label&&(r.clearLabel=e.clearButton.label,S.innerHTML=r.clearLabel),e.clearButton=e.clearButton.show),r.clearButton=!!e.clearButton,S.style.display=r.clearButton?"block":"none";break;case"clearLabel":r.clearLabel=e.clearLabel,S.innerHTML=r.clearLabel;break;case"closeButton":r.closeButton=!!e.closeButton,r.closeButton?i.insertBefore(d,M):M.appendChild(d);break;case"closeLabel":r.closeLabel=e.closeLabel,d.innerHTML=r.closeLabel;break;case"a11y":var f=e.a11y,k=!1;if(typeof f=="object")for(var v in f)f[v]&&r.a11y[v]&&(r.a11y[v]=f[v],k=!0);if(k){var x=T("clr-open-label"),H=T("clr-swatch-label");x.innerHTML=r.a11y.open,H.innerHTML=r.a11y.swatch,d.setAttribute("aria-label",r.a11y.close),S.setAttribute("aria-label",r.a11y.clear),y.setAttribute("aria-label",r.a11y.hueSlider),F.setAttribute("aria-label",r.a11y.alphaSlider),A.setAttribute("aria-label",r.a11y.input),p.setAttribute("aria-label",r.a11y.instruction)}break;default:r[a]=e[a]}};for(var a in e)t()}}function Be(e,t){typeof e=="string"&&typeof t=="object"&&(V[e]=t,$=!0)}function Ne(e){delete V[e],Object.keys(V).length===0&&($=!1,e===ie&&oe())}function ve(e){if($){var t=["el","wrap","rtl","inline","defaultColor","a11y"],a=function(){var f=V[l];if(e.matches(l)){ie=l,W={},t.forEach(function(v){return delete f[v]});for(var k in f)W[k]=Array.isArray(r[k])?r[k].slice():r[k];return Y(f),"break"}};for(var l in V){var s=a();if(s==="break")break}}}function oe(){Object.keys(W).length>0&&(Y(W),ie="",W={})}function ce(e){w(n,"click",e,function(t){r.inline||(ve(t.target),E=t.target,R=E.value,G=se(R),i.classList.add("clr-open"),z(),X(R),(r.focusInput||r.selectInput)&&A.focus({preventScroll:!0}),r.selectInput&&A.select(),(le||r.swatchesOnly)&&we().shift().focus(),E.dispatchEvent(new Event("open",{bubbles:!0})))}),w(n,"input",e,function(t){var a=t.target.parentNode;a.classList.contains("clr-field")&&(a.style.color=t.target.value)})}function z(){if(!(!i||!E&&!r.inline)){var e=g,t=o.scrollY,a=i.offsetWidth,l=i.offsetHeight,s={left:!1,top:!1},u,f,k,v={x:0,y:0};if(e&&(u=o.getComputedStyle(e),f=parseFloat(u.marginTop),k=parseFloat(u.borderTopWidth),v=e.getBoundingClientRect(),v.y+=k+t),!r.inline){var x=E.getBoundingClientRect(),H=x.x,N=t+x.y+x.height+r.margin;e?(H-=v.x,N-=v.y,H+a>e.clientWidth&&(H+=x.width-a,s.left=!0),N+l>e.clientHeight-f&&l+r.margin<=x.top-(v.y-t)&&(N-=x.height+l+r.margin*2,s.top=!0),N+=e.scrollTop):(H+a>n.documentElement.clientWidth&&(H+=x.width-a,s.left=!0),N+l-t>n.documentElement.clientHeight&&l+r.margin<=x.top&&(N=t+x.y-l-r.margin,s.top=!0)),i.classList.toggle("clr-left",s.left),i.classList.toggle("clr-top",s.top),i.style.left=H+"px",i.style.top=N+"px",v.x+=i.offsetLeft,v.y+=i.offsetTop}b={width:p.offsetWidth,height:p.offsetHeight,x:p.offsetLeft+v.x,y:p.offsetTop+v.y}}}function K(e){n.querySelectorAll(e).forEach(function(t){var a=t.parentNode;if(!a.classList.contains("clr-field")){var l=n.createElement("div"),s="clr-field";(r.rtl||t.classList.contains("clr-rtl"))&&(s+=" clr-rtl"),l.innerHTML='<button type="button" aria-labelledby="clr-open-label"></button>',a.insertBefore(l,t),l.setAttribute("class",s),l.style.color=t.value,l.appendChild(t)}})}function U(e){if(E&&!r.inline){var t=E;e&&(E=null,R!==t.value&&(t.value=R,t.dispatchEvent(new Event("input",{bubbles:!0})))),setTimeout(function(){R!==t.value&&t.dispatchEvent(new Event("change",{bubbles:!0}))}),i.classList.remove("clr-open"),$&&oe(),t.dispatchEvent(new Event("close",{bubbles:!0})),r.focusInput&&t.focus({preventScroll:!0}),E=null}}function X(e){var t=Pe(e),a=Oe(t);be(a.s,a.v),J(t,a),y.value=a.h,i.style.color="hsl("+a.h+", 100%, 50%)",L.style.left=a.h/360*100+"%",C.style.left=b.width*a.s/100+"px",C.style.top=b.height-b.height*a.v/100+"px",F.value=a.a*100,B.style.left=a.a*100+"%"}function se(e){var t=e.substring(0,3).toLowerCase();return t==="rgb"||t==="hsl"?t:"hex"}function O(e){e=e!==void 0?e:A.value,E&&(E.value=e,E.dispatchEvent(new Event("input",{bubbles:!0}))),r.onChange&&r.onChange.call(o,e),n.dispatchEvent(new CustomEvent("coloris:pick",{detail:{color:e}}))}function ye(e,t){var a={h:y.value*1,s:e/b.width*100,v:100-t/b.height*100,a:F.value/100},l=Me(a);be(a.s,a.v),J(l,a),O()}function be(e,t){var a=r.a11y.marker;e=e.toFixed(1)*1,t=t.toFixed(1)*1,a=a.replace("{s}",e),a=a.replace("{v}",t),C.setAttribute("aria-label",a)}function Se(e){return{pageX:e.changedTouches?e.changedTouches[0].pageX:e.pageX,pageY:e.changedTouches?e.changedTouches[0].pageY:e.pageY}}function q(e){var t=Se(e),a=t.pageX-b.x,l=t.pageY-b.y;g&&(l+=g.scrollTop),ge(a,l),e.preventDefault(),e.stopPropagation()}function De(e,t){var a=C.style.left.replace("px","")*1+e,l=C.style.top.replace("px","")*1+t;ge(a,l)}function ge(e,t){e=e<0?0:e>b.width?b.width:e,t=t<0?0:t>b.height?b.height:t,C.style.left=e+"px",C.style.top=t+"px",ye(e,t),C.focus()}function J(e,t){e===void 0&&(e={}),t===void 0&&(t={});var a=r.format;for(var l in e)m[l]=e[l];for(var s in t)m[s]=t[s];var u=_e(m),f=u.substring(0,7);switch(C.style.color=f,B.parentNode.style.color=f,B.style.color=u,M.style.color=u,p.style.display="none",p.offsetHeight,p.style.display="",B.nextElementSibling.style.display="none",B.nextElementSibling.offsetHeight,B.nextElementSibling.style.display="",a==="mixed"?a=m.a===1?"hex":"rgb":a==="auto"&&(a=G),a){case"hex":A.value=u;break;case"rgb":A.value=qe(m);break;case"hsl":A.value=Ue(Re(m));break}n.querySelector('.clr-format [value="'+a+'"]').checked=!0}function Ge(){var e=y.value*1,t=C.style.left.replace("px","")*1,a=C.style.top.replace("px","")*1;i.style.color="hsl("+e+", 100%, 50%)",L.style.left=e/360*100+"%",ye(t,a)}function He(){var e=F.value/100;B.style.left=e*100+"%",J({a:e}),O()}function Me(e){var t=e.s/100,a=e.v/100,l=t*a,s=e.h/60,u=l*(1-c.abs(s%2-1)),f=a-l;l=l+f,u=u+f;var k=c.floor(s)%6,v=[l,u,f,f,u,l][k],x=[u,l,l,u,f,f][k],H=[f,f,u,l,l,u][k];return{r:c.round(v*255),g:c.round(x*255),b:c.round(H*255),a:e.a}}function Re(e){var t=e.v/100,a=t*(1-e.s/100/2),l;return a>0&&a<1&&(l=c.round((t-a)/c.min(a,1-a)*100)),{h:e.h,s:l||0,l:c.round(a*100),a:e.a}}function Oe(e){var t=e.r/255,a=e.g/255,l=e.b/255,s=c.max(t,a,l),u=c.min(t,a,l),f=s-u,k=s,v=0,x=0;return f&&(s===t&&(v=(a-l)/f),s===a&&(v=2+(l-t)/f),s===l&&(v=4+(t-a)/f),s&&(x=f/s)),v=c.floor(v*60),{h:v<0?v+360:v,s:c.round(x*100),v:c.round(k*100),a:e.a}}function Pe(e){var t=/^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,a,l;return h.fillStyle="#000",h.fillStyle=e,a=t.exec(h.fillStyle),a?(l={r:a[3]*1,g:a[4]*1,b:a[5]*1,a:a[6]*1},l.a=+l.a.toFixed(2)):(a=h.fillStyle.replace("#","").match(/.{2}/g).map(function(s){return parseInt(s,16)}),l={r:a[0],g:a[1],b:a[2],a:1}),l}function _e(e){var t=e.r.toString(16),a=e.g.toString(16),l=e.b.toString(16),s="";if(e.r<16&&(t="0"+t),e.g<16&&(a="0"+a),e.b<16&&(l="0"+l),r.alpha&&(e.a<1||r.forceAlpha)){var u=e.a*255|0;s=u.toString(16),u<16&&(s="0"+s)}return"#"+t+a+l+s}function qe(e){return!r.alpha||e.a===1&&!r.forceAlpha?"rgb("+e.r+", "+e.g+", "+e.b+")":"rgba("+e.r+", "+e.g+", "+e.b+", "+e.a+")"}function Ue(e){return!r.alpha||e.a===1&&!r.forceAlpha?"hsl("+e.h+", "+e.s+"%, "+e.l+"%)":"hsla("+e.h+", "+e.s+"%, "+e.l+"%, "+e.a+")"}function je(){n.getElementById("clr-picker")||(g=null,i=n.createElement("div"),i.setAttribute("id","clr-picker"),i.className="clr-picker",i.innerHTML='<input id="clr-color-value" name="clr-color-value" class="clr-color" type="text" value="" spellcheck="false" aria-label="'+r.a11y.input+'">'+('<div id="clr-color-area" class="clr-gradient" role="application" aria-label="'+r.a11y.instruction+'">')+'<div id="clr-color-marker" class="clr-marker" tabindex="0"></div></div><div class="clr-hue">'+('<input id="clr-hue-slider" name="clr-hue-slider" type="range" min="0" max="360" step="1" aria-label="'+r.a11y.hueSlider+'">')+'<div id="clr-hue-marker"></div></div><div class="clr-alpha">'+('<input id="clr-alpha-slider" name="clr-alpha-slider" type="range" min="0" max="100" step="1" aria-label="'+r.a11y.alphaSlider+'">')+'<div id="clr-alpha-marker"></div><span></span></div><div id="clr-format" class="clr-format"><fieldset class="clr-segmented">'+("<legend>"+r.a11y.format+"</legend>")+'<input id="clr-f1" type="radio" name="clr-format" value="hex"><label for="clr-f1">Hex</label><input id="clr-f2" type="radio" name="clr-format" value="rgb"><label for="clr-f2">RGB</label><input id="clr-f3" type="radio" name="clr-format" value="hsl"><label for="clr-f3">HSL</label><span></span></fieldset></div><div id="clr-swatches" class="clr-swatches"></div>'+('<button type="button" id="clr-clear" class="clr-clear" aria-label="'+r.a11y.clear+'">'+r.clearLabel+"</button>")+'<div id="clr-color-preview" class="clr-preview">'+('<button type="button" id="clr-close" class="clr-close" aria-label="'+r.a11y.close+'">'+r.closeLabel+"</button>")+"</div>"+('<span id="clr-open-label" hidden>'+r.a11y.open+"</span>")+('<span id="clr-swatch-label" hidden>'+r.a11y.swatch+"</span>"),n.body.appendChild(i),p=T("clr-color-area"),C=T("clr-color-marker"),S=T("clr-clear"),d=T("clr-close"),M=T("clr-color-preview"),A=T("clr-color-value"),y=T("clr-hue-slider"),L=T("clr-hue-marker"),F=T("clr-alpha-slider"),B=T("clr-alpha-marker"),ce(r.el),K(r.el),w(i,"mousedown",function(e){i.classList.remove("clr-keyboard-nav"),e.stopPropagation()}),w(p,"mousedown",function(e){w(n,"mousemove",q)}),w(p,"touchstart",function(e){n.addEventListener("touchmove",q,{passive:!1})}),w(C,"mousedown",function(e){w(n,"mousemove",q)}),w(C,"touchstart",function(e){n.addEventListener("touchmove",q,{passive:!1})}),w(A,"change",function(e){(E||r.inline)&&(X(A.value),O())}),w(S,"click",function(e){O(""),U()}),w(d,"click",function(e){O(),U()}),w(n,"click",".clr-format input",function(e){G=e.target.value,J(),O()}),w(i,"click",".clr-swatches button",function(e){X(e.target.textContent),O(),r.swatchesOnly&&U()}),w(n,"mouseup",function(e){n.removeEventListener("mousemove",q)}),w(n,"touchend",function(e){n.removeEventListener("touchmove",q)}),w(n,"mousedown",function(e){le=!1,i.classList.remove("clr-keyboard-nav"),U()}),w(n,"keydown",function(e){var t=e.key,a=e.target,l=e.shiftKey,s=["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];if(t==="Escape"?U(!0):s.includes(t)&&(le=!0,i.classList.add("clr-keyboard-nav")),t==="Tab"&&a.matches(".clr-picker *")){var u=we(),f=u.shift(),k=u.pop();l&&a===f?(k.focus(),e.preventDefault()):!l&&a===k&&(f.focus(),e.preventDefault())}}),w(n,"click",".clr-field button",function(e){$&&oe(),e.target.nextElementSibling.dispatchEvent(new Event("click",{bubbles:!0}))}),w(C,"keydown",function(e){var t={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};Object.keys(t).includes(e.key)&&(De.apply(void 0,t[e.key]),e.preventDefault())}),w(p,"click",q),w(y,"input",Ge),w(F,"input",He))}function we(){var e=Array.from(i.querySelectorAll("input, button")),t=e.filter(function(a){return!!a.offsetWidth});return t}function T(e){return n.getElementById(e)}function w(e,t,a,l){var s=Element.prototype.matches||Element.prototype.msMatchesSelector;typeof a=="string"?e.addEventListener(t,function(u){s.call(u.target,a)&&l.call(u.target,u)}):(l=a,e.addEventListener(t,l))}function ue(e,t){t=t!==void 0?t:[],n.readyState!=="loading"?e.apply(void 0,t):n.addEventListener("DOMContentLoaded",function(){e.apply(void 0,t)})}NodeList!==void 0&&NodeList.prototype&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach);function Ve(e,t){E=t,R=E.value,ve(t),G=se(e),z(),X(e),O(),R!==e&&E.dispatchEvent(new Event("change",{bubbles:!0}))}var de=function(){var e={init:je,set:Y,wrap:K,close:U,setInstance:Be,setColor:Ve,removeInstance:Ne,updatePosition:z};function t(s){ue(function(){s&&(typeof s=="string"?ce(s):Y(s))})}var a=function(u){t[u]=function(){for(var f=arguments.length,k=new Array(f),v=0;v<f;v++)k[v]=arguments[v];ue(e[u],k)}};for(var l in e)a(l);return ue(function(){o.addEventListener("resize",function(s){t.updatePosition()}),o.addEventListener("scroll",function(s){t.updatePosition()})}),t}();return de.coloris=de,de}(window,document,Math)}();D.coloris;D.init;D.set;D.wrap;D.close;D.setInstance;D.removeInstance;D.updatePosition;D.init();D.coloris({el:".coloris",alpha:!1,format:"hex",wrap:!0,theme:"polaroid",themeMode:"light",swatches:["red","yellow","green","cyan","blue","purple"],onChange:o=>{console.log(o)}});D.close();document.querySelector("#app").innerHTML=`
  <div id="loadingApp" class="center">Loading...</div>
  <div id="labelApp" style="display:none;">
  <div style="display:flex;"><div id="bannerText"></div><div id="whatsNew"></div></div>
  <div id="buttonLabels">
  <div class="nameGroup center">
  <label for="gr1n">Group #1</label><br>
  <input type="text" id="gr1n" name="gr1n" maxlength="15" size="10">
  </div>
  <div class="nameGroup center">
  <label for="gr2n">Group #2</label><br>
  <input type="text" id="gr2n" name="gr2n" maxlength="15" size="10">
  </div>
  <div class="nameGroup center">
  <label for="gr3n">Group #3</label><br>
  <input type="text" id="gr3n" name="gr3n" maxlength="15" size="10">
  </div>
  </div>
  <div id="mainButtonsGroup" class="center">
  <label for="distance">Size: </label><input type="number" id="distance" name="distance">
  <label for="distance">Opacity: </label><input type="number" id="opacity" name="opacity">
  <div id="mainButtons"></div></div>
  <hr style="height:1px; visibility:hidden;" />
  <table id="table-one" style="width:100%">
  <thead>
  <tr id="tableHeader">
  <th style="width: 5%">🔛</th>
  <th id="labelSort" style="width: 55%">Label Name</th>
  <th style="width: 10%">Group</th>
  <th style="width: 20%">Direction</th>
  <th style="width: 10%">🖍️</th>
  </tr>
  </thead>
  <tbody id="label-list"></tbody>
  </table>
  </div>
  `;const he=["Added Import/Export","Marked! v1.3","Updated Positioning for various Scaling","Added ContextMenu for faster Marking"];let Q=0;const ee=document.getElementById("bannerText"),Je=document.getElementById("whatsNew");Je.appendChild(We());function Qe(){ee.style.opacity="0",setTimeout(()=>{Ee()},2e3)}function Ee(){Q=(Q+1)%he.length,ee.textContent=he[Q],ee.style.opacity="1",setTimeout(()=>{Qe()},1e4)}ee.textContent=he[Q];Ee();const Fe=document.getElementById("loadingApp"),Ze=document.getElementById("labelApp"),xe=document.getElementById("label-list"),et=document.getElementById("labelSort");let fe=!0;const j=document.getElementById("mainButtons"),ae=document.getElementById("gr1n"),re=document.getElementById("gr2n"),ne=document.getElementById("gr3n"),P=document.getElementById("distance"),_=document.getElementById("opacity"),tt=[{Id:"1",Name:"Blinded 🕶️",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"2",Name:"Charmed 💘",Color:"#ff0000",Group:"#1",Direction:"Top",Active:1},{Id:"3",Name:"Deafened 🎧",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"4",Name:"Frightened 😱",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"5",Name:"Grappled 🫂",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"6",Name:"Incapacitated 💘",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"7",Name:"Invisible 😶‍🌫️",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"8",Name:"Paralyzed ⚡",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"9",Name:"Petrified 🪨",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"10",Name:"Poisoned 🤢",Color:"#008000",Group:"#1",Direction:"Top",Active:1},{Id:"11",Name:"Prone 🦦",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"12",Name:"Restrained 🪢",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"13",Name:"Stunned 💫",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"14",Name:"Unconscious 💤",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"15",Name:"Exhaustion 🦥",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"16",Name:"Bardic Inspiration 🎵",Color:"#FFFFFF",Group:"#2",Direction:"Left",Active:1},{Id:"17",Name:"Champion 👑",Color:"#FFFFFF",Group:"#3",Direction:"Right",Active:1}],pe=["Conditions","Buffs","Extra"],Le="36",Ae="85";I.onReady(async()=>{Ke();const o=await I.theme.getTheme();Ce(o,document),I.theme.onChange(c=>{Ce(c,document)}),await I.player.getRole()==="GM"?await ct():(Fe.innerHTML="Configuration is GM-Access only.",await I.action.setHeight(70),await I.action.setWidth(150))});function te(o){const n=xe.insertRow(0);n.className="data-row",n.id=$e();const c=n.insertCell(0),h=n.insertCell(1);h.id="name_"+n.id,h.setAttribute("contenteditable","true"),h.innerHTML=o?o.Name:"Default Name";const m=n.insertCell(2);m.className="center";const g=nt();g.value=o?o.Group:"#1",g.id="group_"+n.id,m.appendChild(g);const i=n.insertCell(3);i.className="center";const p=rt();p.value=o?o.Direction:"Top",p.id="selector_"+n.id,i.appendChild(p);const b=n.insertCell(4);b.id=n.id,b.className="center",c.innerHTML=`<input id="checkbox_${n.id}" type="checkbox" ${o?.Active===0?"":"checked"}/>`;const C=o?ze(o.Color):void 0;b.appendChild(at(b.id,C))}function at(o,n){const c=document.createElement("div"),h=document.createElement("button");h.setAttribute("aria-labelledby","clr-open-label"),h.id="clr-button_"+o,c.className="clr-field",c.id="clr-field_"+o,c.style.color=n?"rgb"+n:"rgb(0, 0, 0)",c.appendChild(h);const m=document.createElement("input");return m.type="text",m.id="clr-input_"+o,m.style.width="20px",m.className="coloris",m.setAttribute("data-coloris",""),c.appendChild(m),c}function rt(){const o=document.createElement("select");return["Top","Bottom","Left","Right"].forEach(c=>{const h=document.createElement("option");h.setAttribute("value",c);const m=document.createTextNode(c);h.appendChild(m),o.appendChild(h)}),o}function nt(){const o=document.createElement("select");return["#1","#2","#3"].forEach(c=>{const h=document.createElement("option");h.setAttribute("value",c);const m=document.createTextNode(c);h.appendChild(m),o.appendChild(h)}),o}async function lt(){const o=Te();var n=document.createElement("a"),c=new Blob([JSON.stringify(o)],{type:"text/plain"});n.href=URL.createObjectURL(c),n.download=`MarkedExport-${Date.now()}`,document.body.appendChild(n),n.click(),document.body.removeChild(n)}async function it(o){if(o&&o.Labels?.length>0){const n=document.getElementById("label-list");n.innerHTML="",o.Labels.forEach(c=>{te(c)}),o.Groups.forEach(c=>{switch(c.Num){case"#1":ae.value=c.Name;break;case"#2":re.value=c.Name;break;case"#3":ne.value=c.Name;break;default:throw new Error("Invalid Group")}}),P.value=o.Distance,_.value=o.Opacity}await me()}async function me(){const o=Te();let n={};n[`${Z.EXTENSIONID}/metadata_marks`]={saveData:o},await I.room.setMetadata(n)}function Te(){const o=[],n=[],c=P.value,h=_.value;for(var m=document.getElementById("label-list"),g=0,i;i=m.rows[g];g++){const p=i.id,b=i.querySelector("#checkbox_"+p),C=i.querySelector("#name_"+p),M=i.querySelector("#selector_"+p),A=i.querySelector("#group_"+p),S=i.querySelector("#clr-field_"+p),d=Xe(S.style.color),y={Id:p,Active:b.checked?1:0,Name:C.innerText.trim(),Direction:M.value,Color:d,Group:A.value};o.push(y)}return n.push({Name:ae.value,Num:"#1"}),n.push({Name:re.value,Num:"#2"}),n.push({Name:ne.value,Num:"#3"}),{Groups:n,Labels:o.reverse(),Distance:c,Opacity:h}}async function ot(){confirm("Erase everything and go back to default labels?")&&(xe.innerHTML="",await Ie())}async function Ie(){ae.value=pe[0],re.value=pe[1],ne.value=pe[2],P.value=Le,_.value=Ae,tt.forEach(o=>{te(o)}),await me()}async function ct(){const c=(await I.room.getMetadata())[`${Z.EXTENSIONID}/metadata_marks`]?.saveData;c&&c.Labels?.length>0?(c.Labels.forEach(d=>{te(d)}),c.Groups.forEach(d=>{switch(d.Num){case"#1":ae.value=d.Name;break;case"#2":re.value=d.Name;break;case"#3":ne.value=d.Name;break;default:throw new Error("Invalid Group")}})):await Ie(),P.max="999",P.min="1",P.maxLength=4,P.value=c?.Distance?c.Distance:Le,P.oninput=d=>{M(d.target)},_.max="99",_.min="1",_.maxLength=2,_.value=c?.Opacity?c.Opacity:Ae,_.oninput=d=>{M(d.target)};const h=document.createElement("input");h.type="image",h.className="Icon clickable",h.id="exportButton",h.onclick=async function(){await lt()},h.src="/export.svg",h.title="Export Data",h.height=20,h.width=20,j.appendChild(h);const m=document.createElement("input");m.type="image",m.className="Icon clickable",m.id="importButton",m.onclick=async function(){document.getElementById("fileButton").click()},m.src="/import.svg",m.title="Import Data",m.height=20,m.width=20,j.appendChild(m);const g=document.createElement("input");g.type="file",g.id="fileButton",g.title="Choose a file to import",g.className="tinyType",g.hidden=!0,g.onchange=async function(){if(console.log("FILE ADDED"),g.files&&g.files.length>0){let d=g.files[0],y=new FileReader;y.readAsText(d),y.onload=async function(){try{const L=JSON.parse(y.result);await it(L),I.notification.show("Import Complete!","SUCCESS")}catch(L){I.notification.show(`The import failed - ${L}`,"ERROR")}},y.onerror=function(){console.log(y.error)}}},j.appendChild(g);const i=document.createElement("input");i.type="image",i.className="Icon clickable",i.id="saveButton",i.onclick=async function(){await me()},i.src="/save.svg",i.title="Save Changes",i.height=20,i.width=20,j.appendChild(i);const p=document.createElement("input");p.type="image",p.className="Icon clickable",p.id="addButton",p.onclick=async function(){await te()},p.src="/add.svg",p.title="Add Label",p.height=20,p.width=20,j.appendChild(p);const b=document.createElement("input");b.type="image",b.className="Icon clickable",b.id="addButton",b.onclick=async function(){await ot()},b.src="/reset.svg",b.title="Reset to Default Labels",b.height=20,b.width=20,j.appendChild(b),et.onclick=async function(){var d,y,L,F,B,E,G;for(d=document.getElementById("label-list"),L=!0;L;){for(L=!1,y=d.getElementsByClassName("data-row"),F=0;F<y.length-1;F++)if(G=!1,B=y[F].getElementsByTagName("td")[1],E=y[F+1].getElementsByTagName("td")[1],fe){if(B.innerHTML.toLowerCase()>E.innerHTML.toLowerCase()){G=!0;break}}else if(B.innerHTML.toLowerCase()<E.innerHTML.toLowerCase()){G=!0;break}G&&(y[F].parentNode.insertBefore(y[F+1],y[F]),L=!0)}fe=!fe},Fe.style.display="none",Ze.style.display="";function C(d){return parseInt(d)}function M(d){let y=d.min,L=d.max,F=C(d.value);F>L?d.value=L:F<y&&(d.value=y)}function A(d){d.preventDefault();const y=d.target.closest("tr");y&&y.rowIndex>0&&window.confirm(`Are you sure you want to delete ${y.children[1].innerHTML}?`)&&y.remove()}const S=document.getElementById("table-one");S&&S.addEventListener("contextmenu",A)}
