# ExpenseIQ Frontend

> Intelligent, production-grade personal finance SaaS web application built with Next.js App Router, React 19, Tailwind CSS v4, and offline-first transactional PWA architecture.

---

## 1. Overview & Key Capabilities

ExpenseIQ delivers a fast, responsive, and resilient financial management platform. It allows users to track expenses, manage budgets, configure financial goals, schedule recurring transactions, and inspect analytical reports with full offline resilience.

- **Offline-First Transaction Creation**: Queue transactions while disconnected; automatic background replay upon network restoration using Web Locks and BroadcastChannel synchronization.
- **Idempotency Guarantee**: Unique `clientRequestId` attached to offline items to prevent duplicate financial records.
- **Zero Financial Data in Service Worker**: Strict cache bypass rules ensure private financial API data is network-only.
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop with Dark/Light theme token support, keyboard navigation, and ARIA attributes.
- **Multi-Tab Coordination**: Web Locks serialize sync execution, while BroadcastChannel keeps UI queues synchronized across browser tabs without redundant sync calls.

---

## 2. Frontend Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.4 (App Router, Turbopack) | Server-driven rendering, routing, static optimization |
| **UI Runtime** | React 19.2.8 | Concurrent component model and transitions |
| **Styling** | Tailwind CSS v4 | Native CSS token-based design system |
| **State & Data Fetching** | TanStack Query v5 | Server state caching, targeted invalidation |
| **HTTP Client** | Axios | Normalized error handling, token refresh lifecycle |
| **Charts & Analytics** | Recharts (dynamic imports) | Financial visualizations with code-splitting |
| **Icons** | Lucide React | Lightweight vector iconography |
| **Offline Persistence** | Native IndexedDB (`idb` wrapper) | Isolated client-side transaction queues |
| **Multi-tab / Concurrency** | Web Locks API & BroadcastChannel | Exclusivity and tab-state synchronization |

---

## 3. Environment Variables

Configuration is handled via environment variables. Refer to `.env.example` for all configurable keys.

### Configuration Template (`.env.example`)

```env
# Backend REST API base URL (must point to /api endpoint)
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Optional: Allow unauthenticated demo mode (default: false)
NEXT_PUBLIC_ALLOW_UNAUTH=false
```

### Setup Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Update `NEXT_PUBLIC_API_URL` to match your backend API instance.
3. In production environments (Vercel, AWS Amplify, Docker, Railway), configure `NEXT_PUBLIC_API_URL` within the platform's environment settings.

> **Security Rule**: Only variables prefixed with `NEXT_PUBLIC_` are bundled to client browsers. Never place secrets, private certificates, or database credentials in frontend environment files.

---

## 4. Development & Production Commands

### Prerequisites

- Node.js: `>= 20.0.0`
- Package Manager: `npm` (bundled with Node)

### Installation

```bash
npm install
```

### Local Development Server

```bash
npm run dev
```
Starts Next.js development server at `http://localhost:3000`.

### Production Build

```bash
npm run build
```
Creates an optimized production bundle using Turbopack with strict TypeScript compilation and route static generation.

### Run Production Server Locally

```bash
npm run start
```
Launches the built application locally on port 3000.

### Code Quality & Linting

```bash
npm run lint
```
Runs ESLint against all source files adhering to Next.js Core Web Vitals and TypeScript rules.

---

## 5. Automated Regression Test Suite

ExpenseIQ includes focused regression suites verifying offline queues, sync engines, multi-tab coordination, UX status, and performance guarantees:

| Script | Command | Coverage Area |
| :--- | :--- | :--- |
| **IndexedDB Store** | `npm run test:idb` | IndexedDB lifecycle, schemas, user queue isolation, idempotency indexes |
| **Offline Creation** | `npm run test:offline-create` | Network-down queue enqueuing, UUID v4 clientRequestId, 400 validation bypass |
| **Sync Engine** | `npm run test:sync` | FIFO replay, exponential backoff, Web Lock exclusivity, crash recovery |
| **Offline UX** | `npm run test:ux` | SSR safety, online/offline transitions, retry mechanics, discard operations |
| **Multi-tab & Cache** | `npm run test:f8.7` | BroadcastChannel events, anti-loop guards, SW bypass classifier |
| **Performance** | `npm run test:f8.8` | TanStack Query config, targeted invalidations, dynamic chart splitting |

Run all tests sequentially:
```bash
npm run test:idb && npm run test:offline-create && npm run test:sync && npm run test:ux && npm run test:f8.7 && npm run test:f8.8
```

---

## 6. PWA & Production Deployment Requirements

### 1. HTTPS Requirement
Service Workers and Web Locks APIs require a secure origin (`https://` or `http://localhost` for local development). Production deployments must enforce HTTPS with SSL/TLS certificates.

### 2. Service Worker (`public/sw.js`) Cache Policy
To guarantee immediate client updates upon new releases:
- The Service Worker file (`/sw.js`) **must not be cached aggressively** by CDNs or intermediate proxies.
- Configured header in `next.config.ts`:
  ```http
  Cache-Control: no-cache, no-store, must-revalidate
  Content-Type: application/javascript; charset=utf-8
  ```
- If deploying behind Cloudflare, Fastly, or CloudFront, add a Page Rule ensuring `/sw.js` bypasses CDN edge cache.

### 3. Financial API Cache Safety Architecture
- The Service Worker exclusively caches **static assets** (`/_next/static/*`, `/icons/*`, favicon, CSS, JS) and the offline fallback app-shell.
- **Zero API or financial data caching**: All `GET` requests with `Authorization` headers, `application/json` Accept headers, or targeting `/api/*`, `/dashboard`, `/transactions`, `/budgets`, `/goals`, `/recurring`, `/reports`, `/notifications`, `/profile` strictly bypass Cache Storage and execute as network-only.
- Offline transaction records exist strictly in client-side **IndexedDB**, completely segregated from Cache Storage and inaccessible to the Service Worker.

### 4. Security Headers & Recommended Deployment CSP
`next.config.ts` enforces base HTTP security headers:
- `X-DNS-Prefetch-Control: on`
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`

For production deployment platforms (Vercel, Nginx, Caddy), configure **Strict-Transport-Security** (HSTS) and a matching **Content-Security-Policy**:
```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://<YOUR_API_DOMAIN>; worker-src 'self'; manifest-src 'self';
```

---

## 7. Search Engine Indexing & Privacy

ExpenseIQ is an authenticated financial SaaS application. The `public/robots.txt` configuration explicitly disallows search engine crawlers from indexing private app surfaces:
- Disallowed: `/dashboard`, `/transactions`, `/categories`, `/budgets`, `/goals`, `/recurring`, `/reports`, `/notifications`, `/profile`, `/settings`, `/api/`
- Allowed: Public marketing, `/login`, `/register`, `/forgot-password`, `/reset-password`

---

## 8. Browser Compatibility

- Google Chrome / Chromium-based browsers: `>= 100` (full PWA, Web Locks, BroadcastChannel)
- Mozilla Firefox: `>= 100`
- Apple Safari: `>= 16.4` (Web Locks, Service Worker)
- Mobile Browsers: Chrome for Android, Safari for iOS (full standalone install support)
