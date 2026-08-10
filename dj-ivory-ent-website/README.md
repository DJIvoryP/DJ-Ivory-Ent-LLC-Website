# DJ Ivory Ent LLC — Website

## What's in here
- `index.html` — the full site (Home, About, Highlights, Roster, Book Now, Contact)
- `assets/` — logo, favicon, and app icon files
- `supabase-schema.sql` — SQL to create the `booking_requests` and `contact_messages` tables
- `vercel.json` — clean-URL config for Vercel

## 1. Connect Supabase (so form submissions are actually saved)
1. In Supabase, go to **SQL Editor -> New query**, paste in `supabase-schema.sql`, and run it. This creates the two tables the forms write to.
2. Go to **Project Settings -> API** and copy your **Project URL** and **anon public** key.
3. Open `index.html`, find this block near the bottom (search for `SUPABASE_URL`), and paste your values in:
   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```
4. Save. Booking and contact submissions will now insert into your Supabase tables. You can view them anytime in **Table Editor**.

The anon key is safe to expose in client-side code — it can only insert rows, per the row-level security policies in the schema file.

## 2. Deploy to Vercel
Easiest path is through GitHub:
1. Push this folder to a new GitHub repo (or upload it directly in the Vercel dashboard).
2. In Vercel, click **Add New -> Project**, import that repo.
3. Framework preset: choose **Other** (this is a static site, no build step needed).
4. Root directory: leave as `/` (or point to this folder if it's nested in a larger repo).
5. Click **Deploy**.
6. Once deployed, go to **Project Settings -> Domains** and add your GoDaddy domain, then add the DNS records Vercel gives you in GoDaddy's DNS settings.

No environment variables are needed since the Supabase anon key is meant to live in the client code.
