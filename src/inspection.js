/* inspection.js
 * Everything you inspect: mock interfaces (email, SMS, web, push prompts, profiles, Wi-Fi),
 * real-vs-fake comparisons, hover-to-inspect examples (EX, explore) and the real-or-fake
 * mockups used in quizzes (RF, EXR).
 * Loads AFTER app.js because it extends the lessons (L) and uses its helpers.
 */

/* ---------- Mock interfaces ---------- */

const nb = n => `<b class="nb">${n}</b>`,
      dots = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

// Template dictionary for rendering simulated UI mockups (emails, SMS, push notifications, profiles, Wi-Fi lists, web pages, social posts)
const F = {
  mail: o => `<div class="fr"><div class="bar2">${dots} Inbox</div><div class="bd"><div class="hdr"><div class="av">${o.i || 'M'}</div><div><b>${o.n}</b> &lt;${o.a}&gt;<br><span style="color:#777;font-size:.8rem">${o.to || 'to me'} · 9:41 AM</span></div></div><h3 style="margin:0 0 8px">${o.s}</h3><div>${o.b}</div>${o.at ? `<p><span class="att">📎 ${o.at}</span></p>` : ''}</div>${o.st ? '<div class="stat" id="st">🔗 Tap the link to see where it really goes</div>' : ''}</div>`,
  sms: (f, m) => `<div class="phone"><div style="font-size:.8rem;color:#777;margin-bottom:6px">${f}</div><div class="sms">${m}</div></div>`,
  push: (t, l) => `<div class="phone"><b>🔐 ${t}</b><p style="margin:6px 0;color:#444">${l}</p><span class="btn2" style="background:#2f7d5b">Approve</span> <span class="btn2" style="background:#b85a47">Deny</span></div>`,
  prof: (n, m, msg) => `<div class="fr"><div class="bd"><div class="hdr"><div class="av">M</div><div><b>${n}</b><br><span style="color:#777;font-size:.8rem">${m}</span></div></div><div class="sms">${msg}</div></div></div>`,
  wifi: r => `<div class="phone"><b>📶 Wi-Fi networks</b>${r.map(x => `<div style="padding:8px 0;border-top:1px solid #eee">${x[0]}<br><span style="font-size:.8rem;color:#777">${x[1]}</span></div>`).join('')}</div>`,
  web: (u, i) => `<div class="fr"><div class="bar2">${dots}<span class="url">${u}</span></div><div class="bd">${i}</div></div>`,
  post: i => `<div class="fr"><div class="bd"><div class="hdr"><div class="av">A</div><div><b>Alex Smith</b><br><span style="color:#777;font-size:.8rem">🌍 Public · 2 min ago</span></div></div>${i}<p style="color:#777;margin:8px 0 0">❤️ 48 · 💬 12</p></div></div>`
};

// SVG mockup asset for social media / travel sharing lesson examples
const BP = `<svg viewBox="0 0 300 110" role="img" aria-label="Photo of a boarding pass" style="width:100%;max-width:320px;border-radius:8px;background:#e9edf3"><rect x="8" y="8" width="284" height="94" rx="8" fill="#fff" stroke="#bbc"/><text x="20" y="32" font-size="12" font-weight="700" fill="#345">SKYWAY · BOARDING PASS</text><text x="20" y="56" font-size="13" fill="#222">ALEX M SMITH  BOS → DPS</text><text x="20" y="76" font-size="11" fill="#666">Seat 14A · PNR K7Q2LM</text>${Array.from({ length: 28 }, (_, i) => `<rect x="${170 + i * 4}" y="44" width="${i % 3 ? 2 : 3}" height="46" fill="#222"/>`).join('')}</svg>`;

/* ---------- Real-vs-fake comparisons ---------- */

L[0].c = {
  r: F.sms('Chase Alerts · 24273', 'Chase: Did you spend $82.50 at Target? Reply YES or NO. We’ll never ask for your password.'),
  f: F.sms('+1 (347) 555-0192' + nb(1), 'Chase: Your account is LOCKED' + nb(2) + '. Verify now: chase-secure-verify.top/login' + nb(3)),
  n: ['Banks text from a short code, not a random phone number.', 'Fear and urgency (“LOCKED”) push you to act without thinking.', 'The link’s domain isn’t the bank’s real website.']
};

L[1].c = {
  r: F.mail({ n: 'Chase', a: 'no-reply@chase.com', s: 'Your January statement is ready', b: 'Hi Alex,<br>Your statement is ready. Sign in at chase.com or the Chase app to view it.' }),
  f: F.mail({ n: 'Chase Support', a: 'alerts@chase-secure.co' + nb(1), s: 'URGENT: verify now or account closes' + nb(2), b: 'Dear customer,' + nb(3) + '<br>Unusual activity found.<br><br><span class="btn2">Verify account</span>' + nb(4), at: 'statement.pdf.exe' + nb(5) }),
  n: ['The sender’s domain isn’t chase.com.', 'An urgent threat in the subject line.', 'A generic greeting instead of your name.', 'Buttons hide their real destination. Hover or press-and-hold first.', 'A “PDF” that is really a .exe program.']
};

L[3].c = {
  r: F.push('Is this you signing in?', 'Boston, MA · Chrome · 2:14 PM<br>You just tapped “Sign in”.'),
  f: F.push('Approve sign-in?', 'Moscow, Russia' + nb(1) + ' · Unknown device · 3:02 AM' + nb(2) + '<br>You didn’t try to sign in' + nb(3) + '. 6th request tonight' + nb(4)),
  n: ['Unexpected, faraway location.', 'Odd hour and unknown device.', 'You never started this sign-in. Only approve what you did.', 'Repeated prompts are a pressure tactic (“MFA fatigue”). Deny them all.']
};

L[5].c = {
  r: F.prof('Maya Lopez', '1,248 friends · joined 2016 · 340 posts', 'Hey! Are we still on for Saturday?'),
  f: F.prof('Maya Lopez' + nb(1), '12 friends · joined last week · 2 posts' + nb(2), 'I’m stuck abroad and lost my wallet, please send $200 now' + nb(3) + ', I’ll pay you back!'),
  n: ['Same name and photo as your real friend, but it’s a new account.', 'Tiny history: few friends, almost no posts, created recently.', 'An urgent request for money is the classic cloned-account trick. Call your friend on a known number.']
};

L[6].c = {
  r: F.wifi([['Brew&amp;Bean_Guest', '🔒 Secured · password on your receipt']]),
  f: F.wifi([['Brew&amp;Bean_Guest', '🔒 Secured · password on your receipt'], ['Brew&amp;Bean_Guest_FREE' + nb(1), 'Open · no password' + nb(2) + ' · “Sign in with Google”' + nb(3)]]),
  n: ['A lookalike name that staff never mentioned.', 'No password means anyone can sit in the middle of your traffic.', 'A pop-up asking for your Google or main-account login is credential theft.']
};

L[9].c = {
  r: F.web('windows-security (built-in app)', '<b>✅ No threats found</b><br>Last scan: 2 minutes ago. Real security tools never show phone numbers or countdowns.'),
  f: F.web('secure-alert-win.xyz' + nb(1), '<b style="color:#b00">⚠ VIRUS DETECTED!</b><br>Your files will be erased in <b>04:59</b>' + nb(2) + '. Call 1-800-555-0100' + nb(3) + ' now.'),
  n: ['A random website, not your security software.', 'A countdown to scare you into acting.', 'Legit vendors never ask you to phone a number from a popup. Close the tab.']
};

/* ---------- Real-or-fake quiz mockups ---------- */

const M = (n, a, s, b, at) => F.mail({ n, a, s, b, at }),
      fld = t => `<div style="border:1px solid #ccc;border-radius:6px;padding:6px 10px;margin:6px 0;color:#888">${t}</div>`;

// Quiz item pools for the interactive real-or-fake checks
const RF = [
  [
    [F.sms('Pharmacy · 44712', 'Your prescription is ready for pickup at Main St Pharmacy. Reply STOP to opt out.'), 0, 'Real: it comes from a short code, you expect it, and there is no link or pressure.'],
    [F.sms('+44 7700 900123', 'Parcel service: your parcel is held. Pay £1.45 at royalmail-redeliver.top'), 1, 'Fake: an ordinary foreign number, a small fee as bait, and a .top domain.'],
    [M('Netflix', 'info@account.netflix.com', 'Your payment method was updated', 'You changed your card ending in 4417. Didn’t do this? Visit netflix.com/help.'), 0, 'Real: real domain, confirms something you did, and sends you to the main site rather than a login link.'],
    [M('Netflix Billing', 'billing@netflix-payments.info', 'Payment failed: update within 12 hours', 'Dear user, click here to update your billing details now.'), 1, 'Fake: the domain isn’t netflix.com, the greeting is generic, and the deadline is invented.'],
    [F.sms('Unknown', 'This is Amazon: unusual $499 order. Press 1 or call 1-888-555-0147 to cancel it.'), 1, 'Fake: unexpected alarm and a phone number to call. Check your orders in the app instead.'],
    [M('GitHub', 'noreply@github.com', '[GitHub] A new SSH key was added', 'You added a key to your account. If this wasn’t you, review security at github.com/settings/security.'), 0, 'Real: expected action, real domain, and no demand for your password.']
  ],
  [
    [M('Google', 'no-reply@accounts.google.com', 'Security alert', 'New sign-in on Windows. Review activity at myaccount.google.com. You received this because you signed in.'), 0, 'Real: official domain and it points to the real site without asking for anything.'],
    [M('Google Security', 'security@google-alerts.co', 'Your account will be deleted', 'Dear user, open the attached report to keep your data.', 'security_report.zip'), 1, 'Fake: lookalike domain, a threat, and a zip attachment.'],
    [M('PayPal', 'service@paypal.com.verify-id.net', 'Action required: unusual login', 'We limited your account. Confirm your identity now.'), 1, 'Fake: the real domain is the part right before the last dot, here verify-id.net.'],
    [M('Amazon', 'shipment-tracking@amazon.com', 'Your package was delivered', 'Delivered to your front door. Track it in Your Orders at amazon.com.'), 0, 'Real: official domain and no link demanding a login or payment.'],
    [M('HR Department', 'hr@company-benefits.org', 'Updated salary sheet', 'Open the attached sheet and click “Enable macros”.', 'Salary_2026.xlsm'), 1, 'Fake: outside domain and a macro file. Macros are a common malware delivery trick.'],
    [M('Dropbox', 'no-reply@dropbox.com', 'Maya shared a folder with you', 'Maya Lopez shared “Q3 Plans”. Open Dropbox to view it.'), 0, 'Real: a person you know, expected share, and a legitimate domain.']
  ],
  [
    [F.web('https://accounts.google.com/signin', '<b>Sign in</b><br>Use your Google Account' + fld('Email or phone')), 0, 'Real: HTTPS and the real domain accounts.google.com.'],
    [F.web('https://accounts-google.signin-help.com', '<b>Sign in</b><br>Use your Google Account' + fld('Email or phone')), 1, 'Fake: the real domain here is signin-help.com, not google.com.'],
    [F.web('http://bank-login.example.xyz', '<b>Secure bank</b>' + fld('Password') + fld('PIN')), 1, 'Fake: not HTTPS, an odd domain, and it asks for your PIN along with the password.'],
    [F.web('https://www.paypal.com/signin', '<b>Log in to PayPal</b>' + fld('Email') + fld('Password')), 0, 'Real: HTTPS and the correct domain paypal.com.'],
    [M('IT Helpdesk', 'it@corp-helpdesk.co', 'Password expires today', 'Click the link to keep your current password.'), 1, 'Fake: outside domain and urgency. Change passwords from the official portal.'],
    [M('Microsoft', 'account-security-noreply@accountprotection.microsoft.com', 'Microsoft account security code', 'Security code: 482913. Don’t share this code. You requested it.'), 0, 'Real: you requested it, it shows only a code, and it warns you not to share it.']
  ],
  [
    [F.push('Is this you signing in?', 'Boston, MA · Chrome · just now. You just started a sign-in.'), 0, 'Real: familiar place and you started it.'],
    [F.push('Approve sign-in?', 'Lagos, Nigeria · unknown device · 3:12 AM. 8th request tonight.'), 1, 'Fake: faraway location, odd hour and repeated prompts. Deny and reset your password.'],
    [F.sms('Bank · 22395', 'Your one-time code is 553902. We’ll never call to ask for it. Expires in 10 minutes.'), 0, 'Real: short code, you requested it, and it warns you not to share it.'],
    [F.sms('+1 (212) 555-0100', 'We saw a login. Reply with the code we just sent to confirm it was you.'), 1, 'Fake: no company asks you to reply with your code.'],
    [M('Account Security', '2fa-reset@secure-auth-help.com', '2FA disabled! Re-enable now', 'Click here to re-enable two-factor protection.'), 1, 'Fake: outside domain and a scare to push a link.'],
    [M('GitHub', 'noreply@github.com', 'Two-factor authentication enabled', 'You enabled 2FA. Download your recovery codes at github.com/settings.'), 0, 'Real: confirms what you did and points to the real site.']
  ],
  [
    [F.sms('Unknown number', 'Hi it’s your CEO, I’m in a meeting. Buy 5 $100 gift cards now and keep this quiet. Send me the codes.'), 1, 'Fake: authority, urgency, secrecy and gift cards.'],
    [M('Dana (IT Service Desk)', 'servicedesk@yourcompany.com', 'Scheduled maintenance Friday 9pm', 'No action needed. We will never ask for your password.'), 0, 'Real: internal domain, expected, and no request for secrets.'],
    [M('IT Support', 'support@yourcompany-it.net', 'Verify your credentials now', 'Reply with your username and password or lose access today.'), 1, 'Fake: lookalike domain and a demand for credentials.'],
    [M('HR', 'hr@yourcompany.com', 'Benefits enrollment opens Monday', 'Log in through the intranet bookmark you normally use.'), 0, 'Real: internal sender, and it sends you to your usual route.'],
    [F.sms('Friend request', 'Omg is that you in this video?? bit.ly/3xYv12'), 1, 'Fake: curiosity bait with a short link.'],
    [F.sms('Mom', 'Can you call me when you’re free? Nothing urgent.'), 0, 'Real: no money, codes or links requested.']
  ],
  [
    [F.prof('Sam Carter', '842 friends · joined 2014 · 210 posts', 'Photos from last weekend’s hike, tagging you!'), 0, 'Real: long history and a normal message.'],
    [F.prof('Sam Carter', '9 friends · joined 3 days ago · 1 post', 'Hi dear, I have an investment tip making 40% weekly. DM me.'), 1, 'Fake: brand new account and a get-rich-quick pitch.'],
    [F.prof('Meta Support Team ✔', 'Account created yesterday', 'Your page violates policy. Verify at meta-appeal.help within 24h.'), 1, 'Fake: platforms don’t DM threats from new accounts, and the link is off-site.'],
    [F.post('Had a great day at the park with the family! 🌳'), 0, 'Real: nothing sensitive is revealed.'],
    [F.prof('Tech Giveaway', 'Page created 2 days ago', 'FREE iPhones! Enter your email and password to claim.'), 1, 'Fake: real giveaways never need your password.'],
    [F.prof('Maya Lopez', '1,248 friends · joined 2016', 'Hey, are you free for coffee Thursday?'), 0, 'Real: established account and an ordinary request.']
  ],
  [
    [F.wifi([['LibraryNet', '🔒 Secured · ask the front desk for the password']]), 0, 'Real: the staff provide the name and password.'],
    [F.wifi([['Airport WiFi', 'Open'], ['Airport WiFi Free', 'Open · asks you to “Sign in with Google”']]), 1, 'Fake: a lookalike network that asks for your Google login.'],
    [F.web('https://login.cafe-brew.com/guest', '<b>Welcome!</b><br>Accept the terms to continue.'), 0, 'Real: HTTPS and only asks you to accept terms.'],
    [F.web('http://free-wifi-login.xyz', '<b>Free internet</b><br>Enter your email and password to continue.' + fld('Email') + fld('Password')), 1, 'Fake: not HTTPS and asks for real credentials.'],
    [F.wifi([['Hotel Aurora Guest', '🔒 Password on your room card']]), 0, 'Real: the hotel gave you the password.'],
    [F.wifi([['Hotel Aurora Guest', '🔒 Secured'], ['Hotel Aurora Guest_5G', 'Open · no password']]), 1, 'Fake: an open duplicate nobody told you about.']
  ],
  [
    [M('Prize Center', 'claims@mega-sweeps.co', 'You won $50,000!', 'Pay a $150 processing fee to claim your prize.'), 1, 'Fake: you never pay to win, and you never entered.'],
    [M('Your bank', 'alerts@yourbank.com', 'Statement ready', 'Your statement is ready. Sign in at yourbank.com. We never request personal info by email.'), 0, 'Real: expected, no urgency, and you go to the bank yourself.'],
    [F.sms('Unknown', 'Remote job, $400/day. Text us on WhatsApp now. No experience needed.'), 1, 'Fake: unrealistic pay and a move to a private chat.'],
    [F.web('http://invest-guaranteed.xyz', '<b>Earn 20% weekly. Guaranteed.</b><br>Deposit crypto now.'), 1, 'Fake: guaranteed returns and crypto deposits.'],
    [M('Utility company', 'billing@yourutility.com', 'Your monthly bill is ready', 'Amount due: $54.20 by the 28th. Pay through your usual account.'), 0, 'Real: normal amount, normal timeline, and no pressure.'],
    [F.sms('Unknown', 'Grandma it’s me, I’m in trouble, don’t tell Mom. Send $800 in gift cards.'), 1, 'Fake: secrecy, urgency and gift cards.']
  ],
  [
    [F.web('https://clinic.example.com/intake', '<b>New patient form</b><br>Name, date of birth and insurance ID (needed for billing).'), 0, 'Real: a medical form that needs those details, over HTTPS.'],
    [F.web('http://free-gift-card.example.xyz', '<b>Win a $100 gift card</b><br>Enter your full SSN and mother’s maiden name.'), 1, 'Fake: no prize needs your SSN.'],
    [M('Records Dept', 'update@census-records.info', 'Confirm your SSN', 'We’re updating records. Reply with your SSN and date of birth.'), 1, 'Fake: no one asks for your SSN by email.'],
    [M('Your bank', 'noreply@yourbank.com', 'New address on file', 'You updated your address. If this wasn’t you, call the number on your card.'), 0, 'Real: confirms what you did and tells you to use the number on your card.'],
    [F.sms('+1 (803) 555-0111', 'Your tax refund is ready. Confirm SSN and bank details: irs-refund-claim.top'), 1, 'Fake: tax agencies don’t text for your SSN.'],
    [F.web('https://shop.example.com/checkout', '<b>Checkout</b><br>Shipping address and card. “Create account” is optional.'), 0, 'Real: only collects what the purchase needs.']
  ],
  [
    [F.web('free-games-download.xyz', '<b>Download FortCrack_Setup.exe</b><br>Works without paying!'), 1, 'Fake: cracked installers are a classic malware route.'],
    [F.web('https://store.example.com/app', '<b>Official app page</b><br>Verified developer · 4.7★ · updated yesterday.'), 0, 'Real: official store, verified developer.'],
    [M('Courier', 'delivery@parcel-track.co', 'Delivery failed', 'Open the attached label.', 'Label.js'), 1, 'Fake: a .js script posing as a label.'],
    [F.web('System settings', '<b>Updates available</b><br>Restart tonight to install security updates. [Remind me later]'), 0, 'Real: a built-in update with no phone number or countdown.'],
    [F.web('alert-your-pc.xyz', '<b style="color:#b00">⚠ Your PC is infected!</b><br>Call 1-800-555-0100 now.'), 1, 'Fake: a website can’t scan your PC.'],
    [M('Your IT team', 'it@yourcompany.com', 'Scheduled patching tonight', 'Your laptop will restart after 10pm. No action needed.'), 0, 'Real: internal sender and no request.']
  ]
];

/* ---------- Hover-to-inspect examples ---------- */

const H = (t, w) => `<span class="hs" role="button" tabindex="0" data-g="0" data-w="${esc(w)}">${t}</span>`,
      G = (t, w) => `<span class="hs" role="button" tabindex="0" data-g="1" data-w="${esc(w)}">${t}</span>`;

// Lesson exploration content with interactive hover inspector tooltips
const EX = [
  [
    [F.sms(H('+44 7700 900123', 'An ordinary mobile number. Real parcel firms text from short codes or named senders.'), 'Parcel service: your parcel is held. ' + H('Pay £1.45', 'A tiny fee is bait to capture your card details.') + ' at ' + H('royalmail-redeliver.top', 'Not the carrier’s real website. The .top ending is a common scam sign.') + ' within ' + H('24 hours', 'Deadlines pressure you to act without thinking.')), 1, 'Smishing: a small fee, a pressure deadline, and a link to a lookalike site.'],
    [F.sms(G('Pharmacy · 44712', 'A short-code sender you have received from before.'), 'Your prescription is ready for pickup at ' + G('Main St Pharmacy', 'Matches a pharmacy you actually use.') + '. ' + G('No link and no payment request', 'Nothing to click and nothing urgent: low risk.') + ' Reply STOP to opt out.'), 0, 'Legit: expected, from a known short code, and asks you to do nothing risky.'],
    [F.mail({ n: 'Netflix Billing', a: H('billing@netflix-payments.info', 'The domain is netflix-payments.info, not netflix.com.'), s: H('Payment failed: update within 12 hours', 'An invented deadline to rush you.'), b: H('Dear user,', 'A generic greeting. Real companies usually use your name.') + '<br>Click ' + H('<span class="btn2">Update billing</span>', 'The button’s real destination is hidden. Hover first and compare to netflix.com.') + ' to keep watching.' }), 1, 'Phishing: lookalike domain, generic greeting, urgency and a hidden link.'],
    [F.mail({ n: 'Netflix', a: G('info@account.netflix.com', 'A real netflix.com subdomain.'), s: 'Your payment method was updated', b: 'You ' + G('changed your card ending in 4417', 'Confirms something you actually did.') + '. Didn’t do this? Visit ' + G('netflix.com/help', 'Sends you to the main site, not a login link.') + '.' }), 0, 'Legit: real domain, confirms your own action, and sends you to the main site.'],
    [F.sms(H('Unknown number', 'Companies don’t text fraud alerts from random numbers.'), 'This is Amazon: ' + H('unusual $499 order', 'A scare tactic to provoke a reaction.') + '. ' + H('Press 1 or call 1-888-555-0147', 'Scammers want you on a call so they can pressure you. Check your orders in the app instead.')), 1, 'Vishing bait: scare plus a phone number you shouldn’t call.']
  ],
  [
    [F.mail({ n: 'PayPal', a: H('service@paypal.com.verify-id.net', 'Read from the right: the real domain is verify-id.net. “paypal.com” is just a decoy subdomain.'), s: 'Action required: unusual login', b: 'We limited your account. ' + H('Confirm your identity now', 'Urgent pressure with a link to a lookalike site.') + '<br><br><span class="btn2">Log in</span>' }), 1, 'Fake: a domain-trick address plus pressure.'],
    [F.mail({ n: 'Google', a: G('no-reply@accounts.google.com', 'The real google.com domain.'), s: 'Security alert', b: 'New sign-in on Windows. ' + G('Review activity at myaccount.google.com', 'Points to the real site instead of a login form.') + ' ' + G('You received this because you signed in.', 'Explains why you got it and matches your action.') }), 0, 'Legit: real domain, no credentials requested, and consistent with what you did.'],
    [F.mail({ n: 'HR Department', a: H('hr@company-benefits.org', 'Not your company’s domain.'), s: 'Updated salary sheet', b: 'Please open the attached sheet and ' + H('click “Enable macros”', 'Real HR never asks you to enable macros.') + '.', at: H('Salary_2026.xlsm', 'A macro-enabled file, a common malware carrier.') }), 1, 'Fake: outside domain, macro file and a request to enable macros.'],
    [F.mail({ n: 'Amazon', a: G('shipment-tracking@amazon.com', 'The real amazon.com domain.'), s: G('Your package was delivered', 'Matches an order you can check yourself.'), b: 'Delivered to your front door. ' + G('Track it in Your Orders at amazon.com', 'Tells you to go to the site yourself.') }), 0, 'Legit: real domain and no urgent link or login request.'],
    [F.mail({ n: 'Google Security', a: H('security@google-alerts.co', 'Lookalike domain.'), s: H('Your account will be deleted', 'Threats are meant to scare you.'), b: 'Open the attached report to keep your data.', at: H('security_report.zip', 'An unexpected zip file, a common malware carrier.') }), 1, 'Fake: threat, lookalike domain and a zip attachment.']
  ],
  [
    [F.web(H('https://accounts-google.signin-help.com', 'The real domain here is signin-help.com, not google.com.'), '<b>Sign in</b><br>Use your Google Account' + fld(H('Email or phone', 'The page looks identical to the real one. Looks prove nothing; the address does.')) + fld('Password')), 1, 'Fake login page: the page looks right, but the domain gives it away.'],
    [F.web(G('https://accounts.google.com/signin', 'HTTPS and the exact real domain.'), '<b>Sign in</b>' + fld('Email or phone') + G('Use your Google Account', 'A standard step with no extra demands.')), 0, 'Legit: the correct domain and no oddities.'],
    [F.web(H('http://bank-login.example.xyz', 'No HTTPS and an unrelated domain.'), '<b>Secure bank</b><br>' + H('Enter your password and PIN', 'Banks don’t ask for your PIN on the login page.') + fld('Password')), 1, 'Fake: no HTTPS, odd domain and a request for your PIN.'],
    [F.mail({ n: 'IT Helpdesk', a: H('it@corp-helpdesk.co', 'Not your company’s real domain.'), s: H('Password expires today', 'Urgency to rush you.'), b: H('Click the link to keep your current password', 'Passwords should be changed in the portal you open yourself.') }), 1, 'Fake: urgency plus a link to a harvesting page.'],
    [F.mail({ n: 'Microsoft', a: G('account-security-noreply@accountprotection.microsoft.com', 'The final domain is microsoft.com.'), s: 'Microsoft account security code', b: G('Security code: 482913', 'Only a code. No login link.') + '. ' + G('Don’t share this code.', 'Real services warn you.') + ' ' + G('You requested it.', 'It matches what you just did.') }), 0, 'Legit: expected, contains only a code and warns you not to share it.']
  ],
  [
    [F.push('Is this you signing in?', G('Boston, MA · Chrome · just now', 'Familiar location and device.') + '<br>' + G('You just started a sign-in', 'You triggered it, so approving is fine.')), 0, 'Legit: you started it and the details match.'],
    [F.push('Approve sign-in?', H('Lagos, Nigeria · unknown device', 'A faraway place and a device you don’t own.') + ' · ' + H('3:12 AM', 'An odd hour.') + '<br>' + H('8th request tonight', 'Repeated prompts are an “MFA fatigue” attack. Deny them all.')), 1, 'Attack: deny every prompt and change your password.'],
    [F.sms(G('Bank · 22395', 'A known short code.'), G('Your one-time code is 553902', 'You requested it.') + '. ' + G('We’ll never call to ask for it.', 'Real firms warn you not to share codes.') + ' Expires in 10 minutes.'), 0, 'Legit: a code you requested with a clear warning.'],
    [F.sms(H('+1 (212) 555-0100', 'A random number, not a bank.'), 'We saw a login. ' + H('Reply with the code we just sent', 'No company asks you to send them your code. It’s the key to your account.') + ' to confirm it was you.'), 1, 'Fake: the code is what they want to steal.'],
    [F.mail({ n: 'Account Security', a: H('2fa-reset@secure-auth-help.com', 'An unrelated domain.'), s: H('2FA disabled! Re-enable now', 'A scare to rush you.'), b: H('Click here to re-enable two-factor protection', 'A link to a fake site.') }), 1, 'Fake: a threat from an outside domain.']
  ],
  [
    [F.sms(H('Unknown number', 'Executives don’t text from random numbers.'), 'Hi it’s your CEO, ' + H('I’m in a meeting', 'An excuse for not being able to call.') + '. ' + H('Buy 5 $100 gift cards now', 'Gift cards are the scammer’s favorite payment.') + ' and ' + H('keep this quiet', 'Secrecy stops you from verifying.') + '. Send me the codes.'), 1, 'Impersonation: authority, urgency, secrecy and gift cards.'],
    [F.mail({ n: 'Dana (IT Service Desk)', a: G('servicedesk@yourcompany.com', 'Your internal domain.'), s: G('Scheduled maintenance Friday 9pm', 'Announced in advance, as usual.'), b: G('No action needed. We will never ask for your password.', 'Real IT says this.') }), 0, 'Legit: an announcement with nothing for you to do.'],
    [F.mail({ n: 'IT Support', a: H('support@yourcompany-it.net', 'A lookalike: the real domain is yourcompany-it.net.'), s: 'Verify your credentials now', b: H('Reply with your username and password', 'IT never needs your password.') + ' or ' + H('lose access today', 'A threat with a deadline.') }), 1, 'Fake: demands credentials under a deadline.'],
    [F.mail({ n: 'HR', a: G('hr@yourcompany.com', 'Your internal domain.'), s: 'Benefits enrollment opens Monday', b: G('Log in through the intranet bookmark you normally use', 'Sends you to your usual route, not a new link.') }), 0, 'Legit: nothing unusual and no new link to follow.'],
    [F.sms(H('Friend request', 'A vague sender.'), H('Omg is that you in this video??', 'Curiosity bait.') + ' ' + H('bit.ly/3xYv12', 'Shortened links hide the destination.')), 1, 'Bait: curiosity plus a hidden link.']
  ],
  [
    [F.prof(G('Sam Carter', 'The name matches your friend.'), G('842 friends · joined 2014 · 210 posts', 'A long history is a good sign.'), G('Photos from last weekend’s hike, tagging you!', 'A normal message for this friend.')), 0, 'Legit: established account and normal message.'],
    [F.prof('Sam Carter', H('9 friends · joined 3 days ago · 1 post', 'A brand-new, nearly empty account is suspicious.'), 'Hi dear, ' + H('I have an investment tip making 40% weekly', 'Unrealistic returns.') + '. ' + H('DM me', 'Moves you to a private chat.')), 1, 'Clone: new account, scammy pitch.'],
    [F.prof(H('Meta Support Team ✔', 'Platforms don’t DM you. A checkmark in a name proves nothing.'), H('Account created yesterday', 'A brand-new account.'), 'Your page violates policy. ' + H('Verify at meta-appeal.help within 24h', 'An off-site link plus a deadline.')), 1, 'Fake support DM.'],
    [F.post(G('Great day at the park! 🌳', 'Nothing sensitive is shown.') + ' ' + G('Posted after we got home', 'Sharing after you return doesn’t advertise an empty house.')), 0, 'Safe post: no personal details and posted after the fact.'],
    [F.prof(H('Tech Giveaway', 'A page with no history.'), H('Page created 2 days ago', 'New page.'), H('FREE iPhones!', 'Too good to be true.') + ' ' + H('Enter your email and password to claim', 'Real giveaways never need your password.')), 1, 'Fake giveaway: password phishing.']
  ],
  [
    [F.wifi([[G('LibraryNet', 'Name confirmed by staff.'), G('🔒 Secured · ask the front desk for the password', 'A password given by staff.')]]), 0, 'Legit: confirmed name and a password.'],
    [F.wifi([['Airport WiFi', 'Open'], [H('Airport WiFi Free', 'A lookalike of the real network name.'), H('Open · asks you to “Sign in with Google”', 'Open networks can be watched, and the portal wants your Google login.')]]), 1, 'Evil twin: lookalike network that asks for your login.'],
    [F.web(G('https://login.cafe-brew.com/guest', 'HTTPS and a sensible domain.'), '<b>Welcome!</b><br>' + G('Accept the terms to continue.', 'Only asks for consent, no password.')), 0, 'Legit portal: only asks you to agree to the terms.'],
    [F.web(H('http://free-wifi-login.xyz', 'No HTTPS and an unrelated domain.'), '<b>Free internet</b><br>' + H('Enter your email and password', 'Real portals never ask for your account password.') + fld('Email') + fld('Password')), 1, 'Fake portal: credential theft.'],
    [F.wifi([['Hotel Aurora Guest', '🔒 Secured'], [H('Hotel Aurora Guest_5G', 'A duplicate the hotel never mentioned.'), H('Open · no password', 'Anyone can sit in the middle of your traffic.')]]), 1, 'Evil twin: an open duplicate of the hotel network.']
  ],
  [
    [F.mail({ n: 'Prize Center', a: H('claims@mega-sweeps.co', 'An unknown sender.'), s: H('You won $50,000!', 'You can’t win a contest you never entered.'), b: H('Pay a $150 processing fee', 'Real prizes never charge fees.') + ' to claim your prize.' }), 1, 'Advance-fee fraud.'],
    [F.mail({ n: 'Your bank', a: G('alerts@yourbank.com', 'Your bank’s real domain.'), s: 'Statement ready', b: G('Sign in at yourbank.com', 'Tells you to go to the site yourself.') + '. ' + G('We never request personal info by email.', 'Real banks say this.') }), 0, 'Legit: no urgency and no sensitive requests.'],
    [F.sms(H('Unknown number', 'Unknown sender.'), 'Remote job, ' + H('$400/day', 'Unrealistic pay.') + '. ' + H('No experience needed', 'Scammers target everyone.') + ' ' + H('Text us on WhatsApp', 'Moves you off monitored channels.')), 1, 'Job scam.'],
    [F.mail({ n: 'Utility company', a: G('billing@yourutility.com', 'A company you really have an account with.'), s: 'Your monthly bill is ready', b: G('Amount due: $54.20 by the 28th', 'Normal amount and timeline.') + '. ' + G('Pay through your usual account', 'Directs you to your existing login.') }), 0, 'Legit: normal bill and no pressure.'],
    [F.sms(H('Grandma it’s me', 'A vague opening that fishes for a name.'), 'I’m in trouble, ' + H('don’t tell Mom', 'Secrecy.') + '. Please send ' + H('$800 in gift cards', 'Gift cards are the scammer’s favorite payment.')) + '', 1, 'Grandparent scam.']
  ],
  [
    [F.web(G('https://clinic.example.com/intake', 'HTTPS and the clinic you chose.'), '<b>New patient form</b><br>' + G('Date of birth and insurance ID (needed for billing)', 'Collected for a clear reason.')), 0, 'Legit: sensitive details requested for a clear purpose.'],
    [F.web(H('http://free-gift-card.example.xyz', 'No HTTPS and unrelated domain.'), '<b>Win a $100 gift card</b><br>' + H('Enter your full SSN', 'No prize needs your SSN.') + ' and ' + H('mother’s maiden name', 'A classic security answer.')), 1, 'Identity theft bait.'],
    [F.mail({ n: 'Records Dept', a: H('update@census-records.info', 'Not an official domain.'), s: H('Confirm your SSN', 'No one asks for your SSN by email.'), b: H('We’re updating records.', 'A vague excuse.') + ' Reply with your SSN and date of birth.' }), 1, 'Fake records request.'],
    [F.mail({ n: 'Your bank', a: G('noreply@yourbank.com', 'Your bank’s real domain.'), s: 'New address on file', b: 'You ' + G('updated your address', 'Matches something you did.') + '. If this wasn’t you, ' + G('call the number on your card', 'The safest way to verify.') + '.' }), 0, 'Legit: confirms your action.'],
    [F.sms(H('+1 (803) 555-0111', 'A random number.'), H('Your tax refund is ready', 'Tax agencies don’t text you.') + '. ' + H('Confirm SSN and bank details', 'They already have it.') + ': ' + H('irs-refund-claim.top', 'A government site would end in .gov.')), 1, 'Tax-refund scam.']
  ],
  [
    [F.web(H('free-games-download.xyz', 'An unknown site.'), '<b>' + H('Download FortCrack_Setup.exe', 'An .exe from a random site.') + '</b><br>' + H('Works without paying!', 'Cracked installers hide malware.')), 1, 'Malware download.'],
    [F.web(G('https://store.example.com/app', 'An official store page.'), '<b>' + G('Official app page', 'Stores scan apps for malware.') + '</b><br>' + G('Verified developer · 4.7★ · updated yesterday', 'Verified, reviewed and maintained.')), 0, 'Legit: official store with a verified developer.'],
    [F.mail({ n: 'Courier', a: H('delivery@parcel-track.co', 'An unknown domain.'), s: H('Delivery failed', 'A common lure.'), b: 'Open the attached label.', at: H('Label.js', 'A script file, not a label.') }), 1, 'Malware-by-email.'],
    [F.web(G('System settings', 'Built into your device, not a website.'), '<b>Updates available</b><br>' + G('Restart tonight to install security updates.', 'Updates fix known holes.') + ' ' + G('[Remind me later]', 'You have a choice with no countdown.')), 0, 'Legit: a built-in update with no pressure.'],
    [F.web(H('alert-your-pc.xyz', 'A website cannot scan your PC.'), '<b>' + H('⚠ Your PC is infected!', 'A scare tactic.') + '</b><br>' + H('Call 1-800-555-0100 now', 'Real security tools never show phone numbers.')), 1, 'Tech-support scam popup.']
  ]
];

// Interactive
/* Restore comparison hotspots and the example-inspection flow. */
const REAL_CONTEXT = {
  0: 'This example describes a purchase check without a login link or a request for secrets. Sender names and short codes alone are not proof: verify unexpected alerts in the official app.',
  1: 'Read the actual sender domain and check the statement through the official app. A familiar name alone cannot establish authenticity.',
  3: 'Approve only a sign-in you personally started. If the device or location is unexpected, deny and check account activity independently.',
  5: 'A familiar, ordinary conversation fits the existing relationship. Verify unexpected requests for money through a known number, even from an older account.',
  6: 'Confirm the exact network name with staff. A password alone does not prove a hotspot is legitimate.',
  9: 'Check security status in your device’s built-in security app. A website popup cannot substitute for that app.'
};

L.forEach((l, i) => {
  if (!l.c) return;
  l.c.r = G('✓ What to verify in this example', REAL_CONTEXT[i] || 'Verify through a known, independent channel before acting.') + l.c.r;
  l.c.f = l.c.f.replace(/<b class="nb">(\d+)<\/b>/g, (_, number) => H(nb(number), l.c.n[Number(number) - 1] || 'Verify this detail independently.'));
});

function bindInspectionHotspots(root, feedback, labels = ['real', 'fake']) {
  root.querySelectorAll('.hs').forEach(hotspot => {
    const show = () => {
      const good = hotspot.dataset.g === '1';
      feedback.className = 'ip ' + (good ? 'okp' : 'badp');
      const heading = document.createElement('b');
      heading.textContent = good ? `✅ Context for the ${labels[0]} example: ` : `🚩 Warning in the ${labels[1]} example: `;
      feedback.replaceChildren(heading, document.createTextNode(hotspot.dataset.w || 'Verify this detail independently.'));
    };
    hotspot.addEventListener('pointerenter', show);
    hotspot.addEventListener('focus', show);
    hotspot.addEventListener('click', show);
    hotspot.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(); }
    });
  });
}

function explore(lessonIndex, exampleIndex = 0) {
  if (lessonIndex > 0 && !passed(lessonIndex - 1)) { lockMsg(lessonIndex); return; }
  const examples = EX[lessonIndex];
  if (!examples || !examples[exampleIndex]) return;
  S = { i: lessonIndex };
  const example = examples[exampleIndex];
  $('#app').innerHTML = `<button id="inspection-back">← Back to lesson</button><div class="card activity-card"><p class="mute">Lesson ${lessonIndex + 1} · Example ${exampleIndex + 1} of ${examples.length}</p><h2>🔍 Inspect the message</h2><p>Hover over highlighted parts to inspect them. On mobile, tap; with a keyboard, focus and press Enter.</p><div id="inspection-example">${example[0]}</div><div class="ip" id="inspection-tip" aria-live="polite">Choose a highlighted part to see its explanation.</div><div class="rfb"><button class="opt" id="inspection-real">Looks legitimate</button><button class="opt" id="inspection-fake">Looks suspicious</button></div><div id="inspection-result" aria-live="polite"></div><div class="nv"><button id="inspection-prev" ${exampleIndex === 0 ? 'disabled' : ''}>← Previous example</button><button class="pri" id="inspection-next">${exampleIndex + 1 < examples.length ? 'Next example →' : 'Start lesson quiz →'}</button></div></div>`;
  $('#inspection-back').onclick = () => lesson(lessonIndex);
  $('#inspection-prev').onclick = () => explore(lessonIndex, exampleIndex - 1);
  $('#inspection-next').onclick = () => exampleIndex + 1 < examples.length ? explore(lessonIndex, exampleIndex + 1) : lq(lessonIndex);
  const judge = answer => {
    const correct = answer === example[1];
    $('#inspection-result').innerHTML = `<div class="fb ${correct ? 'ok' : 'bad'}"><b>${correct ? 'Good observation! ' : 'Let’s look again. '}</b>${esc(example[2])}</div>`;
    $('#inspection-real').disabled = true;
    $('#inspection-fake').disabled = true;
  };
  $('#inspection-real').onclick = () => judge(0);
  $('#inspection-fake').onclick = () => judge(1);
  bindInspectionHotspots($('#inspection-example'), $('#inspection-tip'));
  scrollTo(0, 0);
}
