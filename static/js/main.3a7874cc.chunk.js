(this["webpackJsonpautomata-simulator"]=this["webpackJsonpautomata-simulator"]||[]).push([[0],{11:function(t,a,e){t.exports=e(20)},16:function(t,a,e){},17:function(t,a,e){},18:function(t,a,e){},20:function(t,a,e){"use strict";e.r(a);var n=e(0),r=e.n(n),i=e(9),o=e.n(i),s=(e(16),e(3)),c=e(4),u=e(5),l=e(2),h=e(6),p=(e(17),function(t){function a(){var t,e;Object(s.a)(this,a);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(e=Object(u.a)(this,(t=Object(l.a)(a)).call.apply(t,[this].concat(r)))).automata=["DFA","NFA","Turing Machine"],e.changeAutomata=function(t){return e.props.onAutomataChange(t)},e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"render",value:function(){var t=this;return r.a.createElement("nav",{className:"navbar"},r.a.createElement("a",{href:"/",className:"navbar-brand"},"Automata Simulator"),r.a.createElement("div",{className:"navbar-list"},this.automata.map((function(a){return r.a.createElement("button",{key:a,className:t.props.activeAutomata===a?"navbar-item active":"navbar-item",onClick:function(){t.changeAutomata(a)}},a)}))),r.a.createElement("div",{id:"github"},r.a.createElement("a",{href:"https://github.com/bhatushar/automata-simulator",className:"navbar-item"},"GitHub Repository")))}}]),a}(n.Component)),m=e(7),f=Object.freeze({state:"#a83420",initialState:"#380000",acceptedState:"#076e00",nodeBorder:"#2d92ba",link:"#D3D3D3",linkLabelBackground:"#20201F",text:"#ffffff",walked:"#1d53ff"}),d=function(){function t(a){var e=this;Object(s.a)(this,t),this.initialState=void 0,this.states=void 0,this.acceptedStates=void 0;var n=/^[a-zA-Z0-9]+$/,r=a.states.split("\n").filter((function(t){return n.test(t)}));this.initialState=r[0],this.states=new Set(r),this.acceptedStates=new Set(a.acceptedStates.split("\n").filter((function(t){return e.states.has(t)})))}return Object(c.a)(t,[{key:"getGraphData",value:function(){var t=this,a={nodeDataArray:[],linkDataArray:[]};return this.states.forEach((function(e){var n={key:e,color:f.state};e===t.initialState&&(n.color=f.initialState),t.acceptedStates.has(e)&&(n.color=f.acceptedState),a.nodeDataArray.push(n)})),a}}]),t}(),v=function(t){function a(t){var e;Object(s.a)(this,a),(e=Object(u.a)(this,Object(l.a)(a).call(this,t))).transitions=void 0;var n=/^\s*([a-zA-Z0-9]+)\s*,\s*([a-zA-Z0-9]+)\s*=\s*([a-zA-Z0-9]+)\s*$/;return e.transitions={},e.states.forEach((function(t){return e.transitions[t]={}})),t.transitions.split("\n").forEach((function(t){var a=t.match(n);if(a){var r=a[1],i=a[2],o=a[3];e.states.has(r)&&e.states.has(o)&&(e.transitions[r][i]=o)}})),e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"getGraphData",value:function(){var t=Object(m.a)(Object(l.a)(a.prototype),"getGraphData",this).call(this);for(var e in this.transitions)for(var n in this.transitions[e])t.linkDataArray.push({from:e,to:this.transitions[e][n],label:n,key:"(".concat(e,",").concat(n,")"),color:f.link});return t}},{key:"run",value:function(t,a){for(var e,n=t.split(a),r={},i="",o=this.initialState,s=0;s<n.length;s++){var c=n[s];if(r[o]||(r[o]={}),!this.transitions[o][c]){e="Rejected";break}r[o][c]=this.transitions[o][c],i+="(".concat(o,", ").concat(c,") = ").concat(r[o][c],"\n"),o=r[o][c]}void 0===e&&(e=this.acceptedStates.has(o)?"Accepted":"Rejected"),e+="\n\nPATH WALKED:\n"+i;var u=this.getGraphData();return u.nodeDataArray.forEach((function(t){r[t.key]&&(t.color=f.walked)})),u.linkDataArray.forEach((function(t){r[t.from]&&r[t.from][t.label]===t.to&&(t.color=f.walked)})),{newGraph:u,result:e}}}]),a}(d),b=function(t){function a(t){var e;Object(s.a)(this,a),(e=Object(u.a)(this,Object(l.a)(a).call(this,t))).transitions=void 0;var n=new RegExp("^\\s*([a-zA-Z0-9]+)\\s*,\\s*([a-zA-Z0-9]+)\\s*=\\s*([0-9a-zA-Z]+(\\s*,\\s*[0-9a-zA-Z]+)*)\\s*$");return e.transitions={},e.states.forEach((function(t){return e.transitions[t]={}})),t.transitions.split("\n").forEach((function(t){var a=t.match(n);if(a){var r=a[1],i=a[2];if(e.states.has(r)){var o=a[3].split(",").map((function(t){return t.trim()}));o=o.filter((function(t){return e.states.has(t)})),e.transitions[r][i]=new Set(o)}}})),e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"getGraphData",value:function(){var t=this,e=Object(m.a)(Object(l.a)(a.prototype),"getGraphData",this).call(this),n=function(a){var n=function(n){t.transitions[a][n].forEach((function(t){return e.linkDataArray.push({from:a,to:t,label:n,key:"(".concat(a,",").concat(n,")/").concat(t),color:f.link})}))};for(var r in t.transitions[a])n(r)};for(var r in this.transitions)n(r);return e}},{key:"run",value:function(t,e){var n,r,i=this,o=t.split(e),s=new g,c=new k(this.initialState),u=c.getRoot();s.push(u);for(var l,h=function(){var t=u;(r=i.transitions[t.q][o[t.i]])&&r.forEach((function(a){var e=c.add(a,t.i+1,t);e.i===o.length&&i.acceptedStates.has(e.q)?n=e:s.push(e)})),(r=i.transitions[t.q][a.NULL])&&r.forEach((function(a){if(!c.existsUpward(a,t.i,t)){var e=c.add(a,t.i,t);e.i===o.length&&i.acceptedStates.has(e.q)?n=e:s.push(e)}}))};(u=s.pop())&&void 0===n;)h();var p=this.getGraphData();if(n){l="Accepted\n\nPATH WALKED:";var m,d,v={},b="";do{var A=n,y=A.q,D=A.i;if(v[y]||(v[y]={}),m){var E=D===d?a.NULL:o[D];v[y][E]||(v[y][E]=new Set),v[y][E].add(m),b="\n(".concat(y,", ").concat(E,") = ").concat(m)+b}m=y,d=D,n=n.p}while(n);l+=b,p.nodeDataArray.forEach((function(t){v[t.key]&&(t.color=f.walked)})),p.linkDataArray.forEach((function(t){v[t.from]&&v[t.from][t.label]&&v[t.from][t.label].has(t.to)&&(t.color=f.walked)}))}else l="Rejected";return{newGraph:p,result:l}}}]),a}(d);b.NULL="null";var g=function(){function t(){Object(s.a)(this,t),this.front=void 0,this.rear=void 0}return Object(c.a)(t,[{key:"push",value:function(t){var a={object:t,next:void 0};this.rear?(this.rear.next=a,this.rear=this.rear.next):this.front=this.rear=a}},{key:"pop",value:function(){if(this.front){var t=this.front;return this.front.next||(this.rear=void 0),this.front=this.front.next,t.object}}}]),t}(),k=function(){function t(a){Object(s.a)(this,t),this.root=void 0,this.root={q:a,i:0,p:void 0}}return Object(c.a)(t,[{key:"getRoot",value:function(){return this.root}},{key:"add",value:function(t,a,e){return{q:t,i:a,p:e}}},{key:"existsUpward",value:function(t,a,e){for(var n=e;n&&n.i===a;){if(n.q===t)return!0;n=n.p}return!1}}]),t}(),A=function(t){function a(t){var e;Object(s.a)(this,a),(e=Object(u.a)(this,Object(l.a)(a).call(this,t))).transitions=void 0,e.MOVE_LEFT="L",e.MOVE_RIGHT="R",e.BLANK="B";var n="^\\s*([a-zA-Z0-9]+)\\s*,\\s*([a-zA-Z0-9]+)\\s*=\\s*([a-zA-Z0-9]+)\\s*,\\s*([a-zA-Z0-9]+)"+"\\s*,\\s*(".concat(e.MOVE_LEFT,"|").concat(e.MOVE_RIGHT,")")+"\\s*$";return e.transitions={},e.states.forEach((function(t){return e.transitions[t]={}})),t.transitions.split("\n").forEach((function(t){var a=t.match(n);if(a){var r=a[1],i=a[2],o=a[3],s=a[4],c=a[5];e.states.has(r)&&e.states.has(o)&&(e.transitions[r][i]={nextState:o,output:s,direction:c})}})),e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"getGraphData",value:function(){var t=Object(m.a)(Object(l.a)(a.prototype),"getGraphData",this).call(this);for(var e in this.transitions)for(var n in this.transitions[e])t.linkDataArray.push({from:e,to:this.transitions[e][n].nextState,label:"".concat(n,"/").concat(this.transitions[e][n].output,", ").concat(this.transitions[e][n].direction),key:"(".concat(e,",").concat(n,")"),color:f.link});return t}},{key:"run",value:function(t,a){for(var e=t.split(a),n=0,r=this.initialState,i={},o="";this.transitions[r][e[n]];){var s=this.transitions[r][e[n]],c=s.nextState,u=s.output,l=s.direction;i[r]||(i[r]={});var h="".concat(e[n],"/").concat(u,", ").concat(l);i[r][h]=c,o+="(".concat(r,", ").concat(e[n],") = ").concat(c,", ").concat(u,", ").concat(l,"\n"),e[n]=u,l===this.MOVE_LEFT?0===n?e.unshift(this.BLANK):n--:(n===e.length-1&&e.push(this.BLANK),n++),r=c}i[r]||(i[r]={});var p=this.acceptedStates.has(r)?"Accepted":"Rejected";p+="\nPATH WALKED:\n"+o,p+="\nTAPE:\n"+e.join(a);var m=this.getGraphData();return m.nodeDataArray.forEach((function(t){i[t.key]&&(t.color=f.walked)})),m.linkDataArray.forEach((function(t){i[t.from]&&i[t.from][t.label]===t.to&&(t.color=f.walked)})),{newGraph:m,result:p}}}]),a}(d),y=(e(18),function(t){function a(t){var e;return Object(s.a)(this,a),(e=Object(u.a)(this,Object(l.a)(a).call(this,t))).buildAutomata=function(t){t.preventDefault();var a=e.state.automataData;switch(e.props.automataType){case"NFA":e.props.onAutomataBuild(new b(a));break;case"PDA":break;case"Turing Machine":e.props.onAutomataBuild(new A(a));break;default:e.props.onAutomataBuild(new v(a))}},e.runAutomata=function(t){t.preventDefault();var a="input"===e.state.tapeTag?"":"\n";e.props.onAutomataRun(e.state.automataData.tape,a)},e.getTransitionFormat=function(){var t="";switch(e.props.automataType){case"DFA":t="Current-state, Input = Next-state";break;case"NFA":t="Current-state, Input = Next-state [, Next-state ...]\n\nUse 'null' for null-transitions.";break;case"PDA":break;case"Turing Machine":t="Current-state, Input = Next-state, Tape-replace, L/R\n\nUse B for blank symbol."}return t},e.toggleTape=function(t){t.preventDefault();var a="input"===e.state.tapeTag?"textarea":"input";e.setState({tapeTag:a})},e.handleStatesChange=function(t){var a=e.state.automataData;a.states=t.currentTarget.value,e.setState({automataData:a})},e.handleAcceptedStatesChange=function(t){var a=e.state.automataData;a.acceptedStates=t.currentTarget.value,e.setState({automataData:a})},e.handleTransitionsChange=function(t){var a=e.state.automataData;a.transitions=t.currentTarget.value,e.setState({automataData:a})},e.handleTapeChange=function(t){var a=e.state.automataData;a.tape=t.currentTarget.value,e.setState({automataData:a})},e.state={automataData:{states:"",acceptedStates:"",transitions:"",tape:""},tapeTag:"input"},e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"render",value:function(){var t=this.state.automataData,a=t.states,e=t.acceptedStates,n=t.transitions,i=t.tape,o=this.state.tapeTag;return r.a.createElement("div",{className:"sidebar"},r.a.createElement("form",{id:"modelInitializer",onSubmit:this.buildAutomata},r.a.createElement("h1",null,"Create model"),r.a.createElement("label",{htmlFor:"states"},"States"),r.a.createElement("textarea",{id:"states",value:a,placeholder:"States should be alphanumeric (without whitespaces).\r Only enter one state per line. The first state will be the initial state.",onChange:this.handleStatesChange}),r.a.createElement("label",{htmlFor:"acceptedStates"},"Accepted States"),r.a.createElement("textarea",{id:"acceptedStates",value:e,placeholder:"Only enter one state per line.\r These states should also be mentioned in 'States' input.",onChange:this.handleAcceptedStatesChange}),r.a.createElement("label",{htmlFor:"transition"},"Transition Function"),r.a.createElement("textarea",{id:"transition",value:n,placeholder:this.getTransitionFormat(),onChange:this.handleTransitionsChange}),r.a.createElement("input",{type:"submit",id:"buildBtn",className:"btn-primary",value:"Build"})),r.a.createElement("form",{id:"modelTest",onSubmit:this.runAutomata},r.a.createElement("h1",null,"Test model"),r.a.createElement("label",{htmlFor:"tape"},"Tape input"),r.a.createElement(o,{type:"text",id:"tape",value:i,onChange:this.handleTapeChange}),r.a.createElement("button",{id:"tapeToggle",className:"btn-alt",onClick:this.toggleTape},"Switch to ","input"===this.state.tapeTag?"string":"character"," input"),r.a.createElement("input",{type:"submit",id:"runBtn",className:"btn-primary",value:"Test"})),this.props.automataResult&&r.a.createElement("section",{id:"automataResult"},r.a.createElement("h2",null,"Result"),r.a.createElement("div",{id:"resultContainer"},this.props.automataResult.split("\n").map((function(t,a){return r.a.createElement(r.a.Fragment,{key:a},t," ",r.a.createElement("br",null))})))))}}]),a}(n.Component)),D=e(1),E=e(10),j=D.GraphObject.make,S=function(t){function a(){var t,e;Object(s.a)(this,a);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(e=Object(u.a)(this,(t=Object(l.a)(a)).call.apply(t,[this].concat(r)))).createDiagram=function(){var t=j(D.Diagram,{"toolManager.mouseWheelBehavior":D.ToolManager.WheelZoom,model:j(D.GraphLinksModel,{linkKeyProperty:"key"})});return t.layout=new D.ForceDirectedLayout,t.allowDelete=!1,t.allowCopy=!1,t.nodeTemplate=j(D.Node,"Auto",j(D.Shape,"Circle",{stroke:f.nodeBorder,strokeWidth:7},new D.Binding("fill","color")),j(D.TextBlock,{margin:10,stroke:f.text,font:"16pt sans-serif"},new D.Binding("text","key"))),t.linkTemplate=j(D.Link,j(D.Shape,{strokeWidth:8},new D.Binding("stroke","color")),j(D.Shape,{toArrow:"Standard",stroke:f.link,scale:2}),j(D.Panel,"Auto",j(D.Shape,"Rectangle",{fill:f.linkLabelBackground,stroke:null}),j(D.TextBlock,{margin:5,stroke:f.text,font:"16pt sans-serif"},new D.Binding("text","label"))),{curve:D.Link.Bezier,toShortLength:8,adjusting:D.Link.Stretch,reshapable:!0}),t},e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement(E.a,{initDiagram:this.createDiagram,divClassName:"",nodeDataArray:this.props.graphData.nodeDataArray,linkDataArray:this.props.graphData.linkDataArray,skipsDiagramUpdate:!1,onModelChange:function(){}})}}]),a}(n.Component),O={automataType:"DFA",automata:void 0,graphData:{nodeDataArray:[],linkDataArray:[]},result:""},T=function(t){function a(t){var e;return Object(s.a)(this,a),(e=Object(u.a)(this,Object(l.a)(a).call(this,t))).handleAutomataChange=function(t){var a=O;a.automataType=t,e.setState(a)},e.handleAutomataBuild=function(t){return e.setState({automata:t,graphData:t.getGraphData()})},e.handleAutomataRun=function(t,a){if(e.state.automata){var n=e.state.automata.run(t,a),r=n.newGraph,i=n.result;e.setState({graphData:r,result:i})}},e.state=O,e}return Object(h.a)(a,t),Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(p,{onAutomataChange:this.handleAutomataChange,activeAutomata:this.state.automataType}),r.a.createElement(y,{automataType:this.state.automataType,onAutomataBuild:this.handleAutomataBuild,onAutomataRun:this.handleAutomataRun,automataResult:this.state.result}),r.a.createElement(S,{graphData:this.state.graphData}))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[11,1,2]]]);
//# sourceMappingURL=main.3a7874cc.chunk.js.map