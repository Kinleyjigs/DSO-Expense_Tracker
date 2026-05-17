# Expense Tracker CI/CD Task Plan

This file is the exact roadmap from now until submission.

## 1) What We Already Have

- Frontend: Next.js + TypeScript (`frontend/`)
- Backend: Express + TypeScript + Prisma (`backend/`)
- Database: PostgreSQL (local via Docker, production planned on Render)
- Containerization: Dockerfiles for frontend and backend, plus `docker-compose.yml`
- Version Control: GitHub
- CI/CD Tool: GitHub Actions (required by assignment)
- Deployment Target: Render
- Container Registry: DockerHub

You are on track.

## 2) Final Target Architecture

1. Developer pushes code to GitHub.
2. GitHub Actions runs CI:
   - install dependencies
   - lint/typecheck
   - Unit, Integration, API, UI, and E2E tests
   - build Docker images
3. On `main` branch success:
   - push backend/frontend images to DockerHub
   - trigger Render deployment (or Render auto-deploy from image/tag)
4. Render deploys:
   - backend web service
   - frontend web service
   - managed PostgreSQL
5. Backend runs Prisma migrations with `prisma migrate deploy`.

## 3) Immediate Safety Fix (Do First)

Your current `docker-compose.yml` has plain credentials. Replace hardcoded DB password and JWT secret with environment variables, and rotate secrets.

Example `.env` (root for local only):

```bash
POSTGRES_USER=app_user
POSTGRES_PASSWORD=change_this_local_password
POSTGRES_DB=expense_tracker
JWT_SECRET=change_this_local_jwt_secret
```

Then reference these in `docker-compose.yml` using `${...}`.

## 4) Testing Strategy (Required by Assignment)

Use this mapping so every required testing type is covered clearly.

1. Unit Testing
- Scope: pure functions, utility functions, validation logic, isolated service methods.
- Suggested tools:
  - Backend: Vitest or Jest
  - Frontend: Vitest + React Testing Library

2. Integration Testing
- Scope: backend route + middleware + service + test database flow.
- Suggested tools:
  - Vitest/Jest + Supertest + test PostgreSQL (container)

3. API Testing
- Scope: endpoint contract checks (status, payload, auth behavior).
- Suggested tools:
  - Supertest (code-based) and optional Postman/Newman collection in CI

4. E2E Testing
- Scope: full user journey from UI to backend (login, add expense, list expenses, report view).
- Suggested tools:
  - Playwright

5. UI Testing
- Scope: component rendering, interactions, accessibility-critical behavior.
- Suggested tools:
  - React Testing Library + Vitest/Jest

## 5) Milestone Plan (Do in Order)

### Milestone A: Local Quality Baseline

1. Add or confirm scripts in each app:

```bash
# backend/package.json
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:api

# frontend/package.json
pnpm test
pnpm test:ui
pnpm test:e2e
```

2. Make sure tests run locally before CI.
3. Keep at least one passing test per required category for submission evidence.

### Milestone B: Docker and DockerHub

1. Confirm images build locally:

```bash
docker compose build
```

2. Run full stack locally:

```bash
docker compose up -d
```

3. Add DockerHub repo names:
- `yourdockerhub/expense-tracker-backend`
- `yourdockerhub/expense-tracker-frontend`

4. CI should build and push tagged images (`latest` + commit SHA).

### Milestone C: GitHub Actions Workflows

Create two workflows in `.github/workflows/`:

1. `ci.yml` (on pull_request and push to non-main branches)
- checkout
- setup pnpm/node
- install
- run lint/typecheck
- run Unit/Integration/API/UI/E2E tests
- build backend + frontend

2. `cd.yml` (on push to `main`)
- run CI gates again (or require CI success)
- docker login to DockerHub using GitHub Secrets
- build + push backend/frontend images
- trigger Render deploy hooks

Required GitHub Secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `RENDER_BACKEND_DEPLOY_HOOK`
- `RENDER_FRONTEND_DEPLOY_HOOK`

## 6) Render Deployment Setup

1. Create Render PostgreSQL instance.
2. Create Backend Web Service:
- Deploy from Docker image or GitHub repo Dockerfile
- Set env vars:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `NODE_ENV=production`
  - `FRONTEND_URL`
- Start command should execute migrations before app start, e.g.:

```bash
pnpm prisma migrate deploy && pnpm start
```

3. Create Frontend Web Service:
- Docker image or repo-based build
- Set `NEXT_PUBLIC_API_URL` to backend public URL + `/api`

4. Add health check endpoint to backend and configure Render health checks.

## 7) Suggested Branch and Promotion Flow

1. `feature/*` branch: develop and test.
2. Pull Request to `develop` (optional) or `main`: CI must pass.
3. Merge to `main`: CD pushes images and deploys to Render.
4. Verify production smoke tests.

## 8) Evidence Pack for Final Submission

Capture screenshots with these exact names while running pipeline:

1. `01-local-tests-passing.png`
2. `02-docker-compose-up.png`
3. `03-github-actions-ci-pass.png`
4. `04-dockerhub-images-tags.png`
5. `05-render-postgres-created.png`
6. `06-render-backend-env-vars.png`
7. `07-render-frontend-env-vars.png`
8. `08-render-successful-deploy.png`
9. `09-api-test-proof.png`
10. `10-e2e-test-proof.png`
11. `11-ui-test-proof.png`
12. `12-final-live-app.png`

## 9) Definition of Done

- All 5 testing types are implemented and passing in CI.
- Docker images are built and pushed to DockerHub.
- Render backend + frontend + PostgreSQL are live.
- Prisma migrations run in deployment flow.
- `main` branch push triggers deployment automatically.
- Evidence screenshots captured and organized.

## 10) What I Can Do Next For You (Implementation)

I can implement this for you in the repo now:

1. Create `.github/workflows/ci.yml` and `.github/workflows/cd.yml`.
2. Add missing test scripts and starter test setup for backend/frontend.
3. Update `docker-compose.yml` to use env vars safely.
4. Add a deployment-ready backend startup command with migrations.

If you want, I will start these changes immediately in that order.
