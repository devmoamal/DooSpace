# DooSpace: The Modern Orchestration Platform

DooSpace is a high-performance orchestration platform designed for building, testing, and scaling serverless-style "Doo" units. It combines a fast developer playground with a robust runtime environment powered by Bun.

---

## 🏗 Architecture & Workspace

DooSpace is built as a **Bun Monorepo** ensuring seamless integration between the frontend and backend.

- **`client/`**: A high-fidelity React application built with Vite and Tailwind CSS 4. It features a custom editor, real-time playground, and data inspection tools.
- **`server/`**: A high-speed Hono backend running on Bun. It handles script transpilation, secret management, and secure execution.
- **`shared/`**: Common DTOs, TypeScript interfaces, and validation logic shared across the stack.

---

## 🛠 Technology Stack

### Core Runtime
- **[Bun](https://bun.sh/)**: powers the entire stack—from the development server to the script execution engine. It provides native transpilation and high-performance I/O.

### Backend
- **[Hono](https://hono.dev/)**: A fast, lightweight web framework used for the API gateway.
- **[Drizzle ORM](https://orm.drizzle.team/)**: A TypeScript-first ORM providing type-safe database interactions.
- **PostgreSQL**: The primary data store for Doos, logs, and user data.

### Frontend
- **React & Vite**: Modern bundling and UI framework.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utilizing next-gen styling tokens and performance-optimized CSS.
- **TanStack Router**: Providing full type-safe navigation and route management.
- **TanStack Query**: Efficient server-state management and real-time UI updates.

---

## 🚀 Key Features

### 1. Doo Orchestration
Scripts are written in TypeScript and executed in a secure sandbox.
- **Automatic Discovery**: Endpoints are automatically parsed from your `doo.get/post` calls.
- **Hot Reloading**: Changes in the playground are instantly available for testing.

### 2. DooBox (Persistence)
Each Doo has access to `doobox`, a persistent key-value store optimized for orchestration state.
- Inspect and query your data directly using the **SQL Console** in the dashboard.

### 3. Secrets Management
Securely store API keys and sensitive credentials. 
- **Write-only Architecture**: Values are never returned by the API; they are only injected into the runtime environment at execution.

### 4. Interactive Playground
A developer-first environment for testing endpoints.
- Auto-generated request panels.
- Real-time logging and response inspection.
- Integrated schema documentation.

---

## 📂 Key Directories

- `server/src/runtime/`: The logic for transpiling and executing Doo scripts.
- `server/src/lib/parser.ts`: The regex-based engine that discovers API endpoints from source code.
- `client/src/components/playground/`: The core UI components for the editor and testing panels.
- `client/src/hooks/queries/`: All TanStack Query hooks for modular data fetching.

---

## 🚥 Getting Started

### Development
1. Install dependencies: `bun install`
2. Start the dev environment: `bun run dev:client` and `bun run dev:server`
3. Access the dashboard at `http://localhost:5173`
