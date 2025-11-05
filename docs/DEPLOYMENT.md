# Deployment Documentation

## Overview

Hands is deployed on Netlify with automatic deployments from GitHub. The application uses Supabase for backend services.

## Environments

### Development

- **Location**: Local development
- **Supabase**: Local instance via Supabase CLI or development project
- **URL**: `http://localhost:3000`

### Staging

- **Location**: Netlify preview deployments
- **Supabase**: Staging project
- **URL**: Netlify preview URL (generated per branch/PR)

### Production

- **Location**: Netlify
- **Supabase**: Production project
- **URL**: Production domain (to be configured)

## Deployment Process

### Automatic Deployment

#### Production

- Triggers on push to `main` branch
- Builds and deploys automatically via Netlify
- Runs all CI checks before deployment

#### Staging/Preview

- Triggers on pull requests to `develop` or `main`
- Creates preview deployment for each PR
- Available for review and testing

### Manual Deployment

If needed, you can trigger a manual deployment:

```bash
# Build locally
npm run build

# Deploy via Netlify CLI
netlify deploy --prod
```

## Build Configuration

Build settings are configured in `netlify.toml`:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20

## Environment Variables

### Netlify Configuration

Environment variables are configured in the Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL`

### Per-Environment Variables

- **Production**: Set in Netlify production environment
- **Staging**: Set in Netlify staging environment
- **Development**: Set in `.env.local` (gitignored)

## Database Migrations

### Local Development

```bash
supabase db reset
```

### Production

Migrations should be applied through Supabase dashboard or CLI:

```bash
supabase db push --project-ref <project-ref>
```

**Important**: Always test migrations in staging before production.

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. **Lint** - Code linting
2. **Type Check** - TypeScript type checking
3. **Test** - Unit and integration tests
4. **Build** - Production build verification

All checks must pass before deployment.

## Monitoring

### Netlify Analytics

- Site performance metrics
- Build success/failure rates
- Deployment history

### Supabase Monitoring

- Database performance
- API usage
- Error logs

### Error Tracking

- Sentry (recommended) for production error tracking
- Set up in Netlify environment variables

## Rollback Procedure

If a deployment fails or causes issues:

1. **Via Netlify Dashboard**:
   - Go to Deploys
   - Select previous successful deployment
   - Click "Publish deploy"

2. **Via Git**:
   - Revert problematic commit
   - Push to `main`
   - New deployment will trigger automatically

## Domain Configuration

Production domain configuration:

1. Add custom domain in Netlify dashboard
2. Configure DNS records as instructed
3. SSL certificate is automatically provisioned

## Performance Optimization

### Build Optimizations

- Code splitting (automatic via Vite)
- Tree shaking
- Minification

### Runtime Optimizations

- Supabase CDN for static assets
- Database query optimization
- Image optimization before upload

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set
- [ ] RLS policies are correctly configured
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] API keys are secured (not exposed in client code)
- [ ] Error messages don't expose sensitive information

## Troubleshooting

### Build Failures

- Check Netlify build logs
- Verify all dependencies are in `package.json`
- Ensure Node version matches (20)

### Runtime Errors

- Check Supabase logs
- Review error tracking (Sentry)
- Verify environment variables are set correctly

### Database Issues

- Check Supabase dashboard for connection issues
- Verify RLS policies allow necessary access
- Review migration history
