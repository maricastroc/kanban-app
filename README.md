# Kanban Task Management

![banner](https://github.com/user-attachments/assets/6876f831-7719-4f52-bf24-3e84eb236bea)

A fullstack Kanban board for daily task management — organize work across multiple boards, columns and tasks, with drag-and-drop, subtasks, color labels, due dates and light/dark themes.

This repository is the **frontend** (Next.js). It talks to a separate **Laravel API** ([kanban-api](https://github.com/maricastroc/kanban-api)) over HTTP, with authentication handled by a secure **httpOnly session cookie**.

🔗 **Live demo:** [kanban.marianacastro.dev](https://kanban.marianacastro.dev/)

---

## ✨ Features

**Boards & workflow**
- Create, edit and delete boards, and switch the active board
- Customize each board's workflow columns — add, rename and remove (up to 6)
- Each board gets a deterministic accent color for quick visual identity

**Tasks**
- Create, edit and delete tasks with title, description and due date
- Subtasks: add, remove, toggle completion and reorder (animated)
- Due-date status badges (overdue / due soon / completed), derived from the date and subtask progress
- Drag and drop to move tasks across columns or reorder within a column, with optimistic updates

**Labels**
- Create, edit and delete color-coded labels, with per-board usage counts
- Assign multiple labels to a task

**Productivity**
- Search tasks, filter by label, and sort (manual / due date / name)
- Keyboard shortcuts: `/` focuses search, `⌘/Ctrl + ↵` submits a task form, `Esc` closes menus/dialogs

**Experience**
- Responsive layout with a collapsible sidebar and a mobile "boards" sheet
- Light / dark theme toggle (persisted)
- Client-side form validation on every create/edit flow (Zod)

**Auth**
- Register, login and logout, with route guards
- Session stored in an **httpOnly cookie** that JavaScript can't read — see [Authentication](#-authentication)

---

## 🧱 Tech Stack

**Frontend (this repo)**
- [Next.js 14](https://nextjs.org/) (Pages Router) · [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [styled-components](https://styled-components.com/) for styling and theming
- [SWR](https://swr.vercel.app/) + [Axios](https://axios-http.com/) for data fetching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms and validation
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) (drag & drop) + [Framer Motion](https://www.framer.com/motion/) (subtask reorder)
- [Radix UI](https://www.radix-ui.com/) primitives (dialog, select, switch) + [Font Awesome](https://fontawesome.com/)
- [react-hot-toast](https://react-hot-toast.com/) for notifications
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- ESLint + Prettier

**Backend ([kanban-api](https://github.com/maricastroc/kanban-api))**
- [Laravel 12](https://laravel.com/) + [Sanctum](https://laravel.com/docs/sanctum), on PostgreSQL
- Deployed on Railway (`api.marianacastro.dev`)

---

## 🏛️ Architecture

The app is split into two deployments:

```
Browser ──> kanban.marianacastro.dev   (Next.js · Vercel)        ← this repo
   │
   └── XHR (withCredentials) ──> api.marianacastro.dev   (Laravel · Railway)   ← kanban-api
```

The API is served from a **subdomain of the frontend's domain**, so both are *same-site*. That lets the auth cookie use `SameSite=Lax` and stay reliable across browsers (Safari included).

### 🔐 Authentication

Auth uses a **Sanctum token carried in an httpOnly cookie** — the token is never exposed to JavaScript, which mitigates token theft via XSS.

1. On **login/register**, the API issues a Sanctum token and sets it as an `httpOnly` cookie (`SameSite=Lax`, `Secure` in production).
2. On every request, Axios sends the cookie (`withCredentials: true`); a backend middleware promotes it to an `Authorization: Bearer` header so Sanctum authenticates it transparently.
3. The frontend never reads the token. It determines whether it's authenticated by probing `GET /user` through the `useAuthUser` hook (consumed by the route guards and the boards context).
4. **Logout** calls the API, which clears the cookie.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js 22+](https://nodejs.org/) and npm
- The **API must be running** — authenticated features need the backend. Run [kanban-api](https://github.com/maricastroc/kanban-api) locally, or point at the deployed API.

> ⚠️ Because auth is a `SameSite=Lax` cookie, a frontend on `localhost` **cannot** authenticate against the production API at `api.marianacastro.dev` (that's cross-site, so the cookie isn't sent). For authenticated local development, run the API locally too — see the note in [kanban-api](https://github.com/maricastroc/kanban-api).

### 1. Clone & install
```bash
git clone https://github.com/maricastroc/kanban-app
cd kanban-app
npm install
```

### 2. Configure the environment
Copy the example file and adjust the API URL:
```bash
cp .env.example .env.local
```
```bash
# .env.local — point at your local API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
```

### 3. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

Unit and component tests with Vitest + Testing Library.

```bash
npm test            # run the suite once
npm run test:watch  # watch mode
npm run test:coverage
```

---

## ⚙️ Continuous Integration

A GitHub Actions workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every pull request and push to `main`:

- **Lint** — `npm run lint`
- **Test** — `npm test`
- **Build** — `npm run build`

It runs on Node 22, and older runs for the same branch are auto-cancelled.

---

## 📦 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

---

## 📝 What I learned

This project started from the Frontend Mentor Kanban challenge and grew into a decoupled fullstack app. Highlights:

- Designing a **decoupled SPA + REST API** (Next.js ↔ Laravel/Sanctum) and handling the cross-origin concerns that come with it (CORS, credentials, cookies).
- Migrating auth from a **localStorage token to an httpOnly cookie** for XSS safety — including the same-site subdomain setup that makes a `SameSite=Lax` cookie work across Vercel + Railway.
- Implementing optimistic **drag-and-drop** for moving tasks across columns and reordering within a column.
- Orchestrating complex state with React Context + SWR while keeping the UI in sync with the API.
- Setting up **Vitest + Testing Library** and a **CI pipeline** (lint + test + build) on pull requests.
- A sizeable refactor pass: extracting reusable hooks and components, removing dead code and de-duplicating the codebase.
