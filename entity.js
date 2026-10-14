'use strict';

const PRINT_CHOICES={
  role:['Architect','Engineer','Contractor','Property owner','Other'],
  size:['A3','A2','A1','A0','18 × 24 in','24 × 36 in','36 × 48 in','Discuss with the shop'],
  colour:['Black & white','Colour','Mixed pages — specify in notes'],
  scale:['100% / actual size','50% / half size','Confirm scale before printing'],
  finish:['Loose sheets','Rolled sets','Folded sets'],
  fulfilment:['Pickup','Delivery']
};
function validatePrintFiles(files){
  if(!Array.isArray(files)||files.length>10)throw new Error('Choose up to 10 PDF files, each no larger than 20 MB.');
  return files.map(f=>{
    if(!f||typeof f.name!=='string'||f.name.length>255||!/\.pdf$/i.test(f.name)||!Number.isInteger(f.size)||f.size<1||f.size>20971520)throw new Error('Choose PDF files between 1 byte and 20 MB each.');
    return {name:f.name,size:f.size};
  });
}
async function validatePDFSelection(files){
  const metadata=validatePrintFiles(files.map(f=>({name:f.name,size:f.size})));
  // shortcut: checks only a PDF header; use a real PDF preflight and page parser before accepting live print jobs.
  for(const file of files)if(await file.slice(0,5).text()!=='%PDF-')throw new Error('A selected file has no PDF header. Export it as PDF and choose it again.');
  return metadata;
}
function validatePrintRequest(raw,today){
  if(!raw||typeof raw!=='object')throw new Error('Please check the print request.');
  const result={};
  for(const key of ['job','revision','city','notes']){
    if(typeof raw[key]!=='string')throw new Error('Please check the text fields.');
    result[key]=raw[key].trim();
  }
  if(result.job.length<2||result.job.length>120)throw new Error('Enter a print-job reference with 2–120 characters.');
  if(result.revision.length>80||result.city.length>80||result.notes.length>800)throw new Error('Shorten the revision, city, or notes to the field limits.');
  for(const [key,choices] of Object.entries(PRINT_CHOICES)){
    if(!choices.includes(raw[key]))throw new Error('Choose a listed '+key+' preference.');
    result[key]=raw[key];
  }
  for(const [key,max] of [['pages',2000],['sets',100]]){
    if(!['string','number'].includes(typeof raw[key])||!/^[0-9]+$/.test(String(raw[key]))||!Number.isInteger(Number(raw[key]))||Number(raw[key])<1||Number(raw[key])>max)throw new Error(`Enter ${key} as a whole number between 1 and ${max}.`);
    result[key]=Number(raw[key]);
  }
  if(result.fulfilment==='Delivery'&&result.city.length<2)throw new Error('Enter the delivery city or municipality.');
  if(typeof raw.date!=='string'||(raw.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(raw.date)||!Number.isFinite(Date.parse(raw.date+'T00:00:00Z'))||new Date(raw.date+'T00:00:00Z').toISOString().slice(0,10)!==raw.date||raw.date<today)))throw new Error('Choose a valid requested date from today onward.');
  result.date=raw.date;result.sheets=result.pages*result.sets;return result;
}
function printRequestText(r,files){
  return ['W.V. CALLUENG BLUEPRINTING SERVICES | PRINT REQUEST','Independent printing business. This request is not a construction enquiry.','',`Job: ${r.job}`,`Customer role: ${r.role}`,`Drawing revision: ${r.revision||'To confirm'}`,`Requested size: ${r.size}`,`Colour: ${r.colour}`,`Scale: ${r.scale}`,`${r.pages} drawing pages × ${r.sets} sets = ${r.sheets} printed sheets`,`Finishing: ${r.finish}`,`Fulfilment: ${r.fulfilment}`,`Delivery area: ${r.fulfilment==='Delivery'?r.city:'Confirm collection location with the shop'}`,`Requested ready date: ${r.date||'To discuss'}`,'','LOCAL FILE LIST',...(files.length?files.map(f=>f.name+' ('+(f.size/1024).toFixed(1)+' KB)'):['Files to supply separately.']),'File contents are not included. Page count is entered by the customer, not read from a PDF.','','PRINT NOTES',r.notes||'No additional instructions.','','BEFORE PRODUCTION','Shop to verify the intended revision, PDF page sizes, scale, selected sheets, print quality, paper/finishing availability, price, and timing.','Do not scale to fit or substitute a revision without customer confirmation.','Send the correct PDFs and request directly to the printing business using its approved channel.','Nothing was uploaded, sent, ordered, or paid.'].join('\n');
}
if(typeof module!=='undefined')module.exports={validatePrintRequest,printRequestText,validatePrintFiles,validatePDFSelection};

if(typeof document!=='undefined'&&document.body.dataset.entity){
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const text=(id,value)=>{const e=document.getElementById(id);if(e)e.textContent=value;};
  const localToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
  const download=(filename,value)=>{const url=URL.createObjectURL(new Blob([value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const theme=$('button[data-theme]');
  const themeLabel=()=>{const dark=document.documentElement.dataset.theme==='dark';theme.setAttribute('aria-label',`Use ${dark?'light':'dark'} theme`);theme.querySelector('img').src=`assets/${dark?'sun':'moon'}.svg`;};
  themeLabel();theme.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('callueng-'+document.body.dataset.entity+'-theme',document.documentElement.dataset.theme);}catch{}themeLabel();});
  const menu=$('[data-menu]'),nav=$('#main-nav');
  const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.querySelector('img').src='assets/menu-2.svg';};
  menu.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.querySelector('img').src='assets/'+(open?'x':'menu-2')+'.svg';});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

  const printForm=$('#print-form');
  if(printForm){
    const storageKey='callueng-blueprinting-draft';let files=[],fileVersion=0,checkingFiles=false;
    const collect=()=>Object.fromEntries(new FormData(printForm));
    $('#print-date').min=localToday();
    try{
      const draft=JSON.parse(sessionStorage.getItem(storageKey)||'null');
      if(draft&&typeof draft==='object')for(const [key,value] of Object.entries(draft)){
        const field=printForm.elements.namedItem(key);if(!field||typeof value!=='string'||field.type==='file')continue;
        if(field.tagName==='SELECT'&&![...field.options].some(o=>o.value===value))continue;
        field.value=value.slice(0,field.maxLength>0?field.maxLength:800);
      }
    }catch{text('print-status','The saved draft could not be restored. You can prepare a new request.');$('#print-status').hidden=false;}
    const render=()=>{
      const data=collect(),pages=Number(data.pages),sets=Number(data.sets);
      const valid=Number.isInteger(pages)&&pages>=1&&pages<=2000&&Number.isInteger(sets)&&sets>=1&&sets<=100;
      text('print-sheet-total',valid?(pages*sets).toLocaleString('en-PH'):'—');
      text('print-sheet-basis',valid?`${pages} drawing pages × ${sets} sets`:'Add your pages and sets');
      text('print-summary-size',data.size);text('print-summary-scale',data.scale);text('print-summary-fulfilment',data.fulfilment);
      $('#print-delivery').hidden=data.fulfilment!=='Delivery';$('#print-city').required=data.fulfilment==='Delivery';
    };
    const save=()=>{try{sessionStorage.setItem(storageKey,JSON.stringify(collect()));}catch{text('print-status','The draft could not be saved in this tab. Download the request before leaving.');$('#print-status').hidden=false;}};
    printForm.addEventListener('input',()=>{render();save();});printForm.addEventListener('change',()=>{render();save();});render();
    $('#print-files').addEventListener('change',async event=>{
      const version=++fileVersion;checkingFiles=true;$('#print-download').disabled=true;files=[];
      try{
        const metadata=await validatePDFSelection([...event.target.files]);
        if(version!==fileVersion)return;files=metadata;
        const list=$('#print-file-list');list.replaceChildren();
        for(const file of files){const item=document.createElement('li');item.textContent=file.name+' · '+(file.size/1024/1024).toFixed(2)+' MB';list.append(item);}
        text('print-file-status',files.length?files.length+' PDF file(s) selected locally. Enter the intended page count below; content and scale are not inspected.':'No files selected. You can prepare a request first.');
      }catch(error){if(version!==fileVersion)return;event.target.value='';$('#print-file-list').replaceChildren();text('print-file-status',error.message);}
      finally{if(version===fileVersion){checkingFiles=false;$('#print-download').disabled=false;}}
    });
    printForm.addEventListener('submit',event=>{
      event.preventDefault();
      if(event.submitter?.hasAttribute('data-demo-submit')){
        try{if(checkingFiles)throw new Error('Wait for the file header check.');const request=validatePrintRequest(collect(),localToday());const record=window.CalluengDemoInbox.submitRequest('printing',{title:request.job,category:'Plan printing',source:'blueprinting.html',conversationId:window.CalluengDemoInbox.current('printing')?.id||'',files,fields:['job','role','revision','size','colour','scale','pages','sets','sheets','finish','fulfilment','city','date','notes'].map(key=>[{job:'Job reference',role:'Customer role',revision:'Drawing revision',size:'Paper size',colour:'Colour',scale:'Scale',finish:'Finishing',fulfilment:'Fulfilment',city:'Delivery area',date:'Requested date',pages:'Drawing pages',sets:'Sets',sheets:'Printed sheets',notes:'Customer notes'}[key]||key,String(request[key])])});window.CalluengDemoInbox.receipt($('#print-status'),'printing',record);}catch(error){text('print-status',error.message);$('#print-status').hidden=false;}return;
      }
      try{if(checkingFiles)throw new Error('Please wait for the local file header check.');const request=validatePrintRequest(collect(),localToday());save();download('Callueng-Blueprint-Print-Request.txt',printRequestText(request,files));text('print-status','Print request prepared for download. Send it and the correct PDFs directly to Blueprinting for review and a quote. Nothing was uploaded or ordered.');}
      catch(error){text('print-status',error.message);}
      $('#print-status').hidden=false;
    });
  }
  const supportForm=$('#support-form');
  if(supportForm){
    const supportDate=$('#support-date');supportDate.min=localToday();
    const collectSupport=()=>({kinds:$$('[data-support-kind]').filter(button=>button.getAttribute('aria-pressed')==='true').map(button=>button.dataset.supportKind),city:$('#support-city').value,note:$('#support-note').value,date:supportDate.value});
    try{const draft=JSON.parse(sessionStorage.getItem('callueng-final-support')||'null');if(draft&&typeof draft==='object'){$$('[data-support-kind]').forEach(button=>button.setAttribute('aria-pressed',String(Array.isArray(draft.kinds)&&draft.kinds.includes(button.dataset.supportKind))));if(typeof draft.city==='string')$('#support-city').value=draft.city.slice(0,80);if(typeof draft.note==='string')$('#support-note').value=draft.note.slice(0,800);if(typeof draft.date==='string')supportDate.value=draft.date;}}catch{}
    const saveSupport=()=>{try{sessionStorage.setItem('callueng-final-support',JSON.stringify(collectSupport()));}catch{text('support-status','The tab draft could not be saved. Keep a downloaded copy before leaving.');$('#support-status').hidden=false;}};
    $$('[data-support-kind]').forEach(button=>button.addEventListener('click',()=>{button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));saveSupport();}));
    supportForm.addEventListener('input',saveSupport);supportForm.addEventListener('change',saveSupport);
    supportForm.addEventListener('submit',event=>{event.preventDefault();try{const request=validateSupport(collectSupport(),localToday());saveSupport();if(event.submitter?.hasAttribute('data-demo-submit')){const category=request.kinds.length>1?'Combined support':request.kinds[0]==='materials'?'Materials':request.kinds[0]==='rentals'?'Equipment rental':'Hauling';const record=window.CalluengDemoInbox.submitRequest('hardware',{title:request.kinds.map(key=>({materials:'Materials',rentals:'Equipment rental',hauling:'Hauling'}[key])).join(' + ')+' · '+request.city,category,source:'site-support.html',conversationId:window.CalluengDemoInbox.current('hardware')?.id||'',fields:[['Requested services',request.kinds.join(', ')],['City / municipality',request.city],['Requested date',request.date],['Specifications / quantities / access',request.note]]});window.CalluengDemoInbox.receipt($('#support-status'),'hardware',record);return;}download('Callueng-Hardware-Rentals-Hauling-Request.txt',supportText(request));text('support-status','Request prepared for download. Contact Hardware, Rentals & Hauling directly to confirm availability and quotation. Nothing was sent or ordered.');}catch(error){text('support-status',error.message);}$('#support-status').hidden=false;});
  }
}
