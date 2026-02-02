# OAuth Configuration Guide

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

### 2. Create OAuth 2.0 Credentials
1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret**

### 3. Add to Environment Variables
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## GitHub OAuth Setup

### 1. Create OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: PixelForge AI
   - **Homepage URL**: `http://localhost:3000` (development)
   - **Authorization callback URL**:
     - Development: `http://localhost:3000/api/auth/callback/github`
     - Production: `https://yourdomain.com/api/auth/callback/github`
4. Click **Register application**

### 2. Generate Client Secret
1. Click **Generate a new client secret**
2. Copy **Client ID** and **Client Secret**

### 3. Add to Environment Variables
```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## Complete .env.local Example
```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Database
DATABASE_URL="file:./dev.db"

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## Testing OAuth Flow

### Local Development
1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000`
3. Click **"Get Started"** → **"Continue with Google/GitHub"**
4. You should be redirected to the OAuth provider
5. After authorization, you'll be redirected back to the app

### Common Issues

#### Issue: "Redirect URI Mismatch"
**Solution**: Ensure the redirect URI in your OAuth app matches exactly:
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/github`

#### Issue: "Invalid Client"
**Solution**: Double-check your Client ID and Client Secret in `.env.local`

#### Issue: "OAuth app not approved"
**Solution**: 
- For Google: Add test users in Google Cloud Console
- For GitHub: No approval needed for public OAuth apps

---

## Production Deployment

### Update OAuth Apps
1. Add production URLs to authorized redirect URIs
2. Update `NEXTAUTH_URL` to production domain
3. Generate a strong `NEXTAUTH_SECRET`: `openssl rand -base64 32`

### Vercel Deployment
```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
vercel env add NEXTAUTH_SECRET
```

---

## Security Best Practices

1. ✅ Never commit `.env.local` to version control
2. ✅ Use different OAuth apps for dev and production
3. ✅ Rotate secrets regularly
4. ✅ Enable 2FA on OAuth provider accounts
5. ✅ Monitor OAuth app usage for suspicious activity
