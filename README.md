# Bun Next SaaS RBAC

This project was made by following a course at RocketSeat course platform

A modern SaaS boilerplate built with [Bun](https://bun.sh/), [Next.js](https://nextjs.org/), and a robust Role-Based Access Control (RBAC) system. This project is designed to help you quickly launch SaaS products with multi-tenant support, authentication, organization management, and more.

## Features

- **Monorepo structure** powered by Bun workspaces
- **Next.js** frontend with App Router
- **Fastify** backend API
- **PostgreSQL** database (Dockerized)
- **RBAC** (Role-Based Access Control) with flexible permissions
- **Multi-organization** and project support
- **Authentication** (Email/Password & GitHub OAuth)
- **Invite system** for organization members
- **Profile & organization management**
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **ESLint & Prettier** with Rocketseat configs
- **TypeScript** everywhere

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) v1.2+
- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd bun-next-saas-rbac
   ```

2. **Install dependencies:**
   ```sh
   bun install
   ```

3. **Start PostgreSQL with Docker:**
   ```sh
   docker-compose up -d
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env` in each app/package as needed and fill in the required values.

5. **Run database migrations and seed:**
   ```sh
   cd apps/api
   bun run prisma migrate dev
   bun run prisma db seed
   cd ../..
   ```

6. **Start the development servers:**
   - **API:**
     ```sh
     cd apps/api
     bun run dev
     ```
   - **Web:**
     ```sh
     cd apps/web
     bun run dev
     ```

## Project Structure

```
bun-next-saas-rbac/
├── apps/
│   ├── api/         # Fastify backend API
│   └── web/         # Next.js frontend
├── packages/
│   ├── auth/        # Auth logic, RBAC, models
│   └── env/         # Environment variable management
├── config/          # Shared ESLint, Prettier, TS configs
├── docker-compose.yml
└── ...
```

## Scripts

- `bun install` — Install all dependencies
- `bun run dev` — Start development server (run in each app)
- `bun run build` — Build the app
- `bun run lint` — Lint codebase
- `bun run check-types` — Type-check the codebase

## Environment Variables

- Configure your GitHub OAuth, database URL, and other secrets in `.env` files.
- See `.env.example` for required variables.

## License

MIT


