# Expense Tracker

A full-stack expense tracking application with a beautiful dashboard featuring interactive graphs, charts, and analytics.

## Project Structure

```
expense-tracker/
├── frontend/                  (Next.js app)
│   ├── app/                   (Pages and routes)
│   ├── components/            (Reusable components)
│   ├── hooks/                 (Custom hooks)
│   ├── lib/                   (Utilities, API client, store)
│   └── public/                (Assets)
│
├── backend/                   (Express.js + Node)
│   ├── src/
│   │   ├── routes/           (API routes)
│   │   ├── controllers/      (Business logic)
│   │   ├── middleware/       (Auth, validation)
│   │   ├── services/         (Database queries)
│   │   ├── utils/            (Helpers)
│   │   ├── types/            (TypeScript types)
│   │   └── server.ts         (Entry point)
│   └── prisma/
│       └── schema.prisma     (Database schema)
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts
- **State**: Zustand
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- pnpm (recommended) or npm

### Setup

1. **Clone and install dependencies**
   ```bash
   pnpm install:all
   ```

2. **Configure environment variables**

   Backend (`backend/.env`):
   ```env
   DATABASE_URL="postgresql://<render-user>:<render-password>@<render-internal-host>/<db-name>"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="production"
   FRONTEND_URL="https://expense-tracker-frontend-pj0r.onrender.com"
   ```

   Frontend (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=https://expense-tracker-backend-nii9.onrender.com/api
   ```

   If you deploy both backend and database on Render, use the database service's internal connection string in the backend `DATABASE_URL`. Use the external database URL only from outside Render, such as local development or one-off tooling.

3. **Set Render environment variables**

   Backend service:
   - `DATABASE_URL` = Render internal database URL
   - `JWT_SECRET` = a strong secret
   - `JWT_EXPIRES_IN` = `7d` or your preferred value
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://expense-tracker-frontend-pj0r.onrender.com`

   Frontend service:
   - `NEXT_PUBLIC_API_URL` = `https://expense-tracker-backend-nii9.onrender.com/api`

4. **Setup database**
   ```bash
   pnpm db:push
   ```

5. **Run development servers**
   ```bash
   # Run both frontend and backend
   pnpm dev:all

   # Or run separately
   pnpm dev          # Frontend (port 3000)
   pnpm dev:backend  # Backend (port 5000)
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (protected)

### Expenses
- `GET /api/expenses` - List expenses with filters
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats` - Get expense statistics

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/stats` - Categories with stats
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Features

- **User Authentication**: Secure JWT-based auth with password hashing
- **Expense Management**: Full CRUD with filtering and pagination
- **Interactive Dashboard**: Real-time analytics with multiple chart types
- **Category Management**: Pre-defined categories with icons
- **Monthly Reports**: Breakdown and comparison views
- **Responsive Design**: Mobile, tablet, and desktop support

## Scripts

```bash
# Root
pnpm dev          # Run frontend
pnpm dev:backend  # Run backend
pnpm dev:all      # Run both
pnpm build        # Build frontend
pnpm db:push      # Push Prisma schema
pnpm db:migrate   # Run migrations
```
