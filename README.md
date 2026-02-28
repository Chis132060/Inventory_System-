# Inventory System — Admin Module

An admin-first inventory management system built with Next.js (App Router), Supabase, and TypeScript.

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Auth + RLS)
- `@supabase/ssr` for server-side auth with cookies
- **Zod** for input validation
- **Server Actions** for mutations
- **Lucide React** for icons

## Project Structure

```
src/
├── app/
│   ├── (public)/login/           # Google OAuth login
│   ├── (protected)/
│   │   ├── admin/                # Admin module
│   │   │   ├── dashboard/        # KPI cards + recent activity
│   │   │   ├── users/            # User & role management
│   │   │   ├── products/         # CRUD products
│   │   │   ├── packaging/        # CRUD packaging types
│   │   │   └── audit-logs/       # Audit log viewer
│   │   ├── waiting-approval/     # Unassigned users land here
│   │   ├── supervisor/           # (scaffolded)
│   │   ├── inventory-manager/    # (scaffolded)
│   │   ├── salesman/             # (scaffolded)
│   │   └── buyer/                # (scaffolded)
│   └── auth/callback/            # Supabase OAuth callback
├── components/
│   ├── forms/                    # ProductForm, PackagingForm, RoleAssignForm
│   ├── layout/                   # AdminSidebar, AdminTopbar, SignOutButton
│   └── ui/                       # SubmitButton, DeleteButton
├── lib/
│   ├── auth/                     # getUserRole, requireRole, requireAdmin
│   ├── services/                 # users, products, packaging, audit
│   ├── supabase/                 # client.ts, server.ts, middleware.ts
│   ├── validators/               # Zod schemas
│   └── types.ts                  # Shared TypeScript types
├── server/
│   └── actions/                  # Server Actions (auth, users, products, packaging)
└── middleware.ts                  # Auth + RBAC route protection
```

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **Anon (public) key** from Settings → API.

### 2. Configure Google OAuth

1. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable the Google provider.
   - Add your Google OAuth Client ID and Client Secret (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)).
2. In Google Cloud Console, set the authorized redirect URI to:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

### 3. Run the SQL Schema

1. Go to Supabase Dashboard → SQL Editor.
2. Copy the entire contents of `supabase/schema.sql` and run it.
   - This creates all tables (`profiles`, `products`, `packaging`, `audit_logs`).
   - Sets up Row Level Security (RLS) policies.
   - Creates a trigger to auto-create a profile on new user sign-up.

### 4. Set Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Set Up the First Admin

After your first Google login, your account will have role = `UNASSIGNED` and you'll be redirected to the waiting page. To make yourself an admin:

1. Go to Supabase Dashboard → Table Editor → `profiles`.
2. Find your record and change the `role` column to `ADMIN`.
3. Refresh the app — you'll now have full admin access.

## RBAC Flow

| Role              | Access                              |
|-------------------|-------------------------------------|
| `UNASSIGNED`      | `/waiting-approval` only            |
| `ADMIN`           | `/admin/*` (full CRUD)              |
| `SUPERVISOR`      | (scaffolded — implement later)      |
| `INVENTORY_MANAGER`| (scaffolded — implement later)     |
| `SALESMAN`        | (scaffolded — implement later)      |
| `BUYER`           | (scaffolded — implement later)      |

## Security

- **Server-side RBAC**: All admin pages and server actions call `requireAdmin()` before executing.
- **Row Level Security**: Supabase RLS policies enforce that only admins can write to `profiles`, `products`, and `packaging`.
- **Self-assignment prevention**: Admins cannot change their own role via the UI or server action.
- **No service key on client**: Only the anon key is exposed; the service role key is never used in client code.

## License

Private / School Project
