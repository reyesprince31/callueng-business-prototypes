'use strict';

const BRIEF_CHOICES = {
  type: ['Residence', 'Renovation', 'Commercial space', 'Apartment building'],
  service: ['Design & build', 'Blueprint / plan set only', 'Blueprint printing / plan copies', 'Construction only', 'Renovation & fit-out', 'Help me decide'],
  site: ['To confirm', 'Available', 'Existing property'],
  finish: ['Help me decide', 'Standard', 'Mid-range', 'Premium'],
  budget: ['Discuss with the team', 'Below PHP 3 million', 'PHP 3-5 million', 'PHP 5-8 million', 'Above PHP 8 million'],
  timing: ['Still exploring', 'Within 3 months', 'Within 6 months', 'Later than 6 months'],
  drawings: ['Not yet', 'Concept drawings', 'Drawings for review'],
  priorities: ['Natural light', 'Room to grow', 'Easy maintenance', 'Work-from-home space', 'Outdoor connection', 'Accessible everyday use']
};

function validateProject(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Please check the project details.');
  if (!BRIEF_CHOICES.type.includes(raw.type)) throw new Error('Please choose a listed project type.');
  if (typeof raw.city !== 'string' || raw.city.trim().length < 2 || raw.city.trim().length > 80) throw new Error('Enter a city or municipality with 2 to 80 characters.');
  if (typeof raw.area !== 'string' && typeof raw.area !== 'number') throw new Error('Enter the approximate floor area.');
  const area = Number(raw.area);
  if (!Number.isFinite(area) || !Number.isInteger(area) || area < 20 || area > 2000) throw new Error('Enter a whole floor area from 20 to 2,000 m².');
  return {type:raw.type,city:raw.city.trim(),area};
}

function validateBrief(raw) {
  const project = validateProject(raw);
  const brief = {};
  for (const key of ['site', 'finish', 'budget', 'timing', 'drawings']) {
    if (!BRIEF_CHOICES[key].includes(raw[key])) throw new Error('Please choose a listed project option.');
    brief[key] = raw[key];
  }
  const service=raw.service===undefined ? 'Design & build' : raw.service;
  if(!BRIEF_CHOICES.service.includes(service))throw new Error('Choose a listed service preference.');
  if (!Array.isArray(raw.priorities) || raw.priorities.some(value => !BRIEF_CHOICES.priorities.includes(value))) throw new Error('Please check your priorities.');
  if (typeof raw.notes !== 'string' || raw.notes.length > 1000) throw new Error('Keep additional notes within 1,000 characters.');
  return {...brief, ...project, service, priorities: [...new Set(raw.priorities)], notes: raw.notes.trim()};
}

function briefQuestions(brief) {
  const questions = [brief.service==='Blueprint / plan set only' ? 'Which plan disciplines, drawing deliverables, and professional reviews are required for the proposal?' : (brief.service==='Blueprint printing / plan copies' ? 'What drawing version, paper size, quantity, print requirements, and turnaround should the provider confirm?' : 'Confirm the scope, measured floor area, and the information needed for a reviewed estimate.')];
  if (brief.site === 'To confirm') questions.push('What site information and access details are available?');
  if (brief.type === 'Renovation' || brief.site === 'Existing property') questions.push('What existing conditions need professional assessment, and will the space remain occupied?');
  if (brief.drawings === 'Not yet') questions.push('What drawings and professional input are needed to develop the brief?');
  else questions.push('Which drawing revisions and specifications should the team review?');
  if (brief.finish === 'Help me decide') questions.push('Which finish choices fit your intended use and maintenance priorities?');
  if (brief.timing !== 'Still exploring') questions.push('Which approvals, selections, and procurement dependencies affect your preferred start?');
  return questions;
}

function sampleAllowance(brief) {
  if(brief.service==='Blueprint / plan set only'||brief.service==='Blueprint printing / plan copies')throw new Error('A construction allowance does not price blueprint services.');
  // shortcut: fixed illustrative rates, replace with professionally reviewed quantities and rates before live estimating.
  const rate = {'Help me decide': 25000, Standard: 25000, 'Mid-range': 30000, Premium: 35000}[brief.finish];
  return {rate, total: brief.area * rate};
}

function briefText(brief) {
  return ['W.V. CALLUENG CONSTRUCTION | BUILD BRIEF', 'Website prototype: local planning record, not a quotation.', '',
    `Project: ${brief.type}`, `Service preference: ${brief.service||'Design & build'}`, `City or municipality: ${brief.city}`, `Approx. total floor area: ${brief.area} m²`,
    `Site information: ${brief.site}`, `Finish preference: ${brief.finish}`, `Budget preference: ${brief.budget}`,
    `Preferred timing: ${brief.timing}`, `Drawings: ${brief.drawings}`, '', 'PRIORITIES',
    brief.priorities.length ? brief.priorities.join('\n') : 'To discuss with the team', '', 'ADDITIONAL NOTES',
    brief.notes || 'None added', ...(brief.direction ? ['', directionText(brief.direction)] : []), '', 'OPEN QUESTIONS', ...briefQuestions(brief).map(value => `• ${value}`), '',
    'Discuss drawings, site conditions, measured quantities, specifications, exclusions, and professional review before committing.',
    'Nothing has been sent to the company. Contact: https://www.facebook.com/calluengconstruction'].join('\n');
}

// shortcut: prepared concept references, connect a server-side image service for bespoke generation.
const DESIGN_STYLES = {
  tropical:{name:'Modern tropical',description:'Warm materials, shaded openings, and a connection to greenery.',palette:'warm',pattern:/tropical|breezy|shaded|greenery/i},
  minimal:{name:'Warm minimalist',description:'Simple volumes, tactile neutrals, and room for everyday life.',palette:'stone',pattern:/minimal|simple|uncluttered/i},
  japandi:{name:'Japandi',description:'Natural timber, soft tones, and a calmer rhythm.',palette:'warm',pattern:/japandi|japanese|calm|zen/i},
  classic:{name:'Contemporary classic',description:'Balanced proportions, familiar details, and quiet refinement.',palette:'contrast',pattern:/classic|refined|traditional/i}
};
const PALETTES = {warm:'Warm sand & timber',stone:'Soft stone & oak',contrast:'Ivory & charcoal'};
const DESIGN_IDEAS = {exterior:['Shaded balcony','Garden entrance','Carport','Outdoor connection'],interior:['Natural light','Open living and dining','Built-in storage','Easy maintenance','A quiet work corner']};
const defaultDirection = () => ({style:'tropical',previewStyle:null,exteriorStyle:null,interiorStyle:null,palette:'warm',exteriorIdeas:[],interiorIdeas:[],note:'',chatNotes:[]});

function validateDirection(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Please check the saved design direction.');
  if (typeof raw.style!=='string'||typeof raw.palette!=='string'||!Object.hasOwn(DESIGN_STYLES,raw.style) || !Object.hasOwn(PALETTES,raw.palette)) throw new Error('Choose a listed theme and colour preference.');
  for (const key of ['previewStyle','exteriorStyle','interiorStyle']) if (raw[key] !== null && (typeof raw[key]!=='string'||!Object.hasOwn(DESIGN_STYLES,raw[key]))) throw new Error('Choose a listed concept reference.');
  for (const side of ['exterior','interior']) {
    const ideas=raw[side+'Ideas'];
    if (!Array.isArray(ideas) || ideas.length > 12 || ideas.some(value=>!DESIGN_IDEAS[side].includes(value))) throw new Error('Please check your design priorities.');
  }
  if (typeof raw.note !== 'string' || raw.note.length > 600) throw new Error('Keep your design note within 600 characters.');
  if (!Array.isArray(raw.chatNotes) || raw.chatNotes.length > 6 || raw.chatNotes.some(note=>typeof note !== 'string'||note.length > 600)) throw new Error('Please check the saved meeting questions.');
  return {style:raw.style,previewStyle:raw.previewStyle,exteriorStyle:raw.exteriorStyle,interiorStyle:raw.interiorStyle,palette:raw.palette,exteriorIdeas:[...new Set(raw.exteriorIdeas)],interiorIdeas:[...new Set(raw.interiorIdeas)],note:raw.note.trim(),chatNotes:raw.chatNotes.map(note=>note.trim()).filter(Boolean)};
}

function directionText(raw) {
  const d=validateDirection(raw);
  return ['DESIGN DIRECTION',`Exploring: ${DESIGN_STYLES[d.style].name}`,`Preferred exterior: ${d.exteriorStyle ? DESIGN_STYLES[d.exteriorStyle].name : 'To choose'}`,`Preferred interior: ${d.interiorStyle ? DESIGN_STYLES[d.interiorStyle].name : 'To choose'}`,`Colour preference: ${PALETTES[d.palette]}`,`Exterior ideas: ${d.exteriorIdeas.join(', ') || 'To discuss'}`,`Interior priorities: ${d.interiorIdeas.join(', ') || 'To discuss'}`,`Design note: ${d.note || 'None added'}`,'', 'RECENT ASSISTANT NOTES FOR THE MEETING (LATEST SIX)',...d.chatNotes.map(note=>'• '+note),'','AI concept references are prepared examples, not bespoke plans or verified project photographs. Custom colours and ideas are preferences for discussion.'].join('\n');
}

function conceptPrompts(project,raw) {
  const d=validateDirection(raw);
  return ['EXTERIOR CONCEPT PROMPT',`Explore a ${DESIGN_STYLES[d.exteriorStyle||d.style].name} exterior direction for a ${project.type.toLowerCase()} in ${project.city||'the Philippines'}. Approximate total floor area preference: ${project.area||'to confirm'} m². Palette preference: ${PALETTES[d.palette]}. Ideas: ${d.exteriorIdeas.join(', ')||'to discuss'}. ${d.note}`,'','INTERIOR CONCEPT PROMPT',`Explore a ${DESIGN_STYLES[d.interiorStyle||d.style].name} living and dining interior direction for the same project. Palette preference: ${PALETTES[d.palette]}. Priorities: ${d.interiorIdeas.join(', ')||'to discuss'}. ${d.note}`,'','Photorealistic inspiration only. Do not claim code compliance, construction feasibility, measured plans, or pricing. Final design requires site information and professional review.'].join('\n');
}

// shortcut: preset replies and six recent notes, replace with a reviewed AI workflow and conversation history for live use.
function assistantReply(message,raw) {
  const d=validateDirection(raw); const value=message.trim();
  if (!value || value.length>600) throw new Error('Enter a question of up to 600 characters.');
  if(/blueprints?|blueprinting|print.*plans|print.*drawings|plan copies/i.test(value))return {text:'W.V. Callueng Blueprinting Services is a separate printing business. If you already have drawings, prepare a print request with the revision, size, scale, sheets, sets, and pickup or delivery preference. Contact Blueprinting directly for file review and a quote.',href:'blueprinting.html#print-request',label:'Prepare a print request'};
  if (/budget|price|cost|quote|estimate|how much|\bphp\b|₱/i.test(value)) return {text:'A visual direction is a starting point. A useful estimate needs reviewed drawings, measured quantities, site conditions, specifications, and exclusions. Capture your preferences in the Build Brief so the team can discuss the scope with you.',href:'plan.html',label:'Build my brief'};
  if(/plan set|architectural plans|structural plans|drawings only|plans only/i.test(value))return {text:'The company’s published services include architectural, structural, and building-system plans. Start a plans-only brief so the team can clarify the required disciplines, deliverables, and professional review.',href:'plan.html?service=Blueprint%20%2F%20plan%20set%20only',label:'Prepare a plans-only brief'};
  if(/hardware|rentals?|hauling|cement|delivery|equipment|supplies/i.test(value))return {text:'The prototype has a proposed Hardware, Rentals & Hauling area. Record the need, quantities, timing, and access in a request brief. Supplier relationships, availability, and pricing still need confirmation.',href:'site-support.html',label:'Prepare a site support request'};
  if (/structural|beam|column|load.?bearing|foundation|permit|\bcode\b/i.test(value)) return {text:'I can help organize your question, but a concept image cannot establish structural safety, approval requirements, or feasibility. I have kept the question for the relevant professional to review at your meeting.',href:'team.html',label:'Meet the team'};
  if (/meeting|appointment|book\b|shortlist|summari[sz]e|preferences/i.test(value)) return {text:`Your exterior is ${d.exteriorStyle ? DESIGN_STYLES[d.exteriorStyle].name : 'still to choose'}; your interior is ${d.interiorStyle ? DESIGN_STYLES[d.interiorStyle].name : 'still to choose'}. Save both preferred views, add the project location and area, then download the meeting pack. The company must confirm any appointment.`,href:'index.html#imagine',label:'Open my design studio'};
  const matches=Object.keys(DESIGN_STYLES).filter(key=>DESIGN_STYLES[key].pattern.test(value));
  if (matches.length===1) {const style=matches[0];return {style,text:`I’ve selected ${DESIGN_STYLES[style].name} as your exploration theme. ${DESIGN_STYLES[style].description} Create the concept board to see the exterior and interior references, then save the views you like.`,href:'index.html#imagine',label:'Open the design studio'};}
  if (matches.length>1) return {text:'You can mix directions: explore one theme and choose its exterior, then explore another and choose its interior. I’ve kept your exact note so the team can understand the combination you have in mind.',href:'index.html#imagine',label:'Explore the directions'};
  return {text:'I’ve kept that as a note for your first meeting. Think about three things: how the place should feel, what it needs to support, and what you want to avoid. Choose a theme in the design studio, then add the exterior and interior ideas that matter to you.',href:'index.html#imagine',label:'Find my direction'};
}

function validateMeeting(raw,today) {
  if (!raw || !['Design consultation','Blueprint / plan consultation','Scope & budget discussion','Renovation planning'].includes(raw.kind) || typeof raw.date!=='string') throw new Error('Choose a listed conversation focus.');
  if (raw.date && (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date) || Number.isNaN(Date.parse(raw.date+'T12:00:00Z')) || new Date(raw.date+'T12:00:00Z').toISOString().slice(0,10)!==raw.date || raw.date<today)) throw new Error('Choose today or a future date, or leave it open.');
  return {kind:raw.kind,date:raw.date};
}
const escapeHTML = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function meetingHTML(project,raw,meeting,images) {
  const p=validateProject(project); const d=validateDirection(raw);
  if (!d.exteriorStyle || !d.interiorStyle) throw new Error('Choose both preferred views first.');
  for (const side of ['exterior','interior']) if (!/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(images[side])) throw new Error('The concept images could not be embedded.');
  const cards=['exterior','interior'].map(side=>`<article><div class="frame ${side}"><img src="${images[side]}" alt="${side} AI concept reference"></div><p>${side==='exterior'?'Preferred exterior':'Preferred interior'} · ${DESIGN_STYLES[d[side+'Style']].name}</p></article>`).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Callueng meeting pack</title><style>*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,sans-serif;color:#112b45;background:#f5f7fa}main{max-width:1120px;margin:auto;padding:40px 28px}header{background:#0b1c2d;color:#f5f7fa;padding:26px;border-radius:14px;margin-bottom:40px}h1{font-size:clamp(32px,5vw,56px);letter-spacing:-.05em;line-height:1.1;margin:18px 0}h2{margin-top:36px}p{margin:14px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}.frame{aspect-ratio:1;overflow:hidden;position:relative;border-radius:14px}.frame img{position:absolute;width:200%;max-width:none;height:100%;left:0;top:0}.frame.interior img{left:-100%}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;padding:26px;background:#e9eef5;border-radius:14px}small{display:block;color:#4b6175}a{color:#174acb}@media(max-width:620px){.pair{grid-template-columns:1fr}}@media print{body{background:white}main{padding:0}article,header{break-inside:avoid}.pair{gap:16px}pre{padding:16px}}</style><main><header><strong>W.V. CALLUENG CONSTRUCTION</strong><h1>Your design direction.</h1><p>${escapeHTML(p.type)} · ${escapeHTML(p.city)} · ${p.area} m² approximate total floor area</p></header><div class="pair">${cards}</div><h2>A conversation worth preparing.</h2><p><strong>${escapeHTML(meeting.kind)}</strong><br>Preferred date: ${escapeHTML(meeting.date||'To arrange with the team')}</p><pre>${escapeHTML(directionText(d))}</pre><h2>Questions to resolve together</h2><ul><li>Which site information and drawings are needed?</li><li>Which preferences fit the project constraints?</li><li>What is included, excluded, and still to decide?</li><li>How will scope, pricing, and timing be reviewed?</li></ul><p>This pack is a local conversation reference. Nothing was sent and no appointment was booked. Concepts are not construction plans or a quotation.</p><a href="https://www.facebook.com/calluengconstruction">Contact the official company page to arrange a meeting</a><small>Prepared in the website prototype. Company content and project-specific decisions require review.</small></main></html>`;
}

const SUPPORT_TYPES={materials:'Hardware & materials',rentals:'Equipment rentals',hauling:'Hauling & delivery'};
function validateSupport(raw,today) {
  if(!raw||!Array.isArray(raw.kinds)||!raw.kinds.length||raw.kinds.length>3||raw.kinds.some(key=>typeof key!=='string'||!Object.hasOwn(SUPPORT_TYPES,key)))throw new Error('Choose at least one service area.');
  if(typeof raw.city!=='string'||raw.city.trim().length<2||raw.city.length>80)throw new Error('Enter a city or municipality with 2 to 80 characters.');
  if(typeof raw.note!=='string'||raw.note.trim().length<10||raw.note.length>800)throw new Error('Describe your request in 10 to 800 characters.');
  validateMeeting({kind:'Design consultation',date:raw.date},today);
  return {kinds:[...new Set(raw.kinds)],city:raw.city.trim(),note:raw.note.trim(),date:raw.date};
}
function supportText(request) {
  return ['CALLUENG HARDWARE, RENTALS & HAULING | SERVICE REQUEST','Independent service business. Contact this provider directly; no construction project is required.','',`Service areas: ${request.kinds.map(key=>SUPPORT_TYPES[key]).join(', ')}`,`City or municipality: ${request.city}`,`Preferred date: ${request.date||'To discuss'}`,'','REQUEST DETAILS',request.note,'','Confirm specifications, quantities, access, availability, delivery or hire terms, destination, and pricing with the approved provider.','This is a local request brief. Nothing was sent, booked, ordered, or paid.'].join('\n');
}

if (typeof module !== 'undefined') module.exports = {validateProject,validateBrief,briefQuestions,sampleAllowance,briefText,defaultDirection,validateDirection,directionText,conceptPrompts,assistantReply,validateMeeting,meetingHTML,validateSupport,supportText};

const legacyPrintRoute=typeof document!=='undefined'&&!document.body.dataset.entity&&location.pathname.endsWith('/plan.html')&&new URLSearchParams(location.search).get('service')==='Blueprint printing / plan copies';
if(legacyPrintRoute)location.replace('blueprinting.html#print-request');
if (typeof document !== 'undefined' && !document.body.dataset.entity && !legacyPrintRoute) {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const text = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
  const make = (tag, value, className) => { const element = document.createElement(tag); if (value !== undefined) element.textContent = value; if (className) element.className = className; return element; };
  const currency = value => new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP', maximumFractionDigits: 0}).format(value);
  const query = new URLSearchParams(location.search);
  const download = (filename, value) => {
    const url = URL.createObjectURL(new Blob([value], {type: 'text/plain;charset=utf-8'}));
    const anchor = make('a'); anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  document.addEventListener('keydown', () => document.documentElement.classList.add('no-motion'));
  document.addEventListener('pointerdown', () => document.documentElement.classList.remove('no-motion'));

  const themeButton = $('button[data-theme]');
  const themeLabel = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', `Use ${dark ? 'light' : 'dark'} theme`);
    themeButton.querySelector('img').src = `assets/${dark ? 'sun' : 'moon'}.svg`;
  };
  themeLabel();
  themeButton.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('callueng-final-theme', document.documentElement.dataset.theme); } catch {}
    themeLabel();
  });
  const menu = $('[data-menu]');
  const navigation = $('#main-nav');
  const closeMenu = () => { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); menu.querySelector('img').src = 'assets/menu-2.svg'; };
  menu.addEventListener('click', () => {
    if (navigation.classList.contains('open')) { closeMenu(); return; }
    navigation.classList.add('open'); menu.setAttribute('aria-expanded', 'true'); menu.setAttribute('aria-label', 'Close navigation'); menu.querySelector('img').src = 'assets/x.svg';
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });
  $$('[data-open]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.open).showModal()));
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('[data-photo]').forEach(button => button.addEventListener('click', () => {
    $('#photo-image').src = button.dataset.photo; $('#photo-image').alt = button.dataset.title;
    text('photo-title', button.dataset.title); $('#photo-dialog').showModal();
  }));

  const concerns = {
    budget: ['Start with the scope. Then put numbers to it.', 'A floor area alone cannot tell the whole story. Site conditions, specifications, and priorities shape what the project needs.', 'Make assumptions visible', 'Capture the finish, exclusions, and information still needed.', 'Review before committing', 'Discuss drawings and measured quantities with the team.'],
    scope: ['Give the work a clear boundary.', 'Agree what is included, what is excluded, and which decisions remain open before work is released.', 'Define the deliverables', 'List drawings, specifications, work packages, and review points.', 'Keep revisions connected', 'Use a shared scope record when a selection or drawing changes.'],
    schedule: ['Understand what the next step depends on.', 'A credible schedule accounts for approvals, selections, procurement, inspections, and site access.', 'Resolve dependencies early', 'Identify the information needed before each stage can move ahead.', 'Review changes in context', 'Discuss the effect on both the work and the agreed timing.'],
    updates: ['Keep the project conversation together.', 'Clear updates connect completed work, outstanding questions, and the decisions the team needs from you.', 'Know what to review', 'See approved records and the next decision in one place.', 'Keep a useful record', 'Attach selections, changes, and documents to the project conversation.']
  };
  $$('[data-concern]').forEach(button => button.addEventListener('click', () => {
    $$('[data-concern]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    ['concern-title', 'concern-copy', 'concern-a-title', 'concern-a-copy', 'concern-b-title', 'concern-b-copy'].forEach((id, i) => text(id, concerns[button.dataset.concern][i]));
  }));
  $$('[data-project-filter]').forEach(button => button.addEventListener('click', () => {
    $$('[data-project-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    $$('.project-grid [data-category]').forEach(item => { item.hidden = button.dataset.projectFilter !== 'all' && item.dataset.category !== button.dataset.projectFilter; });
    $('#project-empty').hidden = $$('.project-grid [data-category]').some(item => !item.hidden);
  }));

  const projects = {
    residence: ['Two-storey residence', 'Residential', 'A layered facade, sheltered openings, and a confident presence at the street corner.', 'Designed to meet the street.', 'Grey wall planes, stone, glazing, and red-brown details come together in the published exterior. Roof and facade layers create depth around the corner.', 'Layered facade', 'Material and colour changes give the exterior a clear rhythm.', 'Sheltered openings', 'Roof projections frame the upper-level windows and balcony.', '171738453/TWO-(2)-STOREY-RESIDENCE'],
    bungalow: ['Bungalow house', 'Residential', 'A low-rise home with a welcoming entrance and a composed roofline.', 'Everyday life on one level.', 'The published image presents a bungalow with a front porch, contrasting exterior materials, and a prominent pitched roof.', 'A sheltered arrival', 'The entrance sits beneath the front roof projection.', 'A clear roofline', 'The pitched roof gives the home a distinct silhouette.', '171732827/BUNGALOW-HOUSE'],
    basement: ['Residence with basement', 'Residential', 'A residential composition shaped around a lower level and a sheltered frontage.', 'A different way to meet the ground.', 'The company identifies this portfolio entry as a one-storey residence with a basement. The image is a reference for a conversation about site levels and intended use.', 'Level changes', 'The published project name introduces a lower-level residential arrangement.', 'Site questions', 'Actual site levels, drainage, and structural decisions need project-specific review.', '171733601/ONE-STOREY-RESIDENTIAL-WITH-BASEMENT'],
    roofdeck: ['Residence with roof deck', 'Residential', 'A vertical residential form with an upper outdoor space.', 'Room to look beyond the walls.', 'The published portfolio identifies a two-storey residence with a roof deck. Its exterior offers a starting point for discussing the relationship between indoor and outdoor use.', 'An upper outdoor space', 'The project title identifies a roof deck as part of the design.', 'A coordinated brief', 'Use, access, weather protection, and structure belong in the scope discussion.', '171734435/TWO-STOREY-RESIDENTIAL-W-ROOFDECK'],
    court: ['Covered court', 'Community', 'A sheltered shared space for everyday activity and community use.', 'A place to come together.', 'This published portfolio entry presents a covered court. The broad roof and open sides give the space its visible character.', 'A shared roof', 'The roof spans the activity area shown in the published image.', 'Open edges', 'The open-sided form keeps the activity space visually connected to its surroundings.', '171734731/COVERED-COURT'],
    renovation: ['Major renovation works', 'Renovation', 'A company-published reference for the work of changing an existing place.', 'Begin with what is already there.', 'The company identifies this entry as major renovation works. Existing conditions, retained elements, and the intended change are essential questions for any comparable project.', 'Existing conditions', 'Review the property and what should be retained before defining interventions.', 'A clear change record', 'Connect the intended improvement with an assessed, agreed scope.', '171761307/MAJOR-RENOVATION-WORKS'],
    apartments: ['Apartment building', 'Residential', 'A published reference for housing that serves more than one household.', 'Think about the whole building.', 'The apartment portfolio reference opens a conversation about residents, shared facilities, access, and maintenance. Exact areas, specifications, and occupancy are not provided here.', 'Shared priorities', 'Bring common spaces and operations into the project brief.', 'A considered scope', 'Review user needs and supporting facilities with the relevant professionals.', null]
  };
  if ($('#project-title')) {
    const key = Object.hasOwn(projects, query.get('project')) ? query.get('project') : 'residence';
    const item = projects[key];
    ['project-title', 'project-category', 'project-lead', 'project-story-title', 'project-story-copy', 'project-feature-a', 'project-feature-a-copy', 'project-feature-b', 'project-feature-b-copy'].forEach((id, i) => text(id, item[i]));
    text('project-type', item[1]);
    for (const id of ['project-hero', 'project-gallery-image']) { const image = document.getElementById(id); image.src = `assets/${key}.webp`; image.alt = `${item[0]} from the published Callueng portfolio`; }
    $('#project-photo-open').dataset.photo = `assets/${key}.webp`; $('#project-photo-open').dataset.title = item[0];
    $('#project-source').href = item[9] ? `https://www.behance.net/gallery/${item[9]}` : 'https://www.behance.net/calluengconstruction';
    document.title = `${item[0]} | W.V. Callueng Construction`;
  }

  const guides = {
    budget: ['Budget', 'What an estimate needs before it becomes useful.', 'Look beyond the total to the quantities, specifications, exclusions, and assumptions behind it.', [['Begin with a defined scope.', 'The figure is only as useful as the work it describes. Ask which drawings, revision dates, specifications, and measured quantities the estimate uses.'], ['Read the assumptions.', 'Check what is included and excluded. Ask how site work, professional input, approvals, contingencies, and selections are represented. Do not assume every allowance is a fixed price.'], ['Keep changes connected to the record.', 'If a finish or drawing changes, review its effect on quantities and the agreed work. Keep the revised record available to everyone making decisions.']], ['Drawing and revision reference', 'Quantity and specification basis', 'Inclusions and exclusions', 'Allowances that still need selection', 'Items requiring professional review']],
    scope: ['Scope', 'Define the work before the build begins.', 'Separate the work you need from the decisions that are still open.', [['Describe the intended outcome.', 'Start with how the place should work. Capture users, spaces, retained elements, and priorities so the discussion has a clear purpose.'], ['Make the boundaries visible.', 'List deliverables and work packages. Record what is included, excluded, and still awaiting information. For renovations, identify existing conditions that need assessment.'], ['Keep one current reference.', 'Connect the scope to reviewed drawings and specifications. Record proposed changes and confirm which version is current before work moves ahead.']], ['Intended use and priorities', 'Reviewed drawing references', 'Deliverables and work packages', 'Inclusions and exclusions', 'Open decisions and responsible reviewers']],
    schedule: ['Planning', 'Understand what a build schedule depends on.', 'The sequence matters, but so does the information each stage needs.', [['Look at the dependencies.', 'A start date depends on more than availability. Ask which approvals, documents, site access arrangements, and selections must be ready first.'], ['Agree decision dates.', 'Materials and finishes may need advance selection and procurement. Ask when decisions are required and what happens if information arrives late.'], ['Review progress with context.', 'A useful update says what was completed, what remains open, and what affects the next milestone. Discuss proposed changes against the agreed scope and timing.']], ['Preparation and approvals', 'Site access and existing conditions', 'Selection and procurement dates', 'Inspection and review points', 'Dependencies affecting the next milestone']],
    changes: ['Client care', 'Keep project changes clear.', 'A change is easier to review when the proposed work and its impact are together.', [['Describe the proposed change.', 'Name the affected work, the reason for the change, and the drawing or selection it relates to. Keep reference information attached to the request.'], ['Review the impact before release.', 'Ask how the proposal affects specifications, quantities, cost, and timing. Identify what the team still needs to verify before the decision can be made.'], ['Keep the agreed record.', 'Once reviewed through the agreed project procedure, retain the approved version and make sure the people coordinating the work can find it.']], ['Description and reason', 'Affected drawing or selection', 'Specification and quantity impact', 'Cost and schedule impact', 'Reviewed decision and current version']],
    handover: ['Client care', 'The records to keep at handover.', 'Agree what you expect to receive before the final review.', [['Set expectations early.', 'Ask which completion records belong to your project and who prepares them. The required documents depend on the work and the agreed scope.'], ['Inspect and record follow-up items.', 'Review completed work with the team. Record any agreed items for follow-up, who is responsible, and how completion will be confirmed.'], ['Keep information useful.', 'Collect relevant approved drawings, warranties, maintenance information, and contact details for agreed aftercare. Store them somewhere you can access when needed.']], ['Agreed completion records', 'Relevant approved drawings', 'Warranties and maintenance information', 'Recorded follow-up items', 'Aftercare contacts and agreed procedure']]
  };
  if ($('#article-content') && Object.hasOwn(guides, query.get('topic'))) {
    const [category, title, lead, sections, checklist] = guides[query.get('topic')];
    text('article-category', category); text('article-title', title); text('article-lead', lead);
    const content = $('#article-content'); content.replaceChildren();
    sections.forEach(([heading, body]) => content.append(make('h2', heading), make('p', body)));
    content.append(make('h2', 'Questions to bring to the conversation.'));
    const list = make('div', undefined, 'checklist');
    checklist.forEach(value => { const label = make('label', undefined, 'check-item'); const input = make('input'); input.type = 'checkbox'; label.append(input, make('span', value)); list.append(label); });
    content.append(list, make('p', 'General planning guidance only. Confirm project-specific technical and approval requirements with the relevant professionals.', 'small'));
    document.title = `${title} | W.V. Callueng Construction`;
  }

  let direction=defaultDirection();
  try { const saved=JSON.parse(sessionStorage.getItem('callueng-final-direction')||'null'); if(saved) direction=validateDirection(saved); } catch { text('direction-save-status','The saved direction could not be restored. You can make a new selection here.'); }
  const saveDirection=()=>{
    direction=validateDirection(direction);
    try {sessionStorage.setItem('callueng-final-direction',JSON.stringify(direction));}
    catch {text('direction-save-status','Choices remain on this page but could not be saved in the tab. Download a meeting pack before leaving.');}
  };
  const directionSummary=()=>`Exterior: ${direction.exteriorStyle ? DESIGN_STYLES[direction.exteriorStyle].name : 'to choose'} · Interior: ${direction.interiorStyle ? DESIGN_STYLES[direction.interiorStyle].name : 'to choose'}`;
  const renderDirection=()=>{
    $$('[data-direction-style]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.directionStyle===direction.style)));
    $$('[data-palette]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.palette===direction.palette)));
    $$('[data-direction-idea]').forEach(input=>{input.checked=direction[input.dataset.directionIdea+'Ideas'].includes(input.value);});
    if($('#direction-note')) $('#direction-note').value=direction.note;
    text('direction-active',DESIGN_STYLES[direction.style].name);text('direction-description',DESIGN_STYLES[direction.style].description);
    text('direction-summary',directionSummary());text('assistant-context',direction.exteriorStyle||direction.interiorStyle ? directionSummary() : DESIGN_STYLES[direction.style].name+' · exploring');
    if($('#meeting-open')) $('#meeting-open').disabled=!(direction.exteriorStyle&&direction.interiorStyle);
    if($('#direction-preview')) {
      $('#direction-preview').hidden=!direction.previewStyle;
      if(direction.previewStyle) {
        const style=direction.previewStyle; const name=DESIGN_STYLES[style].name;
        text('direction-preview-title',name+', inside and out.');
        for(const side of ['exterior','interior']) {const image=$('#direction-'+side+'-image');image.src=`assets/direction-${style}.webp`;image.alt=`${name} ${side} AI concept reference`;text('direction-'+side+'-title',name);}
        $$('[data-save-view]').forEach(button=>{const saved=direction[button.dataset.saveView+'Style']===style;button.setAttribute('aria-pressed',String(saved));button.textContent=saved ? (button.dataset.saveView==='exterior'?'Exterior chosen':'Interior chosen') : (button.dataset.saveView==='exterior'?'Choose exterior':'Choose interior');});
      }
    }
  };
  renderDirection();
  $$('[data-direction-style]').forEach(button=>button.addEventListener('click',()=>{direction.style=button.dataset.directionStyle;direction.palette=DESIGN_STYLES[direction.style].palette;saveDirection();renderDirection();}));
  $$('[data-palette]').forEach(button=>button.addEventListener('click',()=>{direction.palette=button.dataset.palette;saveDirection();renderDirection();}));
  $$('[data-direction-idea]').forEach(input=>input.addEventListener('change',()=>{direction[input.dataset.directionIdea+'Ideas']=$$(`[data-direction-idea="${input.dataset.directionIdea}"]`).filter(item=>item.checked).map(item=>item.value);saveDirection();}));
  $('#direction-note')?.addEventListener('input',event=>{direction.note=event.target.value;saveDirection();});
  $('#direction-generate')?.addEventListener('click',()=>{direction.previewStyle=direction.style;saveDirection();renderDirection();const heading=$('#direction-preview-title');heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'instant'});});
  $$('[data-save-view]').forEach(button=>button.addEventListener('click',()=>{direction[button.dataset.saveView+'Style']=direction.previewStyle;saveDirection();renderDirection();}));
  $('#direction-save-both')?.addEventListener('click',()=>{direction.exteriorStyle=direction.previewStyle;direction.interiorStyle=direction.previewStyle;saveDirection();renderDirection();text('direction-save-status','Both views are in your shortlist. Add the project details below to prepare your meeting pack.');});

  const quickForm=$('#direction-project');
  if(quickForm) {
    try {
      const draft=JSON.parse(sessionStorage.getItem('callueng-final-brief')||'null');
      if(draft&&typeof draft==='object') {
        if(BRIEF_CHOICES.type.includes(draft.type)) quickForm.elements.type.value=draft.type;
        if(typeof draft.city==='string') quickForm.elements.city.value=draft.city.slice(0,80);
        if((typeof draft.area==='string'||typeof draft.area==='number')&&Number.isInteger(Number(draft.area))&&Number(draft.area)>=20&&Number(draft.area)<=2000) quickForm.elements.area.value=draft.area;
      }
    } catch {}
    const saveProject=()=>{
      quickForm.elements.city.setCustomValidity('');
      try {let draft=JSON.parse(sessionStorage.getItem('callueng-final-brief')||'{}');if(!draft||typeof draft!=='object'||Array.isArray(draft))draft={};sessionStorage.setItem('callueng-final-brief',JSON.stringify({...draft,...Object.fromEntries(new FormData(quickForm))}));}
      catch {text('direction-save-status','Project details could not be saved in this tab. Keep a downloaded copy before leaving.');}
    };
    quickForm.addEventListener('input',saveProject);quickForm.addEventListener('change',saveProject);quickForm.addEventListener('submit',saveProject);
    $('#direction-prompt-download').addEventListener('click',()=>{download('Callueng-Concept-Prompts.txt',conceptPrompts(Object.fromEntries(new FormData(quickForm)),direction));text('direction-save-status','AI prompts prepared for download. They include your preferences for a future design conversation.');});
  }
  let meetingProject;
  const localToday=()=>{const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
  $('#meeting-date').min=localToday();
  $('#meeting-open')?.addEventListener('click',()=>{
    if(quickForm.elements.city.value.trim().length<2)quickForm.elements.city.setCustomValidity('Enter a city or municipality for the meeting pack.');
    if(!quickForm.reportValidity())return;
    try {meetingProject=validateProject(Object.fromEntries(new FormData(quickForm)));}catch(error){text('studio-error',error.message);$('#studio-error').hidden=false;return;}
    $('#studio-error').hidden=true;text('meeting-direction-summary',directionSummary());$('#meeting-status').hidden=true;$('#meeting-dialog').showModal();
  });
  $('#meeting-form').addEventListener('submit',async event=>{
    event.preventDefault();const button=$('#meeting-download');button.disabled=true;button.firstChild.textContent='Preparing your pack';$('#meeting-status').hidden=false;text('meeting-status','Embedding your preferred concept references…');
    try {
      const meeting=validateMeeting({kind:$('#meeting-kind').value,date:$('#meeting-date').value},localToday());
      const entries=await Promise.all(['exterior','interior'].map(async side=>{
        const response=await fetch(`assets/direction-${direction[side+'Style']}.webp`);if(!response.ok)throw new Error('image');
        const blob=await response.blob();const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});return [side,data];
      })).catch(()=>{throw new Error('image');});
      const html=meetingHTML(meetingProject,direction,meeting,Object.fromEntries(entries));
      const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const anchor=make('a');anchor.href=url;anchor.download='Callueng-Meeting-Pack.html';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      text('meeting-status','Meeting pack prepared for download, with both images embedded. Nothing was sent and no appointment was booked. Contact Callueng to confirm a meeting.');
    } catch(error) {text('meeting-status',error.message==='image' ? 'The images could not be embedded. Keep your choices in the Build Brief and try the local preview server again.' : (error instanceof Error ? error.message : 'The meeting pack could not be created. Your choices are still on this page.'));}
    finally {button.disabled=false;button.firstChild.textContent='Download meeting pack';}
  });

  const chatPanel=$('#design-chat-panel');const chatLaunch=$('#assistant-launch');const chatField=$('#assistant-input');
  const nativePopover=typeof chatPanel.showPopover==='function';
  if(!nativePopover){chatPanel.removeAttribute('popover');chatPanel.classList.add('chat-fallback');chatPanel.hidden=true;}
  const openChat=()=>{if(nativePopover){if(!chatPanel.matches(':popover-open'))chatPanel.showPopover();}else chatPanel.hidden=false;chatLaunch.setAttribute('aria-expanded','true');chatField.focus({preventScroll:true});};
  const closeChat=()=>{if(nativePopover){if(chatPanel.matches(':popover-open'))chatPanel.hidePopover();}else chatPanel.hidden=true;chatLaunch.setAttribute('aria-expanded','false');};
  chatLaunch.addEventListener('click',()=>{if(chatLaunch.getAttribute('aria-expanded')==='true')closeChat();else openChat();});
  $('#assistant-close').addEventListener('click',()=>{closeChat();chatLaunch.focus({preventScroll:true});});
  if(nativePopover)chatPanel.addEventListener('toggle',event=>chatLaunch.setAttribute('aria-expanded',String(event.newState==='open')));
  else document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeChat();}});
  $$('[data-ask-assistant]').forEach(button=>button.addEventListener('click',openChat));
  const sendChat=value=>{
    let answer;try{answer=assistantReply(value,direction);}catch(error){chatField.setCustomValidity(error.message);chatField.reportValidity();return;}
    direction.chatNotes=[...direction.chatNotes,value.trim()].slice(-6);
    if(answer.style){direction.style=answer.style;direction.palette=DESIGN_STYLES[answer.style].palette;}
    if(/natural light|bright|airy/i.test(value)&&!direction.interiorIdeas.includes('Natural light'))direction.interiorIdeas.push('Natural light');
    if(/storage/i.test(value)&&!direction.interiorIdeas.includes('Built-in storage'))direction.interiorIdeas.push('Built-in storage');
    saveDirection();renderDirection();
    const question=make('article',undefined,'assistant-message own');question.append(make('strong','You'),make('p',value.trim()));
    const response=make('article',undefined,'assistant-message');response.append(make('strong','Design assistant'),make('p',answer.text));const link=make('a',answer.label,'text-link');link.href=answer.href;link.addEventListener('click',closeChat);response.append(link);
    $('#assistant-log').append(question,response);$('#assistant-log').scrollTop=$('#assistant-log').scrollHeight;chatField.value='';chatField.focus({preventScroll:true});
  };
  $$('[data-chat-prompt]').forEach(button=>button.addEventListener('click',()=>sendChat(button.dataset.chatPrompt)));
  chatField.addEventListener('input',()=>chatField.setCustomValidity(''));
  $('#assistant-form').addEventListener('submit',event=>{event.preventDefault();sendChat(chatField.value);});
  chatField.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();$('#assistant-form').requestSubmit();}});

  const form = $('#brief-form');
  if (form) {
    if(direction.previewStyle||direction.chatNotes.length||direction.note) {
      const reference=make('aside',undefined,'brief-direction');reference.append(make('h3','From your design studio'),make('p',directionSummary()+' · '+PALETTES[direction.palette]));const link=make('a','Review or change my direction','text-link');link.href='index.html#imagine';reference.append(link);form.querySelector('.wizard-body').prepend(reference);
    }
    let step = 0;
    let completed;
    const collect = () => { const data = new FormData(form); return Object.fromEntries([...data.entries()].filter(([key]) => key !== 'priority').concat([['priorities', data.getAll('priority')]])); };
    const restore = draft => {
      if (!draft || typeof draft !== 'object') return;
      for (const key of Object.keys(BRIEF_CHOICES).filter(key => key !== 'priorities')) if (BRIEF_CHOICES[key].includes(draft[key]) && draft[key]!=='Blueprint printing / plan copies') form.elements[key].value = draft[key];
      if (typeof draft.city === 'string') form.elements.city.value = draft.city.slice(0, 80);
      if (/^\d{1,4}$/.test(String(draft.area)) && Number(draft.area) >= 20 && Number(draft.area) <= 2000) form.elements.area.value = draft.area;
      if (typeof draft.notes === 'string') form.elements.notes.value = draft.notes.slice(0, 1000);
      if (Array.isArray(draft.priorities)) $$('input[name=priority]').forEach(input => { input.checked = draft.priorities.includes(input.value); });
    };
    try { restore(JSON.parse(sessionStorage.getItem('callueng-final-brief') || 'null')); } catch { text('brief-save-status', 'Session storage is unavailable. Download your completed brief before leaving. Nothing is sent.'); }
    const seed = {};
    for (const key of ['type', 'city', 'area','service']) if (query.has(key)) seed[key] = query.get(key);
    restore(seed);
    const save = () => { try { sessionStorage.setItem('callueng-final-brief', JSON.stringify(collect())); } catch { text('brief-save-status', 'Your draft could not be saved in this tab. Download your completed brief before leaving. Nothing is sent.'); } };
    const showStep = (next, focus = true) => {
      step = next;
      $$('[data-step]').forEach(item => { item.hidden = Number(item.dataset.step) !== step; });
      $$('[data-progress]').forEach(item => { if (Number(item.dataset.progress) === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
      $('#brief-back').hidden = step === 0;
      $('#brief-next').firstChild.textContent = step === 2 ? 'Create my brief' : 'Continue';
      $('#brief-error').hidden = true;
      if (focus) { const heading = $(`[data-step="${step}"] h2`); heading.tabIndex = -1; heading.focus({preventScroll: true}); heading.scrollIntoView({block: 'nearest', behavior: 'instant'}); }
    };
    form.addEventListener('input', () => { form.elements.city.setCustomValidity(''); $('#brief-error').hidden = true; save(); });
    form.addEventListener('change', save);
    $('#brief-back').addEventListener('click', () => showStep(Math.max(0, step - 1)));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (step === 0 && form.elements.city.value.trim().length < 2) form.elements.city.setCustomValidity('Enter a city or municipality.');
      const invalid = [...$(`[data-step="${step}"]`).querySelectorAll('input,select,textarea')].find(input => !input.checkValidity());
      if (invalid) { invalid.reportValidity(); return; }
      save();
      if (step < 2) { showStep(step + 1); return; }
      try { completed = validateBrief(collect()); } catch (error) { text('brief-error', error.message); $('#brief-error').hidden = false; return; }
      if(direction.previewStyle||direction.chatNotes.length||direction.note)completed.direction=validateDirection(direction);
      text('brief-result-title', `${completed.type} in ${completed.city}`);
      const facts = $('#brief-facts'); facts.replaceChildren();
      for (const [label, value] of [['Service preference',completed.service==='Blueprint / plan set only'?'Plan preparation / engineering':completed.service],['Floor area', `${completed.area} m²`], ['Site information', completed.site], ['Finish preference', completed.finish], ['Budget preference', completed.budget], ['Preferred timing', completed.timing], ['Drawings', completed.drawings]]) { const row = make('div'); row.append(make('dt', label), make('dd', value)); facts.append(row); }
      text('brief-priorities', (completed.priorities.length ? completed.priorities.join(' · ') : 'To discuss with the team') + (completed.notes ? `\n\n${completed.notes}` : ''));
      $('#brief-design')?.remove();if(completed.direction){const reference=make('div',undefined,'form-status');reference.id='brief-design';reference.append(make('h3','Your design direction'),make('p',directionText(completed.direction)));$('#brief-priorities').after(reference);}
      $('#brief-checks').replaceChildren(...briefQuestions(completed).map(value => make('li', value)));
      const allowanceDetails=$('#budget-example').closest('details');allowanceDetails.hidden=completed.service==='Blueprint / plan set only'||completed.service==='Blueprint printing / plan copies';
      if(!allowanceDetails.hidden){const allowance = sampleAllowance(completed);text('budget-example', `${completed.area} m² × ${currency(allowance.rate)} per m² = ${currency(allowance.total)}\nIllustrative arithmetic only. Not a company quotation.`);}
      form.hidden = true; $('.wizard-nav').hidden = true; $('#brief-result').hidden = false;
      $('#brief-result-title').tabIndex = -1; $('#brief-result-title').focus({preventScroll: true}); $('#brief-result-title').scrollIntoView({block: 'start', behavior: 'instant'});
    });
    $('#brief-edit').addEventListener('click', () => { $('#brief-result').hidden = true; $('#brief-download-status').hidden = true; form.hidden = false; $('.wizard-nav').hidden = false; showStep(0); });
    $('#brief-download').addEventListener('click', () => {
      if (!completed) return;
      download('Callueng-Build-Brief.txt', briefText(completed));
      text('brief-download-status', 'Brief prepared for download. Keep a copy for your first conversation. Nothing was sent.'); $('#brief-download-status').hidden = false;
    });
  }

  const tabs = $$('[data-tab]');
  const selectTab = name => {
    tabs.forEach(tab => { const selected = tab.dataset.tab === name; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next].dataset.tab); tabs[next].focus(); }
    });
  });
  $$('[data-portal-next]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.portalNext; selectTab(name);
    if (name === 'messages') { $('#portal-message').value = 'Could you show another exterior finish option?'; $('#portal-message').focus(); }
    else document.getElementById(`tab-${name}`).focus();
  }));
  $('#approve-finish')?.addEventListener('click', () => {
    $('#portal-decision-actions').hidden = true;
    text('portal-status', 'All sample decisions reviewed'); text('portal-approval-status', 'Approved in this demo. The sample team can see your selection here. No real approval or order was created.'); $('#portal-approval-status').hidden = false;
    $('#portal-approval-status').tabIndex = -1; $('#portal-approval-status').focus();
  });
  const documents = {
    update: ['Weekly progress update', 'SANTOS RESIDENCE | SAMPLE UPDATE\n\nStructural milestone: in progress example.\nOpen review: inspection items before the next stage.\nClient decision: exterior accent finish.\n\nFictional record for the prototype. No real site progress is represented.'],
    drawings: ['Drawing register', 'SANTOS RESIDENCE | SAMPLE DRAWING REGISTER\n\nArchitecture: revision to be confirmed by the sample team.\nEngineering: review status example only.\nSelections: exterior accent finish for review.\n\nNo actual drawings are included. A live register must identify document numbers, revisions, reviewers, and approved use.'],
    handover: ['Handover checklist', 'SANTOS RESIDENCE | SAMPLE HANDOVER CHECKLIST\n\n[ ] Review completed work.\n[ ] Record agreed follow-up items.\n[ ] Collect relevant approved drawings.\n[ ] Collect warranties and maintenance information.\n[ ] Confirm the agreed aftercare procedure.\n\nGeneral sample only. Confirm project-specific records with the team.']
  };
  let selectedDocument;
  $$('[data-document]').forEach(button => button.addEventListener('click', () => {
    selectedDocument = documents[button.dataset.document]; text('document-title', selectedDocument[0]); text('document-body', selectedDocument[1]); $('#document-dialog').showModal();
  }));
  $('#download-document').addEventListener('click', () => { if (selectedDocument) download('Callueng-Sample-Record.txt', selectedDocument[1]); });
  $('#portal-message')?.addEventListener('input', () => $('#portal-message').setCustomValidity(''));
  $('#portal-message-form')?.addEventListener('submit', event => {
    event.preventDefault(); const field = $('#portal-message'); const value = field.value.trim();
    if (!value || value.length > 1500) { field.setCustomValidity('Enter a message of up to 1,500 characters.'); field.reportValidity(); return; }
    const message = make('article', undefined, 'message own'); message.append(make('strong', 'Isabel Santos, sample client'), make('p', value)); $('#conversation').append(message);
    field.value = ''; text('portal-message-status', 'Message added to this demo only. Nothing was sent to the company.'); $('#portal-message-status').hidden = false;
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, {threshold: 0.08});
    $$('.reveal').forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
    reducedMotion.addEventListener('change', event => { if (event.matches) { observer.disconnect(); $$('.reveal-ready').forEach(element => element.classList.add('visible')); } });
  }
}
