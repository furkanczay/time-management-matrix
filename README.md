# Time Management Matrix - Turborepo

This is a monorepo for the Time Management Matrix application built with [Turborepo](https://turbo.build/) and [Bun](https://bun.sh/).

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `web`: A [Next.js](https://nextjs.org/) app for the Time Management Matrix application

### Packages

- Future shared packages will be added here

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- [Node.js](https://nodejs.org/) 18+ 

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Setup environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```
   
   Configure your database and authentication settings in the `.env` file.

3. Setup the database:
   ```bash
   cd apps/web
   bun run db:push
   ```

### Development

To develop all apps and packages:

```bash
bun dev
```

To develop only the web app:

```bash
cd apps/web
bun dev
```

### Build

To build all apps and packages:

```bash
bun run build
```

### Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
# Time Management Matrix - Turborepo

This is a monorepo for the Time Management Matrix application built with [Turborepo](https://turbo.build/) and [Bun](https://bun.sh/).

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `web`: A [Next.js](https://nextjs.org/) app for the Time Management Matrix application

### Packages

- Future shared packages will be added here

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- [Node.js](https://nodejs.org/) 18+ 

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Setup environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```
   
   Configure your database and authentication settings in the `.env` file.

3. Setup the database:
   ```bash
   cd apps/web
   bun run db:push
   ```

### Development

To develop all apps and packages:

```bash
bun dev
```

To develop only the web app:

```bash
cd apps/web
bun dev
```

### Build

To build all apps and packages:

```bash
bun run build
```

### Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
