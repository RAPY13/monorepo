# 🎤 RapYard Email & Auth Setup — Quick Start

## What Was Changed

✅ Integrated **Resend** email service (replaces Supabase SMTP)
✅ Updated `/api/auth/email-login` to generate magic links server-side
✅ Magic links sent via Resend instead of Supabase SMTP
✅ Onboarding flow persists username to Supabase auth metadata

## Required Actions (Do These First)

### 1️⃣ Get Resend API Key
- Visit https://resend.com
- Sign up (free tier available)
- Go to **API Keys** section
- Create or copy API key (starts with `re_`)

### 2️⃣ Get Supabase Service Role Key
- Go to https://app.supabase.com → your project
- Click **Settings** → **API**
- Copy the **Service Role** secret (NOT the publishable key)
- ⚠️ This is sensitive — keep it private!

### 3️⃣ Create `.env.local`
In project root, create `.env.local`:

```
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=noreply@rapyard.club
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_key_here` with actual keys from steps 1-2.

### 4️⃣ Start Dev Server
```bash
npm run dev
```

## Test the Auth Flow

### ✅ Test Email Login
1. Open http://localhost:3000
2. Click **"GATE" → "EMAIL LOGIN"**
3. Enter your test email
4. Click **"EMAIL LOGIN"** button
5. **Wait 30-60 seconds** for email to arrive

### ✅ Check Email Received
- Look in your inbox for: **"🎤 Clock in to RapYard — Your magic link is ready"**
- Check spam/junk if not in inbox
- If not received after 2 min:
  - Check `.env.local` has correct `RESEND_API_KEY`
  - Check browser console for error messages
  - Check terminal for API logs

### ✅ Click Magic Link
- Click the **"Enter The Yard"** button in email
- You should see a loading screen
- You'll be redirected to **onboarding flow** (4 steps)

### ✅ Complete Onboarding
**Step 1: Welcome** → Click "START"
**Step 2: Chambers** → Click "EXPLORE"  
**Step 3: Profile** → Enter username (min 3 chars) → Click "SETUP"
**Step 4: Ready** → Click "BEGIN"

### ✅ Verify Auth Success
- You're redirected to **THE BOOTH** (`/record`)
- Top-right shows your username/avatar
- You can start recording

## Troubleshooting

### ❌ "Email delivery is not configured yet"
- Make sure `.env.local` exists in project root
- Verify `RESEND_API_KEY` starts with `re_`
- Restart dev server after creating `.env.local`
- Check terminal for "Environments: .env.local" message

### ❌ Email never arrives
- **Check spam folder first**
- Verify `RESEND_FROM_EMAIL` is set to `noreply@rapyard.club`
- Visit Resend dashboard to check email logs
- Try a different email address

### ❌ "Missing Supabase env vars"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Make sure you're using **Service Role** key, not publishable key
- Service role key should be ~50+ characters long

### ❌ Magic link expired
- Links expire in 24 hours
- Request a new one if too old

### ❌ Browser console shows API errors
- Open DevTools → Console tab
- Look for red error messages
- Share error text if you need help

## For Production (Cloudflare)

Once working locally, deploy secrets:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put RESEND_FROM_EMAIL
```

Then deploy:
```bash
npm run deploy
```

## File Changes Reference

- **New**: `lib/email.ts` — Email service with Resend integration
- **Updated**: `app/api/auth/email-login/route.ts` — Uses Resend for magic links
- **New**: `.env.local.example` — Environment template
- **New**: `EMAIL_SETUP.md` — Detailed setup guide

## Next Steps After Auth Works

1. ✅ Test recording in The Booth
2. ✅ Test beat preview in The Yard
3. ✅ Test battle matching in The Pit
4. ✅ Create other users to test multiplayer features
5. ✅ Deploy to Cloudflare with secrets configured
