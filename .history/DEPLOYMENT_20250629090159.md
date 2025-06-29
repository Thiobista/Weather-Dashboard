# 🚀 Deployment Guide

This guide covers how to deploy the Weather Dashboard application to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- OpenWeatherMap API key
- Platform-specific accounts (Vercel, Netlify, etc.)

## 🌐 Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

**Get your API key:**
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "My API Keys"
4. Copy your API key

## 🎯 Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

### Automatic Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket
   - Click "New Project"
   - Import your weather-dashboard repository

2. **Configure Environment Variables**
   - In the Vercel dashboard, go to your project
   - Navigate to "Settings" → "Environment Variables"
   - Add: `NEXT_PUBLIC_OPENWEATHER_API_KEY` = `your_api_key`

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Your app will be available at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables
```

## 🕸️ Netlify

### Automatic Deployment

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Sign in and click "New site from Git"
   - Connect your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18` (in environment variables)

3. **Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add: `NEXT_PUBLIC_OPENWEATHER_API_KEY` = `your_api_key`

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

## ☁️ AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add `NEXT_PUBLIC_OPENWEATHER_API_KEY` in the Amplify console

## 🚂 Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Environment Variables**
   - Add `NEXT_PUBLIC_OPENWEATHER_API_KEY` in the Railway dashboard

3. **Deploy**
   - Railway will automatically detect Next.js and deploy

## 🔧 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  weather-dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_OPENWEATHER_API_KEY=${NEXT_PUBLIC_OPENWEATHER_API_KEY}
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t weather-dashboard .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key weather-dashboard
```

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use platform-specific secret management
- Rotate API keys regularly

### CORS Configuration
- Configure CORS headers in production
- Restrict origins to your domain
- Use HTTPS in production

### Rate Limiting
- Implement rate limiting for API calls
- Cache responses to reduce API usage
- Monitor API usage and costs

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize images
# Use Next.js Image component with proper sizing
```

### Caching Strategy
- Implement service worker for offline support
- Use CDN for static assets
- Cache API responses appropriately

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables are prefixed with `NEXT_PUBLIC_`
   - Restart the development server
   - Check platform-specific configuration

3. **API Rate Limiting**
   - Implement proper caching
   - Use multiple API keys if needed
   - Monitor usage patterns

### Debug Commands

```bash
# Check TypeScript errors
npm run type-check

# Run tests
npm test

# Lint code
npm run lint

# Check bundle size
npm run build
```

## 📈 Monitoring

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior tracking

### Health Checks
- Implement `/api/health` endpoint
- Monitor API response times
- Set up uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review environment variable configuration
3. Verify API key validity
4. Check build logs for errors

---

**Happy Deploying! 🚀** 