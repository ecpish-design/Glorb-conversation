const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const app=$('#main');
const live=$('#live');
const qs=new URLSearchParams(location.search);
const debugScreen=Number(qs.get('screen'));
const state={
  name:'',screen:Number.isFinite(debugScreen)&&debugScreen>=0?debugScreen:0,completed:0,goal:'',reflection:'',tts:null,
  start:{greet:null,open:null,notice:null,mobileStep:0},join:{timingDone:false},end:{placed:[]},final:{start:false,join:false,end:false},refPage:0
};
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
function shell(inner,type='paper'){return `<section class="screen" data-readable><div class="screen-shell ${type==='dark'?'dark-shell':'paper-shell'}">${inner}</div></section>`}
function content(inner){return `<div class="content-pad" style="width:100%">${inner}</div>`}
function isCompact(){return matchMedia('(max-width:700px)').matches}
function go(n){stopSpeech();state.screen=n;render()}
function setProgress(label,count,pct){$('#progressLabel').textContent=label;$('#progressCount').textContent=count;$('#progressFill').style.width=pct+'%'}
function focusHeading(){setTimeout(()=>{$('h1',app)?.focus({preventScroll:true})},20)}
function announce(t){live.textContent='';setTimeout(()=>live.textContent=t,20)}

function registration(){setTimeout(()=>{$('#begin').onclick=()=>{const v=$('#learnerName').value.trim();if(!v){announce('Enter your name before beginning.');$('#learnerName').focus();return}state.name=v;go(1)}},0);return shell(content(`<div class="registration"><div class="registration-card"><div class="eyebrow dark">MISSION REGISTRATION // EARTH EXPERT</div><h1 tabindex="-1">Who is completing this mission?</h1><p class="lead">Enter your first name so Glorb can speak to you during the mission and create your certificate at the end.</p><div class="name-field"><label for="learnerName">First name</label><input id="learnerName" maxlength="30" autocomplete="given-name" placeholder="Enter your name"></div><div class="actions">${btn('Start mission','begin','primary')}</div></div><div class="registration-visual">${asset(A+'glorb-full.png','Glorb standing','')}</div></div>`),'dark')}
function radar(){setTimeout(()=>{$('#radarNext').onclick=()=>go(2)},0);return shell(content(`<div class="radar-layout"><div class="eyebrow">ZORBAX-9 // CONNECTION</div><h1 tabindex="-1">Incoming transmission</h1><div class="radar" aria-hidden="true"><div class="radar-sweep"></div><span class="blip b1"></span><span class="blip b2"></span><span class="blip b3"></span></div><div class="signal-row"><span>SEARCHING</span><div class="signal-track"><div class="signal-fill"></div></div><span>SIGNAL FOUND</span></div><div class="actions" style="justify-content:center">${btn('Open transmission','radarNext','primary orange')}</div></div>`),'dark')}
function orientation(){return shell(content(`<div class="transmission"><div>${asset(A+'glorb-portrait.png','Portrait of Glorb')}</div><div class="transmission-copy"><div class="eyebrow orange">INCOMING TRANSMISSION</div><h1 tabindex="-1">Hello, ${esc(state.name||'Earth Expert')}.</h1><p class="lead">I have three Earth conversation incidents I need help with.</p><p class="copy">We will solve them one at a time. First you will see what happened. Then we will learn each step, watch an example and practise it.</p>${actions('Open Incident 01',()=>go(3),'primary')}</div></div>`),'paper')}
function story(incident,title,paras,quote,glorbLine,img,nextLabel,next){return `<section class="screen" data-readable><div class="screen-shell story-shell"><div class="story-visual">${asset(img,title)}</div><div class="story-copy"><div class="incident">INCIDENT ${incident}</div><h1 tabindex="-1">${title}</h1>${paras.map(p=>`<p class="copy">${p}</p>`).join('')}<div class="quote-box">${quote}</div>${glorbLine?note(glorbLine,true):''}${actions(nextLabel,next)}</div></div></section>`}
function teach(mission,step,title,desc,examples,key,glorbLine,img,next){return shell(content(`<div class="teach-layout"><div class="teach-copy"><div class="eyebrow orange">MISSION ${mission} // STEP ${step}</div><h1 tabindex="-1">${title}</h1><p class="lead">${desc}</p>${examples.map(x=>`<div class="teach-card">${x}</div>`).join('')}<div class="key-line">${key}</div>${glorbLine?note(glorbLine,true):''}${actions('Next',next)}</div><div class="teach-visual">${asset(img,title)}</div></div>`),'paper')}
function whole(title,mission,strip,steps,key,next){return shell(content(`<div class="strip-layout"><div><div class="eyebrow orange">MISSION ${mission} // PUT IT TOGETHER</div><h1 tabindex="-1">${title}</h1><div class="step-summary">${steps.map((s,i)=>`<div class="${mission==='01'?'start':mission==='02'?'join':'end'}-c${i+1}"><strong>${s[0]}</strong><br>${s[1]}</div>`).join('')}</div><div class="key-line">${key}</div>${actions('Watch Glorb try',next)}</div><div class="strip-card">${asset(strip,title)}</div></div>`),'paper')}
function model(title,mission,conversation,cards,glorbLine,next){return shell(content(`<div class="model-layout"><div><div class="eyebrow orange">MISSION ${mission} // MODEL</div><h1 tabindex="-1">${title}</h1><div class="conversation-card">${conversation}</div>${glorbLine?note(glorbLine,true):''}${actions('My turn',next)}</div><div class="model-cards">${cards.map((c,i)=>`<div class="model-card ${mission==='01'?'start':mission==='02'?'join':'end'}-c${i+1}"><strong>${c[0]} ✓</strong>${c[1]}</div>`).join('')}</div></div>`),'paper')}
function complete(title,stripText,desc,glorbLine,nextLabel,next){setTimeout(()=>{const b=$('#primaryAction');if(b)b.onclick=next},0);return shell(content(`<div class="complete-card"><div class="eyebrow orange">MISSION COMPLETE</div><h1 tabindex="-1">${title}</h1><div class="complete-strip">${stripText}</div><p class="lead">${desc}</p>${glorbLine?note(glorbLine):''}<div class="actions">${btn(nextLabel,'primaryAction','primary')}</div></div>`),'paper')}

const startChoices={
 greet:[['Say nothing and stare.','wrong','Maya does not know Glorb wants to begin. A greeting gives a clear starting signal.'],['Hi, Maya!','correct','A short greeting clearly starts the interaction.'],['HELLO. LET US BEGIN FRIENDSHIP.','wrong','That is much stronger than a usual greeting. A simple hello is enough to begin.']],
 open:[['Tell me every fact about yourself.','wrong','That asks for a lot at once. A simple question is easier to answer.'],['Begin a long story about Zorbax-9.','wrong','That starts with Glorb’s own topic before Maya has a chance to respond.'],['How was your weekend?','correct','This gives Maya something simple she can respond to.']],
 notice:[['Pause and notice Maya’s response.','correct','Pausing gives Maya space to respond.'],['Walk away immediately.','wrong','Glorb has started the conversation, but leaving immediately does not give Maya space to answer.'],['Keep talking without pausing.','wrong','If Glorb keeps talking, Maya does not get a turn.']]
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
      $('#startFeedback').innerHTML=`<div class="feedback good">✓ Fits this situation. ${fb}</div>`;
      if(compact && state.start.mobileStep<2){state.start.mobileStep++;setTimeout(render,350)}
      else updateStartContinue();
    });
    $('#testStart')?.addEventListener('click',()=>{if(order.every(k=>state.start[k])){state.completed=Math.max(state.completed,1);go(10)}});
  },0);
  const mobileKey=order[state.start.mobileStep];
  const builder=compact?`<div class="mobile-step-nav"><strong>${state.start.mobileStep+1} / 3</strong><span>${mobileKey.toUpperCase()}</span></div><div class="mobile-builder">${renderStep(mobileKey,state.start.mobileStep)}</div>`:`<div class="builder-grid">${order.map(renderStep).join('')}</div>`;
  return shell(content(`<div class="assessment-shell"><div class="assessment-head"><div><div class="eyebrow orange">MISSION 01 // PRACTISE</div><h1 tabindex="-1">Build Glorb’s opener</h1></div></div>${builder}<div class="assessment-footer"><div><div id="startFeedback"></div><div class="preview"><strong>GLORB'S OPENER</strong><br>${state.start.greet||'Greet'} → ${state.start.open||'Open'} → ${state.start.notice||'Notice'}</div></div><button id="testStart" class="primary" ${order.every(k=>state.start[k])?'':'disabled'}>Complete START</button></div></div>`),'paper')}
function updateStartContinue(){const b=$('#testStart');if(b)b.disabled=!['greet','open','notice'].every(k=>state.start[k])}

function joinTiming(){setTimeout(()=>{
  const joinBtn=$('#joinNow');let phase=0;const states=[['MAYA','The last round was so close.'],['MILO','I thought the ball was out!'],['PAUSE','There is a space to join.']];
  const show=()=>{const [who,text]=states[phase];$('#timingState').classList.toggle('ready',phase===2);$('#timingState').innerHTML=`<strong>${who}</strong><p>${text}</p>`;joinBtn.disabled=phase!==2;$('#advanceTalk').disabled=phase===2};show();
  $('#advanceTalk').onclick=()=>{phase=Math.min(2,phase+1);show()};
  joinBtn.onclick=()=>{state.join.timingDone=true;go(18)};
  $('#replayTalk').onclick=()=>{phase=0;show()};
  $('#readTalk').onclick=()=>speakText('Maya says: The last round was so close. Milo says: I thought the ball was out. Then there is a pause.');
  $('#showTranscript').onclick=()=>{$('#helpContent').innerHTML='<p><strong>MAYA:</strong> The last round was so close.</p><p><strong>MILO:</strong> I thought the ball was out!</p><p><strong>Then:</strong> a natural pause.</p>';$('#helpDialog').showModal()};
},0);return shell(content(`<div class="timing-layout"><div><div class="eyebrow orange">MISSION 02 // PRACTISE</div><h1 tabindex="-1">Find the space</h1><p class="lead">Listen for the end of the turn. You do not need to count seconds.</p><div id="timingState" class="timing-state"></div></div><div class="timing-controls"><button id="advanceTalk" class="secondary">Next speaker</button><button id="joinNow" class="primary" disabled>Join now</button><button id="replayTalk" class="ghost">Replay</button><button id="readTalk" class="ghost">Read conversation</button><button id="showTranscript" class="ghost">Show transcript</button></div></div>`),'paper')}
const joinChoices=[
 ['I played soccer yesterday.','wrong','Soccer and handball are both sports, but Maya and Milo are talking about this handball game. Joining works better when Glorb connects to the topic they are discussing right now.'],
 ['Stop talking. I have a better story.','wrong','This takes over the conversation instead of joining it. Look for something that stays with their topic.'],
 ['That game sounded close! Can I join the next round?','correct','Glorb waited for a space and added something about the handball game they were already discussing.'],
 ['I ALSO POSSESS FEET.','wrong','Maya and Milo are talking about the game, not about having body parts. Look for something connected to what they are actually discussing.']
];
function joinResponse(){setTimeout(()=>{$$('.join-choice').forEach(b=>b.onclick=()=>{if(b.dataset.type==='wrong'){b.classList.add('tried');b.disabled=true;b.innerHTML+=` <span class="status-tag">TRIED</span>`;$('#joinFeedback').innerHTML=`<div class="feedback">${b.dataset.feedback}</div>`}else{b.classList.add('correct');$$('.join-choice').forEach(x=>x.disabled=true);$('#joinFeedback').innerHTML=`<div class="feedback good">✓ Fits this situation. ${b.dataset.feedback}</div>`;$('#completeJoin').disabled=false}});$('#completeJoin').onclick=()=>{state.completed=Math.max(state.completed,2);go(19)}},0);return shell(content(`<div class="assessment-shell"><div class="eyebrow orange">MISSION 02 // PRACTISE</div><h1 tabindex="-1">What could Glorb say now?</h1><div class="topic-banner">CURRENT TOPIC: THE HANDBALL GAME</div><div class="join-choice-grid">${joinChoices.map(([t,type,fb])=>`<button class="choice join-choice" data-type="${type}" data-feedback="${esc(fb)}">${t}</button>`).join('')}</div><div class="assessment-footer"><div id="joinFeedback"></div><button id="completeJoin" class="primary" disabled>Complete JOIN</button></div></div>`),'paper')}

function endSequence(){
  const correct=['SIGNAL','FINISH PHRASE','EXIT'];
  const initial=['EXIT','SIGNAL','FINISH PHRASE'];
  setTimeout(()=>{
    $$('.sequence-choice').forEach(b=>b.onclick=()=>{
      const expected=correct[state.end.placed.length],val=b.dataset.val;
      if(val===expected){state.end.placed.push(val);render();}
      else{b.classList.remove('wrong-pulse');void b.offsetWidth;b.classList.add('wrong-pulse');$('#endFeedback').innerHTML=`<div class="feedback">${val==='EXIT'?'Exit comes later. First, give a signal that the conversation is ending.':val==='FINISH PHRASE'?'A finish phrase helps, but first give a clue that you are getting ready to leave.':'Try the step that fits here.'}</div>`}
    });
    $('#completeEnd')?.addEventListener('click',()=>{state.completed=3;go(27)});
  },0);
  const remaining=initial.filter(x=>!state.end.placed.includes(x));
  const prompt=state.end.placed.length===0?'What comes first?':state.end.placed.length===1?'What comes next?':'What comes last?';
  return shell(content(`<div class="sequence-layout"><div><div class="eyebrow orange">MISSION 03 // PRACTISE</div><h1 tabindex="-1">Put the ending in order</h1><p class="lead">${state.end.placed.length<3?prompt:'You built the ending.'}</p><div class="sequence-options">${remaining.map(v=>`<button class="choice sequence-choice" data-val="${v}">${v}</button>`).join('')}</div><div id="endFeedback"></div>${state.end.placed.length===3?`<div class="actions"><button id="completeEnd" class="primary">Complete END</button></div>`:''}</div><div class="sequence-slots">${correct.map((v,i)=>`<div class="slot ${state.end.placed[i]===v?'filled':''}">${i+1} · ${state.end.placed[i]||''}</div>`).join('')}</div></div>`),'paper')}

function finalMap(){return shell(content(`<div class="final-map"><div><div class="eyebrow orange">FINAL CONVERSATION MISSION</div><h1 tabindex="-1">Put the three parts together</h1><div class="final-steps"><div><strong>START</strong> Greet → Open → Notice</div><div><strong>JOIN</strong> Listen → Wait → Connect</div><div><strong>END</strong> Signal → Finish Phrase → Exit</div></div><p class="copy">Real conversations can look different. These steps give Glorb useful things to notice and try.</p>${note('I think I’m finally getting the hang of Earth conversations.',true)}${actions('Run final mission',()=>go(29))}</div><div>${asset(strips.combined,'START, JOIN and END conversation steps')}</div></div>`),'paper')}
function finalPart(part,title,visual,scenario,choices,next){setTimeout(()=>{$$('.final-choice').forEach(b=>b.onclick=()=>{if(b.dataset.type==='wrong'){b.classList.add('tried');b.disabled=true;b.innerHTML+=` <span class="status-tag">TRIED</span>`;$('#finalFeedback').innerHTML=`<div class="feedback">${b.dataset.feedback}</div>`}else{b.classList.add('correct');$$('.final-choice').forEach(x=>x.disabled=true);$('#finalFeedback').innerHTML=`<div class="feedback good">✓ Fits this situation. ${b.dataset.feedback}</div>`;$('#finalNext').disabled=false}});$('#finalNext').onclick=next},0);return shell(content(`<div class="final-mission-layout"><div>${asset(visual,title)}</div><div><div class="eyebrow orange">FINAL MISSION // ${part}</div><h1 tabindex="-1">${title}</h1><p class="copy">${scenario}</p><div class="choices">${choices.map(([t,type,fb])=>`<button class="choice final-choice" data-type="${type}" data-feedback="${esc(fb)}">${t}</button>`).join('')}</div><div id="finalFeedback"></div><div class="actions"><button id="finalNext" class="primary" disabled>Continue</button></div></div></div>`),'paper')}

function transfer(){const choices=[['START','I will try one simple opening question or comment.'],['JOIN','I will listen for a pause before joining.'],['END','I will use a finish phrase before I leave.']];setTimeout(()=>{$$('.transfer-card').forEach(b=>b.onclick=()=>{state.goal=b.dataset.goal;$$('.transfer-card').forEach(x=>x.classList.toggle('selected',x===b));$('#goalNext').disabled=false});$('#goalNext').onclick=()=>go(34)},0);return shell(content(`<div><div class="eyebrow orange">TRANSFER</div><h1 tabindex="-1">Take one skill off the screen</h1><p class="lead">You do not have to practise everything at once. Choose one small conversation strategy you would like to try again.</p><div class="transfer-grid">${choices.map(([h,t])=>`<button class="transfer-card" data-goal="${t}"><strong>${h}</strong><br>${t}</button>`).join('')}</div><div class="actions"><button id="goalNext" class="primary" disabled>Continue</button></div></div>`),'paper')}
function reflection(){const opts=['Seeing the examples','Practising it myself','Reading the steps','Listening to the instructions','Using a clue','Trying again after feedback',"I'm not sure yet"];setTimeout(()=>{$$('.reflect').forEach(b=>b.onclick=()=>{state.reflection=b.textContent;go(35)});$('#skipReflect').onclick=()=>go(35)},0);return shell(content(`<div><div class="eyebrow orange">OPTIONAL REFLECTION</div><h1 tabindex="-1">What helped you learn?</h1><p class="lead">There is no right answer.</p><div class="reflection-grid">${opts.map(o=>`<button class="choice reflect">${o}</button>`).join('')}</div><div class="actions"><button id="skipReflect" class="ghost">Skip reflection</button></div></div>`),'paper')}
function finalMessage(){return shell(content(`<div class="transmission"><div>${asset(A+'glorb-portrait.png','Portrait of Glorb')}</div><div class="transmission-copy"><div class="eyebrow orange">TRANSMISSION FROM GLORB</div><h1 tabindex="-1">Dear ${esc(state.name||'Earth Expert')},</h1><p class="copy">It worked. I learned ways to start a conversation, join one already happening, and let people know before I leave.</p><p class="copy">I greeted Maya, gave her something she could respond to and noticed what happened next. I listened to the topic, waited for a space and joined in. When I needed to leave, I gave a clue, used a finish phrase and then left.</p>${note('Earth conversations are still complicated, but they make a lot more sense now.',true)}${actions('View certificate',()=>go(36))}</div></div>`),'paper')}
function certificate(){setTimeout(()=>{$('#printCert').onclick=()=>window.print();$('#restart').onclick=()=>{location.href=location.pathname}},0);return `<section class="screen"><div class="certificate-wrap"><article class="certificate" data-readable><div><div class="eyebrow dark" style="text-align:center">EARTH EXPERT CERTIFICATE</div><h1 tabindex="-1">GLORB'S CONVERSATION MISSION</h1><div style="text-align:center">THIS CERTIFIES THAT</div><div class="certificate-name">${esc(state.name||'Earth Expert')}</div></div><p class="certificate-intro">During this lesson, ${esc(state.name||'the learner')} helped Glorb learn and practise strategies for starting, joining and ending conversations. ${esc(state.name||'The learner')} practised each strategy separately and then used the three sets of steps together in the supported final Conversation Mission.</p><div class="cert-skills"><div class="cert-skill"><h3>START · GREET → OPEN → NOTICE</h3><p>Greeting someone, using a simple question or comment to open a conversation, and pausing to notice the other person's response.</p></div><div class="cert-skill"><h3>JOIN · LISTEN → WAIT → CONNECT</h3><p>Listening to what people are talking about, waiting for a space in the conversation, and adding something connected to the current topic.</p></div><div class="cert-skill"><h3>END · SIGNAL → FINISH PHRASE → EXIT</h3><p>Giving a signal that the conversation is finishing, using a clear finish phrase, and then leaving.</p></div></div><div class="cert-bottom"><div><p><strong>${esc(state.name||'The learner')} successfully completed the supported learning activities and practised applying these strategies within the Conversation Mission.</strong></p><div class="cert-goal"><strong>MY NEXT EARTH MISSION</strong><br>${esc(state.goal||'Choose one conversation strategy to practise again.')}</div></div><div class="cert-footer">3 / 3 LEARNING MISSIONS COMPLETE<br>FINAL CONVERSATION MISSION COMPLETE<br>VERIFIED BY GLORB</div></div></article><div class="certificate-actions"><button id="printCert" class="primary">Print / save certificate</button><button id="restart" class="secondary">Start over</button></div></div></section>`}

const screens=[
 registration,
 radar,
 orientation,
 ()=>story('01 // START','Starting a conversation',['I wanted to talk to Maya.','I walked over and said:'],'“HELLO. LET US BEGIN FRIENDSHIP.”','I thought this clearly communicated my objective.',A+'story-start.png','Learn how to START',()=>go(4)),
 ()=>teach('01','1','GREET','Start by letting the person know you are talking to them.',['<strong>You can:</strong> say hello, and use their name if you know it.','<strong>Example:</strong> “Hi Maya.”'],'A simple greeting gives the conversation a clear starting point.','Apparently I do not need to announce friendship immediately.',icons.greet,()=>go(5)),
 ()=>teach('01','2','OPEN','After greeting someone, give them something simple they can respond to.',['<strong>You can:</strong> ask a simple question or make a relevant comment.','<strong>Example:</strong> “How was your weekend?”'],'An opener gives the other person something they can respond to.','One manageable question. That seems easier.',icons.open,()=>go(6)),
 ()=>teach('01','3','NOTICE','After you greet and open, pause and notice what the other person does next.',['They might answer, ask something back, give a short reply, look busy, or show they do not want to continue.'],'Starting does not mean you have to keep talking. Give the other person space.',null,icons.notice,()=>go(7)),
 ()=>whole('Put the START steps together','01',strips.start,[['GREET','Say hello.'],['OPEN','Give them something to respond to.'],['NOTICE','Pause and see what happens next.']],'GREET → OPEN → NOTICE',()=>go(8)),
 ()=>model('Watch Glorb try','01',`<div class="bubble"><span class="speaker">GLORB</span>Hi Maya. How was your weekend?</div><div class="bubble alt"><span class="speaker">MAYA</span>Good! We went to the beach.</div>`,[['GREET','“Hi Maya.”'],['OPEN','“How was your weekend?”'],['NOTICE','Glorb pauses and listens.']],'Less dramatic. More effective.',()=>go(9)),
 startAssessment,
 ()=>complete('START mission complete','GREET ✓ → OPEN ✓ → NOTICE ✓','Glorb greeted Maya, gave her something to respond to, and paused to notice what happened next.','Conversation started. That went much better.','Next mission',()=>go(11)),
 ()=>story('02 // JOIN','Joining a conversation',['Another human told me that finding something in common can help people connect.','Later, I saw Maya and Milo talking about handball. I thought: “Handball involves feet. I also possess feet.”'],'“I ALSO POSSESS FEET.”','The statement was factually accurate. I remain confused.',A+'story-join.png','Learn how to JOIN',()=>go(12)),
 ()=>teach('02','1','LISTEN','Before joining, work out what people are talking about.',['Maya and Milo are talking about <strong>this handball game</strong>, not just sports, feet or playgrounds.'],'A word can remind you of something without that thing being the current topic.','So I need to listen for what they are actually talking about.',icons.listen,()=>go(13)),
 ()=>teach('02','2','WAIT','When people are already speaking, look or listen for a space before you join.',['Listen for someone finishing their turn or a natural pause.'],'Wait for a space, not a magic number of seconds.','Good. No stopwatch required.',icons.wait,()=>go(14)),
 ()=>teach('02','3','CONNECT','When you join, say something connected to what they are discussing right now.',['Connected: “That last round was close.” · “Can I join the next round?”','Not connected enough: “I played soccer yesterday.” · “I also possess feet.”'],'Related does not always mean connected to the current topic.','So I need to stay with what they are talking about now.',icons.connect,()=>go(15)),
 ()=>whole('Put the JOIN steps together','02',strips.join,[['LISTEN','What are they talking about?'],['WAIT','Is there a space?'],['CONNECT','What can I add that fits?']],'LISTEN → WAIT → CONNECT',()=>go(16)),
 ()=>model('Watch Glorb try','02',`<div class="bubble"><span class="speaker">MAYA</span>The last round was so close.</div><div class="bubble alt"><span class="speaker">MILO</span>I thought the ball was out!</div><div class="pause-box">PAUSE</div><div class="bubble"><span class="speaker">GLORB</span>That game sounded close. Can I join the next round?</div>`,[['LISTEN','Glorb noticed the topic.'],['WAIT','Glorb waited for a space.'],['CONNECT','Glorb added something about the handball game.']],'So I need to notice the topic and the pause. That makes more sense.',()=>go(17)),
 joinTiming,
 joinResponse,
 ()=>complete('JOIN mission complete','LISTEN ✓ → WAIT ✓ → CONNECT ✓','Glorb listened for the topic, waited for space, and added something connected.','I joined the conversation without interrupting it.','Next mission',()=>go(20)),
 ()=>story('03 // END','Ending a conversation',['I finally had a good conversation. I greeted Maya, listened and stayed on topic.','Then I decided I was finished.'],'SO I RAN AWAY.','I had finished. I assumed leaving at maximum speed communicated this.',A+'story-end.png','Learn how to END',()=>go(21)),
 ()=>teach('03','1','SIGNAL','Give the other person a clue that you are getting ready to leave.',['Examples: “The bell is about to ring.” · “I need to get back to class.” · “I have to go soon.”'],'A signal makes the ending less sudden.','So I give a clue before I leave.',icons.signal,()=>go(22)),
 ()=>teach('03','2','FINISH PHRASE','Use words that clearly show the conversation is finishing.',['Examples: “I have to go, but it was good talking.” · “Thanks for talking with me.”'],'A finish phrase makes the ending clear.','That is clearer than disappearing.',icons.finish,()=>go(23)),
 ()=>teach('03','3','EXIT','After you have made the ending clear, leave the conversation.',['You might walk away, wave, return to class or move to the next activity.'],'EXIT comes after you have made the ending clear.','This explains the problem with my sprinting method.',icons.exit,()=>go(24)),
 ()=>whole('Put the END steps together','03',strips.end,[['SIGNAL','Give a clue.'],['FINISH PHRASE','Finish with words.'],['EXIT','Then leave.']],'SIGNAL → FINISH PHRASE → EXIT',()=>go(25)),
 ()=>model('Watch Glorb try','03',`<div class="bubble"><span class="speaker">GLORB</span>The bell is about to ring.</div><div class="bubble"><span class="speaker">GLORB</span>I have to go, but it was good talking.</div><div class="bubble"><span class="speaker">GLORB</span>See you at lunch!</div>`,[['SIGNAL','“The bell is about to ring.”'],['FINISH PHRASE','“I have to go, but it was good talking.”'],['EXIT','Glorb waves and leaves.']],'That was clearer than running away.',()=>go(26)),
 endSequence,
 ()=>complete('END mission complete','SIGNAL ✓ → FINISH PHRASE ✓ → EXIT ✓','Glorb gave a clue, used a finish phrase, and then left.','No unexplained disappearance required.','Continue',()=>go(28)),
 finalMap,
 ()=>finalPart('START','Start the conversation',A+'story-start.png','Glorb sees Maya. Which choice gives the conversation a clear, simple start?',[['Tell me every fact about yourself.','wrong','That asks for too much at once.'],['Hi Maya. How did handball go?','correct','This greets Maya and gives her something simple to respond to.'],['Say nothing and stare.','wrong','Maya needs a clear signal that Glorb wants to begin.']],()=>go(30)),
 ()=>finalPart('JOIN','Join the conversation',A+'story-join.png','Maya and Milo are talking about the handball game. There is a pause. What could Glorb say?',[['I played soccer yesterday.','wrong','That changes the topic.'],['I ALSO POSSESS FEET.','wrong','That does not connect to what they are discussing.'],['That game sounded close. Can I join the next round?','correct','This connects to the current topic and uses the space in the conversation.']],()=>go(31)),
 ()=>finalPart('END','End the conversation',A+'story-end.png','The bell is about to ring and Glorb needs to leave. Which ending fits?',[['Run away without saying anything.','wrong','That makes the ending sudden.'],['The bell is about to ring. I have to go, but it was good talking. See you later!','correct','Glorb gives a clue, uses a finish phrase, then leaves.'],['Keep talking even though he needs to go.','wrong','Glorb can make the ending clear instead.']],()=>go(32)),
 ()=>shell(content(`<div class="final-map"><div><div class="eyebrow orange">FINAL MISSION COMPLETE</div><h1 tabindex="-1">You helped Glorb put it all together</h1><div class="final-steps"><div><strong>START ✓</strong> Greet → Open → Notice</div><div><strong>JOIN ✓</strong> Listen → Wait → Connect</div><div><strong>END ✓</strong> Signal → Finish Phrase → Exit</div></div><p class="copy">You practised each part separately and then used them together in one supported Conversation Mission.</p>${actions('Choose a real-world goal',()=>go(33))}</div><div>${asset(strips.combined,'START, JOIN and END conversation steps')}</div></div>`),'paper'),
 transfer,
 reflection,
 finalMessage,
 certificate
];

function screenHelp(){
  const s=state.screen;
  if(s===9)return '<p><strong>START clue:</strong> Think about the step you are choosing now. A useful start is <strong>Greet → Open → Notice</strong>.</p>';
  if(s===17)return '<p><strong>JOIN clue:</strong> Listen for someone to finish speaking. The button becomes useful when there is a natural space.</p>';
  if(s===18)return '<p><strong>JOIN clue:</strong> Ask yourself: <strong>What are Maya and Milo talking about right now?</strong> Choose something that stays with that topic.</p>';
  if(s===26)return '<p><strong>END clue:</strong> The ending has three steps: <strong>Signal → Finish Phrase → Exit</strong>. A wrong step can still be used later.</p>';
  if(s>=29&&s<=31)return '<p><strong>Final mission clue:</strong> Use the same steps you already practised. Look for the option that fits the current part of the conversation.</p>';
  if(s>=4&&s<=8)return '<p><strong>START:</strong> Greet → Open → Notice.</p>';
  if(s>=12&&s<=16)return '<p><strong>JOIN:</strong> Listen → Wait → Connect.</p><p>Notice the <strong>topic</strong> and the <strong>space</strong>.</p>';
  if(s>=21&&s<=25)return '<p><strong>END:</strong> Signal → Finish Phrase → Exit.</p>';
  return '<p>This screen explains what to do next. Use <strong>Read aloud</strong> if listening helps.</p>';
}
function bindGlobal(){
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
  if(s<=2)setProgress('ORIENTATION','0 / 3 missions complete',0);
  else if(s<=10)setProgress('MISSION 01 // START','0 / 3 missions complete',16);
  else if(s<=19)setProgress('MISSION 02 // JOIN','1 / 3 missions complete',42);
  else if(s<=27)setProgress('MISSION 03 // END','2 / 3 missions complete',68);
  else setProgress('FINAL INTEGRATION','3 / 3 missions complete',100);
  app.innerHTML=(screens[s]||screens[0])();
  bindGlobal();
  focusHeading();
}
window.addEventListener('resize',()=>{if(state.screen===9)render()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech()});
render();
