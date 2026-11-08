'use strict';
const KEY='mdg-herr-m-v1',$=s=>document.querySelector(s),E=EREIGNISSE,F=FALL;
const SCREEN=new URLSearchParams(location.search).get('karten')==='bildschirm';
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{team:'',answers:[],hilfen:[]},idx=0,page=[],pf='0',X={};
const save=()=>localStorage.setItem(KEY,JSON.stringify(S)),R=x=>Math.floor(x+.5);
const esc=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmt=t=>String(t).replace(/\{(\w+)\}/g,(m,k)=>({patient:F.platzhalter.patient,aktivitaet:F.platzhalter.aktivitaet,intervention:X.int?X.int.name:'das Programm',ziel:X.ziel?X.ziel.name:'das Ziel'}[k]??m));
const md=t=>esc(fmt(t)).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const lvOf=id=>F.leitverdachte.find(v=>v.id===id),say=h=>page.push(h);
function rng(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
function shuf(a,k){a=[...a];const r=rng(S.team+'|'+k);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
async function ask(build){
 if(idx<S.answers.length){page=[];return S.answers[idx++]}
 renderSide();const a=await new Promise(res=>{const m=$('#main');$('#hint').hidden=true;$('#reset').hidden=true;m.innerHTML=page.join('')+'<div id="w"></div>';m.classList.remove('enter');void m.offsetWidth;m.classList.add('enter');scrollTo(0,0);build($('#w'),res)});
 S.answers.push(a);idx++;save();page=[];return a}
const cont=(t='Weiter')=>ask((w,r)=>{w.innerHTML=`<button class="b">${t}</button>`;w.firstChild.onclick=()=>r(1)});
function menu(k,q,opts){say(`<h3>${md(q)}</h3>`);const o=shuf(opts,k);return ask((w,r)=>{w.innerHTML=o.map((x,i)=>`<button class="opt" data-i="${i}"><b>${i+1}</b><span>${md(x.menue)}</span></button>`).join('');w.onclick=e=>{const b=e.target.closest('.opt');if(b)r(o[+b.dataset.i].id)}})}
function multi(k,q,opts,n){say(`<h3>${md(q)}</h3><p class="m">${n?'Wählt genau '+n+'.':'Wählt alle zutreffenden.'}</p>`);const o=shuf(opts,k);return ask((w,r)=>{w.innerHTML=o.map((x,i)=>`<button class="opt" data-i="${i}" aria-pressed="false"><b>${i+1}</b><span>${md(x.menue)}</span></button>`).join('')+'<button class="b" disabled>Bestätigen</button>';const bs=[...w.querySelectorAll('.opt')],ok=w.querySelector('.b');bs.forEach(b=>b.onclick=()=>{b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'));const c=bs.filter(x=>x.classList.contains('on')).length;ok.disabled=n?c!==n:c<1});ok.onclick=()=>r(bs.filter(b=>b.classList.contains('on')).map(b=>o[+b.dataset.i].id))})}
function text(q,checks,minLen=15,minW=4){say(`<h3>${md(q)}</h3>`);return ask((w,r)=>{w.innerHTML='<textarea rows="4" aria-label="Antwort"></textarea>'+(checks?'<p class="m">Selbst-Check:</p>'+checks.map(c=>`<label class="ck"><input type="checkbox"> ${esc(c)}</label>`).join(''):'')+'<button class="b" disabled>Weiter</button><button class="lk" hidden>Mit offenen Punkten weiter</button>';
 const ta=w.querySelector('textarea'),cs=[...w.querySelectorAll('input')],b=w.querySelector('.b'),l=w.querySelector('.lk');
 const sinn=s=>{const wd=s.trim().split(/\s+/),L=s.replace(/[^a-zäöüß]/gi,'').toLowerCase();return s.trim().length>=minLen&&wd.length>=minW&&new Set(L).size>=5&&new Set(wd.map(x=>x.toLowerCase())).size>1};
 const upd=()=>{const ok=sinn(ta.value),all=cs.every(c=>c.checked);b.disabled=!(ok&&all);l.hidden=!(ok&&!all)};
 ta.oninput=upd;cs.forEach(c=>c.onchange=upd);const done=()=>r(ta.value.trim());b.onclick=done;l.onclick=done})}
function num(q,lo,hi){say(`<h3>${md(q)}</h3>`);return ask((w,r)=>{w.innerHTML=`<input type="number" inputmode="decimal" min="${lo}" max="${hi}" step="any" aria-label="Zahl"><button class="b" disabled>Weiter</button>`;const i=w.firstChild,b=w.lastChild;i.oninput=()=>{const v=parseFloat(i.value);b.disabled=!(v>=lo&&v<=hi)};b.onclick=()=>r(parseFloat(i.value))})}
function code(chk){say('<p class="m"><b>Eintrittskarte:</b> Gebt den Code ein.</p>');return ask((w,r)=>{w.innerHTML='<input class="code" inputmode="numeric" autocomplete="off" aria-label="Code" placeholder="····"><button class="b">Öffnen</button><p class="err" role="alert"></p>';let f=0;const i=w.firstChild,e=w.lastChild;
 const go=()=>{const v=chk(i.value.trim());if(v!=null&&v!==false)r({v,f});else{f++;i.value='';w.classList.remove('shake');void w.offsetWidth;w.classList.add('shake');e.textContent='Der Code stimmt nicht. Prüft Messung, Rechenweg bzw. die Karte.'}};w.querySelector('.b').onclick=go;i.onkeydown=ev=>{if(ev.key==='Enter')go()}})}
const cn=n=>s=>Math.abs(parseFloat(s.replace(',','.'))-n)<=1?1:null,cs=c=>s=>s.replace(/\s/g,'')===c?1:null;
function card(id,t,h){say(SCREEN?`<div class="paper"><small>Karte ${id} · ${t}</small>${h}</div>`:`<div class="table"><b>Holt euch die Karte ${id}</b> (${t}) vom Kartentisch.</div>`)}
function head(n,t){pf=''+n;X.rs[n]=idx;document.querySelectorAll('#prog i').forEach((e,i)=>e.className=i+1<n?'d':i+1==n?'a':'');say(`<h2>${n} · ${t}</h2>`)}
const cnt=()=>$('#hilfe').textContent='HILFE '+(3-S.hilfen.length)+'/3';
$('#hilfe').onclick=()=>{const h=F.hilfen[pf],b=$('#hint');if(!h)return;if(!S.hilfen.includes(pf)){if(S.hilfen.length>=3){b.textContent='Eure Hilfechips sind aufgebraucht – fragt eine Lehrkraft.';b.hidden=false;return}S.hilfen.push(pf);save();cnt()}b.innerHTML='<b>Hilfekarte:</b> '+md(h);b.hidden=false};
$('#rst').onclick=()=>{const p=$('#reset');if(!p.hidden){p.hidden=true;return}$('#hint').hidden=true;const n=+pf,ks=Object.keys(X.rs).filter(k=>+k<=n).reverse();p.innerHTML=ks.length?'<b>Raum neu starten</b><p class="m">Eure Antworten ab dem gewählten Raum werden gelöscht, alles davor bleibt. Verbrauchte Hilfekarten bleiben verbraucht.</p>'+ks.map(k=>`<button class="opt" data-k="${k}"><b>${k}</b><span>${+k===n?'Diesen Raum neu starten':'Zurück zu Raum '+k}</span></button>`).join(''):'Noch kein Raum gestartet.';p.hidden=false;p.onclick=e=>{const b=e.target.closest('.opt');if(!b)return;const k=+b.dataset.k;if(confirm(`Raum ${k} neu starten? Alle Antworten ab Raum ${k} werden gelöscht.`)){S.answers.length=X.rs[k];save();location.reload()}}};
document.querySelectorAll('#side .tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#side .tabs button').forEach(x=>x.classList.toggle('on',x===b));$('#tab-akte').hidden=b.dataset.t!=='akte';$('#tab-weg').hidden=b.dataset.t!=='weg'});
$('#akteBtn').onclick=()=>$('#side').classList.toggle('open');$('#sideClose').onclick=()=>$('#side').classList.remove('open');
$('#neu').onclick=()=>{if(confirm('Spielstand wirklich löschen und neu starten?')){localStorage.removeItem(KEY);location.reload()}};

const A=F.akte,short=n=>n.length>26?n.slice(0,25)+'…':n,sec=(t,h)=>`<div class="sec"><h4>${t}</h4>${h}</div>`;
function akteHTML(){
 const A=F.akte,P=X.plan,p1=P.p1,p2=P.p2,p3=P.p3,p4=P.p4,p5=P.p5,L=(k,v)=>`<div class="kv"><b>${k}</b><span>${esc(v)}</span></div>`,lock='<p class="m lock">noch gesperrt</p>';
 let h=`<div class="sec">${L('Patient/in',A.name+', geb. '+A.geb)}${L('Diagnose',A.diagnose)}${L('Limits / ärztliche Vorgaben',A.limits)}${L('Therapeut:innen',S.team?'Team '+S.team:'–')}${L('Befunddatum',A.befunddatum)}</div>`;
 h+=sec('Patientenebene (ICF)',`<div class="icf"><div><b>Struktur/Funktion</b>${esc(A.icf.funktion)}</div><div><b>Aktivität</b>${esc(A.icf.aktivitaet)}</div><div><b>Partizipation</b>${esc(A.icf.partizipation)}</div><div><b>Umweltfaktoren</b>${esc(A.icf.umwelt)}</div><div><b>Personenbezogene Faktoren</b>${esc(A.icf.personen)}</div></div><div class="tl">${A.historia.map(x=>`<div><i></i><b>${esc(x.t)}</b>${esc(x.e)}</div>`).join('')}</div>`);
 h+=sec('Zwischenhypothese',p1?esc(p1.leitverdacht)+'<br><i>'+esc(p1.vorhersage)+'</i>':lock);
 h+=sec('Befund (Therapeutenebene)',p1?`${esc(p1.test)}: ${p1.betroffen} / ${p1.gesund} ${p1.einheit} = <b>${p1.prozent} %</b>`:lock);
 h+=sec('Physiotherapeutische Diagnose',p1&&p1.diag?esc(p1.diag):lock);
 h+=sec('Interventionsziel',p2?esc(p2.ziel):lock);
 h+=sec('Maßnahme',p3?`${esc(p3.int)}<br>${p3.d.saetze} × ${p3.d.wdh}, Pause ${p3.d.pause} s<br>ASTE: ${esc(p3.d.aste)}`:lock);
 h+=sec('Wiederbefund (Retest)',p4?`${p4.v.start} → ${p4.neu} ${p4.v.einheit} (${p4.pa} % → ${p4.p} %)`:lock);
 if(p5)h+=sec('Ereignis',esc(p5.titel));
 return h}
function mapHTML(rev){
 const lv=[['Zwischenhypothese',F.leitverdachte],['Ziel',X.weg?F.ziele[X.weg]:null],['Intervention',X.ziel?F.interventionen[X.ziel.id]:null]];
 return '<div class="map">'+lv.map(([t,o],l)=>{if(!o)return '';const vis=X.path.filter(p=>p.l===l);
  return `<div class="lvl"><small>${t}</small><div class="doors">`+o.map(x=>{const v=vis.find(p=>p.id===x.id);return v?`<div class="dr ${v.dead?'dead':'on'}"><span>${v.dead?'↩':'✔'}</span>${esc(short(x.name))}</div>`:rev?`<div class="dr off">${esc(short(x.name))}</div>`:'<div class="dr unk">?</div>'}).join('')+'</div></div>'}).join('')+'</div>'}
function renderSide(done){if(done)X.done=1;$('#tab-akte').innerHTML=akteHTML();$('#tab-weg').innerHTML=mapHTML(!!X.done)}
function dosis(i){say('<h3>Dosierung festlegen</h3><p>Stellt die Werte ein. Unten seht ihr, was daraus folgt. Die Einordnung kommt erst nach eurer Bestätigung.</p>');
 const f=[['saetze','Sätze',1,10,1,3],['wdh','Wiederholungen je Satz',1,100,1,10],['dauer','Dauer/Haltezeit je Wdh. (s, 0 = keine)',0,600,1,0],['pause','Pause zwischen den Sätzen (s)',0,600,5,60]],lim=Object.fromEntries(f.map(a=>[a[0],a]));
 return ask((w,r)=>{w.innerHTML=f.map(([k,l,lo,hi,st,v])=>`<div class="st"><span>${l}</span><button data-k="${k}" data-d="-${st}" aria-label="${l} weniger">−</button><input type="number" data-k="${k}" min="${lo}" max="${hi}" value="${v}" aria-label="${l}"><button data-k="${k}" data-d="${st}" aria-label="${l} mehr">+</button></div>`).join('')+'<div class="res" id="live"></div><button class="b">Dosierung bestätigen</button>';
  const val=k=>{const a=lim[k];return Math.min(a[3],Math.max(a[2],parseFloat(w.querySelector(`input[data-k=${k}]`).value)||a[2]))},get=()=>Object.fromEntries(f.map(a=>[a[0],val(a[0])]));
  const upd=()=>{const d=get(),t=d.dauer>0?d.dauer:4,sd=d.wdh*t,ges=d.saetze*sd+(d.saetze-1)*d.pause,tend=['maxkraft','kraftausdauer'].includes(i.qualitaet)?`<br>Tendenz: ${d.wdh<=6?'eher Maximalkraft':d.wdh<=12?'mittlerer Bereich':'eher Kraftausdauer'} (grobe Orientierung)`:'';
   w.querySelector('#live').innerHTML=`<b>Live:</b> Volumen ${d.saetze*d.wdh} Wiederholungen · eine Serie ca. ${Math.round(sd)} s · Einheit ca. ${(ges/60).toFixed(1)} min${tend}<br><span class="m">Annahme: ${d.dauer>0?'Haltezeit je Wdh.':'4 s je Wdh.'}</span>`};
  w.onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const k=b.dataset.k,inp=w.querySelector(`input[data-k=${k}]`);inp.value=Math.min(lim[k][3],Math.max(lim[k][2],(parseFloat(inp.value)||0)+ +b.dataset.d));upd()};
  w.oninput=upd;upd();w.querySelector('.b').onclick=()=>r(get())})}
async function p0(){
 say(`<h2>Prolog · Patientenakte</h2><p>Lest zuerst die <b>Patientenakte</b> (links bzw. über den Knopf <b>AKTE</b> oben). Sie füllt sich im Spiel. Der <b>Praxisweg</b> zeigt eure Entscheidungen.</p><div class="paper"><small>Fallkarte</small>${md(F.fallkarte).replace(/\n\n/g,'<br><br>').replace(/\n- /g,'<br>• ')}</div>
<h3>So funktioniert das Spiel</h3><ul><li>Ihr seid das <b>Therapeutenteam</b> (Clinical Lead, Therapeut:in, Patient:in, Observer:in). Wechselt die Rollen.</li><li><b>Fünf Räume:</b> ① Zwischenhypothese, Untersuchung und Diagnose · ② Ziel · ③ Intervention und Dosierung · ④ Wiederbefund · ⑤ Ereigniskarte.</li><li>Weiter geht es über eine <b>Eintrittskarte</b> (Code). Die Karten liegen am Kartentisch.</li><li><b>Sackgassen</b> werfen euch zurück und erklären warum. Keine Strafpunkte.</li><li><b>Hilfe:</b> 3 Hilfekarten über den Knopf oben.</li><li>Am Ende entsteht eure <b>Therapieplanung</b> zum Speichern als PDF.</li></ul>`);
 if(innerWidth<900&&!S.answers.length)$('#side').classList.add('open');
 S.team=await ask((w,r)=>{w.innerHTML='<h3>Teamname (kein Klarname)</h3><input type="text" maxlength="30" aria-label="Teamname"><button class="b" disabled>Spiel starten</button>';const i=w.querySelector('input'),b=w.querySelector('button');i.oninput=()=>b.disabled=i.value.trim().length<2;b.onclick=()=>r(i.value.trim())});save()}
async function p1(){
 head(1,'Zwischenhypothese und Untersuchung');say('<p>Wählt eine <b>Zwischenhypothese</b>, sagt <b>vor der Untersuchung</b> voraus, was ihr erwartet, untersucht – und lest das Ergebnis aus den Daten.</p>');
 for(;;){
  const id=await menu('p1_'+X.ver.length,'Welche **Zwischenhypothese** prüft ihr als Nächstes?',F.leitverdachte.filter(v=>!X.ver.includes(v.id))),lv=lvOf(id),t=lv.test;
  const vor=await text('**Zwischenhypothese und Vorhersage:** Was erwartet ihr bei der Untersuchung, wenn die Hypothese stimmt, und was würde dagegen sprechen?',['Die Vorhersage nennt das erwartete Ergebnis.','Sie nennt auch, was GEGEN den Leitverdacht spräche.'],20,6);
  say(`<div class="paper"><b>Test: ${esc(t.name)}</b><ul>${t.protokoll.map(s=>`<li>${md(s)}</li>`).join('')}</ul></div>`);await cont('Test am Teammitglied geübt – weiter');
  card('M-'+lv.id,'Messwertkarte',`<b>${esc(t.name)}</b><br>gesunde Seite: <b>${t.gesund} ${t.einheit}</b><br>betroffene Seite: <b>${t.betroffen} ${t.einheit}</b><br><i>${esc(t.hinweis)}</i>`);
  const p=R(t.betroffen/t.gesund*100);say('<p><b>Aufgabe:</b> Berechnet den Seitenvergleich = betroffene Seite in Prozent der gesunden Seite (gerundet). Das Ergebnis ist eure Eintrittskarte.</p>');
  X.fehl+=(await code(cn(p))).f;
  say(`<div class="res"><b>Seitenvergleich: ${p} %</b> (Spielregel: unter ${F.regel_auffaellig} % gilt als auffällig)</div><p>${md(lv.rueckmeldung)}</p>`);
  const rec={leitverdacht:lv.name,vorhersage:vor,test:t.name,gesund:t.gesund,betroffen:t.betroffen,einheit:t.einheit,prozent:p};
  X.path.push({l:0,id:lv.id,dead:!lv.bestaetigt});
  if(lv.bestaetigt){X.weg=lv.id;X.plan.p1=rec;rec.diag=await text('**Physiotherapeutische Diagnose:** Was habt ihr festgestellt, mit welchen Tests, und was bedeutet das für Aktivität und Partizipation von '+F.platzhalter.patient+'?',['Sie nennt den Befund und den Test.','Sie nennt die Einschränkung (Struktur/Funktion) und ihre Auswirkung auf Aktivität oder Partizipation.','Sie ist die Grundlage für Ziel und Maßnahmen.'],30,10);await cont('Weiter zu Pfeil ②');return}
  X.ver.push(lv.id);(X.plan.ver=X.plan.ver||[]).push(rec);X.sg.push(['Leitverdacht',lv.name]);say('<p class="back">↩ Zurück zur Wahl des Leitverdachts.</p>');await cont()}}
async function p2(){
 head(2,'Ziel');const lv=lvOf(X.weg);say(`<p><b>Euer Befund:</b> ${esc(lv.name)} (${X.plan.p1.prozent} %).<br><b>Patientenziel:</b> „Ich will wieder sicher Treppen steigen – und irgendwann zurück ins Vereinstraining.“</p>`);const v=[];
 for(;;){
  const zid=await menu('p2_'+v.length,'Welches Ziel setzt ihr?',F.ziele[X.weg].filter(z=>!v.includes(z.id))),z=F.ziele[X.weg].find(q=>q.id===zid);
  let a;for(;;){const ai=await menu('p2a'+z.id,'In welcher Aktivität soll sich das zeigen?',F.aktivitaeten);a=F.aktivitaeten.find(q=>q.id===ai);if(a.passend){if(a.hinweis)say('<p class="m">'+md(a.hinweis)+'</p>');break}say('<p class="back">↩ '+md(a.hinweis)+'</p>');await cont()}
  let t;for(;;){const ti=await menu('p2t'+z.id,'Womit prüft ihr das Ziel?',F.ziel_test_optionen);t=F.ziel_test_optionen.find(q=>q.id===ti);if(t.passend)break;say('<p class="back">↩ '+md(t.hinweis)+'</p>');await cont()}
  const fo=await text('**Formuliert das Ziel für '+F.platzhalter.patient+' in zwei Sätzen, ohne Fachsprache.**',['Es nennt die Fähigkeit, die sich verbessern soll.','Es nennt die Aktivität aus dem Alltag.','Es sagt, woran man die Veränderung misst.','Es ist ohne Fachsprache verständlich.'],30,8);
  let bel;for(;;){bel=await multi('p2b'+z.id,'**Belege:** Welche **zwei** Informationen tragen eure Zielwahl am besten?',F.belege,2);say('<ul>'+bel.map(i=>{const b=F.belege.find(q=>q.id===i);return `<li>${b.gilt?'✔':'✘'} ${md(b.menue)} – ${md(b.warum)}</li>`}).join('')+'</ul>');if(bel.includes('m')&&(bel.includes('pz')||bel.includes('pb')))break;say('<p class="back">↩ Eine gute Zielbegründung braucht den <b>Messwert</b> und etwas vom <b>Patienten</b>. Wählt neu.</p>');await cont()}
  say('<p>Erklärt das Ziel jetzt der <b>Patient:in</b> (Teammitglied). Die Patient:in nimmt die Patientenkarte, sobald das Ziel verstanden wurde.</p>');
  card('P-'+z.id,'Patientenkarte',`${esc(z.patient)}<br><b>Code: ${z.code}</b>`);X.fehl+=(await code(cs(z.code))).f;say(`<p>${md(z.feedback)}</p>`);X.path.push({l:1,id:z.id,dead:z.sackgasse});
  if(z.sackgasse){v.push(z.id);X.sg.push(['Ziel',z.name]);say('<p class="back">↩ Zurück zur Zielwahl.</p>');await cont()}
  else{X.ziel=z;X.plan.p2={ziel:z.name,akt:a.menue,test:t.menue.replace(/\*\*/g,''),fo,bel:bel.map(i=>F.belege.find(q=>q.id===i).menue)};await cont('Weiter zu Pfeil ③');return}}}
const NAM={saetze:'Sätze',wdh:'Wiederholungen',dauer:'Dauer (s)',pause:'Pause (s)'},orient=i=>Object.entries(i.orientierung).filter(([k,[a,b]])=>!(k==='dauer'&&!b));
const bew=(i,d)=>{const m=orient(i).filter(([k,[a,b]])=>d[k]<a||d[k]>b).length;return m?m===1?'teils':'unzureichend':'gut'};
async function p3(){
 head(3,'Intervention und Dosierung');say(`<p><b>Euer Ziel:</b> ${esc(X.ziel.name)}</p>`);const v=[],L=F.interventionen[X.ziel.id];
 for(;;){
  const ii=await menu('p3_'+X.ziel.id+v.length,'Welche Intervention wählt ihr?',L.filter(q=>!v.includes(q.id))),i=L.find(q=>q.id===ii);
  for(;;){if(await menu('p3q'+i.id,'Welche Trainingsqualität spricht diese Intervention vor allem an?',F.qualitaeten)===i.qualitaet){say('<p class="ok">Stimmt.</p>');break}say('<p class="back">↩ Prüft noch einmal: Welcher Reiz wird hier hauptsächlich gesetzt (Intensität, Wiederholung, Tempo, Umfang)?</p>');await cont()}
  const d={};
  Object.assign(d,await dosis(i));d.aste=await text('**Ausgangsstellung (ASTE):** Aus welcher Ausgangsstellung wird die Übung ausgeführt (Position, Unterstützung, Bankhöhe)?',null,8,3);
  d.intensitaet=await text('**Intensität/Widerstand:** Wie steuert ihr die Schwierigkeit (z. B. Bankhöhe, Variante)?',null,5,2);d.tempo=await text('**Bewegungstempo:** z. B. Absenken in Sekunden?',null,5,2);
  d.abbruch=await text('**Sicherheits- und Abbruchkriterium:** Woran erkennt ihr, dass abgebrochen oder angepasst wird?',['Das Kriterium ist beobachtbar oder messbar.','Es sagt, was dann passiert.'],10,4);
  d.begruendung=await text('**Begründung in ein bis zwei Sätzen:** Warum passt diese Intervention mit dieser Dosierung zu eurem Ziel?',['Sie nennt die Trainingsqualität des Ziels.','Sie begründet die Dosierung.'],20,8);
  d.qualitaet=F.qualitaeten.find(q=>q.id===i.qualitaet).menue;
  say(`<h3>Probeserie</h3><p>Führt <b>einen Satz</b> durch. Die <b>Observer:in</b> prüft:</p><ul>${i.checkliste.map(c=>`<li>☐ ${esc(c)}</li>`).join('')}</ul>`);await cont('Probeserie erledigt');
  card('O-'+i.id,'Beobachtungskarte',`Checkliste abgearbeitet.<br><b>Code: ${i.code}</b>`);X.fehl+=(await code(cs(i.code))).f;X.path.push({l:2,id:i.id,dead:i.sackgasse});
  if(i.sackgasse){say(`<p>${md(i.feedback)}</p><p class="back">↩ Zurück zur Interventionswahl.</p>`);v.push(i.id);X.sg.push(['Intervention',i.name]);await cont()}
  else{X.stufe=bew(i,d);X.int=i;X.plan.p3={int:i.name,d,ab:orient(i).map(([k,[a,b]])=>`${NAM[k]}: ${d[k]} – ${d[k]>=a&&d[k]<=b?'im Rahmen':'außerhalb'} (${a}–${b})`)};
   say(`<p class="ok">Intervention angenommen.</p><p>${md(i.feedback)}</p><p class="m">Abgleich mit dem Orientierungsrahmen (Spielwerte):</p><ul>${X.plan.p3.ab.map(s=>`<li>${s}</li>`).join('')}</ul>`);await cont('Weiter zu Pfeil ④');return}}}
async function p4(){
 head(4,'Re-Test und Verlauf');const t=lvOf(X.weg).test,v=F.verlauf[X.weg],n=[];
 const ro=F.retest_optionen.map(o=>o.id==='R1'?{...o,menue:`**Gleicher Test wie im Befund** (${t.name}), gleiche Bedingungen, gleiche Untersucher:in`}:o);
 for(;;){const oi=await menu('p4r'+n.length,'Welchen Re-Test plant ihr?',ro.filter(q=>!n.includes(q.id))),o=ro.find(q=>q.id===oi);if(!o.sackgasse)break;say(`<p>${md(o.feedback)}</p>`);n.push(o.id);X.sg.push(['Re-Test',o.menue.replace(/\*\*/g,'')]);await cont()}
 const zp=await text('**Zeitpunkt:** Wann testet ihr erneut, und warum dann?',['Die Antwort nennt einen Zeitraum.','Sie nennt einen Grund.'],10,4);
 const rel=await num(`**Relevante Veränderung:** Ab welcher Veränderung (${v.einheit}) sprecht ihr von einer relevanten Veränderung?`,0,1000);
 say(rel<=v.mf?`<p class="m">Das liegt im Bereich des Messfehlers (Spielregel: ±${v.mf} ${v.einheit}). Veränderungen in dieser Größe sind nicht eindeutig.</p>`:`<p class="m">Gut: Eure Schwelle liegt über dem Messfehler (Spielregel: ±${v.mf} ${v.einheit}).</p>`);await cont();
 const neu=v.ergebnis[X.stufe];say('<h3>Sechs Wochen später …</h3>');
 card('V-'+X.weg+'-'+{gut:1,teils:2,unzureichend:3}[X.stufe],'Verlaufskarte (fiktiv)',`<b>${esc(t.name)}</b> – Re-Test nach 6 Wochen<br>gesunde Seite: <b>${v.gesund} ${v.einheit}</b><br>betroffene Seite: <b>${neu} ${v.einheit}</b> (Ausgangswert: ${v.start})<br>${esc(F.platzhalter.patient)}: ${esc(v.patient[X.stufe])}`);
 const p=R(neu/v.gesund*100);say('<p><b>Aufgabe:</b> Berechnet den <b>neuen Seitenvergleich in Prozent</b>.</p>');X.fehl+=(await code(cn(p))).f;
 const diff=neu-v.start,ueber=Math.abs(diff)>v.mf,un=p>=F.regel_auffaellig;
 say(`<div class="res"><b>Seitenvergleich neu: ${p} %</b> (vorher ${R(v.start/v.gesund*100)} %). Veränderung ${diff>0?'+':''}${diff} ${v.einheit} – ${ueber?'über':'im Bereich von'} dem Messfehler (±${v.mf}). ${un?'Nach Spielregel im unauffälligen Bereich.':'Nach Spielregel noch im auffälligen Bereich.'}</div>`);await cont();
 const gw=await multi('p4a','**Welche Aussagen sind nach dieser Verlaufskarte vertretbar?**',F.aussagen);let tr=0;
 const zl=F.aussagen.map(a=>{const g=a.typ==='fest'?a.gilt:a.typ==='ueber_mf'?ueber:un,r=gw.includes(a.id)===g;tr+=r?1:0;return `<li>${r?'✔':'✘'} <i>${md(a.menue)}</i> → ${g?'vertretbar':'nicht vertretbar'}. ${md(a.warum)}</li>`}).join('');
 say(`<p><b>Auswertung (${tr} von ${F.aussagen.length} passend):</b></p><ul>${zl}</ul>`);await cont();
 const an=await menu('p4n','Wie geht es weiter?',F.anpassung_optionen);say(`<p>${md(F.anpassung_feedback[X.stufe][an])}</p>`);
 const ab=await text('**Begründung der Anpassung:** Welche Information aus der Verlaufskarte trägt eure Entscheidung?',['Sie nennt eine Information aus der Verlaufskarte (Wert, Messfehler oder Aussage).'],20,8);
 let zw='–',zb='';const rest=F.leitverdachte.filter(x=>x.id!==X.weg&&!X.ver.includes(x.id));
 if(rest.length){zw=lvOf(await menu('p4z','Welchen weiteren Leitverdacht prüft ihr als Nächstes?',rest)).name;zb=await text('**Warum dieser?**',null,10,3)}
 X.plan.p4={retest:t.name,zp,rel,v,neu,p,pa:R(v.start/v.gesund*100),an:F.anpassung_optionen.find(o=>o.id===an).menue.replace(/\*\*/g,''),ab,tr,gw:F.aussagen.filter(a=>gw.includes(a.id)).map(a=>a.menue),zw,zb,pat:v.patient[X.stufe]};
 await cont('Weiter zur Ereigniskarte')}
async function p5(){
 head(5,'Ereigniskarte (Woche 7)');say('<p>Im echten Therapieverlauf läuft nicht alles nach Plan. <b>Zieht verdeckt eine Ereigniskarte</b> und gebt den Code ein.</p>');
 const c=await code(s=>{const e=E.find(q=>q.code===s.replace(/\s/g,''));return e?e.id:null});X.fehl+=c.f;const e=E.find(q=>q.id===c.v);
 say(`<div class="paper flip"><small>Ereigniskarte · Woche 7</small><h3>${esc(e.titel)}</h3>${md(e.text)}</div>`);
 const gw=await multi('p5'+e.id,'**Welche zwei Reaktionen setzt ihr als Erstes um?**',e.reaktionen,2);
 say('<p><b>Eure Wahl:</b></p><ul>'+e.reaktionen.filter(r=>gw.includes(r.id)).map(r=>`<li>${r.gilt?'✔':'✘'} ${md(r.menue)} – ${md(r.warum)}</li>`).join('')+'</ul>');
 const fe=e.reaktionen.filter(r=>r.gilt&&!gw.includes(r.id));if(fe.length)say('<p><b>Ebenfalls vertretbar gewesen wären:</b></p><ul>'+fe.map(r=>`<li>${md(r.menue)}</li>`).join('')+'</ul>');
 const ae=await text('**Was genau ändert ihr an Plan oder Vorgehen?** Nennt konkrete Schritte.',['Sie nennt mindestens einen konkreten Schritt.','Sie passt zu den gewählten Reaktionen.'],20,8);
 X.plan.p5={titel:e.titel,text:fmt(e.text),re:e.reaktionen.filter(r=>gw.includes(r.id)).map(r=>(r.gilt?'✔ ':'✘ ')+fmt(r.menue)),ae,lf:e.leitfrage};
 say(`<p><b>Leitfrage für die Präsentation:</b> ${md(e.leitfrage)}</p><p class="m">${md(e.hinweis)}</p>`);await cont('Therapieplanung ansehen')}
function summary(){
 const P=X.plan,p1=P.p1,p2=P.p2,p3=P.p3,p4=P.p4,p5=P.p5,d=p3.d,u=esc,sg=s=>String(s).trim().replace(/\.$/,'');
 const T=(h,r)=>`<h3>${h}</h3><table>${r.map(x=>`<tr><th>${x[0]}</th><td>${u(x[1])}</td></tr>`).join('')}</table>`;
 const pres=[['Problem',`${F.platzhalter.patient} berichtet über Steifigkeit, Schwäche und Unsicherheit; Ziel: sicher Treppen steigen. Zwischenhypothese: ${p1.leitverdacht}.`],['Messung',`${p1.test}: ${p1.betroffen} vs. ${p1.gesund} ${p1.einheit} = ${p1.prozent} %.`+(P.ver?` Verworfen: ${P.ver.map(x=>x.leitverdacht).join(', ')}.`:'')],['Diagnose',`${sg(p1.diag)}.`],['Ziel',`${sg(p2.ziel)}. ${sg(p2.fo)}.`],['Entscheidung',`${p3.int} – ${d.saetze} × ${d.wdh}, Pause ${d.pause} s, Tempo: ${sg(d.tempo)}.`],['Re-Test und Verlauf',`${p4.retest}, ${sg(p4.zp)}. Nach der fiktiven Verlaufskarte: ${p4.an}.`],['Ereignis',`${p5.titel}: ${sg(p5.ae)}.`]];
 $('#summary').innerHTML=`<h2>Therapieplanung</h2><p>${u(F.titel)} · Team: ${u(S.team)} · Pfad: ${X.weg}-${X.ziel.id}-${X.int.id}</p>`+T('Patient und Rahmen',[['Patient/in',A.name+', geb. '+A.geb],['Diagnose',A.diagnose],['Limits / ärztliche Vorgaben',A.limits],['Therapeut:innen','Team '+S.team],['Befunddatum',A.befunddatum]])
 +T('1. Zwischenhypothese und Befund (Therapeutenebene)',[['Zwischenhypothese',p1.leitverdacht],['Vorhersage',p1.vorhersage],['Test',p1.test],['Messwerte',`gesund ${p1.gesund} ${p1.einheit}, betroffen ${p1.betroffen} ${p1.einheit}`],['Seitenvergleich',p1.prozent+' % (Spielregel: unter '+F.regel_auffaellig+' % auffällig)'],['Physiotherapeutische Diagnose',p1.diag],...(P.ver?[['Nicht bestätigt',P.ver.map(x=>`${x.leitverdacht} (${x.prozent} %)`).join('; ')]]:[])])
 +T('2. Interventionsziel',[['Ziel',p2.ziel],['Aktivität',p2.akt],['Überprüfung mit',p2.test],['Formulierung',p2.fo],['Belege',p2.bel.join(' · ')]])
 +T('3. Maßnahmen und Dosierung',[['Maßnahme',p3.int],['Ausgangsstellung (ASTE)',d.aste],['Trainingsqualität',d.qualitaet],['Sätze × Wdh.',d.saetze+' × '+d.wdh],['Dauer je Wdh. / Pause',d.dauer+' s / '+d.pause+' s'],['Intensität',d.intensitaet],['Tempo',d.tempo],['Abbruchkriterium',d.abbruch],['Begründung',d.begruendung],['Abgleich (Spielwerte)',p3.ab.join(' · ')]])
 +T('4. Wiederbefund (Retest), fiktiv',[['Re-Test',p4.retest+', gleiche Bedingungen'],['Zeitpunkt',p4.zp],['Relevant ab',p4.rel+' '+p4.v.einheit+' (Messfehler ±'+p4.v.mf+')'],['Verlauf',`${p4.v.start} → ${p4.neu} ${p4.v.einheit}; Seitenvergleich ${p4.pa} % → ${p4.p} %`],['Rückmeldung',p4.pat],['Als vertretbar bewertet',p4.gw.join(' · ')||'–'],['Aussagen-Check',p4.tr+' von '+F.aussagen.length+' passend'],['Entscheidung',p4.an],['Begründung',p4.ab],['Nächster Leitverdacht',p4.zw+'. '+p4.zb]])
 +T('5. Ereignis in Woche 7',[['Ereignis',p5.titel+': '+p5.text],['Reaktionen',p5.re.join(' · ')],['Konkrete Änderung',p5.ae],['Leitfrage',p5.lf]])
 +T('6. Präsentation (2–3 Minuten)',pres)+`<p class="m">Spielstatistik: ${X.sg.length} Sackgasse(n), ${S.hilfen.length} Hilfekarte(n), ${X.fehl} Fehlversuch(e). Alle Werte sind Spielwerte.</p><h3>Praxisweg</h3>${mapHTML(true)}<div class="nop"><button class="b" onclick="print()">PDF speichern / Drucken</button><button class="b ghost" id="share">Teilen</button><p class="m">iPad: Drucken, dann die Vorschau mit zwei Fingern aufziehen, Teilen, AirDrop. Bitte am iPad testen.</p></div>`;
 $('#main').hidden=true;$('#prog').hidden=true;$('#summary').hidden=false;document.title=S.team.replace(/\s+/g,'-')+'_Therapieplanung';renderSide(true);const sh=$('#share');if(navigator.share)sh.onclick=()=>navigator.share({title:'Therapieplanung – '+S.team,text:pres.map(x=>x[0]+': '+x[1]).join('\n')}).catch(()=>{});else sh.hidden=true;scrollTo(0,0)}
(async function run(){X={sg:[],fehl:0,plan:{},ver:[],rs:{},path:[]};cnt();
 try{await p0();await p1();await p2();await p3();await p4();await p5();summary()}
 catch(e){$('#main').innerHTML='<h3>Es ist ein Fehler aufgetreten.</h3><p>'+esc(e.message)+'</p><p>Über „Neues Spiel“ unten kannst du neu starten.</p>';console.error(e)}})();
