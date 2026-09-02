const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const app=$('#main');
const live=$('#live');
const qs=new URLSearchParams(location.search);
const debugScreen=Number(qs.get('screen'));
const state={
  name:'',screen:Number.isFinite(debugScreen)&&debugScreen>=0?debugScreen:0,completed:0,goal:'',tts:null,
  start:{greet:null,open:null,notice:null,mobileStep:0},join:{responseDone:false},end:{placed:[]},final:{start:false,join:false,end:false},refPage:0
};
const SESSION_KEY='glorbConversationMissionStateV5';
let navHistory=[state.screen],navIndex=0;
try{if(!qs.has('screen')){const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');if(saved?.state){Object.assign(state,saved.state);state.tts=null;}if(Array.isArray(saved?.navHistory)&&saved.navHistory.length){navHistory=saved.navHistory;navIndex=Math.min(saved.navIndex??saved.navHistory.length-1,saved.navHistory.length-1);state.screen=navHistory[navIndex];}}}catch(e){}
function saveSession(){try{const clean=JSON.parse(JSON.stringify({...state,tts:null}));sessionStorage.setItem(SESSION_KEY,JSON.stringify({state:clean,navHistory,navIndex}));}catch(e){}}
const A='assets/ui/';
const icons={greet:A+'icon-greet.png',open:A+'icon-open.png',notice:A+'icon-notice.png',listen:A+'icon-listen.png',wait:A+'icon-wait.png',connect:A+'icon-connect.png',signal:A+'icon-signal.png',finish:A+'icon-finish.png',exit:A+'icon-exit.png'};
const strips={start:A+'start-strip.png',join:A+'join-strip.png',end:A+'end-strip.png',combined:A+'combined-strip.png'};

const refs=[
'ACARA. (2022). Australian Curriculum Version 9.0: Personal and Social Capability.',
'Afsharnejad, B., et al. (2026). Explicit and implicit social skills group programs: systematic review.',
'Carruthers, S., et al. (2020). Generalisation following social communication interventions.',
'Cipriano, C., et al. (2023). The state of evidence for social and emotional learning.',
'Durlak, J. A., et al. (2011). The impact of enhancing students’ social and emotional learning.',
'Gates, J. A., Kang, E., & Lerner, M. D. (2017). Group social skills interventions for autistic youth.',
'Mayer, R. E. (2017). Using multimedia for e-learning.',
'McGinnis, E. (2012). Skillstreaming the Elementary School Child.',
'Pearson, P. D., & Gallagher, M. C. (1983). The instruction of reading comprehension.',
'Queensland Department of Education. (2021). Inclusive education policy.',
'Ramdoss, S., et al. (2012). Computer-based interventions for social and emotional skills in autism.',
'Rey, G. D., et al. (2019). Meta-analysis of the segmenting effect.',
'Ryan, R. M., & Deci, E. L. (2000). Self-determination theory.',
'Scarcella, I., et al. (2023). ICT-based interventions for autistic children.',
'Shute, V. J. (2008). Focus on formative feedback.',
'Soares, E. E., et al. (2021). Social skills training for autism spectrum disorder.',
'Victorian Department of Education and Training. (2020). High Impact Teaching Strategies.',
'Wang, Y., et al. (2024). Self-determination-theory-based interventions in education.',
'Wisniewski, B., Zierer, K., & Hattie, J. (2020). The power of feedback revisited.',
'Wolstencroft, J., et al. (2018). Group social skills interventions for autistic children.'
];
const adultInfo={
  about:`<div class="info-grid"><div class="info-card"><h3>What is it?</h3><p><strong>GLORB // Conversation Mission</strong> is an explicit-teaching and structured-practice lesson for selected strategies used to start, join and end conversations.</p></div><div class="info-card"><h3>What it is for</h3><p>It makes selected conversation behaviours visible, teaches them one at a time, models them, then gives the learner supported practice and explanatory feedback.</p></div><div class="info-card"><h3>Three learning areas</h3><p><strong>START:</strong> Greet → Open → Notice<br><strong>JOIN:</strong> Listen → Wait → Connect<br><strong>END:</strong> Signal → Finish Phrase → Exit</p></div><div class="info-card"><h3>Teaching aid, not a test of real life</h3><p>The activity simplifies parts of conversation so they can be taught clearly. Completion shows supported performance inside this lesson, not independent real-world conversation skill.</p></div></div>`,
  learning:`<div class="info-grid"><div class="info-card"><h3>START</h3><p>Students practise greeting, using a simple opening question or comment, then pausing to notice the other person's response.</p></div><div class="info-card"><h3>JOIN</h3><p>Students practise identifying the current topic, waiting for a conversational space, and adding something connected.</p></div><div class="info-card"><h3>END</h3><p>Students practise giving a clue that they are preparing to leave, using a clear finish phrase, then leaving.</p></div><div class="info-card"><h3>Lesson sequence</h3><p>Incident → explicit teaching → whole strategy → model → guided practice → explanatory feedback → review → real-world goal.</p></div></div>`,
  curriculum:`<div class="info-grid"><div class="info-card"><h3>Australian Curriculum v9.0</h3><p><strong>Personal and Social Capability</strong><br>Social Management → Communication</p></div><div class="info-card"><h3>Years 5–6 connection</h3><p>The strongest link is Communication Level 4: applying skills to address factors that influence verbal and non-verbal communication.</p></div><div class="info-card"><h3>What this lesson practises</h3><p>Timing, conversational availability, topic relevance, entry into interaction, responding to others and conversational closure.</p></div><div class="info-card"><h3>Supporting connection</h3><p>Collaboration is a secondary connection. This lesson does not teach the full group-coordination expectations of that descriptor.</p></div></div>`,
  evidence:'',
  use:`<div class="info-grid"><div class="notice-box"><h3>Important</h3><p><strong>This is not a real-life conversation and completing it does not demonstrate independent conversational competence.</strong></p></div><div class="info-card"><h3>Use with in-person teaching</h3><p>Where possible, pair the activity with adult modelling, discussion, guided rehearsal, role-play, peer interaction, natural practice opportunities and teacher observation.</p></div><div class="info-card"><h3>It is designed to help</h3><p>It is one teaching support, not a complete solution. It does not diagnose, measure overall social competence, prove mastery or guarantee generalisation.</p></div><div class="info-card"><h3>Conversation is contextual</h3><p>These are useful strategies, not universal scripts. Communication varies with relationship, culture, environment, language, sensory needs and personal preference.</p></div></div>`
};
function evidenceHtml(){
  const pageSize=10,start=state.refPage*pageSize,items=refs.slice(start,start+pageSize);
  return `<div class="refs-layout"><div class="evidence-stack"><div class="evidence-item"><strong>Explicit teaching</strong><p>The strategy is taught before the learner is asked to use it. See Victorian DET (2020), Pearson & Gallagher (1983).</p></div><div class="evidence-item"><strong>Segmentation</strong><p>One major idea is presented at a time before parts are combined. See Mayer (2017), Rey et al. (2019).</p></div><div class="evidence-item"><strong>Formative feedback</strong><p>Wrong responses explain the distinction and support another attempt. See Shute (2008), Wisniewski et al. (2020).</p></div><div class="evidence-item"><strong>Active practice</strong><p>Learners build, wait, choose and sequence rather than only read. See Durlak et al. (2011), McGinnis (2012).</p></div></div><div class="refs-panel"><h3>References</h3><div class="ref-list">${items.map(r=>`<div>${r}</div>`).join('')}</div><div class="ref-nav"><button class="secondary" id="refPrev" ${state.refPage===0?'disabled':''}>Previous</button><button class="primary" id="refNext" ${start+pageSize>=refs.length?'disabled':''}>Next references</button></div></div></div>`;
}

function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function asset(src,alt,cls=''){return `<div class="asset-card ${cls}"><img src="${src}" alt="${alt}"></div>`}
function btn(label,id='primaryAction',cls='primary'){return `<button id="${id}" class="${cls}" type="button">${label}</button>`}
function actions(label,next,cls='primary'){setTimeout(()=>{const b=$('#primaryAction');if(b)b.onclick=next},0);return `<div class="actions">${btn(label,'primaryAction',cls)}</div>`}
function note(text,light=false){return `<div class="glorb-note ${light?'light':''}"><span class="eyebrow ${light?'dark':'orange'}">GLORB</span><br>“${text}”</div>`}
function shell(inner,type='paper',extra=''){return `<section class="screen" data-readable><div class="screen-shell ${type==='dark'?'dark-shell':'paper-shell'} ${extra}">${inner}</div></section>`}
function content(inner){return `<div class="content-pad" style="width:100%">${inner}</div>`}
function isCompact(){return matchMedia('(max-width:700px)').matches}
function go(n){stopSpeech();if(navHistory[navIndex]!==n){navHistory=navHistory.slice(0,navIndex+1);navHistory.push(n);navIndex=navHistory.length-1;}state.screen=n;saveSession();render()}
function moveHistory(delta){const next=navIndex+delta;if(next<0||next>=navHistory.length)return;stopSpeech();navIndex=next;state.screen=navHistory[navIndex];saveSession();render()}
function updateHistoryButtons(){const back=$('#backBtn'),forward=$('#forwardBtn');if(back)back.disabled=navIndex<=0;if(forward)forward.disabled=navIndex>=navHistory.length-1}
function setProgress(label,count,pct){$('#progressLabel').textContent=label;$('#progressCount').textContent=count;$('#progressFill').style.width=pct+'%'}
function focusHeading(){setTimeout(()=>{$('h1',app)?.focus({preventScroll:true})},20)}
function announce(t){live.textContent='';setTimeout(()=>live.textContent=t,20)}

function registration(){
  setTimeout(()=>{
    $('#begin').onclick=()=>{
      const v=$('#learnerName').value.trim();
      if(!v){announce('Enter your name before opening the transmission.');$('#learnerName').focus();return}
      state.name=v;go(1)
    };
    $('#learnerName').addEventListener('keydown',e=>{if(e.key==='Enter')$('#begin').click()});
  },0);
  return `<section class="screen landing-screen" data-readable>
    <div class="landing-frame">
      <div class="landing-copy">
        <div class="eyebrow landing-eyebrow">INCOMING TRANSMISSION</div>
        <h1 tabindex="-1" class="landing-title">GLORB &amp; THE<br>CONVERSATION<br>MISSION</h1>
        <div class="landing-signal" aria-hidden="true"><span>SIGNAL</span><div class="landing-signal-track"><div></div></div></div>
        <p class="landing-decoded">Transmission decoded.</p>
        <div class="landing-name">
          <label for="learnerName">EARTH EXPERT NAME</label>
          <input id="learnerName" maxlength="30" autocomplete="given-name" placeholder="Enter your first name" value="${esc(state.name)}">
        </div>
        <button id="begin" class="landing-button" type="button">OPEN TRANSMISSION</button>
      </div>
      <img class="landing-glorb" src="assets/landing/conversation-cover.png" alt="Glorb smiling">
    </div>
  </section>`
}
function radar(){setTimeout(()=>{$('#radarNext').onclick=()=>go(2)},0);return shell(content(`<div class="radar-layout"><div class="eyebrow">ZORBAX-9 // CONNECTION</div><h1 tabindex="-1">Incoming transmission</h1><div class="radar" aria-hidden="true"><div class="radar-sweep"></div><span class="blip b1"></span><span class="blip b2"></span><span class="blip b3"></span></div><div class="signal-row"><span>SEARCHING</span><div class="signal-track"><div class="signal-fill"></div></div><span>SIGNAL FOUND</span></div><div class="actions" style="justify-content:center">${btn('Open transmission','radarNext','primary orange')}</div></div>`),'dark')}
function orientation(){return shell(content(`<div class="transmission"><div>${asset(A+'glorb-portrait.png','Portrait of Glorb')}</div><div class="transmission-copy"><div class="eyebrow orange">INCOMING TRANSMISSION</div><h1 tabindex="-1">Hello, ${esc(state.name||'Earth Expert')}.</h1><p class="lead">I have three Earth conversation incidents I need help with.</p><p class="copy">Glorb has three Earth conversation problems. You’ll see what happened, help him work out what went wrong, and show him what to try next.</p>${actions('Open Incident 01',()=>go(3),'primary')}</div></div>`),'paper')}
function story(incident,title,paras,quote,glorbLine,img,nextLabel,next){return `<section class="screen" data-readable><div class="screen-shell story-shell"><div class="story-copy"><div class="incident">INCIDENT ${incident}</div><h1 tabindex="-1">${title}</h1>${paras.map(p=>`<p class="copy">${p}</p>`).join('')}<div class="quote-box">${quote}</div>${glorbLine?note(glorbLine,true):''}${actions(nextLabel,next)}</div><div class="story-visual">${asset(img,title)}</div></div></section>`}
function teach(mission,step,title,desc,examples,key,glorbLine,img,next){return shell(content(`<div class="teach-layout"><div class="teach-copy"><div class="eyebrow orange">MISSION ${mission} // STEP ${step}</div><h1 tabindex="-1">${title}</h1><p class="lead">${desc}</p>${examples.map(x=>`<div class="teach-card">${x}</div>`).join('')}<div class="key-line">${key}</div>${glorbLine?note(glorbLine,true):''}${actions('Next',next)}</div><div class="teach-visual">${asset(img,title)}</div></div>`),'paper')}
function whole(title,mission,strip,steps,key,next){return shell(content(`<div class="strip-layout"><div><div class="eyebrow orange">MISSION ${mission} // PUT IT TOGETHER</div><h1 tabindex="-1">${title}</h1><div class="step-summary">${steps.map((s,i)=>`<div class="${mission==='01'?'start':mission==='02'?'join':'end'}-c${i+1}"><strong>${s[0]}</strong><br>${s[1]}</div>`).join('')}</div><div class="key-line">${key}</div>${actions('Watch Glorb try',next)}</div><div class="strip-card">${asset(strip,title)}</div></div>`),'paper')}
function model(title,mission,conversation,cards,glorbLine,next){return shell(content(`<div class="model-layout"><div><div class="eyebrow orange">MISSION ${mission} // MODEL</div><h1 tabindex="-1">${title}</h1><div class="conversation-card">${conversation}</div>${glorbLine?note(glorbLine,true):''}${actions('Help Glorb practise',next)}</div><div class="model-cards">${cards.map((c,i)=>`<div class="model-card ${mission==='01'?'start':mission==='02'?'join':'end'}-c${i+1}"><strong>${c[0]} ✓</strong>${c[1]}</div>`).join('')}</div></div>`),'paper')}
function complete(title,stripText,desc,glorbLine,nextLabel,next){setTimeout(()=>{const b=$('#primaryAction');if(b)b.onclick=next},0);return shell(content(`<div class="complete-card"><div class="eyebrow orange">MISSION COMPLETE</div><h1 tabindex="-1">${title}</h1><div class="complete-strip">${stripText}</div><p class="lead">${desc}</p>${glorbLine?note(glorbLine):''}<div class="actions">${btn(nextLabel,'primaryAction','primary')}</div></div>`),'paper')}

const startChoices={
 greet:[['Say nothing and stare.','wrong','Maya does not know Glorb wants to talk. Try a simple hello.'],['Hi, Maya!','correct','Glorb says hello to Maya.'],['HELLO. LET US BEGIN FRIENDSHIP.','wrong','That is a lot to say at once. Try a simple hello.']],
 open:[['Tell me every fact about yourself.','wrong','That asks Maya for too much at once. Try one simple question.'],['Begin a long story about Zorbax-9.','wrong','Glorb starts talking about himself straight away. Try something Maya can answer.'],['How was your weekend?','correct','Gives Maya something easy to say back.']],
 notice:[['Pause and notice Maya’s response.','correct','Glorb waits to see what Maya does next.'],['Walk away immediately.','wrong','Glorb leaves before Maya can answer. Try waiting.'],['Keep talking without pausing.','wrong','Maya does not get a turn. Help Glorb pause and wait.']]
};
function startAssessment(){
  const order=['greet','open','notice'];
  const renderStep=(key,idx)=>`<div class="builder-step" data-key="${key}"><h3>STEP ${idx+1} // ${key.toUpperCase()}</h3><div class="choices">${startChoices[key].map(([t,type,fb],i)=>`<button class="choice ${state.start[key]===t?'selected':''}" data-key="${key}" data-text="${esc(t)}" data-type="${type}" data-feedback="${esc(fb)}">${t}</button>`).join('')}</div></div>`;
  const compact=isCompact();
  setTimeout(()=>{
    $$('.choice[data-key]').forEach(b=>b.onclick=()=>{
      const key=b.dataset.key,type=b.dataset.type,txt=b.dataset.text,fb=b.dataset.feedback;
      if(type==='wrong'){
        b.classList.add('tried');b.disabled=true;b.innerHTML+=` <span class="status-tag">TRIED</span>`;
        $('#startFeedback').innerHTML=`<div class="feedback">${fb}</div>`;return;
      }
      state.start[key]=txt;
      $$('.choice[data-key="'+key+'"]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected','correct');
      $('#startFeedback').innerHTML=`<div class="feedback good">✓ GOOD CHOICE. ${fb}</div>`;
      if(compact && state.start.mobileStep<2){state.start.mobileStep++;setTimeout(render,350)}
      else updateStartContinue();
    });
    $('#testStart')?.addEventListener('click',()=>{if(order.every(k=>state.start[k])){state.completed=Math.max(state.completed,1);go(10)}});
  },0);
  const mobileKey=order[state.start.mobileStep];
  const builder=compact?`<div class="mobile-step-nav"><strong>${state.start.mobileStep+1} / 3</strong><span>${mobileKey.toUpperCase()}</span></div><div class="mobile-builder">${renderStep(mobileKey,state.start.mobileStep)}</div>`:`<div class="builder-grid">${order.map(renderStep).join('')}</div>`;
  return shell(content(`<div class="assessment-shell activity-screen"><div class="assessment-head"><div><div class="eyebrow activity-kicker">YOUR TURN // MISSION 01</div><h1 tabindex="-1">Help Glorb start</h1><p class="activity-instruction"><strong>Choose one answer in each step to build Glorb’s opener.</strong><br><span>Pick a GREET, then an OPEN, then what Glorb should do next.</span></p></div></div>${builder}<div class="assessment-footer"><div><div id="startFeedback"></div><div class="preview"><strong>GLORB'S START</strong><br>${order.every(k=>state.start[k])?`${state.start.greet} → ${state.start.open} → ${state.start.notice}`:`${state.start.greet||'Greet'} → ${state.start.open||'Open'} → ${state.start.notice||'Notice'}`}</div></div><button id="testStart" class="primary" ${order.every(k=>state.start[k])?'':'disabled'}>Finish START mission</button></div></div>`),'paper','activity-shell')}
function updateStartContinue(){const b=$('#testStart');if(b)b.disabled=!['greet','open','notice'].every(k=>state.start[k])}

const joinChoices=[
 ['I played soccer yesterday.','wrong','They are talking about this handball game, not soccer. Try something about their game.'],
 ['Stop talking. I have a better story.','wrong','This takes over the conversation. Help Glorb talk about what Maya and Milo are already talking about.'],
 ['That game sounded close! Can I join the next round?','correct','This is about the handball game, so it fits the conversation.'],
 ['I ALSO POSSESS FEET.','wrong','Having feet is not what Maya and Milo are talking about. Try something about the handball game.']
];
function joinResponse(){setTimeout(()=>{$$('.join-choice').forEach(b=>{if(state.join.responseDone&&b.dataset.type==='correct'){b.classList.add('correct')}if(state.join.responseDone)b.disabled=true;b.onclick=()=>{if(b.dataset.type==='wrong'){b.classList.add('tried');b.disabled=true;b.innerHTML+=` <span class="status-tag">TRIED</span>`;$('#joinFeedback').innerHTML=`<div class="feedback">${b.dataset.feedback}</div>`}else{state.join.responseDone=true;saveSession();b.classList.add('correct');$$('.join-choice').forEach(x=>x.disabled=true);$('#joinFeedback').innerHTML=`<div class="feedback good">✓ GOOD CHOICE. ${b.dataset.feedback}</div>`;$('#completeJoin').disabled=false}}});$('#completeJoin').onclick=()=>{state.completed=Math.max(state.completed,2);go(18)}},0);return shell(content(`<div class="assessment-shell activity-screen"><div class="eyebrow activity-kicker">YOUR TURN // MISSION 02</div><h1 tabindex="-1">Help Glorb join</h1><p class="activity-instruction"><strong>Maya and Milo are talking about the handball game.</strong><br><span>There is a pause. What should Glorb say?</span></p><div class="topic-banner">THEY ARE TALKING ABOUT: THE HANDBALL GAME</div><div class="join-choice-grid">${joinChoices.map(([t,type,fb])=>`<button class="choice join-choice ${state.join.responseDone&&type==='correct'?'correct':''}" data-type="${type}" data-feedback="${esc(fb)}" ${state.join.responseDone?'disabled':''}>${t}</button>`).join('')}</div><div class="assessment-footer"><div id="joinFeedback">${state.join.responseDone?'<div class="feedback good">✓ GOOD CHOICE. This is about the handball game, so it fits the conversation.</div>':''}</div><button id="completeJoin" class="primary" ${state.join.responseDone?'':'disabled'}>Finish JOIN mission</button></div></div>`),'paper','activity-shell')}

function endSequence(){
  const correct=['SIGNAL','FINISH PHRASE','EXIT'];
  const initial=['EXIT','SIGNAL','FINISH PHRASE'];
  setTimeout(()=>{
    $$('.sequence-choice').forEach(b=>b.onclick=()=>{
      const expected=correct[state.end.placed.length],val=b.dataset.val;
      if(val===expected){state.end.placed.push(val);render();}
      else{b.classList.remove('wrong-pulse');void b.offsetWidth;b.classList.add('wrong-pulse');$('#endFeedback').innerHTML=`<div class="feedback">${val==='EXIT'?'Walking away comes later. First, Glorb should say he needs to go.':val==='FINISH PHRASE'?'Saying goodbye comes later. First, Glorb should give a clue that he needs to go.':'Try the step that fits here.'}</div>`}
    });
    $('#completeEnd')?.addEventListener('click',()=>{state.completed=3;go(27)});
  },0);
  const remaining=initial.filter(x=>!state.end.placed.includes(x));
  const prompt=state.end.placed.length===0?'What comes first?':state.end.placed.length===1?'What comes next?':'What comes last?';
  return shell(content(`<div class="sequence-layout activity-screen"><div><div class="eyebrow activity-kicker">YOUR TURN // MISSION 03</div><h1 tabindex="-1">Help Glorb put the ending in order</h1><p class="activity-instruction"><strong>Choose the 3 parts in the right order.</strong><br><span>${state.end.placed.length<3?prompt:'You helped Glorb build the ending.'}</span></p><div class="sequence-options">${remaining.map(v=>`<button class="choice sequence-choice" data-val="${v}"><strong>${v}</strong><span class="choice-example">${v==='SIGNAL'?'“I better get to class.”':v==='FINISH PHRASE'?'“See you later.”':'Walk away.'}</span></button>`).join('')}</div><div id="endFeedback"></div>${state.end.placed.length===3?`<div class="actions"><button id="completeEnd" class="primary">Finish END mission</button></div>`:''}</div><div class="sequence-slots">${correct.map((v,i)=>`<div class="slot ${state.end.placed[i]===v?'filled':''}">${i+1} · ${state.end.placed[i]||''}</div>`).join('')}</div></div>`),'paper','activity-shell')}

function finalMap(){return shell(content(`<div class="final-map"><div><div class="eyebrow orange">FINAL CONVERSATION MISSION</div><h1 tabindex="-1">Help Glorb put the three parts together</h1><div class="final-steps"><div><strong>START</strong> Greet → Open → Notice</div><div><strong>JOIN</strong> Listen → Wait → Connect</div><div><strong>END</strong> Signal → Finish Phrase → Exit</div></div><p class="copy">Real conversations can look different. These steps give Glorb useful things to notice and try.</p>${note('I think I’m finally getting the hang of Earth conversations.',true)}${actions('Run final mission',()=>go(29))}</div><div>${asset(strips.combined,'START, JOIN and END conversation steps')}</div></div>`),'paper')}
function finalPart(part,title,visual,scenario,choices,next){const key=part.toLowerCase();setTimeout(()=>{$$('.final-choice').forEach(b=>b.onclick=()=>{if(b.dataset.type==='wrong'){b.classList.add('tried');b.disabled=true;b.innerHTML+=` <span class="status-tag">TRIED</span>`;$('#finalFeedback').innerHTML=`<div class="feedback">${b.dataset.feedback}</div>`}else{state.final[key]=true;saveSession();b.classList.add('correct');$$('.final-choice').forEach(x=>x.disabled=true);$('#finalFeedback').innerHTML=`<div class="feedback good">✓ GOOD CHOICE. ${b.dataset.feedback}</div>`;$('#finalNext').disabled=false}});$('#finalNext').onclick=next},0);return shell(content(`<div class="final-mission-layout activity-screen"><div><div class="eyebrow activity-kicker">YOUR TURN // FINAL MISSION // ${part}</div><h1 tabindex="-1">${title}</h1><p class="copy">${scenario}</p><div class="choices">${choices.map(([t,type,fb])=>`<button class="choice final-choice" data-type="${type}" data-feedback="${esc(fb)}">${t}</button>`).join('')}</div><div id="finalFeedback"></div><div class="actions"><button id="finalNext" class="primary" ${state.final[key]?'':'disabled'}>Continue</button></div></div><div>${asset(visual,title)}</div></div>`),'paper','activity-shell')}

function transfer(){const choices=[['START','I will try one simple question or comment.'],['JOIN','I will wait for a pause before I join.'],['END','I will say something before I leave.']];setTimeout(()=>{const own=$('#ownGoal');$$('.transfer-card').forEach(b=>b.onclick=()=>{state.goal=b.dataset.goal;$$('.transfer-card').forEach(x=>x.classList.toggle('selected',x===b));own.value='';$('#goalNext').disabled=false;saveSession()});own.addEventListener('input',()=>{const v=own.value.trim();if(v){state.goal=v;$$('.transfer-card').forEach(x=>x.classList.remove('selected'));$('#goalNext').disabled=false}else if(!$$('.transfer-card.selected').length){state.goal='';$('#goalNext').disabled=true}saveSession()});$('#goalNext').onclick=()=>go(34)},0);return shell(content(`<div class="goal-screen activity-screen"><div class="eyebrow activity-kicker">YOUR TURN // NEXT EARTH MISSION</div><h1 tabindex="-1">Choose your next Earth mission</h1><p class="lead">Glorb has been practising. Now choose one thing you would like to try.</p><p class="copy">Choose one idea, or make your own goal.</p><div class="transfer-grid">${choices.map(([h,t])=>`<button class="transfer-card" data-goal="${t}"><strong>${h}</strong><br>${t}</button>`).join('')}</div><div class="own-goal"><label for="ownGoal"><strong>MY OWN GOAL</strong><span>What is one conversation goal you want to try?</span></label><input id="ownGoal" maxlength="120" value="${esc(state.goal && !choices.some(([,t])=>t===state.goal)?state.goal:'')}" placeholder="Example: I want to speak to one new person this week."></div><div class="actions"><button id="goalNext" class="primary" ${state.goal?'':'disabled'}>Continue</button></div></div>`),'paper','activity-shell')}
function finalMessage(){return shell(content(`<div class="transmission"><div>${asset(A+'glorb-portrait.png','Portrait of Glorb')}</div><div class="transmission-copy"><div class="eyebrow orange">TRANSMISSION FROM GLORB</div><h1 tabindex="-1">Dear ${esc(state.name||'Earth Expert')},</h1><p class="copy">It worked.</p><p class="copy">I learned how to <strong>start</strong>, <strong>join</strong> and <strong>end</strong> conversations.</p><p class="copy">I learned to say hello, ask something simple and wait to see what happens.</p><p class="copy">I learned to listen, wait for a pause and talk about the same thing.</p><p class="copy">I also learned to say something before I leave.</p>${note('Earth conversations still confuse me sometimes, but I understand them much better now.',true)}${actions('View certificate',()=>go(35))}</div></div>`),'paper')}
function certificate(){setTimeout(()=>{$('#printCert').onclick=()=>window.print();$('#restart').onclick=()=>{sessionStorage.removeItem(SESSION_KEY);location.href=location.pathname}},0);return `<section class="screen"><div class="certificate-wrap"><article class="certificate" data-readable><div><div class="eyebrow dark" style="text-align:center">EARTH EXPERT CERTIFICATE</div><h1 tabindex="-1">GLORB'S CONVERSATION MISSION</h1><div style="text-align:center">THIS CERTIFIES THAT</div><div class="certificate-name">${esc(state.name||'Earth Expert')}</div></div><p class="certificate-intro">During this mission, ${esc(state.name||'the Earth Expert')} helped Glorb learn and practise ways to start, join and end conversations. ${esc(state.name||'The Earth Expert')} guided Glorb through each mission and helped him put the steps together.</p><div class="cert-skills"><div class="cert-skill"><h3>START · GREET → OPEN → NOTICE</h3><p>Greeting someone, using a simple question or comment to open a conversation, and pausing to notice the other person's response.</p></div><div class="cert-skill"><h3>JOIN · LISTEN → WAIT → CONNECT</h3><p>Listening to what people are talking about, waiting for a space in the conversation, and adding something connected to the current topic.</p></div><div class="cert-skill"><h3>END · SIGNAL → FINISH PHRASE → EXIT</h3><p>Giving a signal that the conversation is finishing, using a clear finish phrase, and then leaving.</p></div></div><div class="cert-bottom"><div><p><strong>${esc(state.name||'The Earth Expert')} completed Glorb’s Conversation Mission and helped Glorb practise all three conversation skills.</strong></p><div class="cert-goal"><strong>MY NEXT EARTH MISSION</strong><br>${esc(state.goal||'Choose one conversation strategy to practise again.')}</div></div><div class="cert-footer">3 / 3 LEARNING MISSIONS COMPLETE<br>FINAL CONVERSATION MISSION COMPLETE<br>VERIFIED BY GLORB</div></div></article><div class="certificate-actions"><button id="printCert" class="primary">Print / save certificate</button><button id="restart" class="secondary">Start over</button></div></div></section>`}

const screens=[
 registration,
 radar,
 orientation,
 ()=>story('01 // START','Starting a conversation',['I wanted to talk to Maya.','I walked over and said:'],'“HELLO. LET US BEGIN FRIENDSHIP.”','I thought that was a good way to start because I do want to be friends.',A+'story-start.png','HELP GLORB START',()=>go(4)),
 ()=>teach('01','1','GREET','Glorb needs a simple way to begin.',['<strong>Show Glorb:</strong> say hello, and use the person’s name if he knows it.','<strong>Example:</strong> “Hi Maya.”'],'Help Glorb start with a simple hello.','Apparently I don’t need to declare that friendship has started. It just happens.',icons.greet,()=>go(5)),
 ()=>teach('01','2','OPEN','Now Glorb needs to give Maya something easy to answer.',['<strong>He can:</strong> ask a simple question or say something about what is happening.','<strong>Example:</strong> “How was your weekend?”'],'Help Glorb give Maya something easy to say back.','One simple question. That’s easier.',icons.open,()=>go(6)),
 ()=>teach('01','3','NOTICE','After Glorb starts, he needs to pause and see what Maya does next.',['Maya might answer, ask something back, give a short reply, look busy, or not seem ready to keep talking.'],'Help Glorb remember: he does not need to keep talking straight away.','So I say something, then I wait and see what happens.',icons.notice,()=>go(7)),
 ()=>whole('Put the START steps together','01',strips.start,[['GREET','Say hello.'],['OPEN','Give them something to respond to.'],['NOTICE','Pause and see what happens next.']],'GREET → OPEN → NOTICE',()=>go(8)),
 ()=>model('Watch Glorb try','01',`<div class="bubble"><span class="speaker">GLORB</span>Hi Maya. How was your weekend?</div><div class="bubble alt"><span class="speaker">MAYA</span>Good! We went to the beach.</div>`,[['GREET','“Hi Maya.”'],['OPEN','“How was your weekend?”'],['NOTICE','He pauses and listens.']],'That gave Maya an easy way to reply.',()=>go(9)),
 startAssessment,
 ()=>complete('START mission complete','GREET ✓ → OPEN ✓ → NOTICE ✓','Glorb said hello, asked a simple question, then waited to see what Maya did.','Conversation started. That went much better.','Next mission',()=>go(11)),
 ()=>story('02 // JOIN','Joining a conversation',['Someone told me that finding something you have in common can help you connect with people.','Later, I saw Maya and Milo talking about handball. I thought: “Handball uses feet. I have feet too.”'],'“I ALSO POSSESS FEET.”','I thought that would help me join in.',A+'story-join.png','HELP GLORB JOIN',()=>go(12)),
 ()=>teach('02','1','LISTEN','Before Glorb joins, he needs to know what Maya and Milo are talking about.',['<strong>They are talking about:</strong> this handball game.','Not just sports, feet or the playground. Those things are related, but they are not what Maya and Milo are talking about right now.'],'HELP GLORB REMEMBER: Listen for what the conversation is about right now.','',icons.listen,()=>go(13)),
 ()=>teach('02','2','WAIT','Before Glorb joins, he needs to wait for a good time to speak.',['He can listen for someone finishing what they are saying or for a short pause.'],'HELP GLORB REMEMBER: Wait until there is a space to join.','Okay. I’ll wait for a pause.',icons.wait,()=>go(14)),
 ()=>teach('02','3','CONNECT','When Glorb joins, he should say something about what Maya and Milo are talking about.',['<strong>Good choices:</strong> “That last round was close.” · “Can I join the next round?”','<strong>Not a good fit:</strong> “I played soccer yesterday.” · “I also possess feet.”'],'HELP GLORB REMEMBER: Stay with what they are talking about.','So I should talk about the same thing.',icons.connect,()=>go(15)),
 ()=>whole('Put the JOIN steps together','02',strips.join,[['LISTEN','What are they talking about?'],['WAIT','Is there a space?'],['CONNECT','What can I add that fits?']],'LISTEN → WAIT → CONNECT',()=>go(16)),
 ()=>model('Watch Glorb try','02',`<div class="bubble"><span class="speaker">MAYA</span>The last round was so close.</div><div class="bubble alt"><span class="speaker">MILO</span>I thought the ball was out!</div><div class="pause-box">PAUSE</div><div class="bubble"><span class="speaker">GLORB</span>That game sounded close. Can I join the next round?</div>`,[['LISTEN','He worked out the topic.'],['WAIT','He waited for a pause.'],['CONNECT','He stayed with the handball game.']],'',()=>go(17)),
 joinResponse,
 ()=>complete('JOIN mission complete','LISTEN ✓ → WAIT ✓ → CONNECT ✓','Glorb listened, waited for a pause, and talked about the same thing.','I waited for a pause and joined in.','Next mission',()=>go(20)),
 ()=>shell(content(`<div class="complete-card"><div class="eyebrow orange">MISSION COMPLETE</div><h1 tabindex="-1">JOIN mission complete</h1><p class="lead">Glorb listened, waited for a pause, and talked about the same thing.</p>${actions('Next mission',()=>go(20))}</div>`),'paper'),
 ()=>story('03 // END','Ending a conversation',['I finally had a good conversation. I greeted Maya, listened and stayed on topic.','Then I decided I was finished.'],'SO I RAN AWAY.','I thought running away showed I was finished.',A+'story-end.png','HELP GLORB END',()=>go(21)),
 ()=>teach('03','1','SIGNAL','First, Glorb can give a clue that he needs to go.',['Examples: “The bell is about to ring.” · “I need to get back to class.” · “I have to go soon.”'],'HELP GLORB REMEMBER: Give a clue before leaving.','So I tell them I need to go soon.',icons.signal,()=>go(22)),
 ()=>teach('03','2','FINISH PHRASE','Glorb can use a few words to show he is ready to finish talking.',['<strong>For example:</strong> “I have to go now.” · “Thanks for talking with me.”'],'HELP GLORB REMEMBER: Say something before you leave.','Oh. So I should say I’m going.',icons.finish,()=>go(23)),
 ()=>teach('03','3','EXIT','After Glorb says he is going, he can leave.',['He might walk away, wave, go back to class or move to the next activity.'],'HELP GLORB REMEMBER: Say something, then leave.','So I say goodbye, then I go.',icons.exit,()=>go(24)),
 ()=>whole('Put the END steps together','03',strips.end,[['SIGNAL','Give a clue.'],['FINISH PHRASE','Finish with words.'],['EXIT','Then leave.']],'SIGNAL → FINISH PHRASE → EXIT',()=>go(25)),
 ()=>model('Watch Glorb try','03',`<div class="bubble"><span class="speaker">GLORB</span>The bell is about to ring.</div><div class="bubble"><span class="speaker">GLORB</span>I have to go, but it was good talking.</div><div class="bubble"><span class="speaker">GLORB</span>See you at lunch!</div>`,[['SIGNAL','“The bell is about to ring.”'],['FINISH PHRASE','“I have to go, but it was good talking.”'],['EXIT','Glorb waves and leaves.']],'That was clearer than running away.',()=>go(26)),
 endSequence,
 ()=>complete('END mission complete','SIGNAL ✓ → FINISH PHRASE ✓ → EXIT ✓','Glorb said he needed to go, said goodbye, then left.','Oh. Saying goodbye first makes more sense.','Continue',()=>go(28)),
 finalMap,
 ()=>finalPart('START','HELP GLORB START',A+'story-start.png','Glorb sees Maya. <strong>What should Glorb say first?</strong>',[['Tell me every fact about yourself.','wrong','That asks for too much at once.'],['Hi Maya. How did handball go?','correct','Gives Maya something easy to say back.'],['Say nothing and stare.','wrong','Maya does not know Glorb wants to talk. Try a simple hello.']],()=>go(30)),
 ()=>finalPart('JOIN','HELP GLORB JOIN',A+'story-join.png','Maya and Milo are talking about the handball game.<br>There is a pause.<br><strong>What should Glorb say?</strong>',[['I played soccer yesterday.','wrong','They are talking about this handball game, not soccer. Try something about their game.'],['I ALSO POSSESS FEET.','wrong','Having feet is not what Maya and Milo are talking about. Try something about the handball game.'],['That game sounded close. Can I join the next round?','correct','This is about the handball game, so it fits the conversation.']],()=>go(31)),
 ()=>finalPart('END','HELP GLORB END',A+'story-end.png','The bell is about to ring and Glorb needs to go.<br><strong>What should Glorb say?</strong>',[['Run away without saying anything.','wrong','Glorb leaves without saying goodbye.'],['The bell is about to ring. I have to go, but it was good talking. See you later!','correct','Glorb says he needs to go, says goodbye, then leaves.'],['Keep talking even though he needs to go.','wrong','Glorb should say something before he leaves.']],()=>go(32)),
 ()=>shell(content(`<div class="final-map"><div><div class="eyebrow orange">FINAL MISSION COMPLETE</div><h1 tabindex="-1">You helped Glorb put it all together</h1><div class="final-steps"><div><strong>START ✓</strong> Greet → Open → Notice</div><div><strong>JOIN ✓</strong> Listen → Wait → Connect</div><div><strong>END ✓</strong> Signal → Finish Phrase → Exit</div></div><p class="copy">Glorb practised each part, then put all three together in one Conversation Mission.</p><p class="copy"><strong>You helped him work out what to do.</strong></p>${actions('Choose your next Earth mission',()=>go(33))}</div><div>${asset(strips.combined,'START, JOIN and END conversation steps')}</div></div>`),'paper'),
 transfer,
 finalMessage,
 certificate
];

function screenHelp(){
  const s=state.screen;
  if(s===9)return '<p><strong>Help Glorb:</strong> Greet → Open → Notice. Which step are you helping him choose now?</p>';
  if(s===17)return '<p><strong>Help Glorb JOIN:</strong> Maya and Milo are talking about handball. Choose something about the same thing.</p>';
  if(s===26)return '<p><strong>Help Glorb:</strong> Signal → Finish Phrase → Exit. First he says he needs to go, then says goodbye, then leaves.</p>';
  if(s===29)return '<p><strong>Help Glorb START:</strong> Choose something simple that Maya can answer.</p>';
  if(s===30)return '<p><strong>Help Glorb JOIN:</strong> Listen to what they are talking about, wait for a pause, then say something about the same thing.</p>';
  if(s===31)return '<p><strong>Help Glorb END:</strong> He can say he needs to go, say goodbye, then leave.</p>';
  if(s>=4&&s<=8)return '<p><strong>Help Glorb START:</strong> Greet → Open → Notice.</p>';
  if(s>=12&&s<=16)return '<p><strong>Help Glorb JOIN:</strong> Listen → Wait → Connect.</p>';
  if(s>=21&&s<=25)return '<p><strong>Help Glorb END:</strong> Signal → Finish Phrase → Exit.</p>';
  return '<p>Help Glorb work out what to do next. You can use Read aloud if listening helps.</p>';
}
function bindGlobal(){
  $('#backBtn').onclick=()=>moveHistory(-1);$('#forwardBtn').onclick=()=>moveHistory(1);updateHistoryButtons();
  $('#helpBtn').onclick=()=>{$('#helpContent').innerHTML=screenHelp();$('#helpDialog').showModal()};
  $('#infoBtn').onclick=()=>{showInfo('about');$('#infoDialog').showModal()};
  $$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
  $$('.tab').forEach(t=>t.onclick=()=>showInfo(t.dataset.tab));
  $('#readBtn').onclick=toggleSpeech;
}
function showInfo(key){
  $$('.tab').forEach(t=>{const on=t.dataset.tab===key;t.classList.toggle('active',on);t.setAttribute('aria-selected',on)});
  $('#infoContent').innerHTML=key==='evidence'?evidenceHtml():adultInfo[key];
  if(key==='evidence'){
    $('#refPrev')?.addEventListener('click',()=>{state.refPage=Math.max(0,state.refPage-1);showInfo('evidence')});
    $('#refNext')?.addEventListener('click',()=>{state.refPage=Math.min(1,state.refPage+1);showInfo('evidence')});
  }
}
function readableText(){const n=$('[data-readable]',app)||app;const clone=n.cloneNode(true);$$('button,input',clone).forEach(x=>x.remove());return clone.innerText.replace(/\s+/g,' ').trim()}
function speakText(text){if(!('speechSynthesis'in window))return;stopSpeech();const u=new SpeechSynthesisUtterance(text);u.lang='en-AU';u.rate=.96;speechSynthesis.speak(u)}
function toggleSpeech(){if(!('speechSynthesis'in window)){announce('Read aloud is not available in this browser.');return}if(speechSynthesis.speaking){stopSpeech();return}const u=new SpeechSynthesisUtterance(readableText());u.lang='en-AU';u.rate=.96;u.onstart=()=>$('#readBtn').innerHTML='■ <span>Stop</span>';u.onend=()=>$('#readBtn').innerHTML='↻ <span>Read again</span>';u.onerror=()=>$('#readBtn').innerHTML='🔊 <span>Read aloud</span>';state.tts=u;speechSynthesis.speak(u)}
function stopSpeech(){if('speechSynthesis'in window)speechSynthesis.cancel();const b=$('#readBtn');if(b)b.innerHTML='🔊 <span>Read aloud</span>'}
function render(){
  const s=state.screen;
  document.body.classList.toggle('landing-mode',s===0);
  if(s<=2)setProgress('ORIENTATION','0 / 3 missions complete',0);
  else if(s<=10)setProgress('MISSION 01 // START','0 / 3 missions complete',16);
  else if(s<=19)setProgress('MISSION 02 // JOIN','1 / 3 missions complete',42);
  else if(s<=27)setProgress('MISSION 03 // END','2 / 3 missions complete',68);
  else setProgress('FINAL INTEGRATION','3 / 3 missions complete',100);
  app.innerHTML=(screens[s]||screens[0])();
  bindGlobal();
  focusHeading();
  saveSession();
}
window.addEventListener('resize',()=>{if(state.screen===9)render()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech()});
render();