# Email Delivery Setup Guide — RapYard

## 1. Get Resend API Key

1. Go to https://resend.com/
2. Sign up or log in
3. Navigate to **API Keys** in the dashboard
4. Click **Create API Key** or copy existing key
5. Copy the key (starts with `re_`)

## 2. Configure Supabase Service Role Key

The service role key is needed to generate magic links server-side.

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy the **Service Role** secret (NOT the Publishable Key)
4. This is different from the anon key and has elevated permissions

## 3. Set Environment Variables

Create or update `.env.local` in your project root:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@rapyard.club

# Supabase (Service Role — keep this SECRET!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Existing vars (keep these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

⚠️ **IMPORTANT**: `SUPABASE_SERVICE_ROLE_KEY` is sensitive. Never commit this to version control or push it to a public repo. It has admin access to your database.

## 4. Update .gitignore

Make sure `.env.local` is in your `.gitignore`:

```
.env.local
.env*.local
```

## 5. For Cloudflare Deployment

Add secrets to Cloudflare:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put RESEND_FROM_EMAIL
```

Then paste your keys when prompted. These won't be committed to version control.

## 6. Verify Setup

Start dev server:
```bash
npm run dev
```

Test the flow:
1. Go to http://localhost:3000
2. Click "EMAIL LOGIN"
3. Enter your test email
4. Check that email was received (may take 30-60 seconds)
5. Click the magic link in the email
6. You should be redirected to onboarding

## Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify RESEND_API_KEY is correct in `.env.local`
- Check browser console for error messages

**Invalid API key error?**
- Make sure key starts with `re_`
- Copy from Resend dashboard carefully (no extra spaces)

**Service role key error?**
- Use the **Service Role** key from Supabase Settings → API
- NOT the publishable/anon key
- The service role key is longer and more restricted

**Still stuck?**
- Check `npm run dev` terminal for error messages
- Open browser DevTools → Console for client-side errors
- Check Network tab for API response details
