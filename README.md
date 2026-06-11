# Bright Abodes

A community-driven social hub for renters everywhere, providing real-time apartment reviews, short-form video tours, and local insights.

## Project Structure

- `web/`: Frontend application built with React, Vite, and Tailwind CSS.
- `api/`: Backend API built with Fastify, Drizzle ORM, and libSQL (Turso).

## Setup Instructions

### Frontend (web)

1. Navigate to the `web` directory: `cd web`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend (api)

1. Navigate to the `api` directory: `cd api`
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Generate migrations: `npx drizzle-kit generate`
5. Apply migrations: `npx drizzle-kit push`
6. Start the development server: `npm run dev` (once script is added)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, TanStack Query, Zustand.
- **Backend:** Fastify, Drizzle ORM, libSQL (Turso).
- **Video:** Mux.
- **Auth:** Clerk.
