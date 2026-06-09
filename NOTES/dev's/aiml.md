# CI/CD & Automation Interview Questions

---

## 1. What is CI/CD?

**CI (Continuous Integration)** — automatically build and test code every time a developer pushes changes.

**CD (Continuous Delivery)** — automatically deploy tested code to staging/production.

```
Code Push → Build → Test → Deploy (staging) → Deploy (production)
```

| Stage | What Happens |
|---|---|
| **Build** | Install dependencies, compile code |
| **Test** | Run unit tests, lint checks |
| **Deploy** | Push to staging or production server |

---

## 2. GitHub Actions — Workflow Basics

GitHub Actions uses `.yml` files inside `.github/workflows/` to define automation pipelines.

**Key concepts:**

| Term | Meaning |
|---|---|
| **Workflow** | An automated process defined in a `.yml` file |
| **Event** | What triggers the workflow (`push`, `pull_request`, `schedule`) |
| **Job** | A set of steps that run on the same runner |
| **Step** | A single task (run command, use action) |
| **Runner** | The machine that executes the job (`ubuntu-latest`, `windows-latest`) |
| **Action** | A reusable unit of code (e.g., `actions/checkout@v4`) |

---

## 3. Writing a Basic Workflow `.yml`

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

---

## 4. Auto Deploy Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install & Build
        run: |
          npm ci
          npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-app
            git pull origin main
            npm ci --production
            pm2 restart all
```

---

## 5. NPM Scripts for Automation

Common scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/ --ext .ts,.tsx",
    "lint:fix": "eslint src/ --ext .ts,.tsx --fix",
    "format": "prettier --write src/",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "type-check": "tsc --noEmit",
    "prepare": "husky install",
    "pre-commit": "npm run lint && npm run type-check",
    "clean": "rm -rf dist node_modules",
    "publish:npm": "npm run build && cd dist && npm publish"
  }
}
```

| Script | Purpose |
|---|---|
| `dev` | Start local dev server |
| `build` | Production build |
| `lint` | Check for code issues |
| `lint:fix` | Auto-fix lint issues |
| `test` | Run all tests with coverage |
| `type-check` | TypeScript check without emitting files |
| `prepare` | Auto-setup git hooks (Husky) |
| `pre-commit` | Run before every commit |

---

## 6. Automatic Build on Push

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'         # Only trigger when source code changes
      - 'package.json'
```

**Ignore paths (skip CI for docs changes):**

```yaml
on:
  push:
    branches: [main]
    paths-ignore:
      - '*.md'
      - 'docs/**'
```

---

## 7. Automated Testing in CI

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]   # Test on multiple Node versions

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

---

## 8. Auto Publish NPM Package

```yaml
name: Publish to NPM

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 9. GitHub Secrets & Environment Variables

Store sensitive data (API keys, tokens, SSH keys) in GitHub Secrets:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Usage |
|---|---|
| `NPM_TOKEN` | Publish to NPM registry |
| `SERVER_HOST` | Deployment server IP |
| `SERVER_USER` | SSH username |
| `SSH_PRIVATE_KEY` | SSH key for deployment |
| `SLACK_WEBHOOK` | Notify team on deploy |

**Access in workflow:**

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

---

## 10. Pre-commit Hooks (Husky + lint-staged)

Run lint/format before every commit:

```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

---

## 11. Branch Protection & PR Checks

Require CI to pass before merging:

**Settings → Branches → Add rule:**
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require pull request reviews

---

## 12. Workflow Triggers Summary

| Trigger | When |
|---|---|
| `push` | Code pushed to branch |
| `pull_request` | PR opened/updated |
| `release` | GitHub release published |
| `schedule` | Cron schedule (e.g., nightly builds) |
| `workflow_dispatch` | Manual trigger from GitHub UI |
| `repository_dispatch` | Triggered by external API call |

**Cron example (daily at midnight):**

```yaml
on:
  schedule:
    - cron: '0 0 * * *'
```

---

## 13. Caching Dependencies (Faster Builds)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'       # Auto-caches node_modules
```

Or manual caching:

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```

---

## 14. Notify on Deploy (Slack/Discord)

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 15. Full CI/CD Pipeline Example

```yaml
name: Full Pipeline

on:
  push:
    branches: [main]

jobs:
  # Step 1: Lint & Type Check
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  # Step 2: Test
  test:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm test

  # Step 3: Build & Deploy
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - name: Deploy
        run: echo "Deploy to production server"
```

**Flow:** `quality` → `test` → `deploy` (each step depends on the previous)
