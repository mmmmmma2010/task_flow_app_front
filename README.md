# TaskFlow Frontend

React + Vite frontend for the **task_flow_app** Django REST backend.

## Stack

| Tech | Purpose |
|---|---|
| React 19 + Vite 7 | Framework & bundler |
| React Router v7 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| React Hook Form + Zod | Form handling & validation |
| React Hot Toast | Toast notifications |
| React Icons | UI icons |
| date-fns | Date formatting |
| CSS Modules | Scoped component styles |

## Project Structure

```
src/
├── api/
│   ├── client.js          # Axios instance + JWT interceptors (auto-refresh)
│   ├── auth.js            # Login API
│   └── tasks.js           # Tasks & Completed Tasks API
├── contexts/
│   └── AuthContext.jsx    # Auth state, login/logout
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx  # Stats cards + overdue tasks
│   ├── TaskListPage.jsx   # Filter, sort, paginate, bulk actions
│   ├── TaskDetailPage.jsx # Full task view, mark complete, delete
│   ├── TaskFormPage.jsx   # Create & edit form
│   └── CompletedTasksPage.jsx
├── components/
│   ├── common/
│   │   ├── LoadingSpinner
│   │   ├── StatusBadge    # Color-coded status pills
│   │   ├── PriorityBadge  # Priority indicators
│   │   ├── ConfirmModal   # Delete confirmation
│   │   └── EmptyState
│   └── layout/
│       ├── Navbar
│       ├── Layout
│       └── ProtectedRoute
└── utils/
    └── formatters.js      # Date formatting, labels, error extraction
```

## Quick Start

### 1. Prerequisites

- **Node.js ≥ 18** and **npm ≥ 9**
- The `task_flow_app` backend running at `http://localhost:8000`

### 2. Setup

```bash
cd task_flow_app_front

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API URL |

The Vite dev server proxies `/api/*` requests to `http://localhost:8000` automatically.

## Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## API Endpoints Used

| Endpoint | Usage |
|---|---|
| `POST /api/token/` | Login (get JWT) |
| `POST /api/token/refresh/` | Auto-refresh access token |
| `GET/POST /api/tasks/` | List & create tasks |
| `GET/PATCH/DELETE /api/tasks/:id/` | Task detail, edit, delete |
| `POST /api/tasks/:id/complete/` | Mark task complete |
| `GET /api/tasks/statistics/` | Dashboard stats |
| `GET /api/tasks/overdue/` | Overdue tasks list |
| `GET /api/completed-tasks/` | All completed tasks |
| `GET /api/completed-tasks/recent/` | Recently completed |

## Features

- **JWT Authentication** — auto-refresh, persistent session
- **Dashboard** — stats cards (total, pending, overdue, completed), overdue task list
- **Task List** — filter by status/priority, search, sort, paginate
- **Task CRUD** — create, view, edit, delete with confirmation modal
- **Mark Complete** — one-click task completion
- **Completed Tasks** — all-time or last 7 days view
- **Toast notifications** — success/error feedback
- **Responsive** — works on mobile and desktop
- **Dark theme** — modern dark UI with Inter font
