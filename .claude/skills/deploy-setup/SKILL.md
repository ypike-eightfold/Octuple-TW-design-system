---
name: deploy-setup
description: Generates infrastructure configuration, Docker setup, CI/CD pipeline, environment config, and a pre-launch deployment checklist. Use this skill when the user wants to deploy the system, set up infrastructure, configure environments, create Docker files, set up CI/CD pipelines, or prepare for production launch. Always trigger after all other pipeline stages are approved. Check forger for tech stack, integrations, and compliance requirements before generating config. Also triggers when the user says "deploy this", "set up infrastructure", "create Dockerfile", "configure CI/CD", or "prepare for launch".
---

# Deploy Setup

Generates all infrastructure, environment, and deployment configuration for production launch.

## Context Manifest

```yaml
unit_type: one_shot
required_inputs:
  - docs/architecture/system.md
  - context.json#project                        # for integrations, compliance, tech_stack
forbidden_paths:
  - docs/product/market-research.md
  - docs/product/user-stories.md
  - docs/architecture/database.md
  - docs/architecture/api.md
budget_tokens: 900000
outputs:
  - deploy/Dockerfile.backend
  - deploy/Dockerfile.frontend
  - deploy/docker-compose.yml
  - deploy/docker-compose.prod.yml
  - deploy/nginx.conf
  - deploy/.env.example
  - deploy/.github/workflows/ci.yml
artifacts:
  summary:          docs/architecture/deployment.md
  return_contract:  docs/architecture/.deploy-setup.return.json
```

Forger invokes as a Task subagent after all build phases verified. Return JSON contract: see `.claude/skills/_shared/return-contract.md`. Do NOT call AskUserQuestion; forger owns the approval gate.

---

## Pre-conditions

Confirm via forger:
- All pipeline stages approved
- Tech stack confirmed
- Integrations confirmed (HRIS, SSO)
- Compliance requirements confirmed (GDPR, SOC2 etc.)

---

## Output Path

All deployment files are written under `deploy/` at repo root.

## Output: Five Sections

Produce all five, then hand to forger for approval.

---

### Section 1 — Docker Configuration

```dockerfile
# deploy/Dockerfile.backend
FROM python:3.12-slim AS base
WORKDIR /app

RUN pip install uv
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev

COPY backend/app ./app
COPY backend/alembic.ini .
COPY backend/app/alembic ./app/alembic

RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 appuser
USER appuser

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# deploy/Dockerfile.frontend
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ .
RUN pnpm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# deploy/docker-compose.yml (local development)
services:
  backend:
    build:
      context: ..
      dockerfile: deploy/Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://pm_user:pm_pass@postgres:5432/pm_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ..
      dockerfile: deploy/Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: pm_user
      POSTGRES_PASSWORD: pm_pass
      POSTGRES_DB: pm_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build:
      context: ..
      dockerfile: deploy/Dockerfile.backend
    command: uv run celery -A app.worker worker --loglevel=info
    environment:
      DATABASE_URL: postgresql://pm_user:pm_pass@postgres:5432/pm_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

### Section 2 — Environment Configuration

```bash
# deploy/.env.example — commit this, never commit .env

# Backend
ENVIRONMENT=production
SECRET_KEY=<generate with: openssl rand -base64 32>
BACKEND_CORS_ORIGINS=["https://your-pm-system.com"]

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/pm_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (for Celery task queue)
REDIS_URL=redis://HOST:6379

# Auth — JWT
ACCESS_TOKEN_EXPIRE_MINUTES=30
FIRST_SUPERUSER=admin@your-pm-system.com
FIRST_SUPERUSER_PASSWORD=<set during deployment>

# SSO (Okta example — adjust for Azure AD/SAML)
OKTA_CLIENT_ID=
OKTA_CLIENT_SECRET=
OKTA_ISSUER=https://your-org.okta.com/oauth2/default

# Email (SendGrid)
SENDGRID_API_KEY=
EMAILS_FROM_EMAIL=noreply@your-pm-system.com
EMAILS_FROM_NAME="Performance System"

# HRIS Integration (Workday example)
WORKDAY_TENANT_URL=
WORKDAY_USERNAME=
WORKDAY_PASSWORD=
WORKDAY_SYNC_CRON=0 2 * * *  # 2am daily

# Storage (S3 for attachments)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=pm-attachments

# Monitoring
SENTRY_DSN=
LOG_LEVEL=info

# Frontend (build-time via VITE_ prefix)
VITE_API_URL=https://api.your-pm-system.com/api/v1
```

---

### Section 3 — CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
          POSTGRES_DB: pm_test
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v4
        with:
          version: "latest"

      - name: Install dependencies
        working-directory: backend
        run: uv sync

      - name: Run linting
        working-directory: backend
        run: |
          uv run ruff check app
          uv run ruff format --check app
          uv run mypy app

      - name: Run migrations on test DB
        working-directory: backend
        run: uv run alembic upgrade head
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/pm_test

      - name: Run tests
        working-directory: backend
        run: uv run pytest --cov=app --cov-report=xml
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/pm_test
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: backend/coverage.xml
          flags: backend

  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml

      - name: Install dependencies
        working-directory: frontend
        run: pnpm install --frozen-lockfile

      - name: Lint & type-check
        working-directory: frontend
        run: |
          pnpm run lint
          pnpm run build

      - name: Run unit tests
        working-directory: frontend
        run: pnpm run test:unit:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: frontend/coverage/lcov.info
          flags: frontend

  e2e:
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - working-directory: frontend
        run: pnpm install --frozen-lockfile
      - working-directory: frontend
        run: npx playwright install --with-deps
      - working-directory: frontend
        run: pnpm run test:e2e

  build:
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build backend Docker image
        run: docker build -f deploy/Dockerfile.backend -t pm-backend:${{ github.sha }} .
      - name: Build frontend Docker image
        run: docker build -f deploy/Dockerfile.frontend -t pm-frontend:${{ github.sha }} .
      - name: Push to registry
        run: |
          docker tag pm-backend:${{ github.sha }} ${{ secrets.REGISTRY }}/pm-backend:latest
          docker push ${{ secrets.REGISTRY }}/pm-backend:latest
          docker tag pm-frontend:${{ github.sha }} ${{ secrets.REGISTRY }}/pm-frontend:latest
          docker push ${{ secrets.REGISTRY }}/pm-frontend:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        run: |
          # Adjust for your cloud provider (AWS ECS / GCP Cloud Run / k8s)
          echo "Deploying ${{ github.sha }} to production"
```

---

### Section 4 — Database Migration Strategy

```bash
# scripts/migrate.sh
#!/bin/bash
set -e

echo "Running database migrations..."
cd backend
uv run alembic upgrade head

echo "Seeding reference data..."
uv run python -m app.initial_data

echo "Migration complete."
```

```python
# backend/app/initial_data.py — Reference data only, no employee data
from sqlmodel import Session
from app.core.db import engine

def init() -> None:
    with Session(engine) as session:
        # Default rating scale
        # Default notification templates
        # Default form question library
        # First superuser (from env vars)
        ...

if __name__ == "__main__":
    init()
```

---

### Section 5 — Pre-Launch Checklist

#### Security
- [ ] All secrets in secrets manager (AWS Secrets Manager / HashiCorp Vault) — not in env files
- [ ] SSO configured and tested with real IdP
- [ ] HTTPS enforced — no HTTP traffic
- [ ] CORS configured to allow only your domain
- [ ] Rate limiting enabled on auth endpoints
- [ ] SQL injection protection verified (SQLModel parameterised queries)
- [ ] XSS protection headers set

#### Data & Compliance
- [ ] GDPR data processing agreement in place (if EU employees)
- [ ] Data retention policy configured — auto-archive after X years
- [ ] Audit log enabled and tested on all write operations
- [ ] PII fields identified and encrypted at rest
- [ ] Backup schedule configured (daily snapshots, 30-day retention)
- [ ] HRIS sync tested end-to-end with real data sample

#### Performance
- [ ] Database indexes verified for all common query patterns
- [ ] Connection pooling configured (PgBouncer recommended for >100 concurrent users)
- [ ] Redis caching enabled for analytics queries
- [ ] Load test completed — target: 500 concurrent users

#### Operations
- [ ] Error monitoring configured (Sentry)
- [ ] Log aggregation set up (CloudWatch / Datadog)
- [ ] Alerting configured for: error rate > 1%, DB CPU > 80%, queue backlog > 1000
- [ ] Rollback plan documented and tested
- [ ] On-call rotation defined for launch week

#### User Readiness
- [ ] HR Admin trained on cycle configuration
- [ ] Test pilot completed with 1 team
- [ ] User guide / help docs published
- [ ] Support channel established (Slack / email)

---

## Cloud Provider Variants

Based on domain doc compliance requirements, adjust hosting:

| Requirement | Recommended Hosting |
|---|---|
| GDPR (EU data residency) | AWS eu-west-1 / GCP europe-west1 |
| SOC2 | AWS (already SOC2 certified) |
| Enterprise (existing AWS) | AWS ECS Fargate or EKS |
| Enterprise (existing Azure) | Azure Container Apps |
| Startup / lean | Railway or Render (faster setup) |

---

## Cross-Cutting Rules

1. **Incremental delivery** — Present work unit by unit inline in the conversation. Get user feedback before proceeding to the next unit. Don't batch everything and dump file paths.
2. **Research awareness** — Check for the market research brief (`docs/product/market-research.md`) before starting. Use competitor insights and UX patterns from it to inform your output.
3. **Enterprise depth** — All outputs should be spec-level, not summary-level. Think about what an enterprise customer at a 5,000-person company would need.
4. **No emoji in production artifacts** — Use text labels and SVG icons, not emoji, in any artifacts that will be used downstream.

---

## After Producing Deploy Config

1. Present the checklist first — it's the most important human review item
2. Then walk through config files
3. Flag any items in the checklist that need the user's input (SSO details, cloud provider, compliance specifics)
4. Hand off to **forger** for final approval — this is the **last gate before launch**
5. After approval, mark all pipeline stages complete in **forger**
