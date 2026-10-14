'use strict';

const BUSINESSES = {
  construction: {name: 'W.V. Callueng Construction', short: 'Construction', website: 'index.html', color: '#174acb', soft: '#eaf0ff', focus: 'Build briefs, design preferences, and first conversations.'},
  printing: {name: 'W.V. Callueng Blueprinting Services', short: 'Blueprinting Services', website: 'blueprinting.html', color: '#236747', soft: '#eaf4ee', focus: 'Drawing sets, print specifications, and collection enquiries.'},
  hardware: {name: 'Callueng Hardware, Rentals & Hauling', short: 'Hardware, Rentals & Hauling', website: 'site-support.html', color: '#865410', soft: '#fcf2df', focus: 'Materials, equipment, and transport requests.'}
};
const STAGES = ['New', 'Qualified', 'Meeting', 'Won', 'Closed'];
const SOURCES = ['Website form', 'Design assistant', 'Facebook', 'Phone', 'Walk-in'];
const MEETING_STATES = ['Proposed', 'Confirmed', 'Completed', 'Cancelled'];
const COPY_FIELDS = ['title', 'eyebrow', 'headline', 'description', 'cta', 'seo'];
const COPY_LIMITS = {title: 100, eyebrow: 80, headline: 180, description: 1000, cta: 60, seo: 200};
const DEMO_KEY = 'callueng-backoffice-v1';
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

function seedOffice() {
  const dateAfter = offset => {const date = new Date(); date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
  const seeds = {
    construction: {
      names: ['Alex Santos', 'Mara Cruz', 'Nico Villanueva', 'Ella Garcia'],
      leads: [
        ['Tropical home in Antipolo', 'New', 'Design assistant', 'Modern tropical exterior + Japandi interior. Approx. 180 m². Wants shade, natural light, and a clear scope discussion.'],
        ['Plan preparation for a bungalow', 'Qualified', 'Website form', 'Needs a new plan set and engineering review. Construction is not included in this enquiry.'],
        ['Renovation consultation', 'Meeting', 'Facebook', 'Occupied home. Discuss which rooms can remain in use and what site information is needed.'],
        ['Two-storey home enquiry', 'New', 'Website form', 'Client has a lot but no plans. Clarify intended use, site access, and approximate floor area.']
      ],
      pages: [
        ['home', 'Homepage', 'index.html', 'Design & build', 'A better build\nbegins here.', 'Design, permits, and construction, with a clear plan from your first idea to the final handover.', 'Plan my build'],
        ['services', 'Services', 'services.html', 'From idea to delivery', 'The right support.\nAt the right stage.', 'Start with plans, engineering, permits, construction or renovation. Clarify the scope before work begins.', 'Prepare a build brief'],
        ['about', 'About us', 'about.html', 'People & purpose', 'Built on clear conversations.', 'Thoughtful planning and considered construction, with a clear record of the decisions that matter.', 'Meet the team']
      ],
      meetings: ['First brief · tropical home', 'Renovation scope discussion']
    },
    printing: {
      names: ['Sam Rivera', 'Luis Mendoza', 'Ana Reyes'],
      leads: [
        ['A1 structural set · 3 copies', 'New', 'Website form', '12 pages × 3 sets. A1 monochrome, 1:100. Rolled finish, pickup requested. Verify the source PDF scale before confirming.'],
        ['Architect drawing revision B', 'Qualified', 'Phone', 'A2 colour drawings, 2 sets. Ask for the final PDF and revision before quoting.'],
        ['A3 plan copies · courier enquiry', 'Meeting', 'Facebook', '6 sheets, 4 copies. Delivery enquiry in Antipolo. Confirm address and timing separately.']
      ],
      pages: [
        ['home', 'Homepage', 'blueprinting.html', 'For your next set', 'Your drawings.\nReady for the next step.', 'Blueprint and large-format plan printing, with paper, scale and finishing choices prepared before the print run.', 'Prepare a print request'],
        ['services', 'Print services', 'blueprinting.html#how-it-works', 'Drawings to print', 'A clear print specification.', 'Confirm paper size, colour, scale, pages and copies. Existing drawings can be printed without a construction enquiry.', 'Choose print specifications'],
        ['checklist', 'File checklist', 'blueprinting.html#prepare-files', 'Before you send', 'The right file. The right revision.', 'Prepare the final PDF, identify the revision, and confirm scale with the printing provider.', 'Review the file checklist']
      ],
      meetings: ['Confirm A1 print specifications', 'Delivery request discussion']
    },
    hardware: {
      names: ['Kai Ramos', 'Bea Torres', 'Jo Fernandez'],
      leads: [
        ['Hauling request · Antipolo', 'New', 'Website form', 'Hauling only. Approximate load and pickup location supplied. Confirm route, access, vehicle suitability and schedule.'],
        ['Equipment rental enquiry', 'Qualified', 'Phone', 'Equipment type and intended duration to be confirmed. Ask about operator needs and site access.'],
        ['Materials availability check', 'New', 'Facebook', 'Mixed materials list. Verify quantities, specifications, stock and delivery before offering a quote.']
      ],
      pages: [
        ['home', 'Homepage', 'site-support.html', 'Independent services', 'Materials. Equipment.\nMovement.', 'Request hardware, rentals or hauling directly. Choose the support you need without starting a construction project.', 'Request support'],
        ['services', 'Services', 'site-support.html#offer', 'What do you need?', 'A practical next step for your site.', 'Choose materials, equipment rental, hauling, or a combination. The team confirms scope and availability.', 'Choose your services'],
        ['workflow', 'Request process', 'site-support.html#workflow', 'Before dispatch', 'Confirm the details. Then coordinate.', 'Prepare the item list, dates and site access. Availability, terms, route and pricing need provider confirmation.', 'Prepare a support request']
      ],
      meetings: ['Hauling route & access review', 'Rental requirements call']
    }
  };
  const state = {version: 1, orgs: {}};
  for (const [key, seed] of Object.entries(seeds)) {
    state.orgs[key] = {
      profile: {name: BUSINESSES[key].name, location: 'Antipolo', inbox: `${key}@example.com`},
      contacts: seed.names.map((name, index) => ({id:`contact-${index}`, name, email:`${name.split(' ')[0].toLowerCase()}.${key}@example.com`, phone:'', company:index === 1 ? 'Sample design studio' : 'Sample client', notes:'Fictional contact for this presentation.'})),
      leads: seed.leads.map(([title, stage, source, details], index) => ({id:`lead-${index}`, title, stage, source, details, contactId:`contact-${index}`})),
      meetings: seed.meetings.map((title, index) => ({id:`meeting-${index}`, title, contactId:`contact-${index === 0 ? 0 : key === 'hardware' ? 1 : 2}`, date:dateAfter(index + 1), time:index === 0 ? '10:00' : '14:30', mode:index === 0 ? 'Video call' : 'Phone call', status:index === 0 ? 'Confirmed' : 'Proposed', notes:'Review the enquiry and agree on the information needed next.'})),
      pages: seed.pages.map(([id, label, path, eyebrow, headline, description, cta]) => {const copy = {title:label, eyebrow, headline, description, cta, seo:description.slice(0,200)}; return {id, label, path, draft:{...copy}, published:{...copy}, updated:'Initial example'};}),
      activity: [{text:'Sample workspace prepared for presentation.', at:'Demo starting point'}]
    };
  }
  return state;
}

function workspace(state, orgId) {
  if (!Object.hasOwn(BUSINESSES, orgId) || !state?.orgs?.[orgId]) throw new Error('Choose a valid business workspace.');
  return state.orgs[orgId];
}
function getRecord(state, orgId, kind, id) {
  if (!['contacts','leads','meetings','pages'].includes(kind)) throw new Error('Unsupported record type.');
  const record = workspace(state, orgId)[kind].find(item => item.id === id);
  if (!record) throw new Error('This record is not in the selected business.');
  return record;
}
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
}
function textField(fields, name, limit, required = false) {
  if (typeof fields[name] !== 'string') throw new Error(`Check the ${name} field.`);
  const value = fields[name].trim();
  if ((required && !value) || value.length > limit) throw new Error(`Check ${name}: ${required ? 'required, ' : ''}up to ${limit} characters.`);
  return value;
}
function validateRecord(state, orgId, kind, fields) {
  const org = workspace(state, orgId);
  if (kind === 'contacts') {
    const value = {name:textField(fields,'name',100,true), email:textField(fields,'email',160), phone:textField(fields,'phone',40), company:textField(fields,'company',120), notes:textField(fields,'notes',2000)};
    if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) throw new Error('Enter a valid email address or leave it blank.');
    return value;
  }
  if (!['leads','meetings'].includes(kind)) throw new Error('Unsupported record type.');
  const value = {title:textField(fields,'title',140,true), contactId:textField(fields,'contactId',100)};
  if (value.contactId && !org.contacts.some(contact => contact.id === value.contactId)) throw new Error('Choose a contact from this business.');
  if (kind === 'leads') {
    if (!STAGES.includes(fields.stage) || !SOURCES.includes(fields.source)) throw new Error('Choose a valid lead stage and source.');
    return {...value, stage:fields.stage, source:fields.source, details:textField(fields,'details',2500)};
  }
  if (!MEETING_STATES.includes(fields.status) || !['Video call','Phone call','In person'].includes(fields.mode)) throw new Error('Choose a valid meeting status and format.');
  if (!validDate(fields.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(fields.time)) throw new Error('Choose a valid meeting date and time.');
  return {...value, date:fields.date, time:fields.time, mode:fields.mode, status:fields.status, notes:textField(fields,'notes',2500)};
}
function saveRecord(state, orgId, kind, id, fields) {
  const value = validateRecord(state, orgId, kind, fields);
  const org = workspace(state, orgId);
  if (id) {Object.assign(getRecord(state,orgId,kind,id), value); return id;}
  if (org[kind].length >= 200) throw new Error('This demo supports up to 200 records per section.');
  const newId = globalThis.crypto.randomUUID();
  org[kind].unshift({id:newId, ...value});
  return newId;
}
function saveCopy(state, orgId, pageId, fields, publish = false) {
  const value = Object.fromEntries(COPY_FIELDS.map(name => [name,textField(fields,name,COPY_LIMITS[name],['title','headline','description','cta'].includes(name))]));
  const page = getRecord(state,orgId,'pages',pageId);
  page.draft = value;
  if (publish) page.published = {...value};
  page.updated = publish ? 'Published in demo' : 'Draft saved locally';
  return page;
}

if (typeof module !== 'undefined') module.exports = {BUSINESSES,seedOffice,workspace,getRecord,validDate,validateRecord,saveRecord,saveCopy,escapeHTML};

if (typeof document !== 'undefined') {
  const $ = selector => document.querySelector(selector);
  let state = seedOffice(), orgId = 'construction', view = 'overview', pageId = 'home', dirty = false, edit = null, toastTimer, requestId='', conversationId='';
  const inbox=window.CalluengDemoInbox;
  let storageNotice = '';
  try {
    const stored = sessionStorage.getItem(DEMO_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const valid = parsed.version === 1 && Object.keys(BUSINESSES).every(key => {const org = parsed.orgs?.[key]; return org && ['contacts','leads','meetings','pages','activity'].every(kind => Array.isArray(org[kind]) && org[kind].length <= 200) && org.profile && org.pages.length === 3;});
      if (!valid) throw new Error('Unsupported saved demo.');
      state = parsed;
      if (Object.hasOwn(BUSINESSES, parsed.activeOrg)) orgId = parsed.activeOrg;
    }
  } catch {storageNotice = 'Saved demo could not be restored. Sample records are shown; do not enter private information.';}
  const views = {
    overview:['YOUR BUSINESS, IN VIEW','A clearer day starts here.','A useful place for the website and the people it brings in.','Review requests'],
    requests:['CUSTOMER INBOX','Every request, with its context.','Review what the customer asked for, then prepare the next conversation.','Try website form'],
    inbox:['WEBSITE / AI INBOX','The conversation continues here.','Read the full history, review the request, and step in when a person is needed.','Try site assistant'],
    content:['WEBSITE / CMS','Good copy. In your hands.','Edit a draft, preview the result, and publish to this demo.',''],
    leads:['CUSTOMER RELATIONSHIPS / CRM','Every enquiry has a next step.','Keep the brief, the person, and the conversation together.','Add a lead'],
    contacts:['CUSTOMER RELATIONSHIPS / CRM','The people behind the enquiry.','One contact record. A clearer history of conversations.','Add a contact'],
    meetings:['CUSTOMER RELATIONSHIPS / CRM','Make the first conversation count.','Prepare a meeting with context from the enquiry. Times are in Asia/Manila.','Add a meeting'],
    settings:['BUSINESS WORKSPACE','The right business. Every time.','Website identity and customer records stay with this workspace.','']
  };
  const org = () => workspace(state,orgId);
  const contactName = id => org().contacts.find(item=>item.id === id)?.name || 'Contact not linked';
  const badge = stage => `<span class="badge" data-stage="${escapeHTML(stage)}">${escapeHTML(stage)}</span>`;
  const action = (kind,id,label='Open record') => `<button type="button" class="plain-action" data-edit="${kind}" data-id="${escapeHTML(id)}">${label} ↗</button>`;
  const dateLabel = (date, opts = {month:'short',day:'numeric'}) => new Intl.DateTimeFormat('en-PH',opts).format(new Date(`${date}T12:00:00`));
  const log = text => {org().activity.unshift({text,at:new Intl.DateTimeFormat('en-PH',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Manila'}).format(new Date())}); org().activity = org().activity.slice(0,12);};
  function toast(message) {clearTimeout(toastTimer); $('#office-status').textContent = message; $('#office-status').hidden = false; toastTimer = setTimeout(()=>{$('#office-status').hidden=true;},6000);}
  function persist() {try {state.activeOrg=orgId;sessionStorage.setItem(DEMO_KEY,JSON.stringify(state)); return true;} catch {toast('Browser storage is unavailable. Changes last only until reload; keep this tab open.'); return false;}}
  function canLeave() {return !dirty || window.confirm('Discard the unsaved changes in this view?');}
  const config=()=>inbox.CONFIG[orgId];
  function intake(){try{return inbox.read().orgs[orgId];}catch(error){toast('Saved inbox could not be read. Sample records are shown. Use the demo reset to recover.');return inbox.seeds().orgs[orgId];}}
  const reference=record=>config().mark+'-'+(record.origin==='sample'?String(Number(record.id.split('-').pop())+1).padStart(3,'0'):record.id.slice(0,6).toUpperCase());
  const timeLabel=value=>new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'Asia/Manila'}).format(new Date(value));
  const originLabel=record=>record.origin==='website'?'Website demo submission':'Presentation sample';
  const requestRow=record=>`<button type="button" class="intake-row" data-request="${escapeHTML(record.id)}" aria-pressed="${record.id===requestId}"><span class="intake-row-top"><small>${reference(record)}</small>${badge(record.status)}</span><strong>${escapeHTML(record.title)}</strong><span>${escapeHTML(record.customer)} · ${escapeHTML(record.category)}</span><small>${originLabel(record)} · ${timeLabel(record.submitted)}</small></button>`;
  const sheet=()=>`<div class="drawing-sheet" aria-label="Illustrative drawing sheet, not an uploaded file"><div><span>WV / SAMPLE SHEET</span><span>ILLUSTRATION ONLY</span></div><svg viewBox="0 0 400 170" role="img" aria-label="Decorative sample plan linework"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M25 20h340v120H25zM150 20v120M265 20v120M25 83h125M150 63h115M265 105h100M80 20v63M310 20v85M150 95h115M25 148h340M15 20v120M25 143v10M150 143v10M265 143v10M365 143v10M10 20h10M10 140h10"/><path d="M150 68a25 25 0 0 1 25 25M265 60a25 25 0 0 1 25 25" stroke-dasharray="3 3"/></g><g fill="currentColor" font-size="8"><text x="38" y="44">SAMPLE</text><text x="190" y="48">ILLUSTRATION</text><text x="282" y="132">NOT A CUSTOMER FILE</text></g></svg><p>Illustrative sheet · file contents are not uploaded or viewed</p></div>`;
  function requestDirection(record){const styles={tropical:'tropical','modern tropical':'tropical',minimal:'minimal','warm minimalist':'minimal',japandi:'japandi',classic:'classic','contemporary classic':'classic'};const directions=['Exterior direction','Interior direction'].map((label,index)=>{const value=record.fields.find(pair=>pair[0]===label)?.[1]||'',style=styles[value.toLowerCase()];return style?`<figure><div role="img" aria-label="Prepared ${escapeHTML(value)} ${index?'interior':'exterior'} concept reference" style="background-image:url('assets/direction-${style}.webp');background-position:${index?'right':'left'} center"></div><figcaption>${index?'Interior':'Exterior'} · ${escapeHTML(value)}</figcaption></figure>`:'';}).join('');return directions?`<div class="request-direction-pair">${directions}<p>Prepared concept references · selected preferences, not custom renders or construction plans</p></div>`:'';}
  function renderRequests(){
    const records=intake().requests;const selected=records.find(item=>item.id===requestId)||records[0];requestId=selected?.id||'';
    return `<div class="intake-shell"><aside class="intake-list"><div class="intake-list-head"><h2>${config().label}</h2><span>${records.length}</span></div><label class="sr-only" for="intake-search">Search customer requests</label><input id="intake-search" type="search" maxlength="120" placeholder="Search requests or customers…"><label class="sr-only" for="intake-filter">Filter customer requests</label><select id="intake-filter"><option value="all">All requests</option><option value="website">Website demo submissions</option>${config().statuses.map(status=>`<option>${status}</option>`).join('')}${orgId==='hardware'?config().categories.map(category=>`<option>${category}</option>`).join(''):''}</select><div class="intake-record-list" id="intake-record-list">${records.map(requestRow).join('')}</div></aside><section class="intake-detail">${selected?requestDetail(selected):'<div class="empty-state">No requests yet. Try the website form to create one.</div>'}</section></div>`;
  }
  function requestDetail(record){
    const converted=org().leads.some(lead=>lead.requestId===record.id);
    const next={construction:'Prepare the consultation',printing:'Review the drawing set',hardware:'Confirm before dispatch'}[orgId];
    return `<div class="intake-detail-head"><div><span class="office-eyebrow">${reference(record)} / ${originLabel(record)}</span><h2>${escapeHTML(record.title)}</h2><p>${escapeHTML(record.customer)} <span>·</span> ${timeLabel(record.submitted)}</p></div>${badge(record.status)}</div><div class="intake-content"><div class="request-context"><span class="context-symbol" aria-hidden="true">${config().mark}</span><div><strong>${config().desk}</strong><p>${orgId==='printing'?'Reproduce supplied drawings. Review scale, revision and copies.':orgId==='hardware'?'Review this service directly. Availability and site access come first.':'Bring the scope, the site and the preferred direction together.'}</p></div></div>${orgId==='printing'?sheet():orgId==='construction'?requestDirection(record):''}<dl class="request-specs">${record.fields.map(([label,value])=>`<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value||'To confirm')}</dd></div>`).join('')}</dl><div class="request-files"><h3>${orgId==='printing'?'Drawing files':'Supporting information'}</h3>${record.files.length?record.files.map(file=>`<div class="request-file"><span class="file-symbol">PDF</span><div><strong>${escapeHTML(file.name)}</strong><small>${(file.size/1048576).toFixed(2)} MB · ${record.origin==='sample'?'sample metadata':'selected locally'} · content not stored</small></div><span class="badge">Metadata only</span></div>`).join(''):'<p>No files attached to this demo request. Ask for the information needed before quoting.</p>'}</div><form id="request-review"><div class="review-heading"><span class="office-eyebrow">TEAM REVIEW</span><h3>${next}</h3></div><div class="review-checks">${config().checks.map(check=>`<label><input type="checkbox" name="check" value="${check}" ${record.checks.includes(check)?'checked':''}>${check}</label>`).join('')}</div><div class="office-form-grid"><div><label for="request-status">Request status</label><select id="request-status" name="status">${config().statuses.map(status=>`<option ${status===record.status?'selected':''}>${status}</option>`).join('')}</select></div><div class="full"><label for="request-notes">Internal review notes</label><textarea id="request-notes" name="notes" maxlength="2500" placeholder="What should the team confirm next?">${escapeHTML(record.notes)}</textarea></div></div><div class="editor-actions"><button class="button small" type="submit">Save review<img class="icon" src="assets/check.svg" alt="" width="20" height="20"></button><button class="button secondary small" type="button" data-request-lead="${record.id}" ${converted?'disabled':''}>${converted?'Added to leads':'Create CRM lead'}<img class="icon" src="assets/arrow-up-right.svg" alt="" width="20" height="20"></button><button class="plain-action" type="button" data-request-download="${record.id}">Download request</button></div></form></div>`;
  }
  function renderConversations(){
    const data=intake(),chat=data.conversations.find(item=>item.id===conversationId)||data.conversations[0];conversationId=chat?.id||'';
    return `<div class="intake-shell conversation-shell"><aside class="intake-list"><div class="intake-list-head"><h2>AI conversations</h2><span>${data.conversations.length}</span></div><p class="inbox-helper">Website assistant history, with a clear handoff to the team.</p><div class="intake-record-list">${data.conversations.map(item=>`<button class="conversation-row" type="button" data-conversation="${item.id}" aria-pressed="${item.id===conversationId}"><span class="row spread"><span class="avatar">${escapeHTML(item.customer.split(' ').map(word=>word[0]).join('').slice(0,2))}</span><small>${timeLabel(item.updated)}</small></span><strong>${escapeHTML(item.customer)}</strong><p>${escapeHTML(item.messages.filter(message=>message.role==='visitor').at(-1)?.text||'New conversation')}</p>${badge(item.status)}<small>${item.origin==='website'?'Website demo conversation':'Presentation sample'}</small></button>`).join('')||'<p class="empty-state">Try the website assistant to start a conversation.</p>'}</div></aside><section class="intake-detail">${chat?`<div class="intake-detail-head"><div><span class="office-eyebrow">${config().desk} / WEBSITE ASSISTANT</span><h2>${escapeHTML(chat.customer)}</h2><p>${chat.origin==='website'?'Captured from the website in this browser':'Fictional presentation conversation'} · ${chat.messages.length} messages</p></div>${badge(chat.status)}</div><div class="conversation-brief"><span class="brief-icon" aria-hidden="true">✦</span><div><strong>Context for the next conversation</strong><p>${escapeHTML(chat.messages.filter(message=>message.role==='visitor').at(-1)?.text||'Ask what the visitor needs.')}</p><small>From the visitor’s message · no live AI summarization</small></div></div><div class="office-transcript" role="log" aria-label="Conversation history">${chat.messages.map(message=>`<article class="transcript-message ${message.role}"><div><strong>${message.role==='visitor'?escapeHTML(chat.customer):message.role==='team'?'Team · demo reply':'AI assistant · preset reply'}</strong><time>${timeLabel(message.at)}</time></div><p>${escapeHTML(message.text)}</p></article>`).join('')}</div><div class="conversation-actions"><form id="chat-review"><div class="office-form-grid"><div><label for="conversation-status">Conversation status</label><select id="conversation-status" name="status">${inbox.CHAT_STATES.map(status=>`<option ${status===chat.status?'selected':''}>${status}</option>`).join('')}</select></div><div><label for="conversation-request">Linked request · this business</label><select id="conversation-request" name="requestId"><option value="">No request linked</option>${data.requests.map(request=>`<option value="${request.id}" ${request.id===chat.requestId?'selected':''}>${escapeHTML(request.title)}</option>`).join('')}</select></div></div><div class="editor-actions"><button type="submit" class="button secondary small">Save handoff</button>${chat.requestId?`<button type="button" class="plain-action" data-open-request="${chat.requestId}">Open linked request →</button>`:''}<button type="button" class="plain-action" data-chat-download="${chat.id}">Download transcript</button></div></form><form id="team-reply" class="team-reply"><label for="team-message">Step in as the team</label><textarea id="team-message" name="message" required maxlength="1600" placeholder="Add a helpful demo reply. It also appears in this visitor’s website chat."></textarea><div class="row spread"><small>Local demo reply · no email or external message is sent</small><button class="button small" type="submit">Add demo team reply<img class="icon" src="assets/arrow-up-right.svg" alt="" width="20" height="20"></button></div></form></div>`:''}</section></div>`;
  }
  function renderOverview() {
    const data=intake(),team=data.conversations.filter(chat=>chat.status==='Needs a person'),meetings=org().meetings.filter(item=>!['Completed','Cancelled'].includes(item.status));
    const headline={construction:'From first idea to a clearer brief.',printing:'Every drawing set. Every detail.',hardware:'The right support starts with the details.'}[orgId];
    return `<section class="desk-banner"><div><span class="office-eyebrow">${config().desk}</span><h2>${headline}</h2><p>${BUSINESSES[orgId].focus}</p><a class="button small" href="#requests">Open ${config().label.toLowerCase()}<span class="button-island">↗</span></a></div><div class="desk-art" aria-hidden="true"><span>${config().mark}</span><small>${orgId==='printing'?'REVISION / SCALE / COPIES':orgId==='hardware'?'SPECIFICATIONS / ACCESS / TIMING':'SITE / SCOPE / DIRECTION'}</small></div></section><div class="office-stats">${[[data.requests.filter(r=>r.status!=='Closed').length,'Open requests','Ready for team review'],[team.length,'Human handoffs','From the website assistant'],[meetings.length,'Open meetings','With context from the enquiry'],[org().leads.length,'CRM leads','Tracked in this workspace']].map(([number,label,note])=>`<article class="stat-card"><small>${label}</small><strong>${String(number).padStart(2,'0')}</strong><p><span class="mini-dot"></span>${note}</p></article>`).join('')}</div><div class="overview-layout"><section class="office-panel"><div class="panel-head"><div><h2>${config().label}</h2><p>What came in, and what the team needs to confirm.</p></div><a href="#requests">View all →</a></div><div class="overview-requests">${data.requests.slice(0,3).map(record=>`<button type="button" class="overview-request" data-open-request="${record.id}"><span class="request-reference">${reference(record)}</span><div><strong>${escapeHTML(record.title)}</strong><p>${escapeHTML(record.customer)} · ${escapeHTML(record.category)}</p><small>${originLabel(record)}</small></div>${badge(record.status)}<span class="request-arrow">↗</span></button>`).join('')}</div></section><aside class="overview-side"><section class="office-panel"><div class="panel-head"><div><h2>AI → team</h2><p>Conversations that need a person</p></div><a href="#inbox">AI inbox →</a></div>${team.slice(0,2).map(chat=>`<button class="handoff-card" type="button" data-open-conversation="${chat.id}"><span class="handoff-dot"></span><strong>${escapeHTML(chat.customer)}</strong><p>“${escapeHTML(chat.messages.filter(message=>message.role==='visitor').at(-1)?.text)}”</p><small>Read history & prepare a reply ↗</small></button>`).join('')||'<p class="empty-state">No conversations need a person.</p>'}</section><section class="office-panel"><div class="panel-head"><div><h2>Next conversations</h2><p>Asia/Manila · sample schedule</p></div><a href="#meetings">View all →</a></div>${meetings.slice(0,2).map(item=>`<article class="meeting-mini"><div class="date-tile"><small>${dateLabel(item.date,{month:'short'})}</small><strong>${dateLabel(item.date,{day:'numeric'})}</strong></div><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(contactName(item.contactId))} · ${item.time}</p></div></article>`).join('')}</section></aside></div><div class="presentation-path"><span>Website form</span><i>→</i><span>Customer request</span><i>→</i><span>Team review</span><i>→</i><span>CRM & meeting</span><small>The presentation flow works locally in this browser.</small></div>`;
  }
  function preview(copy) {return `<small>${escapeHTML(copy.eyebrow)}</small><h2>${escapeHTML(copy.headline)}</h2><p>${escapeHTML(copy.description)}</p><span class="button">${escapeHTML(copy.cta)}</span>`;}
  function renderContent() {
    const page = getRecord(state,orgId,'pages',pageId);
    const labels = {title:'Page title',eyebrow:'Section label',headline:'Headline',description:'Introduction',cta:'Button label',seo:'Search description'};
    return `<div class="content-layout"><aside class="office-panel page-picker"><p>Website sections</p>${org().pages.map(item=>`<button type="button" data-page="${item.id}" aria-pressed="${item.id===pageId}">${escapeHTML(item.label)}<small>${JSON.stringify(item.draft)!==JSON.stringify(item.published)?'Unpublished draft':'Matches demo preview'}</small></button>`).join('')}</aside><section class="office-panel content-editor"><div class="editor-heading"><div><h2>${escapeHTML(page.label)} copy</h2><p id="copy-state">${escapeHTML(page.updated)}</p></div><a class="plain-action" href="${page.path}" target="_blank" rel="noopener">Open website ↗</a></div><form id="copy-form"><div class="office-form-grid">${COPY_FIELDS.map(name=>`<div class="${['headline','description','seo'].includes(name)?'full':''}"><label for="copy-${name}">${labels[name]}</label>${['headline','description','seo'].includes(name)?`<textarea id="copy-${name}" name="${name}" maxlength="${COPY_LIMITS[name]}" ${name==='seo'?'':'required'}>${escapeHTML(page.draft[name])}</textarea>`:`<input id="copy-${name}" name="${name}" maxlength="${COPY_LIMITS[name]}" value="${escapeHTML(page.draft[name])}" ${name==='eyebrow'?'':'required'}>`}${name==='seo'?'<small>Preview only. This demo does not change the public site’s metadata.</small>':''}</div>`).join('')}</div><div class="editor-actions"><button type="submit" class="button secondary small" name="intent" value="draft">Save draft</button><button type="submit" class="button small" name="intent" value="publish">Publish in demo<img class="icon" src="assets/check.svg" alt="" width="20" height="20"></button><small id="copy-save-note">Changes stay in this tab</small></div></form><div class="copy-preview"><div class="preview-label"><span id="preview-label">Draft preview · live as you type</span><button type="button" class="plain-action" id="published-preview">View published demo copy</button></div><div class="preview-body" id="copy-preview">${preview(page.draft)}</div></div></section></div>`;
  }
  function renderList() {
    const isLead = view === 'leads';
    return `<div class="office-toolbar"><div class="office-search"><label class="sr-only" for="record-search">Search ${view}</label><input id="record-search" type="search" maxlength="120" placeholder="Search ${view}…"></div>${isLead?`<div><label class="sr-only" for="stage-filter">Lead stage</label><select id="stage-filter"><option value="">All stages</option>${STAGES.map(stage=>`<option>${stage}</option>`).join('')}</select></div>`:'<span class="small muted">Contacts belong to this business</span>'}</div><section class="office-panel"><div class="table-wrap"><table class="office-table"><thead><tr>${(isLead?['Enquiry / contact','Stage','Source','']:['Contact','Email / phone','Company','']).map(label=>`<th scope="col">${label || '<span class="sr-only">Actions</span>'}</th>`).join('')}</tr></thead><tbody id="record-rows"></tbody></table></div><div class="table-caption"><span id="record-total"></span><span>Fictional records · ${escapeHTML(BUSINESSES[orgId].short)}</span></div></section>`;
  }
  function updateRows() {
    const query = $('#record-search').value.toLowerCase().trim(), stage = $('#stage-filter')?.value;
    const records = org()[view].filter(item=>(Object.values(item).join(' ') + (view==='leads'?' '+contactName(item.contactId):'')).toLowerCase().includes(query) && (!stage || item.stage===stage));
    $('#record-rows').innerHTML = records.map(item=>view==='leads'?`<tr><td><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(contactName(item.contactId))}</small></td><td>${badge(item.stage)}</td><td>${escapeHTML(item.source)}</td><td>${action('leads',item.id,'Edit')}</td></tr>`:`<tr><td><strong>${escapeHTML(item.name)}</strong><small>Sample contact</small></td><td>${escapeHTML(item.email || 'Email not added')}<small>${escapeHTML(item.phone || 'Phone not added')}</small></td><td>${escapeHTML(item.company || '—')}</td><td>${action('contacts',item.id,'Edit')}</td></tr>`).join('') || '<tr><td colspan="4" class="empty-state">No matching records. Try another search or add a record.</td></tr>';
    $('#record-total').textContent = `${records.length} of ${org()[view].length} records`;
  }
  function renderMeetings() {
    const meetings = [...org().meetings].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    return `<div class="meeting-list">${meetings.map(item=>`<article class="office-panel meeting-card"><div class="date-tile"><small>${dateLabel(item.date,{month:'short'})}</small><strong>${dateLabel(item.date,{day:'numeric'})}</strong></div><div><h2>${escapeHTML(item.title)}</h2><div class="meeting-meta"><span>${dateLabel(item.date,{weekday:'short',year:'numeric',month:'short',day:'numeric'})} · ${item.time}</span>${badge(item.status)}<span>${escapeHTML(item.mode)}</span></div><p>${escapeHTML(contactName(item.contactId))}</p><p>${escapeHTML(item.notes)}</p></div>${action('meetings',item.id,'Edit meeting')}</article>`).join('') || '<div class="office-panel empty-state">No meetings yet. Add a conversation to the demo schedule.</div>'}</div><p class="small muted" style="margin-top:18px">Saving a meeting updates this demo only. No calendar event or invitation is sent.</p>`;
  }
  function renderSettings() {
    const profile = org().profile;
    return `<div class="settings-grid"><section class="office-panel"><div class="panel-head"><div><h2>Business identity</h2><p>Sample settings for this workspace</p></div><span class="badge">Demo</span></div><form id="profile-form" class="settings-copy"><div class="office-form-grid"><div class="full"><label for="business-name">Business display name</label><input id="business-name" name="name" required maxlength="120" value="${escapeHTML(profile.name)}"></div><div><label for="business-location">Location</label><input id="business-location" name="location" required maxlength="100" value="${escapeHTML(profile.location)}"></div><div><label for="business-inbox">Demo inbox</label><input id="business-inbox" name="inbox" type="email" required maxlength="160" value="${escapeHTML(profile.inbox)}"></div></div><div class="editor-actions"><button class="button small" type="submit">Save settings</button><small>Local sample identity only</small></div></form><div class="settings-credit"><strong>A thoughtful website. A useful backoffice.</strong><p>Website and product concept by AyosGawa, the creative studio of Prince Reyes.</p><div class="row"><a href="https://ayosgawa.com/" target="_blank" rel="noopener">Visit AyosGawa ↗</a><a href="https://princereyes.com/" target="_blank" rel="noopener">Explore Prince’s portfolio ↗</a></div></div></section><aside><section class="office-panel settings-copy"><h2>This business has its own…</h2><ul class="scope-list">${['Website copy & draft previews','Contact directory','Lead pipeline & enquiry notes','Meeting schedule','Business identity'].map(label=>`<li><span class="checkmark">✓</span>${label}</li>`).join('')}</ul><div class="settings-note">Switching businesses changes every record view. A live system would limit this selector to the organizations the signed-in person can access.</div></section><section class="office-panel" style="margin-top:22px"><div class="panel-head"><h2>Recent demo changes</h2></div>${org().activity.slice(0,5).map(item=>`<div class="activity-line">${escapeHTML(item.text)}<small>${escapeHTML(item.at)}</small></div>`).join('')}</section></aside></div>`;
  }
  function render() {
    dirty = false;
    const business = BUSINESSES[orgId];
    document.body.style.setProperty('--org-color',business.color);
    document.body.style.setProperty('--org-soft',business.soft);
    $('#organization-note').textContent = org().profile.name;
    $('#workspace-label').textContent = business.short;
    $('#view-label').textContent = {overview:'Overview',requests:config().label,inbox:'AI conversations',content:'Content & copy',leads:'Leads',contacts:'Contacts',meetings:'Meetings',settings:'Business settings'}[view];
    $('.office-logo').textContent=config().mark;
    $('#request-nav-label').textContent=config().label;
    $('#meeting-nav-label').textContent={construction:'Consultations',printing:'Customer calls',hardware:'Coordination calls'}[orgId];
    $('#request-count').textContent=intake().requests.filter(record=>record.status==='New').length;
    $('#chat-count').textContent=intake().conversations.filter(chat=>chat.status==='Needs a person').length;
    $('#website-link').href = business.website;
    $('#lead-count').textContent = org().leads.filter(item=>item.stage==='New').length;
    $('#view-eyebrow').textContent = views[view][0]; $('#view-title').textContent = views[view][1]; $('#view-description').textContent = views[view][2];
    $('#view-action').hidden = !views[view][3];
    $('#view-action').innerHTML = `${views[view][3]}<img class="icon" src="assets/${['requests','inbox'].includes(view)?'arrow-up-right':view==='overview'?'arrow-right':'plus'}.svg" alt="" width="20" height="20">`;
    document.querySelectorAll('[data-view]').forEach(link=>{if (link.dataset.view===view) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');});
    $('#office-view').innerHTML = view==='overview'?renderOverview():view==='requests'?renderRequests():view==='inbox'?renderConversations():view==='content'?renderContent():['leads','contacts'].includes(view)?renderList():view==='meetings'?renderMeetings():renderSettings();
    if(view==='requests'){
      const filter=()=>{const query=$('#intake-search').value.toLowerCase(),filter=$('#intake-filter').value;const records=intake().requests.filter(record=>[record.title,record.customer,record.category,...record.fields.flat()].join(' ').toLowerCase().includes(query)&&(filter==='all'||filter===record.origin||filter===record.status||filter===record.category));$('#intake-record-list').innerHTML=records.map(requestRow).join('')||'<p class="empty-state">No matching requests. Try another filter.</p>';};
      $('#intake-search').addEventListener('input',filter);$('#intake-filter').addEventListener('change',filter);
      $('#request-review')?.addEventListener('input',()=>{dirty=true;});
      $('#request-review')?.addEventListener('submit',event=>{event.preventDefault();try{const fields=new FormData(event.currentTarget);inbox.reviewRequest(orgId,requestId,{status:fields.get('status'),notes:fields.get('notes'),checks:fields.getAll('check')});dirty=false;log('Customer request review saved.');persist();render();toast('Request review saved in this browser.');}catch(error){toast(error.message);}});
    }
    if(view==='inbox'){
      $('#chat-review')?.addEventListener('input',()=>{dirty=true;});$('#team-reply')?.addEventListener('input',()=>{dirty=true;});
      $('#chat-review')?.addEventListener('submit',event=>{event.preventDefault();try{const fields=new FormData(event.currentTarget);inbox.updateConversation(orgId,conversationId,fields.get('status'),fields.get('requestId'));dirty=false;render();toast('Conversation handoff saved.');}catch(error){toast(error.message);}});
      $('#team-reply')?.addEventListener('submit',event=>{event.preventDefault();try{inbox.teamReply(orgId,conversationId,new FormData(event.currentTarget).get('message'));dirty=false;render();toast('Demo team reply added. It appears in this visitor’s website chat.');}catch(error){toast(error.message);}});
    }
    if (['leads','contacts'].includes(view)) {updateRows(); $('#record-search').addEventListener('input',updateRows); $('#stage-filter')?.addEventListener('change',updateRows);}
    if (view === 'content') {
      $('#copy-form').addEventListener('input',()=>{dirty = true; $('#copy-state').textContent='Unsaved edits'; $('#copy-preview').innerHTML=preview(Object.fromEntries(new FormData($('#copy-form')))); $('#preview-label').textContent='Draft preview · unsaved edits'; $('#published-preview').textContent='View published demo copy';});
      $('#copy-form').addEventListener('submit',event=>{
        event.preventDefault();
        try {const publish=event.submitter?.value === 'publish'; saveCopy(state,orgId,pageId,Object.fromEntries(new FormData(event.currentTarget)),publish); log(`${getRecord(state,orgId,'pages',pageId).label}: ${publish?'published to demo preview':'draft saved'}.`); const stored=persist(); render(); if(stored)toast(publish?'Published to this demo preview. Public website unchanged.':'Draft saved in this tab.');} catch(error) {toast(error.message);}
      });
      $('#published-preview').addEventListener('click',()=>{const showPublished=$('#preview-label').textContent!=='Published demo copy'; $('#copy-preview').innerHTML=preview(showPublished?getRecord(state,orgId,'pages',pageId).published:Object.fromEntries(new FormData($('#copy-form')))); $('#preview-label').textContent=showPublished?'Published demo copy':'Draft preview · live as you type'; $('#published-preview').textContent=showPublished?'Back to draft preview':'View published demo copy';});
    }
    if (view==='settings') $('#profile-form').addEventListener('submit',event=>{event.preventDefault();try {const fields=Object.fromEntries(new FormData(event.currentTarget)); const profile={name:textField(fields,'name',120,true),location:textField(fields,'location',100,true),inbox:textField(fields,'inbox',160,true)};if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.inbox))throw new Error('Enter a valid demo inbox.');org().profile=profile;log('Business identity settings updated locally.');const stored=persist();render();if(stored)toast('Business settings saved in this tab.');}catch(error){toast(error.message);}});
  }
  const selectField = (name,label,options,value,required=false) => `<div><label for="field-${name}">${label}</label><select id="field-${name}" name="${name}" ${required?'required':''}>${options.map(option=>{const [key,text]=Array.isArray(option)?option:[option,option];return `<option value="${escapeHTML(key)}" ${key===value?'selected':''}>${escapeHTML(text)}</option>`;}).join('')}</select></div>`;
  const inputField = (name,label,value='',limit=140,type='text',required=false,full=false) => `<div class="${full?'full':''}"><label for="field-${name}">${label}</label><input id="field-${name}" name="${name}" type="${type}" maxlength="${limit}" value="${escapeHTML(value)}" ${required?'required':''}></div>`;
  const notesField = (name,label,value='',limit=2500) => `<div class="full"><label for="field-${name}">${label}</label><textarea id="field-${name}" name="${name}" maxlength="${limit}">${escapeHTML(value)}</textarea></div>`;
  function openRecord(kind,id='') {
    const item=id?getRecord(state,orgId,kind,id):{};
    edit={kind,id,orgId};
    const name={contacts:'contact',leads:'lead',meetings:'meeting'}[kind];
    $('#record-title').textContent=`${id?'Edit':'New'} ${name}`;
    $('#record-label').textContent=BUSINESSES[orgId].short;
    $('#record-context').textContent='Fictional record · saved to this business in this tab only';
    $('#record-error').hidden=true;
    const contacts=[['','No contact linked'],...org().contacts.map(contact=>[contact.id,contact.name])];
    $('#record-fields').innerHTML=kind==='contacts'?
      inputField('name','Contact name',item.name,100,'text',true,true)+inputField('email','Email',item.email,160,'email')+inputField('phone','Phone',item.phone,40,'tel')+inputField('company','Company / context',item.company,120,'text',false,true)+notesField('notes','Contact notes',item.notes,2000):
      inputField('title',kind==='leads'?'Enquiry title':'Meeting title',item.title,140,'text',true,true)+selectField('contactId','Contact in this business',contacts,item.contactId || '')+(kind==='leads'?
      selectField('stage','Stage',STAGES,item.stage || 'New',true)+selectField('source','Enquiry source',SOURCES,item.source || 'Website form',true)+notesField('details','Brief / preferences / next questions',item.details):
      selectField('status','Status',MEETING_STATES,item.status || 'Proposed',true)+inputField('date','Date · Asia/Manila',item.date,10,'date',true)+inputField('time','Time · Asia/Manila',item.time,5,'time',true)+selectField('mode','Meeting format',['Video call','Phone call','In person'],item.mode || 'Video call',true)+notesField('notes','Agenda / meeting notes',item.notes));
    $('#record-dialog').showModal();
    $('#record-fields input').focus();
  }
  $('#record-form').addEventListener('submit',event=>{event.preventDefault();try {
    if(edit.orgId!==orgId)throw new Error('The workspace changed. Reopen the record.');
    saveRecord(state,edit.orgId,edit.kind,edit.id,Object.fromEntries(new FormData(event.currentTarget)));
    log(`${edit.id?'Updated':'Added'} ${edit.kind.slice(0,-1)}: ${event.currentTarget.elements.namedItem(edit.kind==='contacts'?'name':'title').value.trim()}.`);
    const stored=persist();$('#record-dialog').close();render();if(stored)toast('Record saved in this business workspace.');
  }catch(error){$('#record-error').textContent=error.message;$('#record-error').hidden=false;}});
  for (const id of ['record-close','record-cancel']) $(`#${id}`).addEventListener('click',()=>$('#record-dialog').close());
  $('#office-view').addEventListener('click',event=>{const editButton=event.target.closest('[data-edit]'), pageButton=event.target.closest('[data-page]');if(editButton)openRecord(editButton.dataset.edit,editButton.dataset.id);if(pageButton&&canLeave()){pageId=pageButton.dataset.page;render();}});
  function showIntake(next,recordId){if(!canLeave())return;view=next;if(next==='requests')requestId=recordId||'';else conversationId=recordId||'';history.replaceState(null,'',`?workspace=${orgId}${recordId?'&'+(next==='requests'?'request':'conversation')+'='+encodeURIComponent(recordId):''}#${view}`);render();}
  function downloadText(filename,value){const url=URL.createObjectURL(new Blob([value],{type:'text/plain;charset=utf-8'})),anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('#office-view').addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.request||target.dataset.openRequest)showIntake('requests',target.dataset.request||target.dataset.openRequest);
    if(target.dataset.conversation||target.dataset.openConversation)showIntake('inbox',target.dataset.conversation||target.dataset.openConversation);
    if(target.dataset.requestDownload){const record=inbox.find(inbox.read(),orgId,'requests',target.dataset.requestDownload);downloadText(`${config().mark}-Demo-Request.txt`,[config().desk,record.title,'Browser-local demo request',...record.fields.map(([key,value])=>key+': '+value),'File metadata only:',...record.files.map(file=>file.name),record.notes].join('\n'));}
    if(target.dataset.chatDownload){const chat=inbox.find(inbox.read(),orgId,'conversations',target.dataset.chatDownload);downloadText(`${config().mark}-Demo-Conversation.txt`,[config().desk,chat.customer,chat.status,...chat.messages.map(message=>`${message.role} (${timeLabel(message.at)}): ${message.text}`)].join('\n\n'));}
    if(target.dataset.requestLead&&canLeave()){
      try{const record=inbox.find(inbox.read(),orgId,'requests',target.dataset.requestLead);if(org().leads.some(lead=>lead.requestId===record.id)){toast('This request already has a lead in this tab.');return;}let contact=org().contacts.find(contact=>contact.name===record.customer);if(!contact){const contactId=saveRecord(state,orgId,'contacts','',{name:record.customer,email:'',phone:'',company:'Website demo visitor',notes:'Created from a local demo request.'});contact=getRecord(state,orgId,'contacts',contactId);}const leadId=saveRecord(state,orgId,'leads','',{title:record.title,contactId:contact.id,stage:'New',source:'Website form',details:(reference(record)+'\n'+record.fields.map(([key,value])=>key+': '+value).join('\n')).slice(0,2500)});getRecord(state,orgId,'leads',leadId).requestId=record.id;log('CRM lead created from '+reference(record)+'.');persist();render();toast('CRM lead created with the customer and request context.');}catch(error){toast(error.message);}
    }
  });
  $('#view-action').addEventListener('click',()=>{if(view==='overview'){showIntake('requests');return;}if(view==='requests'){window.open({construction:'plan.html',printing:'blueprinting.html#print-request',hardware:'site-support.html#support-request'}[orgId],'_blank','noopener');return;}if(view==='inbox'){window.open(BUSINESSES[orgId].website+'?chat=1','_blank','noopener');return;}openRecord(view==='contacts'?'contacts':view==='meetings'?'meetings':'leads');});
  $('#organization').addEventListener('change',event=>{if(!canLeave()){event.target.value=orgId;return;}orgId=event.target.value;pageId='home';requestId='';conversationId='';history.replaceState(null,'',`?workspace=${orgId}#${view}`);const stored=persist();render();if(stored)toast(`Switched to ${BUSINESSES[orgId].short}.`);});
  document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');const next=link?.getAttribute('href').slice(1);if(next&&Object.hasOwn(views,next)){event.preventDefault();if(canLeave()){view=next;history.replaceState(null,'',`#${view}`);render();$('#main').scrollIntoView({block:'start'});}}});
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  $('#demo-info').addEventListener('click',()=>$('#info-dialog').showModal());$('#info-close').addEventListener('click',()=>$('#info-dialog').close());
  $('#reset-demo').addEventListener('click',()=>{if(window.confirm('Reset the fictional records and local edits in this tab?')){state=seedOffice();pageId='home';const stored=persist();$('#info-dialog').close();render();if(stored)toast('This tab’s demo has been reset.');}});
  $('#reset-intake').addEventListener('click',()=>{if(window.confirm('Reset the demo requests and chat histories in this browser?')){try{localStorage.setItem(inbox.KEY,JSON.stringify(inbox.seeds()));requestId='';conversationId='';$('#info-dialog').close();render();toast('Demo request and chat samples reset.');}catch(error){toast('Could not reset the saved inbox. Check browser storage.');}}});
  window.addEventListener('storage',event=>{if(event.key===inbox.KEY){if(dirty)toast('New inbox activity arrived. Save your changes before refreshing this view.');else render();}});
  const params=new URLSearchParams(location.search);if(Object.hasOwn(BUSINESSES,params.get('workspace')))orgId=params.get('workspace');requestId=params.get('request')||'';conversationId=params.get('conversation')||'';
  const initial=location.hash.slice(1);if(Object.hasOwn(views,initial))view=initial;
  $('#organization').value=orgId;render();if(storageNotice)toast(storageNotice);
}
