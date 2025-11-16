# Netlify Deployment Guide - NSS Portal Frontend

## 🚀 Quick Deployment Commands

### Build Command
```bash
npm run build
```

### Publish Directory
```
build
```

---

## 📋 Netlify Configuration

Your `netlify.toml` is already configured correctly:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build]
  command = "npm run build"
  publish = "build"
```

---

## 🔧 Environment Variables Setup

In Netlify Dashboard → Site Settings → Environment Variables, add:

| Variable Name | Value |
|--------------|-------|
| `REACT_APP_API_URL` | `https://nss-latest.onrender.com/api` |

**Important:** Don't include the `|| http://localhost:5000` part in Netlify - that's only for local development!

---

## 📝 Step-by-Step Netlify Deployment

### Method 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository: `sdsameer16/NSS_Latest`

3. **Configure Build Settings**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`

4. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://nss-latest.onrender.com/api`

5. **Deploy!**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)

---

### Method 2: Manual Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

   When prompted:
   - **Publish directory:** `build`

---

### Method 3: Drag & Drop (Quick Test)

1. **Build locally**
   ```bash
   cd frontend
   npm run build
   ```

2. **Drag & Drop**
   - Go to https://app.netlify.com/drop
   - Drag the `frontend/build` folder
   - Wait for deployment

**Note:** This method requires manual updates and doesn't have auto-deploy.

---

## 🔄 Auto-Deploy Setup

Once connected to GitHub, Netlify will auto-deploy when you:
- Push to `main` branch
- Merge a pull request

**To trigger a deploy:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

---

## 🛠️ Local Testing Before Deploy

Always test the production build locally:

```bash
cd frontend
npm run build
npx serve -s build -p 3000
```

Then visit http://localhost:3000 to test the production build.

---

## ⚙️ Build Settings Summary

Use these settings in Netlify Dashboard:

```
Base directory:     frontend
Build command:      npm run build
Publish directory:  frontend/build
Node version:       18.x (or latest LTS)
```

---

## 🌍 Environment Variables

**For Netlify (Production):**
```
REACT_APP_API_URL=https://nss-latest.onrender.com/api
```

**For Local Development (keep in .env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Note:** Never commit `.env` files with production secrets to GitHub!

---

## 📦 Build Output

After successful build, you'll see:
```
Creating an optimized production build...
Compiled successfully!

File sizes after gzip:

  XX KB  build/static/js/main.[hash].js
  XX KB  build/static/css/main.[hash].css

The build folder is ready to be deployed.
```

---

## 🔍 Troubleshooting

### Build Fails on Netlify

**Issue:** `Cannot find module` errors

**Solution:** Make sure all dependencies are in `package.json`:
```bash
cd frontend
npm install
```

### API Requests Fail After Deploy

**Issue:** API calls return 404 or CORS errors

**Solution:** 
1. Check `REACT_APP_API_URL` is set correctly in Netlify
2. Verify backend is running at `https://nss-latest.onrender.com`
3. Check backend CORS settings allow your Netlify domain

### Build Works Locally But Fails on Netlify

**Issue:** Build succeeds locally but fails on Netlify

**Solution:**
1. Check Node version compatibility
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Commit and push

---

## 🎯 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] `netlify.toml` configured correctly
- [ ] Environment variable `REACT_APP_API_URL` set in Netlify
- [ ] Base directory set to `frontend`
- [ ] Build command set to `npm run build`
- [ ] Publish directory set to `frontend/build`
- [ ] Backend API is accessible at production URL
- [ ] CORS configured on backend to allow Netlify domain

---

## 📱 Post-Deployment Testing

After deployment, test these features:

1. **Login/Authentication** - Can users log in?
2. **API Calls** - Are reports loading?
3. **File Upload** - Can students submit reports with files?
4. **PDF Viewing** - Do PDFs open correctly?
5. **Responsive Design** - Test on mobile devices

---

## 🔗 Useful Commands

```bash
# Build for production
npm run build

# Test production build locally
npx serve -s build

# Deploy to Netlify (if CLI installed)
netlify deploy --prod

# Check build logs
netlify logs

# Open Netlify dashboard
netlify open
```

---

## 📊 Expected Build Time

- **First Deploy:** 3-5 minutes
- **Subsequent Deploys:** 1-2 minutes

---

## 🎉 Success!

Once deployed, you'll get a URL like:
```
https://your-site-name.netlify.app
```

You can set a custom domain in Netlify Dashboard → Domain Settings.

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com
