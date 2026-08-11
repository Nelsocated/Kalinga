# Kalinga

A TikTok-style pet adoption app. Users scroll through short pet videos and can adopt directly from the feed. Shelters post pet videos and profiles, manage their account, and handle adoptions. Admins review shelter applications and approve or reject them.

Built for **Introduction to Engineering Design** as a group project.

## Features

- **User** — scroll through a pet video feed, view pet profiles, click to adopt
- **Shelter** — create/manage pet video posts and profiles, manage account, settle adoptions
- **Admin** — review shelter creation applications and accept or reject them

## Tech Stack

- [Next.js](https://nextjs.org/) — frontend and backend
- [Supabase](https://supabase.com/) — database and storage (pet videos/images)
- [Tailwind CSS](https://tailwindcss.com/) — styling

## Getting Started

1. Clone the repo

   ```bash
   git clone <repo-url>
   cd kalinga
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.
