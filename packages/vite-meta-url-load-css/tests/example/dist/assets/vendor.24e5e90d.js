const p={},v=[],y=document;let h=Symbol.for;const w=h("Atomico.$$");function $(s,e,...u){let n=e||p,{children:l}=n;l=l??(u.length?u:v);const t=s?s instanceof Node?1:s.prototype instanceof HTMLElement&&2:!1;return{$$:w,type:s,props:n,children:l,key:n.key,shadow:n.shadowDom,once:n.renderOnce,raw:t,is:n.is}}const E={sheet:!!document.adoptedStyleSheets,ssr:null},a={};function P(s,...e){let u=s.reduce((n,l,t)=>n+l+(e[t]||""),"");return a[u]=a[u]||M(u)}function M(s){if(E.sheet){let e=new CSSStyleSheet;return e.replaceSync(s),e}else{let e=y.createElement("style");return e.textContent=s,e}}var m=function(s,e,u,n){var l;e[0]=0;for(var t=1;t<e.length;t++){var o=e[t++],i=e[t]?(e[0]|=o?1:2,u[e[t++]]):e[++t];o===3?n[0]=i:o===4?n[1]=Object.assign(n[1]||{},i):o===5?(n[1]=n[1]||{})[e[++t]]=i:o===6?n[1][e[++t]]+=i+"":o?(l=s.apply(i,m(s,i,u,["",null])),n.push(l),i[0]?e[0]|=2:(e[t-2]=0,e[t]=l)):n.push(i)}return n},g=new Map;function b(s){var e=g.get(this);return e||(e=new Map,g.set(this,e)),(e=m(this,e.get(s)||(e.set(s,e=function(u){for(var n,l,t=1,o="",i="",c=[0],r=function(f){t===1&&(f||(o=o.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?c.push(0,f,o):t===3&&(f||o)?(c.push(3,f,o),t=2):t===2&&o==="..."&&f?c.push(4,f,0):t===2&&o&&!f?c.push(5,0,!0,o):t>=5&&((o||!f&&t===5)&&(c.push(t,0,o,l),t=6),f&&(c.push(t,f,0,l),t=6)),o=""},S=0;S<u.length;S++){S&&(t===1&&r(),r(S));for(var d=0;d<u[S].length;d++)n=u[S][d],t===1?n==="<"?(r(),c=[c],t=3):o+=n:t===4?o==="--"&&n===">"?(t=1,o=""):o=n+o[0]:i?n===i?i="":o+=n:n==='"'||n==="'"?i=n:n===">"?(r(),t=1):t&&(n==="="?(t=5,l=o,o=""):n==="/"&&(t<5||u[S][d+1]===">")?(r(),t===3&&(c=c[0]),t=c,(c=c[0]).push(2,0,t),t=0):n===" "||n==="	"||n===`
`||n==="\r"?(r(),t=2):o+=n),t===3&&o==="!--"&&(t=4,c=c[0])}return r(),c}(s)),e),arguments,[])).length>1?e:e[0]}b.bind($);export{P as c};