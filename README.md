This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- User authentication with Supabase
- Notes management with create/delete functionality
- Email sending to recipients (To/CC) when creating notes
- Built with Next.js 16, React 19, and TypeScript

## Prerequisites

- Node.js 20+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Resend account for email sending ([sign up here](https://resend.com))

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then update the following variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `NEXT_PUBLIC_SITE_URL`: Your site URL (http://localhost:3000 for local development)
- `RESEND_API_KEY`: Your Resend API key for sending emails

### 3. Setup Supabase Database

Run the migrations in your Supabase SQL editor:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `supabase/migrations/001_create_profiles.sql`
   - `supabase/migrations/002_create_notes.sql`
   - `supabase/migrations/003_create_note_recipients.sql`

### 4. Configure Resend Email Domain

Before emails will work, you need to verify a domain in Resend:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add and verify your domain
3. Update the `senderEmail` parameter in `/lib/email/send-note.ts` to use your verified domain

For testing, you can use Resend's free testing domain.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
