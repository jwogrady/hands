# Vercel Deployment Guide

This guide explains how to deploy the Hands application to Vercel and connect it to the hosted Supabase database.

## Prerequisites

- Vercel account (connected to GitHub)
- Supabase hosted project credentials
- GitHub repository access

## Supabase Configuration

**Hosted Supabase Project:**

- Project URL: `https://rkoavwryjvgbanecngup.supabase.co`
- Project Reference: `rkoavwryjvgbanecngup`

## Environment Variables for Vercel

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Production Environment

```
VITE_SUPABASE_URL=https://rkoavwryjvgbanecngup.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_bmSjvr8quOk9e0_A15ntLQ_HCB9rqDw
VITE_APP_URL=https://your-app.vercel.app
```

### Preview Environment (optional - for PR previews)

```
VITE_SUPABASE_URL=https://rkoavwryjvgbanecngup.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_bmSjvr8quOk9e0_A15ntLQ_HCB9rqDw
VITE_APP_URL=$VERCEL_URL
```

**Note:** `$VERCEL_URL` is automatically provided by Vercel for preview deployments.

## Deployment Steps

### 1. Initial Deployment via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import the `jwogrady/hands` repository
4. Configure project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)
5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add all three variables listed above for Production
   - Add the same variables for Preview (using `$VERCEL_URL` for `VITE_APP_URL`)
6. Click **"Deploy"**

### 2. Configure Supabase for Vercel Domain

After deployment, configure Supabase to allow your Vercel domain:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/rkoavwryjvgbanecngup)
2. Navigate to **Authentication → URL Configuration**
3. Add your Vercel production URL to **Redirect URLs:**
   - `https://your-app.vercel.app/**`
4. Update **Site URL** to your production URL:
   - `https://your-app.vercel.app`
5. Save changes

### 3. Verify Deployment

1. Visit your Vercel deployment URL
2. Test authentication (sign up/login)
3. Verify Supabase connection by checking browser console
4. Test profile creation and job applications

## Automatic Deployments

Vercel automatically:

- **Production:** Deploys on push to `main` branch
- **Preview:** Creates preview deployments for all pull requests
- **Branch Deploys:** Deploys branches automatically (optional)

## Manual Deployment via CLI

If you prefer using the CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (first time will ask configuration questions)
vercel

# Deploy to production
vercel --prod
```

## Vercel Configuration File

The `vercel.json` file is configured with:

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- Client-side routing support (SPA rewrites)

## Troubleshooting

### Build Fails

- Check Vercel build logs
- Verify Node.js version (should be 20+)
- Ensure all dependencies are in `package.json`

### Supabase Connection Errors

- Verify environment variables are set correctly in Vercel
- Check Supabase project is active
- Verify CORS settings in Supabase dashboard

### Authentication Issues

- Ensure Vercel URL is added to Supabase Redirect URLs
- Check `VITE_APP_URL` matches your actual deployment URL
- Verify `VITE_SUPABASE_ANON_KEY` is correct

### Routing Issues (404 errors)

- Verify `vercel.json` rewrite rules are in place
- Check that all routes are handled by React Router

## Environment Variable Notes

**Important:**

- All environment variables must start with `VITE_` to be accessible in the browser
- The anon key is safe to expose in the client (it's protected by RLS policies)
- Never commit `.env.local` files to git
- Always set environment variables in Vercel dashboard, not in code

## Database Migrations

Migrations are already applied to the hosted Supabase instance. To apply new migrations:

```bash
# Link to hosted project (if not already linked)
supabase link --project-ref rkoavwryjvgbanecngup

# Push new migrations
supabase db push
```

## Monitoring

- **Vercel Dashboard:** View deployment logs, analytics, and performance
- **Supabase Dashboard:** Monitor database, API usage, and auth logs
- **Browser Console:** Check for runtime errors

## Rollback

If a deployment causes issues:

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click the three dots menu
4. Select "Promote to Production"
