# Supabase CLI Quick Start Guide

This guide helps you set up and use Supabase CLI for local development of the ChaseWhiteRabbit intranet.

## Prerequisites

✅ Supabase CLI installed (version 2.31.4)
✅ Docker Desktop installed and running (for local development)

## Quick Start

### 1. Login to Supabase

```bash
supabase login
```

This will open a browser window to authenticate with your Supabase account.

### 2. Start Local Development

```bash
# Navigate to the website directory
cd /Users/tiaastor/tiation-github/ChaseWhiteRabbit/website

# Start Supabase local development stack
supabase start
```

This starts:
- Local PostgreSQL database (port 54322)
- Auth server (port 54321)
- Storage server
- Realtime server
- Studio (database GUI) at http://localhost:54323

### 3. Access Local Services

After running `supabase start`, you'll see output like:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJ...
service_role key: eyJ...
```

### 4. Update Environment Variables for Local Development

Create a `.env.local` file:

```bash
# Local Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

### 5. Set Up Database Schema

```bash
# Create a new migration
supabase migration new create_user_profiles

# Edit the migration file in supabase/migrations/
# Add your SQL schema

# Apply migrations
supabase db push
```

Example migration for user profiles:

```sql
-- Create user profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  department TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 6. Generate TypeScript Types

```bash
# Generate types from your local database
supabase gen types typescript --local > src/types/supabase.ts
```

### 7. Link to Remote Project (Optional)

If you have a remote Supabase project:

```bash
# Get your project ref from Supabase dashboard
supabase link --project-ref your-project-ref

# Pull remote database schema
supabase db pull

# Push local changes to remote
supabase db push
```

## Common Commands

### Database Management
```bash
# Reset database
supabase db reset

# Create new migration
supabase migration new migration_name

# List migrations
supabase migration list

# Apply migrations
supabase db push
```

### Edge Functions
```bash
# Create new function
supabase functions new function-name

# Serve functions locally
supabase functions serve

# Deploy function
supabase functions deploy function-name
```

### Development Workflow
```bash
# Check status of local services
supabase status

# Stop all services
supabase stop

# Stop and remove all data
supabase stop --no-backup
```

## Testing Social Login Locally

1. **Configure OAuth Redirect URLs** in your OAuth providers:
   - Add `http://localhost:54321/auth/v1/callback` as authorized redirect

2. **Update Auth Settings** in Studio (http://localhost:54323):
   - Go to Authentication → Providers
   - Configure your OAuth providers

3. **Test Login Flow**:
   - Start your Vue dev server: `npm run dev`
   - Click social login buttons
   - You'll be redirected through the OAuth flow

## Troubleshooting

### Docker Not Running
```
Error: Cannot connect to Docker daemon
```
**Solution**: Start Docker Desktop

### Port Already in Use
```
Error: port 54321 is already in use
```
**Solution**: 
```bash
# Find and kill the process
lsof -i :54321
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check if services are running
supabase status

# Restart services
supabase stop
supabase start
```

### Type Generation Fails
```bash
# Make sure services are running
supabase status

# Try with explicit connection string
supabase gen types typescript --local --schema public
```

## Production Deployment

When ready to deploy:

1. **Push to Remote Supabase**:
   ```bash
   supabase db push
   supabase functions deploy
   ```

2. **Update Production Environment**:
   - Set production Supabase URL and anon key
   - Configure OAuth redirect URLs for production domain

3. **Enable Security**:
   - Review and tighten RLS policies
   - Set up proper CORS configuration
   - Enable additional auth providers as needed

## Resources

- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Self-Hosting Supabase](https://supabase.com/docs/guides/self-hosting)
