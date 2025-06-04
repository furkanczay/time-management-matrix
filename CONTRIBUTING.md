# Contributing to Time Management Matrix

Thank you for your interest in contributing to Time Management Matrix! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 LTS or higher)
- **PostgreSQL** (v17 or higher)
- **Git**
- **npm**, **yarn**, **pnpm**, or **bun**

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```powershell
   git clone https://github.com/YOUR_USERNAME/time-management-matrix.git
   cd time-management-matrix
   ```

3. **Install dependencies**:

   ```powershell
   npm install
   ```

4. **Set up environment variables**:

   ```powershell
   Copy-Item .env.example .env.local
   # Edit .env.local with your database credentials
   ```

5. **Set up the database**:

   ```powershell
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Start the development server**:
   ```powershell
   npm run dev
   ```

## 🛠️ Development Workflow

### Branch Naming Convention

- `feature/description` - For new features
- `fix/description` - For bug fixes
- `docs/description` - For documentation updates
- `refactor/description` - For code refactoring
- `chore/description` - For maintenance tasks

### Making Changes

1. **Create a new branch** from `main`:

   ```powershell
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:

   ```powershell
   npm run lint
   npm run build
   ```

4. **Commit your changes** with a clear message:

   ```powershell
   git commit -m "feat: add new task sorting feature"
   ```

5. **Push to your fork**:

   ```powershell
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow strict type checking
- Avoid `any` types - use proper interfaces/types
- Use meaningful variable and function names

### Code Style

- Use Prettier formatting (configured in the project)
- Follow ESLint rules (run `npm run lint`)
- Use meaningful commit messages
- Write descriptive comments for complex logic

### File Organization

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Shadcn)
│   └── todo/           # Feature-specific components
├── contexts/           # React Context providers
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── actions/            # Server actions
```

### Component Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use TypeScript interfaces for props
- Implement proper accessibility (a11y)

## 🧪 Testing

### Running Tests

```powershell
# Run linting
npm run lint

# Build the project
npm run build

# Check TypeScript
npx tsc --noEmit
```

### Writing Tests

- Write unit tests for utility functions
- Test components with user interactions
- Ensure database operations work correctly
- Test API endpoints thoroughly

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, Node.js version, browser)
6. **Screenshots** (if applicable)

Use our bug report template in GitHub Issues.

## ✨ Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide mockups** or examples (if applicable)

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### 🔧 Technical Improvements

- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Database query optimizations
- API endpoint enhancements

### 🎨 UI/UX Enhancements

- New themes and color schemes
- Animation improvements
- Better user experience flows
- Mobile-first design improvements

### 📱 New Features

- Task templates
- Time tracking
- Calendar integration
- Export/import functionality
- Collaboration features
- Mobile app (React Native)

### 📚 Documentation

- API documentation
- User guides
- Tutorial videos
- Translation (i18n)

### 🧪 Testing

- Unit tests
- Integration tests
- E2E tests
- Performance tests

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated (if needed)
- [ ] Self-review completed

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots (if applicable)

Add screenshots of UI changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🏷️ Issue Labels

We use the following labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority/high` - High priority
- `priority/medium` - Medium priority
- `priority/low` - Low priority

## 💬 Communication

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Requests** - Code contributions and reviews

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 🎉 Recognition

Contributors will be:

- Listed in our README.md
- Mentioned in release notes
- Given credit in documentation

## ❓ Questions?

If you have questions about contributing, please:

1. Check existing GitHub Issues and Discussions
2. Create a new Discussion for general questions
3. Open an Issue for specific bugs or features

Thank you for contributing to Time Management Matrix! 🎯
