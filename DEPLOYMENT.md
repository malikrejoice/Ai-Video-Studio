# Deployment Guide

## Vercel (Recommended - Easy & Free)

### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import GitHub repo
   - Click "Deploy"

3. **That's it!** Your app is live at `https://your-app.vercel.app`

### Environment Variables (if needed)
- Add in Vercel Dashboard → Settings → Environment Variables

---

## Deploy to Netlify

1. **Connect GitHub**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Deploy**
   - Click "Deploy site"

---

## Deploy to Docker

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./next
COPY public ./public
CMD ["npm", "start"]
EXPOSE 3000
```

### Build & Run
```bash
docker build -t ai-video-studio .
docker run -p 3000:3000 ai-video-studio
```

---

## Custom Server (DigitalOcean, AWS, etc.)

### Prerequisites
- Server with Node.js 18+
- SSH access

### Steps:

1. **SSH into server**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/ai-video-studio.git
   cd ai-video-studio
   npm install
   npm run build
   ```

4. **Use PM2 for process management**
   ```bash
   sudo npm install -g pm2
   pm2 start "npm start" --name "ai-studio"
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx reverse proxy**
   ```bash
   sudo apt-get install nginx
   ```

   `/etc/nginx/sites-available/default`:
   ```nginx
   server {
     listen 80;
     server_name your_domain.com;
     
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

6. **Enable SSL (Let's Encrypt)**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your_domain.com
   ```

7. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

---

## Performance Optimization

### Build Size
- Current: ~150KB gzipped
- Next.js builds are already optimized

### CDN
- Vercel includes global CDN
- Consider Cloudflare for additional caching

### Image Optimization
- Next.js automatically optimizes images
- Already configured in next.config.js

### Caching Strategy
- Static files: 1 year
- Pages: Revalidate on demand
- API: Cache as needed

---

## Monitoring & Analytics

### Vercel Analytics
- Automatically included
- Dashboard shows performance

### Custom Analytics (Optional)
- Google Analytics: Add to layout.tsx
- Segment: Install segment package
- PostHog: Self-hosted option

### Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- Sentry for error tracking

---

## Domain Setup

1. **Buy Domain** (Namecheap, GoDaddy, etc.)
2. **Point DNS** to:
   - **Vercel**: nameservers from Vercel dashboard
   - **Custom**: A record to your server IP
   - **CNAME**: For subdomains

3. **SSL Certificate**
   - Vercel: Automatic
   - Custom: Use Let's Encrypt
   - Netlify: Automatic

---

## Auto-Deploy on Push

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
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
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## Troubleshooting Deployment

**Build fails?**
- Check Node version: `node --version`
- Clear cache: `npm ci`
- Check for TypeScript errors: `npm run build`

**Performance issues?**
- Enable caching headers
- Use CDN
- Compress images
- Check network tab in DevTools

**Can't connect to domain?**
- Wait 24-48 hours for DNS propagation
- Flush DNS: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Verify DNS settings

**"Port already in use"?**
- Kill process: `lsof -i :3000` then `kill -9 <PID>`
- Or use different port: `PORT=3001 npm start`
