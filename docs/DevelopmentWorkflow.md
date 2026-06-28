# Development Workflow

## Git Flow

This project follows a simplified Git Flow:

```
main ──────────────────────────────────┬──────────────►
    \                                / (merge --no-ff)
     feature/fix-xxx ──────► develop ──► (PR)
```

| Branch   | Purpose                                     |
|----------|---------------------------------------------|
| `main`   | Production-ready code. Protected.           |
| `develop`| Integration branch for features.            |
| `feature/*` | New feature development. PR → `develop`. |
| `fix/*`  | Bug fixes. PR → `develop`.                 |
| `chore/*`| Maintenance, tooling, CI. PR → `develop`.  |

## Branch Strategy

1. Create your branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/my-feature
   ```

2. Commit frequently with [Conventional Commits](#commit-pattern).

3. Push and open a Pull Request to `develop`.

4. After review and approval, squash-merge into `develop`.

5. Releases: merge `develop` into `main` with a `release/v*` tag.

## Commit Pattern

All commits must follow **Conventional Commits**:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Allowed Types

| Type       | Usage                                    |
|------------|------------------------------------------|
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation only                        |
| `style`    | Formatting, missing semicolons, etc.      |
| `refactor` | Code change that neither fixes nor adds   |
| `perf`     | Performance improvement                   |
| `test`     | Adding or fixing tests                    |
| `build`    | Build system or dependencies              |
| `ci`       | CI/CD configuration                       |
| `chore`    | Maintenance, tooling                      |
| `revert`   | Revert a previous commit                  |

### Examples

```
feat(auth): add login with email/password
fix(solicitacoes): prevent duplicate submission
ci: add database validation workflow
chore(deps): bump supabase-js to 2.108.2
docs: update architecture overview
```

## PR Flow

1. Create PR against `develop` branch.
2. Fill the PR template (automatically provided).
3. Ensure CI passes (lint → TypeScript → build).
4. Request review from at least one team member.
5. Address feedback with additional commits.
6. Squash-merge once approved.

## Release Flow

1. Create a `release/v*` branch from `develop`.
2. Bump version in `package.json`.
3. Open PR to `main`.
4. Tag the merge commit:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
5. Merge back into `develop`.

## CI Pipeline

| Workflow        | Trigger                | Checks                                  |
|-----------------|------------------------|-----------------------------------------|
| CI              | push/PR to `main`      | lint → TypeScript → build               |
| Database        | push/PR touching migrations | lint SQL → apply migrations       |
| CodeQL          | push/PR to `main` + weekly | JavaScript/TypeScript analysis    |
| Security        | PR to `main`           | Dependency review                       |

### Conventions

- Duplicate runs are automatically cancelled (concurrency groups).
- Logs are uploaded only on failure.
- Database workflow never touches remote databases.

## Local Development

```bash
# Install dependencies
npm ci

# Start Supabase local
npx supabase start

# Run lint
npm run lint

# TypeScript check
npx tsc --noEmit

# Build
npm run build

# Dev server
npm run dev
```

### Git Hooks (Husky)

| Hook         | Action                        |
|--------------|-------------------------------|
| `pre-commit` | `lint-staged` (ESLint on staged files) |
| `commit-msg` | `commitlint` (Conventional Commits validation) |
