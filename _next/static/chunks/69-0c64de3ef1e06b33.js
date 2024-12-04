"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[69],{51868:function(e,t,n){n.d(t,{z:function(){return i}});var r=n(86006),o=n(81084),a=n(6423),i=e=>{let t,n;let{present:i,children:s}=e,l=function(e){var t;let[n,o]=r.useState(),i=r.useRef({}),s=r.useRef(e),l=r.useRef("none"),c=e?"mounted":"unmounted",[d,f]=(t={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},r.useReducer((e,n)=>{let r=t[e][n];return r??e},c));return r.useEffect(()=>{let e=u(i.current);l.current="mounted"===d?e:"none"},[d]),(0,a.b)(()=>{let t=i.current,n=s.current,r=n!==e;if(r){let r=l.current,o=u(t);e?f("MOUNT"):"none"===o||t?.display==="none"?f("UNMOUNT"):n&&r!==o?f("ANIMATION_OUT"):f("UNMOUNT"),s.current=e}},[e,f]),(0,a.b)(()=>{if(n){let e;let t=n.ownerDocument.defaultView??window,r=r=>{let o=u(i.current),a=o.includes(r.animationName);if(r.target===n&&a&&(f("ANIMATION_END"),!s.current)){let r=n.style.animationFillMode;n.style.animationFillMode="forwards",e=t.setTimeout(()=>{"forwards"===n.style.animationFillMode&&(n.style.animationFillMode=r)})}},o=e=>{e.target===n&&(l.current=u(i.current))};return n.addEventListener("animationstart",o),n.addEventListener("animationcancel",r),n.addEventListener("animationend",r),()=>{t.clearTimeout(e),n.removeEventListener("animationstart",o),n.removeEventListener("animationcancel",r),n.removeEventListener("animationend",r)}}f("ANIMATION_END")},[n,f]),{isPresent:["mounted","unmountSuspended"].includes(d),ref:r.useCallback(e=>{e&&(i.current=getComputedStyle(e)),o(e)},[])}}(i),c="function"==typeof s?s({present:l.isPresent}):r.Children.only(s),d=(0,o.e)(l.ref,(n=(t=Object.getOwnPropertyDescriptor(c.props,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?c.ref:(n=(t=Object.getOwnPropertyDescriptor(c,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?c.props.ref:c.props.ref||c.ref),f="function"==typeof s;return f||l.isPresent?r.cloneElement(c,{ref:d}):null};function u(e){return e?.animationName||"none"}i.displayName="Presence"},76069:function(e,t,n){n.d(t,{VY:function(){return Y},aV:function(){return q},fC:function(){return B},xz:function(){return H}});var r=n(86006),o=n(1928),a=n(38899),i=n(66814),u=n(81084),s=n(9268),l=n(70757),c=n(76899),d=n(46868),f=n(85740),m=n(84924),p="rovingFocusGroup.onEntryFocus",v={bubbles:!1,cancelable:!0},b="RovingFocusGroup",[w,g,N]=(0,i.B)(b),[y,h]=function(e,t=[]){let n=[],o=()=>{let t=n.map(e=>r.createContext(e));return function(n){let o=n?.[e]||t;return r.useMemo(()=>({[`__scope${e}`]:{...n,[e]:o}}),[n,o])}};return o.scopeName=e,[function(t,o){let a=r.createContext(o),i=n.length;function u(t){let{scope:n,children:o,...u}=t,l=n?.[e][i]||a,c=r.useMemo(()=>u,Object.values(u));return(0,s.jsx)(l.Provider,{value:c,children:o})}return n=[...n,o],u.displayName=t+"Provider",[u,function(n,u){let s=u?.[e][i]||a,l=r.useContext(s);if(l)return l;if(void 0!==o)return o;throw Error(`\`${n}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let n=()=>{let n=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let o=n.reduce((t,{useScope:n,scopeName:r})=>{let o=n(e),a=o[`__scope${r}`];return{...t,...a}},{});return r.useMemo(()=>({[`__scope${t.scopeName}`]:o}),[o])}};return n.scopeName=t.scopeName,n}(o,...t)]}(b,[N]),[M,T]=y(b),I=r.forwardRef((e,t)=>(0,s.jsx)(w.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,s.jsx)(w.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,s.jsx)(x,{...e,ref:t})})}));I.displayName=b;var x=r.forwardRef((e,t)=>{let{__scopeRovingFocusGroup:n,orientation:a,loop:i=!1,dir:l,currentTabStopId:b,defaultCurrentTabStopId:w,onCurrentTabStopIdChange:N,onEntryFocus:y,preventScrollOnEntryFocus:h=!1,...T}=e,I=r.useRef(null),x=(0,u.e)(t,I),R=(0,m.gm)(l),[E=null,A]=(0,f.T)({prop:b,defaultProp:w,onChange:N}),[D,F]=r.useState(!1),j=(0,d.W)(y),O=g(n),_=r.useRef(!1),[P,S]=r.useState(0);return r.useEffect(()=>{let e=I.current;if(e)return e.addEventListener(p,j),()=>e.removeEventListener(p,j)},[j]),(0,s.jsx)(M,{scope:n,orientation:a,dir:R,loop:i,currentTabStopId:E,onItemFocus:r.useCallback(e=>A(e),[A]),onItemShiftTab:r.useCallback(()=>F(!0),[]),onFocusableItemAdd:r.useCallback(()=>S(e=>e+1),[]),onFocusableItemRemove:r.useCallback(()=>S(e=>e-1),[]),children:(0,s.jsx)(c.WV.div,{tabIndex:D||0===P?-1:0,"data-orientation":a,...T,ref:x,style:{outline:"none",...e.style},onMouseDown:(0,o.M)(e.onMouseDown,()=>{_.current=!0}),onFocus:(0,o.M)(e.onFocus,e=>{let t=!_.current;if(e.target===e.currentTarget&&t&&!D){let t=new CustomEvent(p,v);if(e.currentTarget.dispatchEvent(t),!t.defaultPrevented){let e=O().filter(e=>e.focusable),t=e.find(e=>e.active),n=e.find(e=>e.id===E),r=[t,n,...e].filter(Boolean),o=r.map(e=>e.ref.current);C(o,h)}}_.current=!1}),onBlur:(0,o.M)(e.onBlur,()=>F(!1))})})}),R="RovingFocusGroupItem",E=r.forwardRef((e,t)=>{let{__scopeRovingFocusGroup:n,focusable:a=!0,active:i=!1,tabStopId:u,...d}=e,f=(0,l.M)(),m=u||f,p=T(R,n),v=p.currentTabStopId===m,b=g(n),{onFocusableItemAdd:N,onFocusableItemRemove:y}=p;return r.useEffect(()=>{if(a)return N(),()=>y()},[a,N,y]),(0,s.jsx)(w.ItemSlot,{scope:n,id:m,focusable:a,active:i,children:(0,s.jsx)(c.WV.span,{tabIndex:v?0:-1,"data-orientation":p.orientation,...d,ref:t,onMouseDown:(0,o.M)(e.onMouseDown,e=>{a?p.onItemFocus(m):e.preventDefault()}),onFocus:(0,o.M)(e.onFocus,()=>p.onItemFocus(m)),onKeyDown:(0,o.M)(e.onKeyDown,e=>{if("Tab"===e.key&&e.shiftKey){p.onItemShiftTab();return}if(e.target!==e.currentTarget)return;let t=function(e,t,n){var r;let o=(r=e.key,"rtl"!==n?r:"ArrowLeft"===r?"ArrowRight":"ArrowRight"===r?"ArrowLeft":r);if(!("vertical"===t&&["ArrowLeft","ArrowRight"].includes(o))&&!("horizontal"===t&&["ArrowUp","ArrowDown"].includes(o)))return A[o]}(e,p.orientation,p.dir);if(void 0!==t){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();let o=b().filter(e=>e.focusable),a=o.map(e=>e.ref.current);if("last"===t)a.reverse();else if("prev"===t||"next"===t){var n,r;"prev"===t&&a.reverse();let o=a.indexOf(e.currentTarget);a=p.loop?(n=a,r=o+1,n.map((e,t)=>n[(r+t)%n.length])):a.slice(o+1)}setTimeout(()=>C(a))}})})})});E.displayName=R;var A={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function C(e,t=!1){let n=document.activeElement;for(let r of e)if(r===n||(r.focus({preventScroll:t}),document.activeElement!==n))return}var D=n(51868),F="Tabs",[j,O]=(0,a.b)(F,[h]),_=h(),[P,S]=j(F),U=r.forwardRef((e,t)=>{let{__scopeTabs:n,value:r,onValueChange:o,defaultValue:a,orientation:i="horizontal",dir:u,activationMode:d="automatic",...p}=e,v=(0,m.gm)(u),[b,w]=(0,f.T)({prop:r,onChange:o,defaultProp:a});return(0,s.jsx)(P,{scope:n,baseId:(0,l.M)(),value:b,onValueChange:w,orientation:i,dir:v,activationMode:d,children:(0,s.jsx)(c.WV.div,{dir:v,"data-orientation":i,...p,ref:t})})});U.displayName=F;var L="TabsList",V=r.forwardRef((e,t)=>{let{__scopeTabs:n,loop:r=!0,...o}=e,a=S(L,n),i=_(n);return(0,s.jsx)(I,{asChild:!0,...i,orientation:a.orientation,dir:a.dir,loop:r,children:(0,s.jsx)(c.WV.div,{role:"tablist","aria-orientation":a.orientation,...o,ref:t})})});V.displayName=L;var k="TabsTrigger",W=r.forwardRef((e,t)=>{let{__scopeTabs:n,value:r,disabled:a=!1,...i}=e,u=S(k,n),l=_(n),d=z(u.baseId,r),f=G(u.baseId,r),m=r===u.value;return(0,s.jsx)(E,{asChild:!0,...l,focusable:!a,active:m,children:(0,s.jsx)(c.WV.button,{type:"button",role:"tab","aria-selected":m,"aria-controls":f,"data-state":m?"active":"inactive","data-disabled":a?"":void 0,disabled:a,id:d,...i,ref:t,onMouseDown:(0,o.M)(e.onMouseDown,e=>{a||0!==e.button||!1!==e.ctrlKey?e.preventDefault():u.onValueChange(r)}),onKeyDown:(0,o.M)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&u.onValueChange(r)}),onFocus:(0,o.M)(e.onFocus,()=>{let e="manual"!==u.activationMode;m||a||!e||u.onValueChange(r)})})})});W.displayName=k;var K="TabsContent",$=r.forwardRef((e,t)=>{let{__scopeTabs:n,value:o,forceMount:a,children:i,...u}=e,l=S(K,n),d=z(l.baseId,o),f=G(l.baseId,o),m=o===l.value,p=r.useRef(m);return r.useEffect(()=>{let e=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,s.jsx)(D.z,{present:a||m,children:({present:n})=>(0,s.jsx)(c.WV.div,{"data-state":m?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":d,hidden:!n,id:f,tabIndex:0,...u,ref:t,style:{...e.style,animationDuration:p.current?"0s":void 0},children:n&&i})})});function z(e,t){return`${e}-trigger-${t}`}function G(e,t){return`${e}-content-${t}`}$.displayName=K;var B=U,q=V,H=W,Y=$}}]);