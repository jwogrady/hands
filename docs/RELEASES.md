# Release Process

This document describes the release process for Hands using Release Please and Conventional Commits.

## Overview

We use [Release Please](https://github.com/googleapis/release-please) for automated versioning, changelog generation, and release management. This ensures consistent releases based on [Conventional Commits](https://www.conventionalcommits.org/).

## How It Works

### 1. Conventional Commits

All commits must follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Commit types that trigger version bumps:**

- `feat:` → Minor version bump (0.0.1 → 0.1.0)
- `fix:` → Patch version bump (0.0.1 → 0.0.2)
- `feat!:` or `BREAKING CHANGE:` → Major version bump (0.0.1 → 1.0.0)

### 2. Release Please Workflow

Release Please runs on every push to `main` and:

1. **Analyzes commits** since the last release
2. **Determines version bump** based on commit types
3. **Creates/updates a release PR** with:
   - Updated version in `package.json`
   - Updated `CHANGELOG.md` with categorized changes
   - Updated `.release-please-manifest.json`
4. **Releases** when the PR is merged

### 3. Release PR Creation

A release PR is created automatically:

- When new commits are pushed to `main`
- Daily via scheduled workflow (midnight UTC)
- Manually via workflow dispatch

The PR will be titled: `chore: release 0.1.0` (or similar, based on version bump)

## Release Process

### Automatic Release

1. **Developers make commits** following Conventional Commits
2. **Commits are merged to `main`**
3. **Release Please creates/updates release PR** automatically
4. **Team reviews the release PR** (changelog, version bump)
5. **Merge the release PR** to create the release
6. **GitHub release is created** automatically with:
   - Version tag (e.g., `v0.1.0` or `v0.0.2`)
   - Release notes from CHANGELOG
   - Git tag

### Manual Release

If you need to trigger a release manually:

1. Go to Actions → "Release Please PR"
2. Click "Run workflow"
3. Review and merge the generated PR

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backwards compatible)
- **PATCH** (0.0.2): Bug fixes (backwards compatible)

**Current version**: 0.0.1 (pre-release/development)

**Note**: Version 0.0.1 indicates this is pre-release/development. The first feature release will be 0.1.0.

### Examples

**Patch Release (0.0.1 → 0.0.2):**

```
fix(auth): resolve login redirect issue
fix(ui): correct button styling
```

**Minor Release (0.0.1 → 0.1.0):**

```
feat(jobs): add job posting form
feat(candidates): implement candidate dashboard
fix(auth): resolve login redirect issue
```

**Major Release (0.0.1 → 1.0.0):**

```
feat(api): restructure authentication endpoints

BREAKING CHANGE: Authentication endpoints now require API version prefix
```

## Changelog Format

The `CHANGELOG.md` is automatically generated with sections:

```markdown
## [0.1.0] - 2024-01-15

### Added

- Job posting form for managers
- Candidate dashboard with filtering

### Changed

- Improved authentication flow

### Fixed

- Login redirect issue
- Button styling inconsistencies
```

## Release PR Checklist

Before merging a release PR:

- [ ] Review CHANGELOG.md for accuracy
- [ ] Verify version number is correct
- [ ] Check that all intended changes are included
- [ ] Ensure no breaking changes in a minor/patch release
- [ ] Test the release build if necessary

## Breaking Changes

To indicate a breaking change:

**Option 1: Use `!` in commit type:**

```
feat!: change API response format
```

**Option 2: Add BREAKING CHANGE footer:**

```
feat(api): change API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case
```

Both will trigger a major version bump.

## Release Configuration

Configuration files:

- `release-please-config.json` - Release Please configuration
- `.release-please-manifest.json` - Current version tracking (auto-updated)
- `.github/workflows/release-please.yml` - Release workflow
- `.github/workflows/release-please-pr.yml` - Release PR workflow

## Troubleshooting

### Release PR Not Created

- Check if commits follow Conventional Commits format
- Verify workflow is running on `main` branch
- Check GitHub Actions logs for errors

### Wrong Version Bump

- Review commit types since last release
- Ensure breaking changes are properly marked
- Check `.release-please-manifest.json` for current version

### Changelog Issues

- Release Please groups commits by type automatically
- Commits without conventional format are excluded
- Scope information is preserved in changelog

## Best Practices

1. **Always use Conventional Commits** - Required for automation
2. **Review release PRs carefully** - Ensure changelog accuracy
3. **Tag breaking changes properly** - Use `!` or `BREAKING CHANGE:`
4. **Keep commits focused** - One logical change per commit
5. **Use scopes** - Helps organize changelog entries

## Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Commit message guidelines
- [Conventional Commits](https://www.conventionalcommits.org/) - Specification
- [Release Please](https://github.com/googleapis/release-please) - Documentation
