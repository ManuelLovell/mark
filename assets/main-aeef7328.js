import{O as L,C as z,S as ve,G as He,H as Me,R as Re}from"./style-0a7c21db.js";const Oe="com.tutorial.initiative-tracker";function Pe(){L.contextMenu.create({id:`${Oe}/context-menu`,icons:[{icon:"/tag1.svg",label:"Mark It",filter:{every:[{key:"layer",value:"CHARACTER"}]}}],async onClick(c,n){c.items.length==1?await L.popover.open({id:z.LABELSID,url:`/labelpicker.html?targetid=${c.items[0].id}`,height:250,width:300,anchorElementId:n}):await L.popover.open({id:z.LABELSID,url:`/labelpicker.html?targetid=${c.items.map(s=>s.id).toString()}&multi=true`,height:250,width:300,anchorElementId:n})}})}var x=function(){/*!
* Copyright (c) 2021-2023 Momo Bassit.
* Licensed under the MIT License (MIT)
* https://github.com/mdbassit/Coloris
* Version: 0.19.0
* NPM: https://github.com/melloware/coloris-npm
*/return function(c,n,s){var p=n.createElement("canvas").getContext("2d"),u={r:0,g:0,b:0,h:0,s:0,v:0,a:1},v,o,m,y,F,M,A,I,S,N,U,R,B,k,P,D,K,r={el:"[data-coloris]",parent:"body",theme:"default",themeMode:"light",rtl:!1,wrap:!0,margin:2,format:"hex",formatToggle:!1,swatches:[],swatchesOnly:!1,alpha:!0,forceAlpha:!1,focusInput:!0,selectInput:!1,inline:!1,defaultColor:"#000000",clearButton:!1,clearLabel:"Clear",closeButton:!1,closeLabel:"Close",onChange:function(){},a11y:{open:"Open color picker",close:"Close color picker",clear:"Clear the selected color",marker:"Saturation: {s}. Brightness: {v}.",hueSlider:"Hue slider",alphaSlider:"Opacity slider",input:"Color value field",format:"Color format",swatch:"Color swatch",instruction:"Saturation and brightness selector. Use up, down, left and right arrow keys to select."}},_={},J="",q={},j=!1;function $(e){if(typeof e=="object"){var t=function(){switch(a){case"el":Z(e.el),e.wrap!==!1&&X(e.el);break;case"parent":v=n.querySelector(e.parent),v&&(v.appendChild(o),r.parent=e.parent,v===n.body&&(v=null));break;case"themeMode":r.themeMode=e.themeMode,e.themeMode==="auto"&&c.matchMedia&&c.matchMedia("(prefers-color-scheme: dark)").matches&&(r.themeMode="dark");case"theme":e.theme&&(r.theme=e.theme),o.className="clr-picker clr-"+r.theme+" clr-"+r.themeMode,r.inline&&V();break;case"rtl":r.rtl=!!e.rtl,n.querySelectorAll(".clr-field").forEach(function(E){return E.classList.toggle("clr-rtl",r.rtl)});break;case"margin":e.margin*=1,r.margin=isNaN(e.margin)?r.margin:e.margin;break;case"wrap":e.el&&e.wrap&&X(e.el);break;case"formatToggle":r.formatToggle=!!e.formatToggle,w("clr-format").style.display=r.formatToggle?"block":"none",r.formatToggle&&(r.format="auto");break;case"swatches":if(Array.isArray(e.swatches)){var i=[];e.swatches.forEach(function(E,he){i.push('<button type="button" id="clr-swatch-'+he+'" aria-labelledby="clr-swatch-label clr-swatch-'+he+'" style="color: '+E+';">'+E+"</button>")}),w("clr-swatches").innerHTML=i.length?"<div>"+i.join("")+"</div>":"",r.swatches=e.swatches.slice()}break;case"swatchesOnly":r.swatchesOnly=!!e.swatchesOnly,o.setAttribute("data-minimal",r.swatchesOnly);break;case"alpha":r.alpha=!!e.alpha,o.setAttribute("data-alpha",r.alpha);break;case"inline":if(r.inline=!!e.inline,o.setAttribute("data-inline",r.inline),r.inline){var d=e.defaultColor||r.defaultColor;P=ee(d),V(),W(d)}break;case"clearButton":typeof e.clearButton=="object"&&(e.clearButton.label&&(r.clearLabel=e.clearButton.label,I.innerHTML=r.clearLabel),e.clearButton=e.clearButton.show),r.clearButton=!!e.clearButton,I.style.display=r.clearButton?"block":"none";break;case"clearLabel":r.clearLabel=e.clearLabel,I.innerHTML=r.clearLabel;break;case"closeButton":r.closeButton=!!e.closeButton,r.closeButton?o.insertBefore(S,M):M.appendChild(S);break;case"closeLabel":r.closeLabel=e.closeLabel,S.innerHTML=r.closeLabel;break;case"a11y":var f=e.a11y,g=!1;if(typeof f=="object")for(var h in f)f[h]&&r.a11y[h]&&(r.a11y[h]=f[h],g=!0);if(g){var C=w("clr-open-label"),T=w("clr-swatch-label");C.innerHTML=r.a11y.open,T.innerHTML=r.a11y.swatch,S.setAttribute("aria-label",r.a11y.close),I.setAttribute("aria-label",r.a11y.clear),N.setAttribute("aria-label",r.a11y.hueSlider),R.setAttribute("aria-label",r.a11y.alphaSlider),A.setAttribute("aria-label",r.a11y.input),m.setAttribute("aria-label",r.a11y.instruction)}break;default:r[a]=e[a]}};for(var a in e)t()}}function Fe(e,t){typeof e=="string"&&typeof t=="object"&&(_[e]=t,j=!0)}function ke(e){delete _[e],Object.keys(_).length===0&&(j=!1,e===J&&Q())}function se(e){if(j){var t=["el","wrap","rtl","inline","defaultColor","a11y"],a=function(){var f=_[l];if(e.matches(l)){J=l,q={},t.forEach(function(h){return delete f[h]});for(var g in f)q[g]=Array.isArray(r[g])?r[g].slice():r[g];return $(f),"break"}};for(var l in _){var i=a();if(i==="break")break}}}function Q(){Object.keys(q).length>0&&($(q),J="",q={})}function Z(e){b(n,"click",e,function(t){r.inline||(se(t.target),k=t.target,D=k.value,P=ee(D),o.classList.add("clr-open"),V(),W(D),(r.focusInput||r.selectInput)&&A.focus({preventScroll:!0}),r.selectInput&&A.select(),(K||r.swatchesOnly)&&pe().shift().focus(),k.dispatchEvent(new Event("open",{bubbles:!0})))}),b(n,"input",e,function(t){var a=t.target.parentNode;a.classList.contains("clr-field")&&(a.style.color=t.target.value)})}function V(){if(!(!o||!k&&!r.inline)){var e=v,t=c.scrollY,a=o.offsetWidth,l=o.offsetHeight,i={left:!1,top:!1},d,f,g,h={x:0,y:0};if(e&&(d=c.getComputedStyle(e),f=parseFloat(d.marginTop),g=parseFloat(d.borderTopWidth),h=e.getBoundingClientRect(),h.y+=g+t),!r.inline){var C=k.getBoundingClientRect(),T=C.x,E=t+C.y+C.height+r.margin;e?(T-=h.x,E-=h.y,T+a>e.clientWidth&&(T+=C.width-a,i.left=!0),E+l>e.clientHeight-f&&l+r.margin<=C.top-(h.y-t)&&(E-=C.height+l+r.margin*2,i.top=!0),E+=e.scrollTop):(T+a>n.documentElement.clientWidth&&(T+=C.width-a,i.left=!0),E+l-t>n.documentElement.clientHeight&&l+r.margin<=C.top&&(E=t+C.y-l-r.margin,i.top=!0)),o.classList.toggle("clr-left",i.left),o.classList.toggle("clr-top",i.top),o.style.left=T+"px",o.style.top=E+"px",h.x+=o.offsetLeft,h.y+=o.offsetTop}y={width:m.offsetWidth,height:m.offsetHeight,x:m.offsetLeft+h.x,y:m.offsetTop+h.y}}}function X(e){n.querySelectorAll(e).forEach(function(t){var a=t.parentNode;if(!a.classList.contains("clr-field")){var l=n.createElement("div"),i="clr-field";(r.rtl||t.classList.contains("clr-rtl"))&&(i+=" clr-rtl"),l.innerHTML='<button type="button" aria-labelledby="clr-open-label"></button>',a.insertBefore(l,t),l.setAttribute("class",i),l.style.color=t.value,l.appendChild(t)}})}function O(e){if(k&&!r.inline){var t=k;e&&(k=null,D!==t.value&&(t.value=D,t.dispatchEvent(new Event("input",{bubbles:!0})))),setTimeout(function(){D!==t.value&&t.dispatchEvent(new Event("change",{bubbles:!0}))}),o.classList.remove("clr-open"),j&&Q(),t.dispatchEvent(new Event("close",{bubbles:!0})),r.focusInput&&t.focus({preventScroll:!0}),k=null}}function W(e){var t=Ie(e),a=Te(t);de(a.s,a.v),Y(t,a),N.value=a.h,o.style.color="hsl("+a.h+", 100%, 50%)",U.style.left=a.h/360*100+"%",F.style.left=y.width*a.s/100+"px",F.style.top=y.height-y.height*a.v/100+"px",R.value=a.a*100,B.style.left=a.a*100+"%"}function ee(e){var t=e.substring(0,3).toLowerCase();return t==="rgb"||t==="hsl"?t:"hex"}function G(e){e=e!==void 0?e:A.value,k&&(k.value=e,k.dispatchEvent(new Event("input",{bubbles:!0}))),r.onChange&&r.onChange.call(c,e),n.dispatchEvent(new CustomEvent("coloris:pick",{detail:{color:e}}))}function ue(e,t){var a={h:N.value*1,s:e/y.width*100,v:100-t/y.height*100,a:R.value/100},l=Le(a);de(a.s,a.v),Y(l,a),G()}function de(e,t){var a=r.a11y.marker;e=e.toFixed(1)*1,t=t.toFixed(1)*1,a=a.replace("{s}",e),a=a.replace("{v}",t),F.setAttribute("aria-label",a)}function Ce(e){return{pageX:e.changedTouches?e.changedTouches[0].pageX:e.pageX,pageY:e.changedTouches?e.changedTouches[0].pageY:e.pageY}}function H(e){var t=Ce(e),a=t.pageX-y.x,l=t.pageY-y.y;v&&(l+=v.scrollTop),fe(a,l),e.preventDefault(),e.stopPropagation()}function we(e,t){var a=F.style.left.replace("px","")*1+e,l=F.style.top.replace("px","")*1+t;fe(a,l)}function fe(e,t){e=e<0?0:e>y.width?y.width:e,t=t<0?0:t>y.height?y.height:t,F.style.left=e+"px",F.style.top=t+"px",ue(e,t),F.focus()}function Y(e,t){e===void 0&&(e={}),t===void 0&&(t={});var a=r.format;for(var l in e)u[l]=e[l];for(var i in t)u[i]=t[i];var d=Se(u),f=d.substring(0,7);switch(F.style.color=f,B.parentNode.style.color=f,B.style.color=d,M.style.color=d,m.style.display="none",m.offsetHeight,m.style.display="",B.nextElementSibling.style.display="none",B.nextElementSibling.offsetHeight,B.nextElementSibling.style.display="",a==="mixed"?a=u.a===1?"hex":"rgb":a==="auto"&&(a=P),a){case"hex":A.value=d;break;case"rgb":A.value=Ne(u);break;case"hsl":A.value=Be(xe(u));break}n.querySelector('.clr-format [value="'+a+'"]').checked=!0}function Ae(){var e=N.value*1,t=F.style.left.replace("px","")*1,a=F.style.top.replace("px","")*1;o.style.color="hsl("+e+", 100%, 50%)",U.style.left=e/360*100+"%",ue(t,a)}function Ee(){var e=R.value/100;B.style.left=e*100+"%",Y({a:e}),G()}function Le(e){var t=e.s/100,a=e.v/100,l=t*a,i=e.h/60,d=l*(1-s.abs(i%2-1)),f=a-l;l=l+f,d=d+f;var g=s.floor(i)%6,h=[l,d,f,f,d,l][g],C=[d,l,l,d,f,f][g],T=[f,f,d,l,l,d][g];return{r:s.round(h*255),g:s.round(C*255),b:s.round(T*255),a:e.a}}function xe(e){var t=e.v/100,a=t*(1-e.s/100/2),l;return a>0&&a<1&&(l=s.round((t-a)/s.min(a,1-a)*100)),{h:e.h,s:l||0,l:s.round(a*100),a:e.a}}function Te(e){var t=e.r/255,a=e.g/255,l=e.b/255,i=s.max(t,a,l),d=s.min(t,a,l),f=i-d,g=i,h=0,C=0;return f&&(i===t&&(h=(a-l)/f),i===a&&(h=2+(l-t)/f),i===l&&(h=4+(t-a)/f),i&&(C=f/i)),h=s.floor(h*60),{h:h<0?h+360:h,s:s.round(C*100),v:s.round(g*100),a:e.a}}function Ie(e){var t=/^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,a,l;return p.fillStyle="#000",p.fillStyle=e,a=t.exec(p.fillStyle),a?(l={r:a[3]*1,g:a[4]*1,b:a[5]*1,a:a[6]*1},l.a=+l.a.toFixed(2)):(a=p.fillStyle.replace("#","").match(/.{2}/g).map(function(i){return parseInt(i,16)}),l={r:a[0],g:a[1],b:a[2],a:1}),l}function Se(e){var t=e.r.toString(16),a=e.g.toString(16),l=e.b.toString(16),i="";if(e.r<16&&(t="0"+t),e.g<16&&(a="0"+a),e.b<16&&(l="0"+l),r.alpha&&(e.a<1||r.forceAlpha)){var d=e.a*255|0;i=d.toString(16),d<16&&(i="0"+i)}return"#"+t+a+l+i}function Ne(e){return!r.alpha||e.a===1&&!r.forceAlpha?"rgb("+e.r+", "+e.g+", "+e.b+")":"rgba("+e.r+", "+e.g+", "+e.b+", "+e.a+")"}function Be(e){return!r.alpha||e.a===1&&!r.forceAlpha?"hsl("+e.h+", "+e.s+"%, "+e.l+"%)":"hsla("+e.h+", "+e.s+"%, "+e.l+"%, "+e.a+")"}function De(){n.getElementById("clr-picker")||(v=null,o=n.createElement("div"),o.setAttribute("id","clr-picker"),o.className="clr-picker",o.innerHTML='<input id="clr-color-value" name="clr-color-value" class="clr-color" type="text" value="" spellcheck="false" aria-label="'+r.a11y.input+'">'+('<div id="clr-color-area" class="clr-gradient" role="application" aria-label="'+r.a11y.instruction+'">')+'<div id="clr-color-marker" class="clr-marker" tabindex="0"></div></div><div class="clr-hue">'+('<input id="clr-hue-slider" name="clr-hue-slider" type="range" min="0" max="360" step="1" aria-label="'+r.a11y.hueSlider+'">')+'<div id="clr-hue-marker"></div></div><div class="clr-alpha">'+('<input id="clr-alpha-slider" name="clr-alpha-slider" type="range" min="0" max="100" step="1" aria-label="'+r.a11y.alphaSlider+'">')+'<div id="clr-alpha-marker"></div><span></span></div><div id="clr-format" class="clr-format"><fieldset class="clr-segmented">'+("<legend>"+r.a11y.format+"</legend>")+'<input id="clr-f1" type="radio" name="clr-format" value="hex"><label for="clr-f1">Hex</label><input id="clr-f2" type="radio" name="clr-format" value="rgb"><label for="clr-f2">RGB</label><input id="clr-f3" type="radio" name="clr-format" value="hsl"><label for="clr-f3">HSL</label><span></span></fieldset></div><div id="clr-swatches" class="clr-swatches"></div>'+('<button type="button" id="clr-clear" class="clr-clear" aria-label="'+r.a11y.clear+'">'+r.clearLabel+"</button>")+'<div id="clr-color-preview" class="clr-preview">'+('<button type="button" id="clr-close" class="clr-close" aria-label="'+r.a11y.close+'">'+r.closeLabel+"</button>")+"</div>"+('<span id="clr-open-label" hidden>'+r.a11y.open+"</span>")+('<span id="clr-swatch-label" hidden>'+r.a11y.swatch+"</span>"),n.body.appendChild(o),m=w("clr-color-area"),F=w("clr-color-marker"),I=w("clr-clear"),S=w("clr-close"),M=w("clr-color-preview"),A=w("clr-color-value"),N=w("clr-hue-slider"),U=w("clr-hue-marker"),R=w("clr-alpha-slider"),B=w("clr-alpha-marker"),Z(r.el),X(r.el),b(o,"mousedown",function(e){o.classList.remove("clr-keyboard-nav"),e.stopPropagation()}),b(m,"mousedown",function(e){b(n,"mousemove",H)}),b(m,"touchstart",function(e){n.addEventListener("touchmove",H,{passive:!1})}),b(F,"mousedown",function(e){b(n,"mousemove",H)}),b(F,"touchstart",function(e){n.addEventListener("touchmove",H,{passive:!1})}),b(A,"change",function(e){(k||r.inline)&&(W(A.value),G())}),b(I,"click",function(e){G(""),O()}),b(S,"click",function(e){G(),O()}),b(n,"click",".clr-format input",function(e){P=e.target.value,Y(),G()}),b(o,"click",".clr-swatches button",function(e){W(e.target.textContent),G(),r.swatchesOnly&&O()}),b(n,"mouseup",function(e){n.removeEventListener("mousemove",H)}),b(n,"touchend",function(e){n.removeEventListener("touchmove",H)}),b(n,"mousedown",function(e){K=!1,o.classList.remove("clr-keyboard-nav"),O()}),b(n,"keydown",function(e){var t=e.key,a=e.target,l=e.shiftKey,i=["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];if(t==="Escape"?O(!0):i.includes(t)&&(K=!0,o.classList.add("clr-keyboard-nav")),t==="Tab"&&a.matches(".clr-picker *")){var d=pe(),f=d.shift(),g=d.pop();l&&a===f?(g.focus(),e.preventDefault()):!l&&a===g&&(f.focus(),e.preventDefault())}}),b(n,"click",".clr-field button",function(e){j&&Q(),e.target.nextElementSibling.dispatchEvent(new Event("click",{bubbles:!0}))}),b(F,"keydown",function(e){var t={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};Object.keys(t).includes(e.key)&&(we.apply(void 0,t[e.key]),e.preventDefault())}),b(m,"click",H),b(N,"input",Ae),b(R,"input",Ee))}function pe(){var e=Array.from(o.querySelectorAll("input, button")),t=e.filter(function(a){return!!a.offsetWidth});return t}function w(e){return n.getElementById(e)}function b(e,t,a,l){var i=Element.prototype.matches||Element.prototype.msMatchesSelector;typeof a=="string"?e.addEventListener(t,function(d){i.call(d.target,a)&&l.call(d.target,d)}):(l=a,e.addEventListener(t,l))}function te(e,t){t=t!==void 0?t:[],n.readyState!=="loading"?e.apply(void 0,t):n.addEventListener("DOMContentLoaded",function(){e.apply(void 0,t)})}NodeList!==void 0&&NodeList.prototype&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach);function Ge(e,t){k=t,D=k.value,se(t),P=ee(e),V(),W(e),G(),D!==e&&k.dispatchEvent(new Event("change",{bubbles:!0}))}var ae=function(){var e={init:De,set:$,wrap:X,close:O,setInstance:Fe,setColor:Ge,removeInstance:ke,updatePosition:V};function t(i){te(function(){i&&(typeof i=="string"?Z(i):$(i))})}var a=function(d){t[d]=function(){for(var f=arguments.length,g=new Array(f),h=0;h<f;h++)g[h]=arguments[h];te(e[d],g)}};for(var l in e)a(l);return te(function(){c.addEventListener("resize",function(i){t.updatePosition()}),c.addEventListener("scroll",function(i){t.updatePosition()})}),t}();return ae.coloris=ae,ae}(window,document,Math)}();x.coloris;x.init;x.set;x.wrap;x.close;x.setInstance;x.removeInstance;x.updatePosition;x.init();x.coloris({el:".coloris",alpha:!1,format:"hex",wrap:!0,theme:"polaroid",themeMode:"light",swatches:["red","yellow","green","cyan","blue","purple"],onChange:c=>{console.log(c)}});x.close();document.querySelector("#app").innerHTML=`
  <div id="loadingApp" class="center">Loading...</div>
  <div id="labelApp" style="display:none;">
  Mark!<div id="mainButtons"></div>
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
  <hr style="height:1px; visibility:hidden;" />
  <table id="table-one" style="width:100%">
  <thead>
  <tr>
  <th style="width: 5%">🔛</th>
  <th style="width: 55%">Label Name</th>
  <th style="width: 10%">Group</th>
  <th style="width: 20%">Direction</th>
  <th style="width: 10%">🖍️</th>
  </tr>
  </thead>
  <tbody id="label-list"></tbody>
  </table>
  </div>`;const me=document.getElementById("loadingApp"),_e=document.getElementById("labelApp"),be=document.getElementById("label-list"),re=document.getElementById("mainButtons"),ie=document.getElementById("gr1n"),oe=document.getElementById("gr2n"),ce=document.getElementById("gr3n"),qe=[{Id:"1",Name:"Blinded 🕶️",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"2",Name:"Charmed 💘",Color:"#ff0000",Group:"#1",Direction:"Top",Active:1},{Id:"3",Name:"Deafened 🎧",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"4",Name:"Frightened 😱",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"5",Name:"Grappled 🫂",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"6",Name:"Incapacitated 💘",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"7",Name:"Invisible 😶‍🌫️",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"8",Name:"Paralyzed ⚡",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"9",Name:"Petrified 🪨",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"10",Name:"Poisoned 🤢",Color:"#008000",Group:"#1",Direction:"Top",Active:1},{Id:"11",Name:"Prone 🦦",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"12",Name:"Restrained 🪢",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"13",Name:"Stunned 💫",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"14",Name:"Unconscious 💤",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"15",Name:"Exhaustion 🦥",Color:"#FFFFFF",Group:"#1",Direction:"Top",Active:1},{Id:"16",Name:"Bardic Inspiration 🎵",Color:"#FFFFFF",Group:"#2",Direction:"Left",Active:1},{Id:"17",Name:"Champion 👑",Color:"#FFFFFF",Group:"#3",Direction:"Right",Active:1}],le=["Conditions","Buffs","Extra"];L.onReady(async()=>{Pe();const c=await L.theme.getTheme();ve(c,document),L.theme.onChange(s=>{ve(s,document)}),await L.player.getRole()==="GM"?await Xe():(me.innerHTML="Configuration is GM-Access only.",await L.action.setHeight(70),await L.action.setWidth(150))});function ne(c){const n=be.insertRow(0);n.id=He();const s=n.insertCell(0),p=n.insertCell(1);p.id="name_"+n.id,p.setAttribute("contenteditable","true"),p.innerHTML=c?c.Name:"Default Name";const u=n.insertCell(2);u.className="center";const v=We();v.value=c?c.Group:"#1",v.id="group_"+n.id,u.appendChild(v);const o=n.insertCell(3);o.className="center";const m=Ve();m.value=c?c.Direction:"Top",m.id="selector_"+n.id,o.appendChild(m);const y=n.insertCell(4);y.id=n.id,y.className="center",s.innerHTML=`<input id="checkbox_${n.id}" type="checkbox" ${c?.Active===0?"":"checked"}/>`;const F=c?Me(c.Color):void 0;y.appendChild(je(y.id,F))}function je(c,n){const s=document.createElement("div"),p=document.createElement("button");p.setAttribute("aria-labelledby","clr-open-label"),p.id="clr-button_"+c,s.className="clr-field",s.id="clr-field_"+c,s.style.color=n?"rgb"+n:"rgb(0, 0, 0)",s.appendChild(p);const u=document.createElement("input");return u.type="text",u.id="clr-input_"+c,u.style.width="20px",u.className="coloris",u.setAttribute("data-coloris",""),s.appendChild(u),s}function Ve(){const c=document.createElement("select");return["Top","Bottom","Left","Right"].forEach(s=>{const p=document.createElement("option");p.setAttribute("value",s);const u=document.createTextNode(s);p.appendChild(u),c.appendChild(p)}),c}function We(){const c=document.createElement("select");return["#1","#2","#3"].forEach(s=>{const p=document.createElement("option");p.setAttribute("value",s);const u=document.createTextNode(s);p.appendChild(u),c.appendChild(p)}),c}async function ge(){const c=[],n=[];for(var s=document.getElementById("label-list"),p=0,u;u=s.rows[p];p++){const m=u.id,y=u.querySelector("#checkbox_"+m),F=u.querySelector("#name_"+m),M=u.querySelector("#selector_"+m),A=u.querySelector("#group_"+m),I=u.querySelector("#clr-field_"+m),S=Re(I.style.color),N={Id:m,Active:y.checked?1:0,Name:F.innerHTML,Direction:M.value,Color:S,Group:A.value};c.push(N)}n.push({Name:ie.value,Num:"#1"}),n.push({Name:oe.value,Num:"#2"}),n.push({Name:ce.value,Num:"#3"});const v={Groups:n,Labels:c};let o={};o[`${z.EXTENSIONID}/metadata_marks`]={saveData:v},await L.room.setMetadata(o)}async function $e(){confirm("Erase everything and go back to default labels?")&&(be.innerHTML="",await ye())}async function ye(){ie.value=le[0],oe.value=le[1],ce.value=le[2],qe.forEach(c=>{ne(c)}),await ge()}async function Xe(){const s=(await L.room.getMetadata())[`${z.EXTENSIONID}/metadata_marks`]?.saveData;s&&s.Labels?.length>0?(s.Labels.forEach(o=>{ne(o)}),s.Groups.forEach(o=>{switch(o.Num){case"#1":ie.value=o.Name;break;case"#2":oe.value=o.Name;break;case"#3":ce.value=o.Name;break;default:throw new Error("Invalid Group")}})):await ye();const p=document.createElement("input");p.type="image",p.className="Icon clickable",p.id="saveButton",p.onclick=async function(){await ge()},p.src="/save.svg",p.title="Save Changes",p.height=20,p.width=20,re.appendChild(p);const u=document.createElement("input");u.type="image",u.className="Icon clickable",u.id="addButton",u.onclick=async function(){await ne()},u.src="/add.svg",u.title="Add Label",u.height=20,u.width=20,re.appendChild(u);const v=document.createElement("input");v.type="image",v.className="Icon clickable",v.id="addButton",v.onclick=async function(){await $e()},v.src="/reset.svg",v.title="Reset to Default Labels",v.height=20,v.width=20,re.appendChild(v),me.style.display="none",_e.style.display=""}
