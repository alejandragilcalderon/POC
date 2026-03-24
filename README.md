# POC — NASA APOD & Mars weather

This repository is a small full-stack **NASA** demo: a **Next.js backend** that proxies NASA’s public APIs, and an **Expo / React Native client** that consumes that backend over HTTP. Both apps follow **clean / hexagonal** layering, adapted to each platform.

## Repository layout

| Folder | Description |
|--------|-------------|
| `apod-backend/` | Next.js API — proxies APOD & InSight Mars Weather, health check, API reference page |
| `apod-mobile/` | Expo app — APOD & Mars weather tabs, talks to the backend via `EXPO_PUBLIC_API_BASE_URL` |

---

## `apod-backend` (Next.js API)

**Purpose:** Server-side proxy for **NASA APOD** and **InSight Mars Weather**, plus a simple **health** endpoint and a minimal **HTML API reference** page.

### Stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Vitest** for unit tests, **ESLint** (`eslint-config-next`)
- **`server-only`** so server secrets and gateways are not pulled into client bundles
- **`dotenv`** in `scripts/verify-env.mjs` so builds/dev fail fast if **`NASA_APOD_API_KEY`** is missing

### Patterns & practices

- **Clean architecture–style layering**
  - **Domain:** entities/value types (e.g. `ApodQuery`), **ports** (gateway interfaces), shared **`UpstreamHttpError`**
  - **Application:** **use cases** (`GetApodUseCase`, `GetInsightWeatherUseCase`, `GetHealthUseCase`) — orchestration only
  - **Infrastructure:** NASA HTTP **gateway** classes implementing those ports
  - **Adapters:** HTTP-specific parsing (e.g. **`parseApodQueryParams`** from URL search params)
  - **Composition root:** **`createAppContainer()`** wires gateways → use cases for NASA-backed routes
- **Dependency rule:** domain does not depend on frameworks; routes depend on use cases, not on `fetch` details
- **Security:** API keys only on the server (`NASA_APOD_API_KEY`); clients must not pass `api_key`; verification runs before **`next dev` / `next build` / `next start`**
- **Health route** uses **`GetHealthUseCase` only** (no NASA wiring) so liveness stays cheap and does not depend on NASA keys
- **Testing:** route tests **mock the composition root** or **spy** application helpers; gateway tests use **injected `fetch`**
- **Ops:** **`npm run dev:mobile`** binds **`0.0.0.0:3000`** so physical devices on the LAN can reach the API

---

## `apod-mobile` (Expo)

**Purpose:** Mobile UI for **NASA APOD** and **Mars (InSight) weather**, consuming the backend’s REST JSON.

### Stack

- **Expo SDK ~55**, **Expo Router** (file-based tabs), **React Native**, **React 19**
- **TypeScript**, **Jest** + **jest-expo** + **Testing Library React Native**
- **ESLint** via **`expo lint`**
- **Gesture Handler**, **Safe Area**, **Screens** for navigation UX
- **`@expo/vector-icons` (Ionicons)** for tab icons

### Patterns & practices

- **Feature modules** under `src/modules/*` (e.g. `apod`, `insight-weather`), each with:
  - **Domain:** entities, **repository ports**
  - **Application:** **use cases** (e.g. `GetApodUseCase`, `GetInsightWeatherUseCase`)
  - **Data:** **remote datasources**, **mappers** (DTO → domain), **repository implementations**
  - **Presentation:** **screens**, **widgets**, **hooks**, shared UI components
- **Composition root:** **`createAppDependencies()`** builds **`HttpClientImpl` → datasources → repositories → use cases**
- **React DI:** **`AppContainerProvider`** + **`useAppDependencies()`** expose use cases to the tree (single composition per app lifetime via **`useMemo`**)
- **`Result<T, E>`** (`ok` / `fail`) for **explicit success/failure** in the domain/application style (documented as avoiding throw-based control flow in domain logic where used)
- **HTTP:** **`IHttpClient`** + **`HttpClientImpl`** (thin **`fetch`** wrapper); **`ApiError`** for non-OK responses
- **Config:** **`EXPO_PUBLIC_API_BASE_URL`** validated at runtime via **`getApiBaseUrl()`** (fail fast if unset)
- **Shared UI:** theme **colors**, **spacing**, reusable components (**loading**, **errors**, **screen surface**), **`format-api-error`** for user-facing messages
- **Tests:** unit tests for use cases, repositories, mappers, datasources, hooks/widgets, and **`Result`**

---

## How the projects fit together

| Concern | Backend | Mobile |
|--------|---------|--------|
| NASA access | Server holds **API key**; proxies **GET `/api/apod`**, **GET `/api/insight-weather`** | Calls backend paths only; **no secrets** in the app |
| Architecture | Domain / application / infrastructure / adapters + **Next routes** | Feature modules + **core** HTTP/DI + **Expo Router** UI |
| Composition | **`createAppContainer()`** | **`createAppDependencies()`** + **React context** |
| Testing | Vitest | Jest + RTL Native |

Together they demonstrate **layered boundaries**, **ports and adapters**, **a single composition root per app**, **typed HTTP**, **environment validation**, and **automated tests** at use-case and infrastructure boundaries—aligned with common **clean architecture** and **mobile best practices** without unnecessary framework lock-in at the domain level.

---

## Quick start (outline)

**Backend** (`apod-backend/`): set `NASA_APOD_API_KEY` in `.env.local`, then e.g. `npm install` and `npm run dev` or `npm run dev:mobile` for LAN access.

**Mobile** (`apod-mobile/`): set `EXPO_PUBLIC_API_BASE_URL` to your machine’s reachable base URL (e.g. `http://<LAN-IP>:3000`), then `npm install` and `npx expo start`.

See each project’s `package.json` scripts for **lint** and **test** commands.
