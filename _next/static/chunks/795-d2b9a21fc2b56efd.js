"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[795],{61750:function(e,t,r){r.d(t,{Z:function(){return l}});var n=r(86006),u={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),l=(e,t)=>{let r=(0,n.forwardRef)(({color:r="currentColor",size:l=24,strokeWidth:i=2,absoluteStrokeWidth:c,children:a,...s},f)=>(0,n.createElement)("svg",{ref:f,...u,width:l,height:l,stroke:r,strokeWidth:c?24*Number(i)/Number(l):i,className:`lucide lucide-${o(e)}`,...s},[...t.map(([e,t])=>(0,n.createElement)(e,t)),...(Array.isArray(a)?a:[a])||[]]));return r.displayName=`${e}`,r}},1928:function(e,t,r){r.d(t,{M:function(){return n}});function n(e,t,{checkForDefaultPrevented:r=!0}={}){return function(n){if(e?.(n),!1===r||!n.defaultPrevented)return t?.(n)}}},66814:function(e,t,r){r.d(t,{B:function(){return i}});var n=r(86006),u=r(9268),o=r(81084),l=r(1095);function i(e){let t=e+"CollectionProvider",[r,i]=function(e,t=[]){let r=[],o=()=>{let t=r.map(e=>n.createContext(e));return function(r){let u=r?.[e]||t;return n.useMemo(()=>({[`__scope${e}`]:{...r,[e]:u}}),[r,u])}};return o.scopeName=e,[function(t,o){let l=n.createContext(o),i=r.length;function c(t){let{scope:r,children:o,...c}=t,a=r?.[e][i]||l,s=n.useMemo(()=>c,Object.values(c));return(0,u.jsx)(a.Provider,{value:s,children:o})}return r=[...r,o],c.displayName=t+"Provider",[c,function(r,u){let c=u?.[e][i]||l,a=n.useContext(c);if(a)return a;if(void 0!==o)return o;throw Error(`\`${r}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let r=()=>{let r=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let u=r.reduce((t,{useScope:r,scopeName:n})=>{let u=r(e),o=u[`__scope${n}`];return{...t,...o}},{});return n.useMemo(()=>({[`__scope${t.scopeName}`]:u}),[u])}};return r.scopeName=t.scopeName,r}(o,...t)]}(t),[c,a]=r(t,{collectionRef:{current:null},itemMap:new Map}),s=e=>{let{scope:t,children:r}=e,o=n.useRef(null),l=n.useRef(new Map).current;return(0,u.jsx)(c,{scope:t,itemMap:l,collectionRef:o,children:r})};s.displayName=t;let f=e+"CollectionSlot",d=n.forwardRef((e,t)=>{let{scope:r,children:n}=e,i=a(f,r),c=(0,o.e)(t,i.collectionRef);return(0,u.jsx)(l.g7,{ref:c,children:n})});d.displayName=f;let p=e+"CollectionItemSlot",m="data-radix-collection-item",v=n.forwardRef((e,t)=>{let{scope:r,children:i,...c}=e,s=n.useRef(null),f=(0,o.e)(t,s),d=a(p,r);return n.useEffect(()=>(d.itemMap.set(s,{ref:s,...c}),()=>void d.itemMap.delete(s))),(0,u.jsx)(l.g7,{[m]:"",ref:f,children:i})});return v.displayName=p,[{Provider:s,Slot:d,ItemSlot:v},function(t){let r=a(e+"CollectionConsumer",t),u=n.useCallback(()=>{let e=r.collectionRef.current;if(!e)return[];let t=Array.from(e.querySelectorAll(`[${m}]`)),n=Array.from(r.itemMap.values()),u=n.sort((e,r)=>t.indexOf(e.ref.current)-t.indexOf(r.ref.current));return u},[r.collectionRef,r.itemMap]);return u},i]}},81084:function(e,t,r){r.d(t,{F:function(){return u},e:function(){return o}});var n=r(86006);function u(...e){return t=>e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t)})}function o(...e){return n.useCallback(u(...e),e)}},38899:function(e,t,r){r.d(t,{b:function(){return l},k:function(){return o}});var n=r(86006),u=r(9268);function o(e,t){let r=n.createContext(t),o=e=>{let{children:t,...o}=e,l=n.useMemo(()=>o,Object.values(o));return(0,u.jsx)(r.Provider,{value:l,children:t})};return o.displayName=e+"Provider",[o,function(u){let o=n.useContext(r);if(o)return o;if(void 0!==t)return t;throw Error(`\`${u}\` must be used within \`${e}\``)}]}function l(e,t=[]){let r=[],o=()=>{let t=r.map(e=>n.createContext(e));return function(r){let u=r?.[e]||t;return n.useMemo(()=>({[`__scope${e}`]:{...r,[e]:u}}),[r,u])}};return o.scopeName=e,[function(t,o){let l=n.createContext(o),i=r.length;r=[...r,o];let c=t=>{let{scope:r,children:o,...c}=t,a=r?.[e]?.[i]||l,s=n.useMemo(()=>c,Object.values(c));return(0,u.jsx)(a.Provider,{value:s,children:o})};return c.displayName=t+"Provider",[c,function(r,u){let c=u?.[e]?.[i]||l,a=n.useContext(c);if(a)return a;if(void 0!==o)return o;throw Error(`\`${r}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let r=()=>{let r=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let u=r.reduce((t,{useScope:r,scopeName:n})=>{let u=r(e),o=u[`__scope${n}`];return{...t,...o}},{});return n.useMemo(()=>({[`__scope${t.scopeName}`]:u}),[u])}};return r.scopeName=t.scopeName,r}(o,...t)]}},76899:function(e,t,r){r.d(t,{WV:function(){return i},jH:function(){return c}});var n=r(86006),u=r(8431),o=r(1095),l=r(9268),i=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,t)=>{let r=n.forwardRef((e,r)=>{let{asChild:n,...u}=e,i=n?o.g7:t;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,l.jsx)(i,{...u,ref:r})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{});function c(e,t){e&&u.flushSync(()=>e.dispatchEvent(t))}},1095:function(e,t,r){r.d(t,{A4:function(){return c},g7:function(){return l}});var n=r(86006),u=r(81084),o=r(9268),l=n.forwardRef((e,t)=>{let{children:r,...u}=e,l=n.Children.toArray(r),c=l.find(a);if(c){let e=c.props.children,r=l.map(t=>t!==c?t:n.Children.count(e)>1?n.Children.only(null):n.isValidElement(e)?e.props.children:null);return(0,o.jsx)(i,{...u,ref:t,children:n.isValidElement(e)?n.cloneElement(e,void 0,r):null})}return(0,o.jsx)(i,{...u,ref:t,children:r})});l.displayName="Slot";var i=n.forwardRef((e,t)=>{let{children:r,...o}=e;if(n.isValidElement(r)){let e,l;let i=(l=(e=Object.getOwnPropertyDescriptor(r.props,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?r.ref:(l=(e=Object.getOwnPropertyDescriptor(r,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?r.props.ref:r.props.ref||r.ref;return n.cloneElement(r,{...function(e,t){let r={...t};for(let n in t){let u=e[n],o=t[n],l=/^on[A-Z]/.test(n);l?u&&o?r[n]=(...e)=>{o(...e),u(...e)}:u&&(r[n]=u):"style"===n?r[n]={...u,...o}:"className"===n&&(r[n]=[u,o].filter(Boolean).join(" "))}return{...e,...r}}(o,r.props),ref:t?(0,u.F)(t,i):i})}return n.Children.count(r)>1?n.Children.only(null):null});i.displayName="SlotClone";var c=({children:e})=>(0,o.jsx)(o.Fragment,{children:e});function a(e){return n.isValidElement(e)&&e.type===c}},46868:function(e,t,r){r.d(t,{W:function(){return u}});var n=r(86006);function u(e){let t=n.useRef(e);return n.useEffect(()=>{t.current=e}),n.useMemo(()=>(...e)=>t.current?.(...e),[])}},85740:function(e,t,r){r.d(t,{T:function(){return o}});var n=r(86006),u=r(46868);function o({prop:e,defaultProp:t,onChange:r=()=>{}}){let[o,l]=function({defaultProp:e,onChange:t}){let r=n.useState(e),[o]=r,l=n.useRef(o),i=(0,u.W)(t);return n.useEffect(()=>{l.current!==o&&(i(o),l.current=o)},[o,l,i]),r}({defaultProp:t,onChange:r}),i=void 0!==e,c=i?e:o,a=(0,u.W)(r),s=n.useCallback(t=>{if(i){let r="function"==typeof t?t(e):t;r!==e&&a(r)}else l(t)},[i,e,l,a]);return[c,s]}},6423:function(e,t,r){r.d(t,{b:function(){return u}});var n=r(86006),u=globalThis?.document?n.useLayoutEffect:()=>{}},78917:function(e,t,r){r.d(t,{j:function(){return l}});var n=r(89791);let u=e=>"boolean"==typeof e?"".concat(e):0===e?"0":e,o=n.Z,l=(e,t)=>r=>{var n;if((null==t?void 0:t.variants)==null)return o(e,null==r?void 0:r.class,null==r?void 0:r.className);let{variants:l,defaultVariants:i}=t,c=Object.keys(l).map(e=>{let t=null==r?void 0:r[e],n=null==i?void 0:i[e];if(null===t)return null;let o=u(t)||u(n);return l[e][o]}),a=r&&Object.entries(r).reduce((e,t)=>{let[r,n]=t;return void 0===n||(e[r]=n),e},{}),s=null==t?void 0:null===(n=t.compoundVariants)||void 0===n?void 0:n.reduce((e,t)=>{let{class:r,className:n,...u}=t;return Object.entries(u).every(e=>{let[t,r]=e;return Array.isArray(r)?r.includes({...i,...a}[t]):({...i,...a})[t]===r})?[...e,r,n]:e},[]);return o(e,c,s,null==r?void 0:r.class,null==r?void 0:r.className)}}}]);