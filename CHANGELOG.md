# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0] - 2025-01-XX

### Added

- M1 Foundation Setup: Complete application foundation
  - TanStack Router with route configuration (public and protected routes)
  - Authentication pages (login/signup) with form validation
  - Auth hooks (`useAuth`) and protected route wrapper component
  - Layout components (Header, RootLayout) with navigation
  - Complete TypeScript type definitions for all entities
  - Initial Supabase database schema migration with RLS policies
  - Comprehensive seed data for development and testing
  - Tailwind CSS v4 configuration
  - TanStack Query integration for state management

### Changed

- Updated from Tailwind CSS v3 to v4 with PostCSS plugin
- Migrated ESLint to flat config format (v9)

## [0.0.1] - 2024-01-XX

### Added

- Initial project setup with React + TanStack UI
- Supabase backend integration
- Development workflow with Git Flow
- CI/CD pipeline with GitHub Actions
- Testing framework (Jest + Playwright)
- Documentation structure
- Conventional Commits and Release Please configuration

[0.1.0]: https://github.com/jwogrady/hands/releases/tag/v0.1.0
[0.0.1]: https://github.com/jwogrady/hands/releases/tag/v0.0.1
