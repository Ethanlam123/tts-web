# Deployment Guide

This guide covers various deployment options for the AudioConverter TTS web application.

## 🌐 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- ElevenLabs API key

### Steps

1. **Connect Repository to Vercel**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "Next.js" as framework preset

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   ELEVENLABS_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Vercel-Specific Configuration

The project includes Vercel optimizations:
- ✅ TypeScript build errors resolved
- ✅ Proper Next.js 16 configuration
- ✅ Static asset optimization
- ✅ API routes configured

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run
```bash
# Build the image
docker build -t tts-web .

# Run the container
docker run -p 3000:3000 -e ELEVENLABS_API_KEY=your_key_here tts-web
```

## 🚀 Railway Deployment

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Select the tts-web repository
   - Add environment variable: `ELEVENLABS_API_KEY`

3. **Configure**
   - Railway will auto-detect Next.js
   - Set build command: `npm run build`
   - Set start command: `npm start`
   - Deploy!

## 🔧 Netlify Deployment

### Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Steps
1. Connect repository to Netlify
2. Set environment variables in Netlify dashboard:
   - `ELEVENLABS_API_KEY`
   - `NODE_VERSION=18`
3. Deploy!

## ⚙️ Self-Hosted VPS Deployment

### Requirements
- Node.js 18+
- PM2 (Process Manager)
- Nginx (optional, for reverse proxy)
- SSL certificate

### Deployment Steps

1. **Clone and Build**
   ```bash
   git clone https://github.com/yusinglam/tts-web.git
   cd tts-web
   npm install
   npm run build
   ```

2. **Set Environment Variables**
   ```bash
   export ELEVENLABS_API_KEY="your_key_here"
   export NODE_ENV="production"
   export PORT=3000
   ```

3. **Install PM2**
   ```bash
   npm install -g pm2
   ```

4. **Create PM2 Config**
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'tts-web',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       env_production: {
         NODE_ENV: 'production',
         ELEVENLABS_API_KEY: 'your_actual_key_here'
       }
     }]
   };
   ```

5. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to git
- Use different keys for development and production
- Rotate keys regularly

### HTTPS
- Always use HTTPS in production
- Configure proper SSL certificates
- Set secure cookie flags

### Rate Limiting
- Monitor API usage
- Implement rate limiting if needed
- ElevenLabs has built-in rate limits

## 📊 Monitoring

### Health Checks
Add health check endpoint:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
```

### Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics

## 🚀 Performance Optimization

### Build Optimization
- ✅ Next.js 16 with App Router
- ✅ Static generation where possible
- ✅ Optimized images and assets
- ✅ Code splitting

### Caching
- API responses cached appropriately
- Static assets cached via CDN
- Browser caching headers

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm run lint

    - name: Build
      run: npm run build
      env:
        ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📝 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] API endpoints respond
- [ ] ElevenLabs integration works
- [ ] File upload functions
- [ ] Audio generation works
- [ ] Download ZIP functionality
- [ ] Mobile responsiveness
- [ ] Error handling works
- [ ] SSL certificate valid
- [ ] Performance acceptable
- [ ] Monitoring configured

---

For additional deployment options or troubleshooting, see the main [README.md](README.md) or open an issue.