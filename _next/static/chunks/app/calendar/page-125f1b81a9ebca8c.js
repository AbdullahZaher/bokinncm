(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[329],{10984:function(e,t,r){Promise.resolve().then(r.bind(r,14770))},14770:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return O}});var n=r(9268),a=r(86006),s=r(80735),i=r(65326),o=r.n(i);r(64458);var l=r(51597),c=r(68569),d=r(25428),u=r(50168),f=r(21898),m=r(72324),h=r(36092),p=r(31211),g=r(61567),x=r(81466),b=r(99154),v=r(31859);async function y(e){try{let t=encodeURIComponent(e),r=await fetch("/api/calendar-proxy?url=".concat(t));if(!r.ok)throw Error("HTTP error! status: ".concat(r.status));let n=await r.text();console.log("iCal Data:",n);let a=function(e){let t=[],r=e.split("\n"),n=null;for(let e of r)if((e=e.trim()).startsWith("BEGIN:VEVENT"))n={};else if(e.startsWith("END:VEVENT")&&n){if(n.dtstart&&n.dtend)try{let e={title:n.summary||"Booking.com Reservation",start:new Date(n.dtstart),end:new Date(n.dtend),source:"booking.com",resourceId:"booking"};isNaN(e.start.getTime())||isNaN(e.end.getTime())||t.push(e)}catch(e){console.error("Error parsing event dates:",e)}n=null}else if(n)try{if(e.startsWith("SUMMARY:"))n.summary=e.substring(8);else if(e.startsWith("DTSTART")){let t=e.split(":")[1];n.dtstart=N(t)}else if(e.startsWith("DTEND")){let t=e.split(":")[1];n.dtend=N(t)}}catch(t){console.error("Error parsing line:",e,t)}return t}(n);return console.log("Parsed Events:",a),a}catch(e){return console.error("Error fetching iCal events:",e),[]}}function N(e){try{if((e=e.trim()).includes("T")){let t=e.substring(0,4),r=e.substring(4,6),n=e.substring(6,8),a=e.substring(9,11),s=e.substring(11,13),i=e.substring(13,15);return"".concat(t,"-").concat(r,"-").concat(n,"T").concat(a,":").concat(s,":").concat(i,"Z")}{let t=e.substring(0,4),r=e.substring(4,6),n=e.substring(6,8);return"".concat(t,"-").concat(r,"-").concat(n,"T00:00:00Z")}}catch(t){throw console.error("Error formatting date:",e,t),t}}var j=r(60751),w=r.n(j);o().locale("en-GB");let k=(0,s.Zt)(o()),I=new Map,T={"bokinn.app":"#8b5cf6",booking:"#10b981",airbnb:"#ef4444",expedia:"#f59e0b",default:"#6b7280"},C=e=>{let{title:t,value:r,icon:a}=e;return(0,n.jsx)(l.Zb,{className:"hover:shadow-lg transition-shadow",children:(0,n.jsx)(l.aY,{className:"p-6",children:(0,n.jsxs)("div",{className:"flex items-center justify-between",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("p",{className:"text-sm text-muted-foreground mb-1",children:t}),(0,n.jsx)("p",{className:"text-3xl font-bold",children:r})]}),(0,n.jsx)("div",{className:"h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center",children:(0,n.jsx)(a,{className:"h-6 w-6 text-primary"})})]})})})},S=()=>(0,n.jsxs)(l.Zb,{className:"hover:shadow-md transition-shadow",children:[(0,n.jsx)("div",{className:"p-4 border-b",children:(0,n.jsxs)("h3",{className:"text-sm font-medium flex items-center gap-2",children:[(0,n.jsx)(u.Z,{className:"h-4 w-4"}),"Booking Sources"]})}),(0,n.jsx)("div",{className:"p-4 space-y-3",children:Object.entries(T).map(e=>{let[t,r]=e;return"default"!==t&&(0,n.jsxs)("div",{className:"flex items-center gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors",children:[(0,n.jsx)("div",{className:"w-3 h-3 rounded-full ring-2 ring-offset-2 group-hover:ring-offset-4 transition-all ring-[".concat(r,"]"),style:{backgroundColor:r}}),(0,n.jsx)("span",{className:"text-sm capitalize",children:t})]},t)})})]}),E=e=>{let{onView:t,onNavigate:r,label:a}=e;return(0,n.jsxs)("div",{className:"flex items-center justify-between mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4",children:[(0,n.jsxs)("div",{className:"flex items-center gap-2",children:[(0,n.jsx)(c.z,{variant:"outline",size:"icon",onClick:()=>r("PREV"),children:(0,n.jsx)(f.Z,{className:"h-4 w-4"})}),(0,n.jsx)(c.z,{variant:"outline",size:"sm",onClick:()=>r("TODAY"),children:"Today"}),(0,n.jsx)(c.z,{variant:"outline",size:"icon",onClick:()=>r("NEXT"),children:(0,n.jsx)(m.Z,{className:"h-4 w-4"})}),(0,n.jsx)("span",{className:"text-lg font-semibold ml-4",children:a})]}),(0,n.jsx)(d.mQ,{defaultValue:"month",className:"w-[300px]",children:(0,n.jsxs)(d.dr,{className:"grid w-full grid-cols-3",children:[(0,n.jsx)(d.SP,{value:"month",onClick:()=>t("month"),children:"Month"}),(0,n.jsx)(d.SP,{value:"week",onClick:()=>t("week"),children:"Week"}),(0,n.jsx)(d.SP,{value:"day",onClick:()=>t("day"),children:"Day"})]})})]})};function O(){let[e,t]=(0,a.useState)(new Date),[r,i]=(0,a.useState)("month"),[o,d]=(0,a.useState)([]),[f,m]=(0,a.useState)(!0),[N,j]=(0,a.useState)(null),{toast:O}=(0,v.pm)(),D=(0,a.useCallback)(e=>{try{let t=new(w()).XMLParser({ignoreAttributes:!1,attributeNamePrefix:"",parseAttributeValue:!0});return t.parse(e)}catch(e){return console.error("XML parsing error:",e),null}},[]);(0,a.useCallback)(async e=>{let t;let r=I.get(e);if(r&&Date.now()-r.timestamp<3e5)return r.events;let n=await fetch("/api/calendar?url=".concat(encodeURIComponent(e)));if(!n.ok)throw Error("HTTP error! status: ".concat(n.status));let a=await n.text(),s=a.trim().startsWith("<?xml")||a.trim().startsWith("<");return t=s?D(a):JSON.parse(a),I.set(e,{events:t,timestamp:Date.now()}),t},[D]);let _=(0,a.useCallback)(async()=>{m(!0),j(null);try{let{data:e,error:t}=await b.O.from("rooms").select("*").not("calendar_url","is",null);if(t)throw t;let{data:r,error:n}=await b.O.from("channel_connections").select("*").eq("status","connected");if(n)throw n;let a=await Promise.all((e||[]).map(async e=>{try{if(!e.calendar_url)return[];let t=await y(e.calendar_url);return t.map(t=>({...t,title:"".concat(e.name," - ").concat(t.title),resourceId:e.id,source:"bokinn.app",color:T["bokinn.app"]}))}catch(t){return console.error("Error fetching calendar for room ".concat(e.name,":"),t),[]}})),s=await Promise.all((r||[]).map(async e=>{try{if(!e.calendar_url)return[];let t=await y(e.calendar_url);return t.map(t=>({...t,title:"".concat(e.room_name," - ").concat(t.title),resourceId:e.room_name,color:T[e.channel_name.toLowerCase()]||T.default}))}catch(t){return console.error("Error fetching calendar for ".concat(e.channel_name,":"),t),[]}})),i=[...a.flat(),...s.flat()];console.log("Calendar Events:",i),d(i)}catch(e){console.error("Error fetching calendar data:",e),j("Failed to load calendar data"),O({title:"Calendar sync error",description:"Failed to sync calendar data",variant:"destructive"})}finally{m(!1)}},[]);(0,a.useEffect)(()=>{_();let e=b.O.channel("calendar_changes").on("postgres_changes",{event:"*",schema:"public",table:"reservations"},()=>_()).subscribe(),t=setInterval(_,3e5);return()=>{b.O.removeChannel(e),clearInterval(t)}},[_]);let A=(0,a.useCallback)(()=>{let e=new Date,t=o.filter(t=>new Date(t.start).getMonth()===e.getMonth());return{totalEvents:o.length,thisMonth:t.length,bokinnApp:o.filter(e=>"bokinn.app"===e.source).length,external:o.filter(e=>"bokinn.app"!==e.source).length}},[o]);if(f)return(0,n.jsx)("div",{className:"flex items-center justify-center h-[600px]",children:(0,n.jsxs)("div",{className:"text-center",children:[(0,n.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"}),(0,n.jsx)("p",{className:"text-gray-600",children:"Loading calendar data..."})]})});let M=A();return(0,n.jsxs)("div",{className:"space-y-8 p-8 max-w-[1600px] mx-auto",children:[(0,n.jsxs)("div",{className:"flex items-center justify-between",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("h1",{className:"text-3xl font-bold",children:"Reservation Calendar"}),(0,n.jsx)("p",{className:"text-muted-foreground mt-1",children:"Manage all your bookings in one place"})]}),(0,n.jsxs)(c.z,{onClick:_,className:"flex items-center gap-2",children:[(0,n.jsx)(h.Z,{className:"h-4 w-4"}),"Sync Calendar"]})]}),(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[(0,n.jsx)(C,{title:"Total Reservations",value:M.totalEvents,icon:p.Z}),(0,n.jsx)(C,{title:"This Month",value:M.thisMonth,icon:g.Z}),(0,n.jsx)(C,{title:"Bokinn.app",value:M.bokinnApp,icon:x.Z}),(0,n.jsx)(C,{title:"Channel Bookings",value:M.external,icon:u.Z})]}),(0,n.jsx)(l.Zb,{className:"overflow-hidden",children:(0,n.jsx)(l.aY,{className:"p-6",children:(0,n.jsxs)("div",{className:"flex flex-col lg:flex-row gap-6",children:[(0,n.jsx)("div",{className:"flex-1",children:(0,n.jsx)(s.f,{localizer:k,events:o,startAccessor:"start",endAccessor:"end",style:{height:"700px"},views:["month","week","day"],defaultView:"month",components:{toolbar:E},eventPropGetter:e=>({style:{backgroundColor:e.color||T.default,borderRadius:"6px",border:"none",padding:"2px 6px"}})})}),(0,n.jsxs)("div",{className:"w-full lg:w-72 space-y-6",children:[(0,n.jsx)(S,{}),N&&(0,n.jsx)(l.Zb,{className:"border-red-200 bg-red-50",children:(0,n.jsx)(l.aY,{className:"p-4",children:(0,n.jsx)("p",{className:"text-red-600 text-sm",children:N})})})]})]})})})]})}},68569:function(e,t,r){"use strict";r.d(t,{d:function(){return l},z:function(){return c}});var n=r(9268),a=r(86006),s=r(1095),i=r(78917),o=r(26602);let l=(0,i.j)("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=a.forwardRef((e,t)=>{let{className:r,variant:a,size:i,asChild:c=!1,...d}=e,u=c?s.g7:"button";return(0,n.jsx)(u,{className:(0,o.cn)(l({variant:a,size:i,className:r})),ref:t,...d})});c.displayName="Button"},51597:function(e,t,r){"use strict";r.d(t,{Ol:function(){return o},Zb:function(){return i},aY:function(){return d},eW:function(){return u},ll:function(){return l}});var n=r(9268),a=r(86006),s=r(26602);let i=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",r),...a})});i.displayName="Card";let o=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",r),...a})});o.displayName="CardHeader";let l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("h3",{ref:t,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",r),...a})});l.displayName="CardTitle";let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("p",{ref:t,className:(0,s.cn)("text-sm text-muted-foreground",r),...a})});c.displayName="CardDescription";let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("p-6 pt-0",r),...a})});d.displayName="CardContent";let u=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)("div",{ref:t,className:(0,s.cn)("flex items-center p-6 pt-0",r),...a})});u.displayName="CardFooter"},25428:function(e,t,r){"use strict";r.d(t,{SP:function(){return c},dr:function(){return l},mQ:function(){return o},nU:function(){return d}});var n=r(9268),a=r(86006),s=r(76069),i=r(26602);let o=s.fC,l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)(s.aV,{ref:t,className:(0,i.cn)("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",r),...a})});l.displayName=s.aV.displayName;let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)(s.xz,{ref:t,className:(0,i.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",r),...a})});c.displayName=s.xz.displayName;let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,n.jsx)(s.VY,{ref:t,className:(0,i.cn)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",r),...a})});d.displayName=s.VY.displayName},31859:function(e,t,r){"use strict";r.d(t,{pm:function(){return f}});var n=r(86006);let a=0,s=new Map,i=e=>{if(s.has(e))return;let t=setTimeout(()=>{s.delete(e),d({type:"REMOVE_TOAST",toastId:e})},2e3);s.set(e,t)},o=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?i(r):e.toasts.forEach(e=>{i(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},l=[],c={toasts:[]};function d(e){c=o(c,e),l.forEach(e=>{e(c)})}function u(e){let{...t}=e,r=(a=(a+1)%Number.MAX_VALUE).toString(),n=()=>d({type:"DISMISS_TOAST",toastId:r});return d({type:"ADD_TOAST",toast:{...t,id:r,open:!0,onOpenChange:e=>{e||n()}}}),{id:r,dismiss:n,update:e=>d({type:"UPDATE_TOAST",toast:{...e,id:r}})}}function f(){let[e,t]=n.useState(c);return n.useEffect(()=>(l.push(t),()=>{let e=l.indexOf(t);e>-1&&l.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>d({type:"DISMISS_TOAST",toastId:e})}}},99154:function(e,t,r){"use strict";r.d(t,{O:function(){return a}});var n=r(88325);let a=(0,n.eI)("https://sezwmumuobqanzhvkxhl.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlendtdW11b2JxYW56aHZreGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MzExODIsImV4cCI6MjA0ODMwNzE4Mn0.BDU6PpDeCeOlYkVN3BLygPL4JBy1awPW7AD5LFIKqlg",{auth:{persistSession:!0,autoRefreshToken:!0,storageKey:"bokinn-auth",storage:{getItem:e=>localStorage.getItem(e),setItem:(e,t)=>{localStorage.setItem(e,t)},removeItem:e=>{localStorage.removeItem(e)}}}})},26602:function(e,t,r){"use strict";r.d(t,{cn:function(){return s}});var n=r(89791),a=r(20293);function s(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,a.m)((0,n.W)(t))}}},function(e){e.O(0,[243,534,222,795,639,69,963,283,667,488,744],function(){return e(e.s=10984)}),_N_E=e.O()}]);