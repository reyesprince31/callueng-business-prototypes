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
  let state = seedOffice(), orgId = 'construction', view = 'overview', pageId = 'home', dirty = false, edit = null, toastTimer;
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
    overview:['YOUR BUSINESS, IN VIEW','A clearer day starts here.','A useful place for the website and the people it brings in.','Add a lead'],
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
  function canLeave() {return !dirty || window.confirm('Discard the unsaved copy edits in this preview?');}
  function renderOverview() {
    const data = org(), fresh = data.leads.filter(item=>item.stage === 'New'), upcoming = data.meetings.filter(item=>!['Completed','Cancelled'].includes(item.status)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    const drafts = data.pages.filter(item=>JSON.stringify(item.draft)!==JSON.stringify(item.published));
    const stats = [[fresh.length,'New enquiries','Ready for a first review'],[upcoming.length,'Open meetings','Proposed or confirmed'],[drafts.length,'Unpublished drafts','Website copy to review'],[data.contacts.length,'Contacts','In this business only']];
    const queue = data.leads.filter(item=>!['Won','Closed'].includes(item.stage)).slice(0,4);
    const copy = data.pages[0].published;
    return `<div class="office-stats">${stats.map(([number,label,note])=>`<article class="stat-card"><small>${label}</small><strong>${number.toString().padStart(2,'0')}</strong><p><span class="mini-dot"></span>${note}</p></article>`).join('')}</div>
    <div class="overview-layout"><section class="office-panel"><div class="panel-head"><div><h2>Conversations to move forward</h2><p>${escapeHTML(BUSINESSES[orgId].focus)}</p></div><a href="#leads">All leads →</a></div>${queue.length ? queue.map(item=>`<article class="queue-row"><span class="avatar" aria-hidden="true">${escapeHTML(contactName(item.contactId).split(' ').map(word=>word[0]).join('').slice(0,2))}</span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(contactName(item.contactId))} · ${escapeHTML(item.source)}</p><p>${escapeHTML(item.details)}</p>${action('leads',item.id,'Review enquiry')}</div>${badge(item.stage)}</article>`).join('') : '<p class="empty-state">No open enquiries. Add a lead to begin.</p>'}</section>
    <aside class="overview-side"><section class="office-panel"><div class="panel-head"><div><h2>Next conversations</h2><p>Asia/Manila · sample schedule</p></div><a href="#meetings">View all →</a></div>${upcoming.slice(0,2).map(item=>`<article class="meeting-mini"><div class="date-tile"><small>${dateLabel(item.date,{month:'short'})}</small><strong>${dateLabel(item.date,{day:'numeric'})}</strong></div><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(contactName(item.contactId))} · ${item.time}</p><p>${escapeHTML(item.mode)} · ${escapeHTML(item.status)}</p></div></article>`).join('') || '<p class="empty-state">No open meetings.</p>'}</section>
    <section class="office-panel"><div class="panel-head"><div><h2>Your website, at a glance</h2><p>Published demo copy</p></div><span class="badge published">Preview</span></div><div class="office-website-preview"><div class="mini-browser"><div class="browser-top"><i></i><i></i><i></i><span>${escapeHTML(BUSINESSES[orgId].website)}</span></div><div class="mini-site"><small>${escapeHTML(copy.eyebrow)}</small><strong>${escapeHTML(copy.headline).replace(/\n/g,'<br>')}</strong><p>${escapeHTML(copy.description)}</p><em>${escapeHTML(copy.cta)}</em></div></div><a class="plain-action" href="#content">Edit website copy →</a></div></section></aside></div>
    <section class="office-panel pipeline-panel"><div class="row spread"><h2>Enquiry pipeline</h2><span class="small muted">${data.leads.length} sample records</span></div><div class="pipeline-strip">${STAGES.map(stage=>`<div><small>${stage}</small><strong>${data.leads.filter(item=>item.stage===stage).length}</strong></div>`).join('')}</div></section>`;
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
    $('#view-label').textContent = {overview:'Overview',content:'Content & copy',leads:'Leads',contacts:'Contacts',meetings:'Meetings',settings:'Business settings'}[view];
    $('#website-link').href = business.website;
    $('#lead-count').textContent = org().leads.filter(item=>item.stage==='New').length;
    $('#view-eyebrow').textContent = views[view][0]; $('#view-title').textContent = views[view][1]; $('#view-description').textContent = views[view][2];
    $('#view-action').hidden = !views[view][3];
    $('#view-action').innerHTML = `${views[view][3]}<img class="icon" src="assets/plus.svg" alt="" width="20" height="20">`;
    document.querySelectorAll('[data-view]').forEach(link=>{if (link.dataset.view===view) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');});
    $('#office-view').innerHTML = view==='overview'?renderOverview():view==='content'?renderContent():['leads','contacts'].includes(view)?renderList():view==='meetings'?renderMeetings():renderSettings();
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
  $('#view-action').addEventListener('click',()=>openRecord(view==='contacts'?'contacts':view==='meetings'?'meetings':'leads'));
  $('#organization').addEventListener('change',event=>{if(!canLeave()){event.target.value=orgId;return;}orgId=event.target.value;pageId='home';const stored=persist();render();if(stored)toast(`Switched to ${BUSINESSES[orgId].short}.`);});
  document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');const next=link?.getAttribute('href').slice(1);if(next&&Object.hasOwn(views,next)){event.preventDefault();if(canLeave()){view=next;history.replaceState(null,'',`#${view}`);render();$('#main').scrollIntoView({block:'start'});}}});
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  $('#demo-info').addEventListener('click',()=>$('#info-dialog').showModal());$('#info-close').addEventListener('click',()=>$('#info-dialog').close());
  $('#reset-demo').addEventListener('click',()=>{if(window.confirm('Reset the fictional records and local edits in this tab?')){state=seedOffice();pageId='home';const stored=persist();$('#info-dialog').close();render();if(stored)toast('This tab’s demo has been reset.');}});
  const initial=location.hash.slice(1);if(Object.hasOwn(views,initial))view=initial;
  $('#organization').value=orgId;render();if(storageNotice)toast(storageNotice);
}
