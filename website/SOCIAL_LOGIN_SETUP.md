# Social Login Setup Guide

This guide explains how to set up social login functionality for the ChaseWhiteRabbit intranet using Supabase Auth.

## Prerequisites

1. A Supabase account (free tier available at https://supabase.com)
2. OAuth app credentials from your preferred providers (Google, GitHub, Microsoft)

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 3: Enable OAuth Providers

In your Supabase dashboard:

### Google OAuth Setup

1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret
4. Add redirect URLs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `https://tiation.github.io/ChaseWhiteRabbit/` (for production)
   - `http://localhost:5173/` (for development)

### GitHub OAuth Setup

1. Go to Authentication → Providers → GitHub
2. Enable GitHub provider
3. Create a GitHub OAuth App:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL to Supabase callback URL
4. Add Client ID and Secret to Supabase

### Microsoft (Azure AD) Setup

1. Go to Authentication → Providers → Azure
2. Enable Azure provider
3. Register app in Azure Portal:
   - Go to Azure Active Directory → App registrations
   - Create new registration
   - Add redirect URI
4. Add Application (client) ID and Directory (tenant) ID

## Step 4: Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

1. Site URL: `https://tiation.github.io/ChaseWhiteRabbit/`
2. Redirect URLs:
   - `https://tiation.github.io/ChaseWhiteRabbit/dashboard`
   - `http://localhost:5173/dashboard` (for development)

## Step 5: Update Auth Store (Optional)

The auth store is already configured to use Supabase. To customize the behavior, modify `/src/stores/auth.ts`:

```typescript
const socialLogin = async (provider: string) => {
  // ... existing code ...
  
  const { error } = await supabase.auth.signInWithOAuth({ 
    provider: provider as any,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'email profile' // Add custom scopes if needed
    }
  })
  
  // ... rest of code ...
}
```

## Step 6: Handle Auth State Changes

To properly handle authentication state after OAuth redirect, add this to your App.vue or main layout:

```typescript
import { onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

onMounted(() => {
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      // Update your auth store with the session data
      authStore.setAuthData({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.email!,
          department: 'General',
          role: 'user',
          avatar: session.user.user_metadata.avatar_url
        },
        token: session.access_token,
        refreshToken: session.refresh_token!
      })
    }
  })
})
```

## Testing Social Login

1. Run the development server: `npm run dev`
2. Navigate to the login page
3. Click on any social login button
4. You should be redirected to the provider's login page
5. After successful authentication, you'll be redirected back to the dashboard

## Troubleshooting

### "Social login is not configured" Error
- Ensure you've added the Supabase URL and anon key to your `.env` file
- Restart your development server after adding environment variables

### Redirect Issues
- Verify that your redirect URLs in Supabase match your application URLs exactly
- Check that your OAuth app settings include the correct callback URLs

### CORS Errors
- Add your application domain to Supabase's allowed origins
- For development, ensure `localhost:5173` is allowed

## Security Considerations

1. **Never commit** your `.env` file with real credentials
2. Use environment-specific configurations for development/production
3. Implement proper role-based access control in your application
4. Regularly rotate your OAuth app secrets
5. Monitor authentication logs in Supabase dashboard

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
