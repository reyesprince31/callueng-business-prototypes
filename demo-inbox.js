'use strict';

// shortcut: browser-local presentation inbox; replace with authenticated, organization-scoped Convex functions for real customers.
const DemoInbox = (() => {
  const KEY='callueng-demo-inbox-v1';
  const CONFIG={
    construction:{label:'Build enquiries',desk:'Design & build desk',mark:'WV',statuses:['New','Reviewing','Consultation requested','Ready for proposal','Closed'],categories:['Design & build','Plans & engineering','Renovation'],checks:['Review site information','Confirm service scope','Review design preferences','Prepare consultation questions']},
    printing:{label:'Customer requests',desk:'Blueprinting desk',mark:'BP',statuses:['New','Checking files','Awaiting revision','Ready for quote','Ready for collection','Closed'],categories:['Plan printing'],checks:['Confirm drawing revision','Confirm paper size and scale','Reconcile pages and copies','Confirm finishing and collection']},
    hardware:{label:'Service requests',desk:'Hardware & dispatch desk',mark:'CH',statuses:['New','Checking availability','Reviewing access','Ready for quote','Closed'],categories:['Materials','Equipment rental','Hauling','Combined support'],checks:['Check specifications and availability','Review location and site access','Confirm handling and equipment needs','Prepare quotation questions']}
  };
  const CHAT_STATES=['AI assisting','Needs a person','Team handling','Resolved'];
  const stamp=()=>new Date().toISOString();
  const id=()=>globalThis.crypto.randomUUID();
  function business(org){if(!Object.hasOwn(CONFIG,org))throw new Error('Choose a valid business.');return CONFIG[org];}
  function text(value,max,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error('Check the demo record fields.');return value.trim();}
  function validateRequest(org,raw){
    const config=business(org);
    if(!raw||!config.categories.includes(raw.category)||!Array.isArray(raw.fields)||raw.fields.length>20||!Array.isArray(raw.files||[])||(raw.files||[]).length>10)throw new Error('Check the request category and details.');
    const fields=raw.fields.map(pair=>{if(!Array.isArray(pair)||pair.length!==2)throw new Error('Check the request details.');return [text(pair[0],80,true),text(pair[1],1200)];});
    const files=(raw.files||[]).map(file=>{if(!Number.isInteger(file.size)||file.size<1||file.size>20971520)throw new Error('Check file metadata.');return {name:text(file.name,255,true),size:file.size};});
    const source=text(raw.source,80,true);if(!['plan.html','index.html','blueprinting.html','site-support.html'].includes(source))throw new Error('Unknown website source.');
    return {title:text(raw.title,140,true),customer:text(raw.customer||'Website visitor',100,true),category:raw.category,fields,files,source};
  }
  function seeds(){
    const rows={
      construction:[
        ['Tropical home · Antipolo','Alex Santos','Design & build','New',[['Service','Design & build'],['Location','Antipolo'],['Floor area','180 m²'],['Exterior direction','Modern tropical'],['Interior direction','Japandi'],['Priorities','Shade, natural light, built-in storage'],['Drawings','No plans yet'],['Next question','Confirm site information and service scope.']]],
        ['Bungalow plan set','Mara Cruz','Plans & engineering','Reviewing',[['Service','Plans & engineering only'],['Location','Antipolo'],['Floor area','95 m²'],['Requested deliverables','Architectural and structural scope to discuss'],['Construction','Not requested'],['Next question','Which engineering disciplines and documents are needed?']]],
        ['Occupied-home renovation','Nico Villanueva','Renovation','Consultation requested',[['Service','Renovation'],['Location','Antipolo'],['Floor area','120 m²'],['Site condition','Occupied home'],['Priorities','Keep bedrooms usable; improve kitchen daylight'],['Next question','What can remain in use during the work?']]]
      ],
      printing:[
        ['Structural set · revision B','Sam Rivera','Plan printing','Checking files',[['Job reference','Sample structural set'],['Customer role','Engineer'],['Drawing revision','Revision B'],['Paper size','A1'],['Colour','Black & white'],['Scale','100% / actual size'],['Drawing pages','12'],['Sets','3'],['Printed sheets','36'],['Finishing','Rolled sets'],['Fulfilment','Pickup'],['Requested date','To confirm with shop']]],
        ['Architectural drawings · revised issue','Luis Mendoza','Plan printing','Awaiting revision',[['Job reference','Sample architectural issue'],['Customer role','Architect'],['Drawing revision','Needs customer confirmation'],['Paper size','A2'],['Colour','Colour'],['Scale','Confirm scale before printing'],['Drawing pages','8'],['Sets','2'],['Printed sheets','16'],['Finishing','Folded sets'],['Fulfilment','Pickup']]],
        ['A3 copies · delivery enquiry','Ana Reyes','Plan printing','New',[['Job reference','Sample permit copies'],['Customer role','Property owner'],['Drawing revision','Revision A'],['Paper size','A3'],['Colour','Black & white'],['Drawing pages','6'],['Sets','4'],['Printed sheets','24'],['Finishing','Loose sheets'],['Fulfilment','Delivery'],['Delivery area','Antipolo']]]
      ],
      hardware:[
        ['Hauling only · access review','Kai Ramos','Hauling','Reviewing access',[['Requested service','Hauling only'],['Pickup area','Antipolo'],['Destination area','To confirm'],['Load','Approximate volume and material type needed'],['Site access','Narrow access road; vehicle suitability to discuss'],['Timing','Requested schedule to confirm']]],
        ['Equipment · three-day rental','Bea Torres','Equipment rental','Checking availability',[['Requested service','Equipment rental only'],['Equipment','Concrete mixer · sample request'],['Duration','3 days'],['Site area','Antipolo'],['Operator','Needs confirmation'],['Delivery / collection','To discuss']]],
        ['Materials list · availability enquiry','Jo Fernandez','Materials','New',[['Requested service','Materials only'],['Items','Cement, reinforcement bars and sand · sample list'],['Quantities','Customer to provide measured quantities'],['Specifications','Grades and sizes to confirm'],['Delivery area','Antipolo'],['Timing','To discuss']]]
      ]
    };
    const chats={
      construction:[['I want a breezy tropical home, but a calmer interior.','We can pair a tropical exterior with a Japandi interior. What matters most in daily use?'],['Natural light and storage. We have no plans yet.','I will include those preferences in your first brief. The team needs to confirm site information, floor area and service scope.'],['Can someone discuss the next step with us?','Your demo conversation is marked for a person to review. A consultation still needs team confirmation.']],
      printing:[['Can you print an A1 structural set, three copies?','Yes, we can prepare the print-request specification in this demo. How many drawing pages and which revision?'],['12 pages, revision B. Please keep it at actual size.','That is 36 printed sheets. Confirm the PDF page size and intended print scale with the shop before production.'],['Could the team check whether the PDF is ready?','I have marked this demo conversation for a person to review the revision, paper size and scale.']],
      hardware:[['We only need hauling. We are not building with the construction business.','You can request hauling directly from this business. Which pickup and destination areas are involved?'],['Antipolo pickup, but the access road is narrow.','The team should check the route, load, access and suitable vehicle before confirming availability or price.'],['Can a person review the access?','This demo conversation is flagged for a person. Add the access details to the hauling request for review.']]
    };
    const state={version:1,orgs:{}};
    for(const [org,requests] of Object.entries(rows)){
      const source={construction:'plan.html',printing:'blueprinting.html',hardware:'site-support.html'}[org];
      state.orgs[org]={requests:requests.map(([title,customer,category,status,fields],index)=>({id:`sample-${org}-${index}`,title,customer,category,status,fields,source,origin:'sample',submitted:stamp(),notes:'',checks:[],files:org==='printing'&&index===0?[{name:'sample-structural-revision-B.pdf',size:2457600}]:[]})),conversations:[]};
      const messages=chats[org].flatMap(([visitor,assistant])=>[{role:'visitor',text:visitor,at:stamp()},{role:'assistant',text:assistant,at:stamp()}]);
      state.orgs[org].conversations.push({id:`sample-chat-${org}`,customer:requests[0][1],status:'Needs a person',origin:'sample',source,requestId:`sample-${org}-0`,messages,updated:stamp()});
      state.orgs[org].conversations.push({id:`sample-chat-${org}-2`,customer:requests[1][1],status:'AI assisting',origin:'sample',source,requestId:`sample-${org}-1`,messages:[{role:'visitor',text:org==='printing'?'Should I send the revised PDF before requesting a quote?':org==='hardware'?'What details help with an equipment rental enquiry?':'Can I request plans without construction?',at:stamp()},{role:'assistant',text:org==='printing'?'Prepare the intended revision, size, scale, page count and sets. The shop confirms a quote after review.':org==='hardware'?'Include equipment type, duration, site area, access and operator needs. Availability needs provider confirmation.':'Yes. Describe the plan set and engineering disciplines you need. Construction is a separate scope decision.',at:stamp()}],updated:stamp()});
    }
    return state;
  }
  function validateState(raw){
    if(raw?.version!==1)throw new Error('Unsupported saved inbox.');
    for(const org of Object.keys(CONFIG)){
      const data=raw.orgs?.[org];if(!data||!Array.isArray(data.requests)||data.requests.length>40||!Array.isArray(data.conversations)||data.conversations.length>20)throw new Error('Invalid saved inbox.');
      const ids=new Set();
      for(const request of data.requests){validateRequest(org,request);if(ids.has(request.id)||typeof request.id!=='string'||! /^[a-zA-Z0-9_-]{1,100}$/.test(request.id)||!CONFIG[org].statuses.includes(request.status)||!['sample','website'].includes(request.origin)||!Array.isArray(request.checks)||request.checks.some(check=>!CONFIG[org].checks.includes(check))||typeof request.notes!=='string'||request.notes.length>2500||!Number.isFinite(Date.parse(request.submitted)))throw new Error('Invalid saved request.');ids.add(request.id);}
      ids.clear();
      for(const chat of data.conversations){if(ids.has(chat.id)||typeof chat.id!=='string'||! /^[a-zA-Z0-9_-]{1,100}$/.test(chat.id)||!CHAT_STATES.includes(chat.status)||!['sample','website'].includes(chat.origin)||!Array.isArray(chat.messages)||chat.messages.length>30||typeof chat.requestId!=='string'||(chat.requestId&&!data.requests.some(r=>r.id===chat.requestId))||!Number.isFinite(Date.parse(chat.updated)))throw new Error('Invalid conversation.');text(chat.customer,100,true);for(const message of chat.messages){if(!['visitor','assistant','team'].includes(message.role)||!Number.isFinite(Date.parse(message.at)))throw new Error('Invalid message.');text(message.text,1600,true);}ids.add(chat.id);}
    }
    return raw;
  }
  function read(storage=localStorage){const raw=storage.getItem(KEY);return raw?validateState(JSON.parse(raw)):seeds();}
  function write(state,storage=localStorage){validateState(state);storage.setItem(KEY,JSON.stringify(state));if(typeof window!=='undefined')window.dispatchEvent(new Event('demo-inbox-change'));}
  function find(state,org,kind,recordId){business(org);if(!['requests','conversations'].includes(kind))throw new Error('Unknown inbox record.');const row=state.orgs[org][kind].find(item=>item.id===recordId);if(!row)throw new Error('Record not found in this business.');return row;}
  function submitRequest(org,raw,storage){const value=validateRequest(org,raw),state=read(storage);if(state.orgs[org].requests.length>=40)throw new Error('This demo holds 40 requests per business. Reset the demo inbox to try more.');const record={...value,id:id(),status:'New',origin:'website',submitted:stamp(),notes:'',checks:[]};state.orgs[org].requests.unshift(record);if(raw.conversationId)find(state,org,'conversations',raw.conversationId).requestId=record.id;write(state,storage);return record;}
  function reviewRequest(org,recordId,values,storage){const state=read(storage),record=find(state,org,'requests',recordId);if(!CONFIG[org].statuses.includes(values.status)||!Array.isArray(values.checks)||values.checks.some(check=>!CONFIG[org].checks.includes(check)))throw new Error('Check the review status and checklist.');Object.assign(record,{status:values.status,checks:values.checks,notes:text(values.notes,2500)});write(state,storage);return record;}
  function recordChat(org,conversationId,question,answer,storage){business(org);const state=read(storage);let chat=conversationId?find(state,org,'conversations',conversationId):null;if(!chat){if(state.orgs[org].conversations.length>=20)throw new Error('This demo holds 20 conversations per business. Reset the demo inbox to try more.');chat={id:id(),customer:'Website visitor',status:'AI assisting',origin:'website',source:{construction:'index.html',printing:'blueprinting.html',hardware:'site-support.html'}[org],requestId:'',messages:[],updated:stamp()};state.orgs[org].conversations.unshift(chat);}
    chat.messages.push({role:'visitor',text:text(question,600,true),at:stamp()});if(answer&&chat.status!=='Team handling')chat.messages.push({role:'assistant',text:text(answer,1600,true),at:stamp()});chat.messages=chat.messages.slice(-30);if(/person|human|team|quote|price|check.*file/i.test(question)&&chat.status!=='Team handling')chat.status='Needs a person';chat.updated=stamp();write(state,storage);return chat;
  }
  function updateConversation(org,recordId,status,requestId,storage){const state=read(storage),chat=find(state,org,'conversations',recordId);if(!CHAT_STATES.includes(status))throw new Error('Choose a valid conversation status.');if(requestId)find(state,org,'requests',requestId);Object.assign(chat,{status,requestId,updated:stamp()});write(state,storage);return chat;}
  function teamReply(org,recordId,message,storage){const state=read(storage),chat=find(state,org,'conversations',recordId);chat.messages.push({role:'team',text:text(message,1600,true),at:stamp()});chat.messages=chat.messages.slice(-30);chat.status='Team handling';chat.updated=stamp();write(state,storage);return chat;}
  function current(org){try{const recordId=sessionStorage.getItem('callueng-chat-'+org);return recordId?find(read(),org,'conversations',recordId):null;}catch{return null;}}
  function websiteChat(org,question,answer){const chat=recordChat(org,current(org)?.id,question,answer);sessionStorage.setItem('callueng-chat-'+org,chat.id);return chat;}
  function receipt(element,org,record){element.textContent='Sent to this browser’s demo inbox. Nothing was sent to the business. ';const link=document.createElement('a');link.href=`backoffice.html?workspace=${org}&request=${encodeURIComponent(record.id)}#requests`;link.textContent='Open the submitted request →';link.className='text-link';element.append(link);element.hidden=false;}
  return {KEY,CONFIG,CHAT_STATES,seeds,validateState,read,find,submitRequest,reviewRequest,recordChat,updateConversation,teamReply,current,websiteChat,receipt};
})();
if(typeof module!=='undefined')module.exports=DemoInbox;
if(typeof window!=='undefined')window.CalluengDemoInbox=DemoInbox;

if(typeof document!=='undefined'&&document.body.dataset.entity){
  const org=document.body.dataset.entity==='printing'?'printing':'hardware',config=DemoInbox.CONFIG[org];
  const launcher=document.createElement('button');launcher.type='button';launcher.className='assistant-launch';launcher.id='service-chat-launch';launcher.setAttribute('aria-controls','service-chat');launcher.setAttribute('aria-expanded','false');launcher.textContent=org==='printing'?'Ask the print desk':'Ask about site support';
  const panel=document.createElement('div');panel.className='chat-panel';panel.id='service-chat';panel.setAttribute('popover','auto');panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','service-chat-title');
  panel.innerHTML=`<div class="chat-header"><div><span class="tag">AI chat prototype</span><h2 id="service-chat-title">${org==='printing'?'A clearer print request.':'The support you need.'}</h2></div><button class="icon-button" type="button" id="service-chat-close" aria-label="Close service assistant">×</button></div><div class="chat-log" id="service-chat-log" role="log" aria-live="polite"></div><div class="chat-suggestions"><button type="button" id="service-chat-prompt">${org==='printing'?'Help me prepare A1 plan copies':'I only need hauling'}</button></div><form class="assistant-form" id="service-chat-form"><label for="service-chat-input" class="sr-only">Ask this business assistant</label><div class="assistant-compose"><textarea id="service-chat-input" rows="2" required maxlength="600" placeholder="${org==='printing'?'Paper size, scale, copies…':'Materials, equipment, or hauling…'}"></textarea><button class="icon-button" type="submit" aria-label="Send to service demo assistant">↗</button></div><p>Preset replies. History appears in the demo backoffice in this browser. No live AI or message delivery.</p><p id="service-chat-status" role="status"></p></form>`;
  document.body.append(launcher,panel);
  const field=panel.querySelector('textarea'),log=panel.querySelector('#service-chat-log');
  const refresh=()=>{log.replaceChildren();const chat=DemoInbox.current(org);const messages=chat?.messages||[{role:'assistant',text:org==='printing'?'Tell me your drawing size, revision, pages and copies. I can help prepare the specification for shop review.':'Choose just materials, rentals or hauling. I can help identify the details this business needs.'}];for(const item of messages){const article=document.createElement('article');article.className='assistant-message'+(item.role==='visitor'?' own':'');const author=document.createElement('strong');author.textContent={visitor:'You',assistant:config.desk,team:'Team · demo reply'}[item.role];const copy=document.createElement('p');copy.textContent=item.text;article.append(author,copy);log.append(article);}log.scrollTop=log.scrollHeight;};
  const native=typeof panel.showPopover==='function';if(!native){panel.removeAttribute('popover');panel.hidden=true;panel.classList.add('chat-fallback');}
  const close=()=>{if(native&&panel.matches(':popover-open'))panel.hidePopover();else if(!native)panel.hidden=true;launcher.setAttribute('aria-expanded','false');};
  launcher.addEventListener('click',()=>{if(launcher.getAttribute('aria-expanded')==='true'){close();return;}refresh();if(native)panel.showPopover();else panel.hidden=false;launcher.setAttribute('aria-expanded','true');field.focus();});
  panel.querySelector('#service-chat-close').addEventListener('click',close);if(native)panel.addEventListener('toggle',event=>launcher.setAttribute('aria-expanded',String(event.newState==='open')));
  const send=question=>{const answer=org==='printing'?(/scale|size|actual/i.test(question)?'Confirm PDF page size and intended print scale with the shop. Do not scale to fit without approval. Include paper size, page count, sets and revision in your print request.':'Prepare the final PDF, revision, paper size, colour, scale, pages, sets and finishing. The shop confirms quality, price and collection timing after review.'):'Include the service, specifications or load, quantities or duration, city, timing and site access. This business confirms availability, equipment suitability, route and pricing after review.';try{DemoInbox.websiteChat(org,question,answer);field.value='';refresh();panel.querySelector('#service-chat-status').textContent='Conversation saved in this browser’s demo AI inbox.';}catch(error){panel.querySelector('#service-chat-status').textContent=error.message;}};
  panel.querySelector('form').addEventListener('submit',event=>{event.preventDefault();send(field.value);});panel.querySelector('#service-chat-prompt').addEventListener('click',()=>send(org==='printing'?'Help me prepare A1 plan copies':'I only need hauling'));
  window.addEventListener('storage',event=>{if(event.key===DemoInbox.KEY)refresh();});
  if(new URLSearchParams(location.search).has('chat'))launcher.click();
}
