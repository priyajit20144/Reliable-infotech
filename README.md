# Reliable Info Tech — Full-Stack Digital Agency Platform

A modern, high-performance web agency and custom software commissioning platform built with **React**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS with custom glassmorphism & dark-mode design system
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend (`/server`)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs password hashing
- **Security & Utilities**: CORS, dotenv, cookie-parser

---

## 📁 Repository Structure

```
horizon/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # UI components (admin, client, common, layout)
│   │   ├── pages/          # Application views (landing, dashboard, admin, etc.)
│   │   ├── context/        # React contexts (Auth, Notifications)
│   │   ├── services/       # API integration services (Axios/fetch)
│   │   └── types/          # TypeScript interfaces and shared types
│   ├── index.html
│   └── package.json
├── server/                 # Express REST API backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose schemas & data models
│   │   ├── routes/         # Express API routes
│   │   ├── middleware/     # Auth, error handling, validation middleware
│   │   ├── seed/           # Initial database seeder
│   │   └── server.ts       # Server entry point
│   └── package.json
├── scripts/                # Helper scripts (port cleanup, etc.)
├── .env.example            # Environment variables template
├── package.json            # Monorepo / root orchestration scripts
└── README.md
```

---

## 🚀 Getting Started (Collaborator Quickstart)

### 1. Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9+ recommended)
- **MongoDB** (Atlas cloud cluster or local MongoDB instance)

### 2. Clone the Repository
```bash
git clone git@github.com:<username>/<repo-name>.git
cd <repo-name>
```

### 3. Install All Dependencies
Install root, client, and server dependencies with a single command:
```bash
npm run install:all
```
*(Or install each separately: `npm install`, `cd client && npm install`, `cd ../server && npm install`)*

### 4. Configure Environment Variables
Copy `.env.example` to `.env` in the root (and in `server/.env`):
```bash
cp .env.example .env
cp .env.example server/.env
```
Fill in your `MONGODB_URI` and `JWT_SECRET` in `.env`.

### 5. Launch the Development Environment
Run both backend API (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

---

## 🔑 Demo Seed Accounts

When the backend connects to MongoDB, default seed accounts are populated:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@reliableinfotech.io` | `Admin@123456` |
| **Client / User** | `client@reliableinfotech.io` | `Client@123456` |
| **Team Member** | `team@reliableinfotech.io` | `Team@123456` |

---

## 📜 Available NPM Scripts

- `npm run dev`: Runs server (`:5000`) and client (`:5173`) concurrently in watch mode.
- `npm run dev:client`: Runs Vite frontend dev server only.
- `npm run dev:server`: Runs Express backend with `tsx watch` only.
- `npm run build`: Compiles TypeScript and builds production bundles for both client and server.
- `npm run clean:ports`: Frees up ports 5000 and 5173 if blocked.

---

## 🤝 Collaborative Git Workflow

1. Always pull latest changes before starting work:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit with descriptive conventional commit messages:
   ```bash
   git commit -m "feat: add client proposal export to pdf"
   ```
4. Push your branch and open a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```
