 # SafeSpace

 A privacy-first web app for reporting abuse and measuring community safety. 
 SafeSpace provides anonymous, client-side encrypted reporting with tamper-proof verification (report hash), community dashboards, safety scoring, and administrative tools built on Supabase and Vite + React (TypeScript).

 ## 🚀 Features
 - Submit anonymous, end-to-end encrypted reports (AES-GCM) from the browser
 - Client-side encryption prevents the platform from storing plaintext evidence
 - Reports are stored in Supabase and timestamped by creating a tamper-proof hash
 - Community registration and admin dashboards
 - Safety rating component and public transparency dashboard
 - Supabase Edge Function (`submit-report`) used to accept and store anonymous reports

 ## 🧭 Tech Stack
 - Frontend: Vite, React 18, TypeScript, Tailwind CSS
 - UI: Radix UI + shadcn/ui primitives and lucide icons
 - State & Data: TanStack React Query, react-router v6
 - Auth & Storage: Supabase (auth, DB, RLS, Edge Functions)
 - Edge Function runtime: Deno (Supabase Functions)

 ## Prerequisites
 - Node.js v18+ (or Bun if you prefer)
 - NPM or Yarn or Bun to install dependencies
 - A Supabase project and the Supabase CLI for local development and to deploy the Edge Function

 ## Setup (Local Development)
 1. Clone the repo:
	 ```bash
	 git clone https://github.com/Aisha-Barasa/safespace.git
	 cd safespace
	 ```
 2. Install dependencies:
	 ```bash
	 # using npm
	 npm install
	 # using bun
	 # bun install
	 ```
 3. Create a local `.env` file in the project root (Vite reads variables prefixed with `VITE_`) and add your Supabase credentials:
	 ```env
	 VITE_SUPABASE_URL=https://safespace-rust.vercel.app/
	 VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-publishable-key>
	 ```
 4. Start the dev server:
	 ```bash
	 npm run dev
	 ```
 5. Open the app at http://localhost:5173 (Vite default)

 ## Run Supabase Edge Function locally
 The `submit-report` function is a Deno-based Supabase Edge Function located at `supabase/functions/submit-report/index.ts`.
 1. Install the Supabase CLI and login:
	 ```bash
	 # macOS / Linux example
	 npm install -g supabase
	 supabase login
	 ```
 2. Set the environment variables for the function (SUPABASE_URL, SUPABASE_ANON_KEY) and run locally:
	 ```bash
	 export SUPABASE_URL=https://safespace-rust.vercel.app/
	 export SUPABASE_ANON_KEY=<pub-anon-key>
	 cd supabase/functions/submit-report
	 supabase functions serve
	 ```
 3. The function listens for POST requests to accept anonymous reports and returns a tamper-proof report hash.

 ## Database & Migrations
 - The repository includes SQL migration files under `supabase/migrations/`.
 - Tables: `profiles`, `communities`, `reports` with proper RLS policies for privacy and secure access.
 - Apply migrations using the Supabase CLI (or Supabase Studio):
	 ```bash
	 # Using Supabase CLI - refer to your installed version
	 supabase db push   # or `supabase migrations apply` depending on CLI version
	 ```

 ## Environment Variables
 - Frontend (Vite):
	- `VITE_SUPABASE_URL` - Supabase REST/Realtime URL
	- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase PUBLIC ANON KEY
 - Supabase Edge Function (deployed environment or locally when serving):
	- `SUPABASE_URL` - Supabase URL
	- `SUPABASE_ANON_KEY` - Supabase public anon key for function to insert into DB

 ## Security & Privacy Notes 🔒
 - Encryption: Sensitive fields (description, evidence) are encrypted client-side using Web Crypto API (AES-GCM). Only the encrypted blob is sent and stored.
 - Anonymity: The Edge Function accepts reports without requiring user credentials and the `reports` table allows anonymous INSERTs while restricting SELECT to authenticated users.
 - Hashing: The Edge Function computes a SHA-256 hash of report content (including timestamp) to provide a tamper-proof verification token.

 ## Deployment
 1. Frontend: Deploy the produced `dist/` after `npm run build` to any static host (Vercel, Netlify, Cloudflare Pages, Supabase Hosting etc.). Ensure environment variables are set in the host.
 2. Backend: Use Supabase for the database and auth.
 3. Edge Function: Deploy the `submit-report` function with the Supabase CLI:
	 ```bash
	 supabase functions deploy submit-report --project-ref <project-ref>
	 ```

 ## Quick test (Edge Function)
 After deploying, you can manually test the function with a `curl` POST (replace endpoint and JSON data):
 ```bash
 curl -X POST https://<project-ref>.functions.supabase.co/submit-report \
	 -H 'Content-Type: application/json' \
	 -d '{"incidentType":"harassment","encryptedDescription":"<encrypted_blob>","incidentDate":"2025-11-29" }'
 ```

 Example Node.js snippet using the Supabase client (for invoking built-in Supabase Functions):
 ```js
 import { createClient } from '@supabase/supabase-js';
 const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
 const { data, error } = await supabase.functions.invoke('submit-report', {
	 body: {
		 incidentType: 'harassment',
		 encryptedDescription: '<encrypted_blob>',
	 },
 });
 ```

 ## Project Structure
 - `src/` - React application source code
	- `components/` - UI and shared components
	- `pages/` - All routes (index, report, dashboard, auth, community)
	- `integrations/supabase/` - Supabase client and types
 - `supabase/functions/` - Supabase Edge Functions (Deno)
 - `supabase/migrations/` - SQL migrations for DB schema

 ## Scripts
 - `npm run dev` - Start Vite dev server
 - `npm run build` - Build production bundle
 - `npm run preview` - Preview the production build
 - `npm run lint` - Run ESLint

 ## Contributing
 We welcome contributions! Steps to help:
 1. Open an issue with a clear description if you find a bug or want a feature.
 2. Fork the repo and create a feature branch.
 3. Add tests or demo data where applicable, implement your fix/feature, and send a PR.

 ## Troubleshooting & Tips
 - If you experience 401/403 errors against Supabase, check that your `VITE_SUPABASE_PUBLISHABLE_KEY` is the anon/public key and that RLS policies are correctly applied.
 - The `submit-report` function is free to accept anonymous data; the DB row-level security is set so only authenticated users can SELECT reports.

## Developer notes
- Client-side encryption is implemented in `src/pages/Report.tsx` using the Web Crypto API (AES-GCM). The approach uses a generated key + random IV and converts the result into a base64 payload that is stored in the DB.
- The `submit-report` function (Deno) computes a SHA-256 hash of the provided content (including timestamp) and stores `report_hash` in `reports`. This is used for tamper-proof verification.
- For production, consider secure key management: storing and rotating keys for admin functionality that might decrypt data or verify hashes.

 ## License
 - No license file is present. Add a `LICENSE` if you want to open-source this project under a specific license.

 ---
 Built with ❤️ by the SafeSpace contributors

