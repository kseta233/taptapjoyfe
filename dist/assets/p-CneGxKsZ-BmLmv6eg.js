import{W as r,v as s,x as a,P as i,y as m}from"./vendor-DIQqgIeR.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const c=()=>{const t=window;t.addEventListener("statusTap",(()=>{r((()=>{const n=document.elementFromPoint(t.innerWidth/2,t.innerHeight/2);if(!n)return;const e=s(n);e&&new Promise((o=>a(e,o))).then((()=>{i((async()=>{e.style.setProperty("--overflow","hidden"),await m(e,300),e.style.removeProperty("--overflow")}))}))}))}))};export{c as startStatusTap};
