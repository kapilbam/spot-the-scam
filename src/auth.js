/* auth.js
 * Client-side sign-in / sign-up demo (see README: this is NOT server-grade security).
 *  - PBKDF2-SHA-256 hashing (600,000 rounds, random salt) via the Web Crypto API
 *  - password rules + strength meter, lockout after repeated failures, 20-minute idle sessions
 * Depends at call time on helpers ($, esc, st) and home() from app.js.
 */

const ITER=600000,enc=new TextEncoder();

const BAD=new Set('password 123456 12345678 123456789 1234567890 111111 000000 123123 654321 qwerty qwertyuiop qwerty123 abc123 abcdef letmein welcome welcome1 admin administrator iloveyou monkey dragon football baseball basketball soccer hockey sunshine princess master shadow superman batman starwars michael jennifer jessica ashley daniel thomas charlie trustno1 passw0rd p455w0rd password1 password123 1q2w3e4r 1qaz2wsx zxcvbnm asdfgh asdfghjkl login hello freedom whatever hunter ranger buster killer george harley summer winter spring autumn secret computer internet changeme default guest test testing user root cheese flower orange purple yellow liverpool chelsea arsenal barcelona pokemon naruto minecraft fortnite google facebook iphone samsung ginger pepper cookie banana chocolate butterfly lovely nicole matthew andrew joshua austin'.split(' ')),BADX=['password','qwerty','letmein','iloveyou','123456','abc123'];

const pwScore=p=>{let pool=0;if(/[a-z]/.test(p))pool+=26;if(/[A-Z]/.test(p))pool+=26;if(/\d/.test(p))pool+=10;if(/[^\w\s]/.test(p))pool+=33;if(/[\s-]/.test(p))pool+=1;let b=p.length*Math.log2(pool||1);const l=p.toLowerCase();
 if(BAD.has(l)||BAD.has(l.replace(/[^a-z]/g,''))||BADX.some(w=>l.includes(w))||/(1234|abcd|qwer|0000)/.test(l))b=Math.min(b,20);if(/(.)\1{2,}/.test(p))b*=.7;if(new Set(p).size<5)b=Math.min(b,25);return b};

const b64=u=>btoa(String.fromCharCode(...u)),un=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));

async function hash(pw,salt,it){const k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:it},k,256))}

const same=(a,b)=>{let d=a.length^b.length;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0};

const users=()=>st.get('sts-users',{}),save=u=>st.set('sts-users',u);

let me=null;const IDLE=20*60000;

function session(u){me=u;st.set('sts-sess',{u,exp:Date.now()+IDLE},sessionStorage)}

function touch(){if(me)st.set('sts-sess',{u:me,exp:Date.now()+IDLE},sessionStorage)}

function out(msg){me=null;st.del('sts-sess');authView(msg)}

['click','keydown'].forEach(e=>addEventListener(e,touch));

setInterval(()=>{if(me){const s=st.get('sts-sess',null,sessionStorage);if(!s||s.exp<Date.now())out('You were signed out after 20 minutes of inactivity.')}},15000);

function authView(msg='',mode='in'){
 $('#top').innerHTML='';
 $('#app').innerHTML=`<div class="card" style="max-width:440px;margin:24px auto"><div class="em">👋</div><h2>Welcome! Let's learn to stay safe online</h2>
 <div class="tabs" role="tablist"><button role="tab" id="ti" aria-selected="${mode==='in'}">Sign in</button><button role="tab" id="tu" aria-selected="${mode==='up'}">Create account</button></div>
 <div class="mute" style="margin-bottom:6px">${esc(msg)}</div>
 <div id="f"><label for="u">Username</label><input id="u" autocomplete="username" maxlength="20" autocapitalize="none">
 <label for="p">Password ${mode==='up'?'(12+ characters; a passphrase works great)':''}</label><input id="p" type="password" autocomplete="${mode==='in'?'current-password':'new-password'}" maxlength="128">
 ${mode==='up'?'<div class="bar" style="margin:8px 0 2px"><i id="pm" style="width:0"></i></div><div class="mute" id="pt" style="font-size:.9rem">Use 12+ characters. Four or more random words works well.</div><label for="p2">Confirm password</label><input id="p2" type="password" autocomplete="new-password" maxlength="128">':''}
 <label style="font-weight:400"><input type="checkbox" id="sp" style="width:auto"> Show password</label>
 <div class="err" id="er" role="alert"></div><button class="pri" id="sb" style="width:100%">${mode==='in'?'Sign in':'Create account'}</button></div>
 <p class="mute" style="font-size:.9rem">Your password is never stored: only a salted, slow hash that stays in this browser.</p></div>`;
 $('#ti').onclick=()=>authView('', 'in');$('#tu').onclick=()=>authView('','up');
 if(mode==='up')$('#p').addEventListener('input',()=>{const v=$('#p').value,b=pwScore(v);$('#pm').style.width=Math.min(100,b/70*100)+'%';$('#pm').style.background=b<45?'var(--bad)':b<60?'#d9a441':'var(--ok)';$('#pt').textContent=v?`${b<45?'Too weak':b<60?'Fair':'Strong'}${v.length<12?' · needs 12 or more characters':''}${b<45&&v.length>=12?' · too predictable, try unrelated words':''}`:'Use 12+ characters. Four or more random words works well.'});
 $('#sp').onchange=e=>{$('#p').type=$('#p2')?($('#p2').type=e.target.checked?'text':'password'):'password';$('#p').type=e.target.checked?'text':'password'};
 const go=async()=>{const er=m=>{$('#er').textContent=m;$('#sb').disabled=false};$('#sb').disabled=true;er2();
  const u=$('#u').value.trim().toLowerCase(),p=$('#p').value;
  if(!window.crypto||!crypto.subtle)return er('Your browser cannot do secure sign-in here (HTTPS is required).');
  if(!/^[a-z0-9_]{3,20}$/.test(u))return er('Username: 3–20 letters, numbers or underscores.');
  const all=users(),f=st.get('sts-fail',{});
  if(mode==='up'){
   if(p.length<12)return er('Password needs at least 12 characters.');
   if(p.toLowerCase().includes(u)||pwScore(p)<45)return er('That password is too easy to guess. Try a longer one made of a few unrelated words.');
   if(p!==$('#p2').value)return er('Passwords do not match.');
   if(all[u])return er('That username is unavailable.');
   const salt=crypto.getRandomValues(new Uint8Array(16));all[u]={salt:b64(salt),h:b64(await hash(p,salt,ITER)),it:ITER,p:{}};save(all);$('#p').value=$('#p2').value='';session(u);return home()}
  const r=f[u]||{n:0,until:0};
  if(r.until>Date.now())return er(`Too many attempts. Please wait ${Math.ceil((r.until-Date.now())/1000)} seconds.`);
  const a=all[u],salt=a?un(a.salt):new Uint8Array(16),h=await hash(p,salt,a?a.it:ITER);
  if(a&&same(h,un(a.h))){delete f[u];st.set('sts-fail',f);if(a.it<ITER){const ns=crypto.getRandomValues(new Uint8Array(16));a.salt=b64(ns);a.h=b64(await hash(p,ns,ITER));a.it=ITER;save(all)}$('#p').value='';session(u);return home()}
  r.n++;if(r.n>=5)r.until=Date.now()+Math.min(30000*2**(r.n-5),900000);f[u]=r;st.set('sts-fail',f);er('Incorrect username or password.')};
 const er2=()=>{$('#er').textContent=''};$('#sb').onclick=go;$('#f').onkeydown=e=>{if(e.key==='Enter')go()};$('#u').focus()}
