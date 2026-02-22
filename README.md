# Personal Finance Tracker - Frontend

This is the frontend for a personal finance tracking application built with Next.js, React Query, Tailwind CSS, and TypeScript. It allows users to manage accounts, transactions, budgets, categories, and view dashboards.

## Features
- User authentication (login/register)
- Dashboard with stats, trends, and recent transactions
- Account management (create/update/delete)
- Transaction tracking (create/update/delete with filters)
- Category management
- Budget creation and alerts
- Profile settings
- Responsive UI with dark mode support
# Development mode (recommended - with ts-node-dev or nodemon)
npm run dev
# or
yarn dev
# or
pnpm dev
→ server starts on http://localhost:5000

# Build TypeScript → JavaScript
npm run build
# or
yarn build
# or
pnpm build

# Start production server (after build)
npm start
# or
yarn start
# or
pnpm start
→ server starts on http://localhost:5000
## Tech Stack
- **Framework**: Next.js (React-based)
- **State Management**: React Query (for data fetching/caching) + Zustand (for auth state)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Types**: TypeScript
- **Other**: Lucide icons, Recharts for charts, Zod for validation

## Architecture Overview
- **Pages/Routes**: Next.js App Router (`/app` directory) with protected routes via middleware.
  - Public: Home (`/`), Login (`/login`), Register (`/register`)
  - Protected: Dashboard (`/dashboard`), Accounts (`/accounts`), Transactions (`/transactions`), etc.
- **Components**: Reusable UI components in `/components` (e.g., Navbar, Sidebar, Cards).
- **Hooks**: Custom hooks in `/hooks` for data fetching (e.g., `useAccounts`, `useAuth` using React Query).
- **API Integration**: Axios in `/lib/axios.ts` with interceptors for auth tokens and error handling. Fetches from backend API.
- **State**: Auth state persisted with Zustand + cookies for tokens.
- **Layouts**: Root layout (`/app/layout.tsx`) with providers; Dashboard layout (`/app/dashboard/layout.tsx`) with sidebar/navbar.
- **Middleware**: `/middleware.ts` for auth protection (redirects unauth users to login).
- **Error Handling**: Global error boundaries and React Query error states.
- **Deployment**: Optimized for Vercel (static/SSR support).

The app follows a clean architecture: UI components → Hooks (business logic) → API layer.

## Setup Instructions
1. **Prerequisites**:
   - Node.js >= 18.x
   - Yarn or npm
   - Backend API running (see backend README for setup)

2. **Clone and Install**: