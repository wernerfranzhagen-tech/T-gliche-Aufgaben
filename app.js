const KEY='wh-digital-todos';
let todos=JSON.parse(localStorage.getItem(KEY)||'[]');

function speichern(){localStorage.setItem(KEY,JSON.stringify(todos))}
function formatiere(ts){const d=new Date(ts);return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}
function eszid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}

function todoElement(t,fertig){
  const li=document.createElement('li');
  li.className='todo'+(t.erledigt?' done':'');
  li.dataset.id=t.id;
  const cb=document.createElement('input');
  cb.type='checkbox';cb.checked=!!t.erledigt;
  cb.setAttribute('aria-label','Als erledigt markieren');
  cb.onchange=()=>{t.erledigt=cb.checked;t.erledigtAm=t.erledigt?Date.now():null;speichern();render()};
  const body=document.createElement('div');body.className='todo-body';
  const text=document.createElement('div');text.className='todo-text';text.textContent=t.text;
  body.appendChild(text);
  if(t.foto){
    const img=document.createElement('img');img.className='thumb';img.src=t.foto;img.alt='Anhang';
    img.onclick=()=>{window.open().document.write('<img src="'+t.foto+'" style="max-width:100%">')};
    body.appendChild(img);
  }
  if(t.audio){
    const a=document.createElement('audio');a.controls=true;a.src=t.audio;
    body.appendChild(a);
  }
  const meta=document.createElement('div');meta.className='todo-meta';
  meta.textContent=formatiere(t.erstellt);
  if(t.sprache)meta.textContent+=' · 🎙️ Sprache';
  if(t.foto)meta.textContent+=' · 📷 Foto';
  body.appendChild(meta);
  const del=document.createElement('button');del.className='btn-del';del.textContent='🗑️';
  del.setAttribute('aria-label','Aufgabe löschen');
  del.onclick=()=>{todos=todos.filter(x=>x.id!==t.id);speichern();render()};
  li.append(cb,body,del);
  return li;
}

function render(){
  const offen=todos.filter(t=>!t.erledigt).sort((a,b)=>b.erstellt-a.erstellt);
  const fertig=todos.filter(t=>t.erledigt).sort((a,b)=>(b.erledigtAm||0)-(a.erledigtAm||0));
  document.getElementById('liste').replaceChildren(...offen.map(t=>todoElement(t)));
  document.getElementById('listeFertig').replaceChildren(...fertig.map(t=>todoElement(t,true)));
  document.getElementById('stats').textContent=offen.length?offen.length+' offen · '+fertig.length+' erledigt':'';
  document.getElementById('leer').hidden=offen.length>0;
  document.getElementById('fertigUeberschrift').hidden=fertig.length===0;
}

function hinzufuegen(text,extra={}){
  text=(text||'').trim();
  if(!text&&!extra.foto)return;
  const t={id:eszid(),text:text||'(Notiz)',erstellt:Date.now(),erledigt:false,...extra};
  todos.push(t);speichern();render();
}

const eingabe=document.getElementById('eingabe');
document.getElementById('btnAdd').onclick=()=>{hinzufuegen(eingabe.value);eingabe.value=''};
eingabe.addEventListener('keydown',e=>{if(e.key==='Enter'){hinzufuegen(eingabe.value);eingabe.value=''}});

/* Spracheingabe */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const btnSpeech=document.getElementById('btnSpeech');
const hinweis=document.getElementById('aufnahmeHinweis');
if(SR){
  const rec=new SR();rec.lang='de-DE';rec.continuous=false;rec.interimResults=true;
  let aktiv=false;
  btnSpeech.onclick=()=>{
    if(aktiv){rec.stop();return}
    eingabe.value='';rec.start();
  };
  rec.onstart=()=>{aktiv=true;btnSpeech.classList.add('rot');hinweis.style.display='block';hinweis.textContent='Aufnahme läuft… jetzt sprechen';eingabe.placeholder='Sprechen…'};
  rec.onend=()=>{aktiv=false;btnSpeech.classList.remove('rot');hinweis.style.display='none';eingabe.placeholder='Aufgabe tippen…';
    const text=eingabe.value.trim();if(text){hinzufuegen(text,{sprache:true});eingabe.value=''}};
  rec.onerror=e=>{hinweis.style.display='block';hinweis.textContent='Fehler: '+e.error};
  rec.onresult=ev=>{let s='';for(const r of ev.results)s+=r[0].transcript;eingabe.value=s};
}else{
  btnSpeech.style.display='none';
  hinweis.style.display='block';hinweis.textContent='Spracherkennung in diesem Browser nicht verfügbar. Tipp: Chrome verwenden.';
}

/* Foto */
const dlg=document.getElementById('fotoDialog');
const fotoInput=document.getElementById('fotoInput');
const vorschau=document.getElementById('fotoVorschau');
let fotoDaten=null;
document.getElementById('btnFoto').onclick=()=>{fotoDaten=null;vorschau.hidden=true;vorschau.src='';fotoInput.value='';document.getElementById('fotoText').value='';dlg.showModal()};
fotoInput.onchange=()=>{
  const f=fotoInput.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const max=900,s=Math.min(1,max/Math.max(img.width,img.height));
      const c=document.createElement('canvas');
      c.width=img.width*s;c.height=img.height*s;
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      fotoDaten=c.toDataURL('image/jpeg',.8);
      vorschau.src=fotoDaten;vorschau.hidden=false;
    };
    img.src=r.result;
  };
  r.readAsDataURL(f);
};
document.getElementById('dlgLoeschen').onclick=()=>dlg.close();
document.getElementById('dlgOk').onclick=()=>{
  if(!fotoDaten){dlg.close();return}
  hinzufuegen(document.getElementById('fotoText').value,{foto:fotoDaten});
  dlg.close();
};

render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
