# MURA - Kazakh Literary Heritage

MURA is a React/Vite digital humanities platform for exploring Kazakh literary heritage through authors, works, places, guided reading routes, multilingual interpretation, and reader progress.

## Features

- Interactive home, works, authors, epochs, map, and route pages
- Chapter-based reading experiences with choices, feedback, quizzes, and progress
- English, Russian, and Kazakh interface translations
- Local progress, favorites, profile settings, and reading state
- Optional Supabase authentication, progress sync, comments, likes, and admin content
- GitHub Pages deployment support with `base: "/literary-heritage/"`

## Tech Stack

- React 19
- React Router 7
- Vite / rolldown-vite
- Zustand for local progress state
- Supabase for optional auth, sync, comments, likes, and admin data
- GSAP, Motion, and OGL for UI motion/visual effects

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The local app is served under:

```text
http://127.0.0.1:5173/literary-heritage/
```

## Environment

Copy `.env.example` to `.env` and add Supabase values if you want cloud auth and shared content:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

The app still works without Supabase, but auth, remote progress sync, comments, likes, and shared admin content fall back or show setup guidance.

## Supabase Setup

Run these SQL files in the Supabase SQL Editor:

1. `supabase-setup.sql` for profiles, progress, likes, comments, and row-level security.
2. `supabase-admin-content.sql` for shared admin content and admin-user access.

After creating your account, make it an admin using the instructions at the bottom of `supabase-admin-content.sql`.

## Quality Checks

Run lint:

```bash
npm run lint
```

Build production assets:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

Build and publish `dist` to GitHub Pages:

```bash
npm run build
npm run deploy
```

The Vite config already sets the correct base path for the `literary-heritage` repository.
