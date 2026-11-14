# Code-A-Nova Hackathon Portal — Final Review & Demo Readiness

> Reviewed: client + server + README + env examples
> Status: ~90% ready. Core flows implemented. Main blocker is email on Render free tier.

Maine poora codebase padh liya (client + server + README + env examples). Overall app **~90% ready hai** — signup, OTP, login, dashboard, dynamic team registration, delete, contact, JWT cookie, bcrypt, rate limits sab implemented hain. Lekin **live demo ke liye 3 cheezein blocker hain**, aur kuch cleanup/submission items missing hain.

---

## 1. Sabse bada blocker: Render free + Gmail SMTP

Render ne **26 Sept 2025 se free web services par outbound SMTP ports 25/465/587 block** kar diye hain. Aapka code Gmail SMTP use karta hai (`server/services/emailService.js`), isliye Render free par:

- OTP email **timeout** hoga
- Confirmation email **timeout** hoga
- Startup par `verifyTransporter()` await hone ki wajah se server **late start** ho sakta hai (`server/server.js:15`)

### Option A — Fastest, paid (code change almost zero)

Render ka Starter plan ($7/month) lo. Paid instances par 465/587 allowed hain, Gmail App Password wala current code waise hi chalega.

### Option B — Free (recommended): Brevo SMTP + Nodemailer

Render free par **port 2525** blocked nahi hai. Brevo free plan 300 emails/day deta hai, aur Nodemailer hi use hoga — evaluation requirement satisfy hoti hai.

Env:

```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=2525
EMAIL_USER=<Brevo SMTP login>
EMAIL_PASS=<Brevo SMTP key>
EMAIL_FROM="Code-a-Nova <your-project@gmail.com>"
CONTACT_EMAIL=your-project@gmail.com
```

Iske liye 2 chhote code changes karne honge:

- Contact email `EMAIL_USER` ki jagah `CONTACT_EMAIL` par jaye (`emailService.js:41`)
- Transporter me `connectionTimeout/greetingTimeout/socketTimeout` add karo, aur `verifyTransporter()` ko await mat karo (ya timeout lagao)
- Brevo me sender Gmail verify karna zaroori hai

Agar Brevo account approval me time lage to SendGrid trial (port 2525, 100/day) fallback hai.

---

## 2. Deployment ke liye kya chahiye (bina local install)

Aapke paas git already installed hai (`git 2.54`), par folder **git repo nahi hai**.

### Step 1 — GitHub public repo banao aur code push karo

```bash
git init
git add .
git commit -m "Code-A-Nova hackathon portal"
git branch -M main
git remote add origin https://github.com/<you>/code-a-nova-hackathon.git
git push -u origin main
```

`.env` commit mat karna — `.gitignore` already correct hai.

### Step 2 — MongoDB Atlas

- Free M0 cluster banao
- DB user banao
- Network Access me `0.0.0.0/0` allow karo
- Connection string copy karo (database name `codeanova`)

### Step 3 — Render backend

- New Web Service > GitHub repo
- Root Directory: `server`
- Build: `npm install`
- Start: `node server.js`
- Health check: `/api/health`

Env:

```env
NODE_ENV=production
MONGO_URI=...
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://<vercel-url>
OTP_EXPIRY_MINUTES=10
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM="Code-a-Nova <project@gmail.com>"
CONTACT_EMAIL=project@gmail.com
```

### Step 4 — Vercel frontend

- Import same repo, Root Directory: `client`
- Framework: Vite

Env:

```env
VITE_API_URL=https://<render-service>.onrender.com/api
VITE_CONTACT_EMAIL=project@gmail.com
```

Env add karne ke baad **redeploy** karna padta hai.

### Step 5 — CLIENT_URL update

Vercel URL milne ke baad Render me `CLIENT_URL` update karo aur backend redeploy karo. `CLIENT_URL` me trailing slash nahi hona chahiye.

### Step 6 — Backend warm-up

Demo se pehle `https://<render-service>.onrender.com/api/health` 2-3 baar kholo — free Render 15 min me sleep karta hai, cold start ~50 sec.

---

## 3. Submission ke liye missing items (5 marks)

- `README.md:8-10` me live URLs abhi `<your-app>` placeholders hain
- `README.md:251` screenshots missing
- `README.md:265` me likha hai tests nahi hain, jabki `server/tests` folder hai
- Demo video link missing — 3-5 min recording zaroori hai
- Event details `TBA` hain (`client/src/pages/Home.jsx:7`, `client/src/utils/eventConfig.js:12`) — kam se kam dates/prizes/venue bhar do
- GitHub repo public karna hai

---

## 4. Code quality issues (20 marks ke liye cleanup)

Server `"type": "module"` hai, lekin bahut saari **purani CommonJS files** padi hain jo kahin import nahi hoti:

- `server/routes/authRoutes.js`, `userRoutes.js`, `hackathonRoutes.js`, `contactRoutes.js`, `healthRoutes.js`
- `server/middleware/authMiddleware.js`, `errorMiddleware.js`, `validateRequest.js`
- `server/services/otpService.js`
- `server/utils/appError.js`, `asyncHandler.js`, `cookieOptions.js`, `generateOtp.js`, `escapeHtml.js`, `maskEmail.js`, `validateTeam.js`, `validationRules.js`
- `server/templates/contactEmailTemplate.js`, `otpEmailTemplate.js`, `registrationEmailTemplate.js`
- `server/tests/*.js` — ye `require()` use karte hain, ESM package me **fail** honge; `npm test` script bhi nahi hai

Client side dead files:

- `client/src/components/TeamMemberFields.jsx` — nonexistent `emailRule`/`nameRule` import karta hai (not imported anywhere, isliye build nahi tootega)
- `About.jsx` route nahi hai, `Footer.jsx`/`MainLayout.jsx`/`eventConfig.js` unused hain
- `server/{config,controllers,...}` naam ka ek **empty accidental folder** bhi hai

Inhe delete kar do ya fix karo. Isse evaluator ko clean structure dikhega.

---

## 5. Good points (jo already sahi hain)

- Passwords bcrypt hashed
- OTP bcrypt hash + 10 min expiry + 5 attempts + one-time use
- JWT httpOnly cookie, production me `SameSite=None; Secure`
- Protected routes + ownership check on delete
- express-validator + rate limiting + helmet + mongo-sanitize
- Sender name har email me `Code-a-Nova`, candidate name nahi
- Dynamic team members (teamSize - 1) correctly implemented
- API endpoints README me documented

---

## 6. Aaj ka priority order

1. Email fix karo (Brevo port 2525 ya Render paid + Gmail) — **ye na hua to demo fail**
2. GitHub repo + Atlas + Render + Vercel deploy
3. `CLIENT_URL` / `VITE_API_URL` set karke end-to-end test
4. README live links + screenshots + demo video
5. Dead files delete + tests fix/remove
6. Demo se pehle backend warm-up

### Demo flow

Home → Signup (fresh email) → OTP inbox/spam → Login → Dashboard → Register Now → Team size 2 → Submit → confirmation email → dashboard entry → Contact → Logout.

---

> Maine abhi kuch modify nahi kiya. Fixes baad me karenge: email service fix + dead files cleanup + README placeholders.
