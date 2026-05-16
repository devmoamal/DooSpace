# DooSpace — Developer Reference

> **DooSpace** is a high-performance orchestration platform for building, testing, and scaling serverless TypeScript functions called **Doos**. Think of it as a self-hosted function-as-a-service platform with a built-in playground, persistence layer, secrets vault, and inter-function communication bus — all powered by Bun.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Technology Stack](#4-technology-stack)
5. [Doo Runtime — Full Reference](#5-doo-runtime--full-reference)
6. [Key Features](#6-key-features)
7. [API Routes](#7-api-routes)
8. [Getting Started](#8-getting-started)
9. [Writing a Doo](#9-writing-a-doo)

---

## 1. Project Overview

DooSpace lets you write small TypeScript units (Doos), deploy them instantly, and invoke them via HTTP — without managing servers, build pipelines, or deployments. The platform handles:

- **Transpilation** — Bun converts your TypeScript to runnable JS on every request.
- **Sandboxing** — Each Doo runs in an isolated `new Function()` scope; it cannot access the host filesystem or network arbitrarily.
- **Persistence** — Each Doo gets its own namespaced key-value store (`doobox`) backed by PostgreSQL.
- **Secrets** — API keys and credentials are stored encrypted and injected into the sandbox at runtime. Values are **never** returned by the API.
- **Inter-Doo Communication** — Doos can call each other directly using `callDoo` without going through HTTP.
- **Loops** — Scheduled or event-driven execution chains for orchestrating multi-step workflows.

---

## 2. Architecture

DooSpace is a **Bun Monorepo** with three workspaces:

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│            React + Vite + TanStack (client/)            │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST
┌───────────────────────▼─────────────────────────────────┐
│                   Hono API Server                        │
│                    (server/)                            │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Routes    │  │   Services   │  │  Repositories │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                │                   │          │
│  ┌──────▼────────────────▼───────────────────▼───────┐  │
│  │              Doo Runtime Engine                    │  │
│  │   executor.ts → context.ts → doobox.ts            │  │
│  │                            → secrets.ts           │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                │
│              ┌─────────▼──────────┐                     │
│              │    PostgreSQL DB    │                     │
│              │  (Drizzle ORM)     │                     │
│              └────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Folder Structure

```
DooSpace/
├── GEMINI.md                    # ← You are here. AI developer guide.
├── DOO_GUIDE.md                 # Quick-start guide for writing Doos
├── README.md                    # Public-facing readme
├── package.json                 # Bun monorepo workspace root
├── tsconfig.json                # Root TypeScript config (path aliases)
├── bun.lock                     # Bun lockfile
│
├── shared/                      # Shared types, DTOs, enums
│   └── src/
│       ├── types/               # Core TypeScript interfaces
│       └── index.ts             # Barrel export
│
├── server/                      # Hono API server (Bun)
│   ├── src/
│   │   ├── index.ts             # Server entry point, Hono app bootstrap
│   │   ├── app/                 # App-level setup (CORS, middleware wiring)
│   │   ├── config/              # Environment config (env vars, constants)
│   │   ├── context/             # Hono request context types
│   │   ├── db/                  # Drizzle ORM client + schema definitions
│   │   ├── lib/
│   │   │   ├── parser.ts        # Regex engine: discovers endpoints in Doo source
│   │   │   ├── error.ts         # Centralized error classes
│   │   │   ├── jwt.ts           # JWT sign/verify helpers
│   │   │   ├── logger.ts        # Structured logging utility
│   │   │   ├── response.ts      # Typed response helpers
│   │   │   └── types/           # Shared lib types
│   │   ├── middlewares/         # Auth, error-handling Hono middleware
│   │   ├── repositories/        # Data-access layer (Drizzle queries)
│   │   │   ├── doo.repository.ts
│   │   │   ├── doobox.repository.ts
│   │   │   ├── loop.repository.ts
│   │   │   ├── loop_logs.repository.ts
│   │   │   ├── page.repository.ts
│   │   │   ├── request.repository.ts
│   │   │   ├── secrets.repository.ts
│   │   │   ├── settings.repository.ts
│   │   │   └── user.repository.ts
│   │   ├── routes/              # Hono route handlers
│   │   │   ├── index.ts         # Route aggregator
│   │   │   ├── ai.route.ts      # AI-powered Doo generation
│   │   │   ├── auth.route.ts    # Login / session
│   │   │   ├── doos.route.ts    # CRUD for Doos
│   │   │   ├── doobox.route.ts  # DooBox key-value API
│   │   │   ├── loop.route.ts    # Loop scheduling and management
│   │   │   ├── overview.route.ts
│   │   │   ├── pages.route.ts   # Custom Doo-rendered pages
│   │   │   ├── requests.route.ts # Request history
│   │   │   ├── secrets.route.ts
│   │   │   └── settings.route.ts
│   │   ├── runtime/             # ★ THE DOO EXECUTION ENGINE ★
│   │   │   ├── executor.ts      # Entry point: transpile + sandbox + run
│   │   │   ├── context.ts       # Doo class: routing, logging, response helpers
│   │   │   ├── doobox.ts        # DooBox class: persistent KV store
│   │   │   ├── secrets.ts       # DooSecrets class: read-only secret proxy
│   │   │   └── canvas.ts        # Trace/pixel canvas rendering
│   │   ├── scripts/             # One-off utility scripts (migrations, seeds)
│   │   ├── services/            # Business logic layer
│   │   │   ├── ai.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── doo.service.ts
│   │   │   ├── doobox.service.ts
│   │   │   ├── execution.service.ts
│   │   │   ├── loop.service.ts
│   │   │   ├── overview.service.ts
│   │   │   ├── page.service.ts
│   │   │   ├── request.service.ts
│   │   │   ├── secrets.service.ts
│   │   │   └── settings.service.ts
│   │   ├── utils/               # Pure utility functions
│   │   └── workers/             # Background workers (loop execution, etc.)
│   ├── drizzle/                 # Drizzle migration files
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── client/                      # React frontend (Vite + Tailwind v4)
    ├── index.html
    ├── vite.config.ts
    ├── src/
    │   ├── main.tsx             # React root + TanStack Router init
    │   ├── App.tsx
    │   ├── router.ts            # Router instance creation
    │   ├── routeTree.gen.ts     # Auto-generated by TanStack Router
    │   ├── routes/              # File-based route definitions
    │   ├── pages/               # Page-level React components
    │   ├── components/
    │   │   ├── ai/              # AI code generation UI
    │   │   ├── dashboard/       # Dashboard widgets and stats
    │   │   ├── doobox/          # DooBox inspector & SQL console
    │   │   ├── editor/          # Monaco-based code editor
    │   │   ├── layout/          # Sidebar, navigation, shell
    │   │   ├── loops/           # Loop configuration UI
    │   │   ├── playground/      # ★ HTTP testing UI, request panels
    │   │   ├── requests/        # Request history viewer
    │   │   ├── settings/        # User settings panels
    │   │   ├── studio/          # Doo creation/editing studio
    │   │   └── ui/              # Reusable primitive components
    │   ├── hooks/
    │   │   └── queries/         # TanStack Query hooks (one file per resource)
    │   ├── services/            # API client functions (fetch wrappers)
    │   ├── stores/              # Zustand or similar state stores
    │   ├── constants/           # App-wide constants
    │   ├── lib/                 # Client-side utility libraries
    │   ├── templates/           # Starter Doo code templates
    │   └── utils/               # Pure client utility functions
    └── tsconfig.json
```

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **[Bun](https://bun.sh/)** | JS/TS runtime, transpiler, package manager |
| Backend | **[Hono](https://hono.dev/)** | Lightweight, edge-ready API framework |
| ORM | **[Drizzle ORM](https://orm.drizzle.team/)** | Type-safe SQL query builder |
| Database | **PostgreSQL** | Primary store for Doos, DooBox, logs, users |
| Frontend | **React + Vite** | UI framework and build tool |
| Styling | **Tailwind CSS v4** | Next-gen utility-first CSS |
| Routing | **TanStack Router** | Fully type-safe client-side routing |
| Data Fetching | **TanStack Query** | Server-state management and caching |

---

## 5. Doo Runtime — Full Reference

The runtime is the heart of DooSpace. It lives in `server/src/runtime/` and consists of four modules.

### 5.1 Execution Pipeline (`executor.ts`)

When a Doo is invoked, the pipeline runs in this order:

```
HTTP Request
    │
    ▼
[1] Bun.Transpiler          TypeScript → JavaScript (ES modules)
    │
    ▼
[2] ESM → CJS Transform     Regex rewrite: import {} → const {} = require()
    │
    ▼
[3] Sandbox Construction    Build Doo, DooBox, DooSecrets, DooCallClient
    │
    ▼
[4] new Function() Wrapper  Isolated scope; only Web APIs + doospace globals
    │
    ▼
[5] dooFunction(doo)        Register user routes onto the Doo instance
    │
    ▼
[6] doo.run(method, path)   Match route regex, parse body/query, call handler
    │
    ▼
Response + Logs + Trace Pixels
```

**Key export:**
```typescript
executeDoo(dooId, code, method, path, originalRequest, secretsMap)
  → { response, duration, logs, pixels }
```

**Inter-Doo calls (`executeDooById`):**
```typescript
executeDooById(dooId, method, path, { body?, headers? })
  → any  // parsed JSON or raw text
```

### 5.2 The `Doo` Class (`context.ts`)

The `Doo` class is the orchestration driver passed to every Doo function. It manages:

- **Route registration** via `doo.get/post/put/delete/all`
- **Path parameter parsing** using regex with named capture groups (`/:id` → `params.id`)
- **Query string parsing** (auto-coerced to numbers/booleans)
- **Body parsing** — JSON for POST/PUT, query-params mapped to body for GET/DELETE
- **Logging** via `doo.log()` and `doo.error()`
- **Response helpers** — `doo.json()` and `doo.text()`
- **Trace pixels** — a flat array of color strings for visualizing execution in the UI

**Available methods inside a Doo:**

| Method | Signature | Description |
|---|---|---|
| `doo.get` | `(path, handler)` | Register a GET route |
| `doo.post` | `(path, handler)` | Register a POST route |
| `doo.put` | `(path, handler)` | Register a PUT route |
| `doo.delete` | `(path, handler)` | Register a DELETE route |
| `doo.all` | `(path, handler)` | Match any HTTP method |
| `doo.log` | `(message: any)` | Emit a timestamped log line |
| `doo.error` | `(message: any)` | Emit a timestamped error line |
| `doo.json` | `(data, status?)` | Return a JSON `Response` |
| `doo.text` | `(data, status?)` | Return a plain-text `Response` |

**Request object (`DooRequest<T>`):**

```typescript
interface DooRequest<T = any> {
  url:     string;
  method:  string;
  headers: Headers;
  params:  Record<string, string>;   // URL path params  e.g. /:id
  query:   Record<string, string>;   // Query string     e.g. ?page=1
  body:    T;                        // Parsed JSON body (or query for GET)
}
```

### 5.3 DooBox (`doobox.ts`)

A namespaced, per-Doo key-value store backed by PostgreSQL. Values are stored as text (JSON-serialized automatically).

```typescript
// Import in your Doo:
import { doobox } from "doospace";

await doobox.get<T>(key)                       // → T | null
await doobox.set(key, value, ttlSeconds?)      // → void  (JSON-serialized)
await doobox.delete(key)                       // → boolean
await doobox.list()                            // → { key, value, expireAt }[]
await doobox.clear()                           // → void  (wipe all keys)
```

> **TTL support:** pass `ttlSeconds` to auto-expire entries. Expired entries are filtered at read time.

### 5.4 DooSecrets (`secrets.ts`)

Secrets are pre-loaded from the database at invocation time and injected as a frozen, read-only proxy. Values are **never** logged or returned by any API endpoint.

```typescript
// Import in your Doo:
import { secrets } from "doospace";

// Property-style access (recommended):
const token = secrets.MY_API_KEY;   // → string | undefined

// Method-style access:
secrets.get("MY_API_KEY");          // → string | undefined
secrets.keys();                     // → string[]  (names only, no values)
```

### 5.5 `callDoo` — Inter-Doo Communication

Call any other Doo directly without going through HTTP. The callee Doo is fetched from the database, its secrets are loaded, and it is executed in a fresh sandbox.

```typescript
import { callDoo } from "doospace";

const result = await callDoo.get(dooId, "/path");
const result = await callDoo.post(dooId, "/path", body);
const result = await callDoo.put(dooId, "/path", body);
const result = await callDoo.delete(dooId, "/path");
const result = await callDoo.patch(dooId, "/path", body);
```

### 5.6 Trace Pixels

Every runtime event appends a color token to `doo.trace[]`. The UI renders this as a pixel strip showing execution anatomy at a glance.

| Color | Event |
|---|---|
| `"log"` | `doo.log()` called (yellow) |
| `"error"` | `doo.error()` or uncaught error (red) |
| `"db"` | DooBox read or write (amber) |
| `"fetch"` | External HTTP fetch (blue) |
| `"call"` | `callDoo` inter-Doo invocation (green) |
| `"brand"` | `callDoo` client trace (brand color) |
| `"purple"` | Custom/reserved (purple) |

### 5.7 Sandbox Constraints

The sandbox is a strict `new Function()` scope. The following **are available**:

- `globalThis.fetch`, `Headers`, `Request`, `Response` — full Web Fetch API
- `doobox`, `secrets`, `callDoo` — DooSpace drivers
- `doo` — orchestration instance
- `require("doospace")` — resolves to the above drivers

The following are **not available** and will throw:

- `require("any-other-package")` — no NPM imports
- `process`, `Bun`, `fs`, `path` — no Node/Bun globals
- Any network access outside `fetch` (e.g. raw sockets)

---

## 6. Key Features

### Doo Orchestration
- Write TypeScript — Bun transpiles on every invocation, no build step needed.
- Endpoints auto-discovered from source via the regex parser (`lib/parser.ts`).
- Full REST support: GET, POST, PUT, DELETE, PATCH.

### DooBox (Persistence)
- Per-Doo namespaced KV store backed by PostgreSQL.
- Optional TTL for ephemeral state.
- Inspect and query data via the **SQL Console** in the dashboard.

### Secrets Management
- Write-only vault — once saved, values are never returned by the API.
- Injected into the sandbox at execution time as a frozen proxy.

### Loops (Scheduled Orchestration)
- Define execution chains that invoke Doos on a schedule or in sequence.
- Logs and history stored in `loop_logs` table.

### Pages (Doo-Rendered HTML)
- Doos can return HTML pages served at custom routes.

### Interactive Playground
- Auto-generated request panels for every discovered endpoint.
- Real-time log streaming and response inspection.
- Trace pixel strip showing execution anatomy.

### AI Code Generation
- Built-in AI assistant (`ai.route.ts` / `ai.service.ts`) for scaffolding Doo code.

---

## 7. API Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user |
| `GET` | `/api/doos` | List all Doos |
| `POST` | `/api/doos` | Create a new Doo |
| `GET` | `/api/doos/:id` | Get a Doo by ID |
| `PUT` | `/api/doos/:id` | Update a Doo |
| `DELETE` | `/api/doos/:id` | Delete a Doo |
| `POST` | `/api/doos/:id/execute` | Execute a Doo endpoint |
| `GET` | `/api/doobox/:dooId` | List DooBox keys |
| `GET` | `/api/doobox/:dooId/:key` | Get a DooBox value |
| `POST` | `/api/secrets` | Create/update a secret |
| `DELETE` | `/api/secrets/:name` | Delete a secret |
| `GET` | `/api/loops` | List loops |
| `POST` | `/api/loops` | Create a loop |
| `GET` | `/api/overview` | Dashboard stats |
| `POST` | `/api/ai/generate` | AI Doo generation |

---

## 8. Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- PostgreSQL database

### Setup

```bash
# 1. Install all workspace dependencies
bun install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your DATABASE_URL, JWT_SECRET, etc.

# 3. Run database migrations
cd server && bun run db:migrate

# 4. Start development servers (in separate terminals)
bun run dev:server   # → http://localhost:3000
bun run dev:client   # → http://localhost:5173
```

### Environment Variables (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `PORT` | ❌ | Server port (default: 3000) |
| `GEMINI_API_KEY` | ❌ | Google Gemini key for AI features |

---

## 9. Writing a Doo

See **[DOO_GUIDE.md](./DOO_GUIDE.md)** for the full authoring guide with examples.

**Minimal Doo:**

```typescript
export default function (doo: Doo) {
  doo.get("/", async (req) => {
    return { ok: true, message: "Hello from DooSpace!" };
  });
}
```

**With persistence and secrets:**

```typescript
import { doobox, secrets, callDoo } from "doospace";

export default function (doo: Doo) {
  doo.post("/process", async (req) => {
    const body = await req.json();

    // Persist state
    await doobox.set("last_payload", body);

    // Use a secret
    const apiKey = secrets.EXTERNAL_API_KEY;

    // Chain to another Doo
    const result = await callDoo.post(42, "/analyze", body);

    return { processed: true, result };
  });
}
```

**Rules:**
- Always `export default function (doo: Doo) { ... }`.
- Only import from `"doospace"`. No NPM packages.
- Use `doo.get/post/put/delete/all` inside the default function.
- Return plain objects (auto-JSON) or `doo.json()` / `doo.text()` / `new Response()`.
