(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,function(e,t,n){e.exports=n(13)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),c=n(3),s=n.n(c),r=(n(11),n(1)),i=(n(12),n(4)),l=n(5),u={},f=function(){function e(t){Object(i.a)(this,e),this.front=this.parseCube(t),this.back=this.parseCube(t.slice(4))}return Object(l.a)(e,[{key:"parseCube",value:function(e){return{top:e[0],bot:e[1],left:e[2],right:e[3]}}}]),e}();u.toType=function(e){switch(e.type){case"vlx":return new f(e.data);default:return console.log("Unknown Type"),e.data}};var b=u,p=null,d={},v={boot:function(e){e=e||"localhost",console.log("connnecting to ".concat(e)),(p=new WebSocket("wss://".concat(e,":8080"))).onopen=function(e){console.log("Connected",e),Object.keys(d).forEach(function(e){v.send({type:"sub",payload:e})}),v.send({type:"start"})},p.onmessage=function(e){console.log("Message from server ",e);var t=JSON.parse(e.data),n=b.toType(t);d[t.type].forEach(function(e){e(n)})},p.onclose=function(e){console.log("WebSocket is closed now.")}},send:function(e){p?p.send(JSON.stringify(e)):console.warn("Socket not ready!")},sub:function(e,t,n){d[e]||(d[e]=new Map,v.send({type:"sub",payload:e})),d[e].set(t,n)},unsub:function(e,t){d[e]&&(d[e].delete(t),d[e].size<1&&v.send({type:"unsub",payload:e}))},stop:function(){v.send({type:"stop"})}},y=v,h=400,m=400,w=10,g=(w-1)/2;var k=function(){var e=Object(o.useState)({fx:m/2,fy:h/2,bx:m/2,by:h/2}),t=Object(r.a)(e,2),n=t[0],c=t[1],s=Object(o.useRef)(null);return Object(o.useEffect)(function(){var e=s.current.getContext("2d");e.clearRect(0,0,m,h),e.fillRect(m/2,0,1,h),e.fillRect(0,h/2,m,1),e.fillRect(n.fx-g,n.fy-g,w,w),e.fillRect(n.bx-g,n.by-g,w,w)},[s,n]),Object(o.useEffect)(function(){return y.sub("vlx","Canvas",function(e){var t=e.front,n=e.back;c({fx:200+(t.left-t.right)/1e3*m,fy:200+(t.top-t.bot)/1e3*h,bx:200+(n.left-n.right)/1e3*m,by:200+(n.top-n.bot)/1e3*h})}),function(){y.unsub("vlx","Canvas")}},[]),a.a.createElement("div",{className:"canvasBlock"},a.a.createElement("canvas",{id:"myCanvas",ref:s,width:"400",height:"400"}))};var E=function(){var e=Object(o.useState)(""),t=Object(r.a)(e,2),n=t[0],c=t[1];return a.a.createElement("div",{className:"App"},a.a.createElement("header",{className:"App-header"},a.a.createElement("input",{value:n,onChange:function(e){return c(e.target.value)}}),a.a.createElement("button",{onClick:function(){y.boot(n)}},"GO!"),a.a.createElement("button",{onClick:y.stop},"STOP!"),a.a.createElement(k,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(a.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}],[[6,1,2]]]);
//# sourceMappingURL=main.ba52c6b6.chunk.js.map