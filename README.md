# Time Management Matrix

A modern, intuitive task management application built with Next.js that implements the Eisenhower Matrix (also known as the Priority Matrix) to help users organize and prioritize their tasks effectively.

![Time Management Matrix](https://via.placeholder.com/800x400/1f2937/ffffff?text=Time+Management+Matrix)

## 🚀 Features

### Core Functionality

- **Eisenhower Matrix Implementation**: Organize tasks into four quadrants based on urgency and importance

  - **Quadrant 1**: Urgent & Important (Do First)
  - **Quadrant 2**: Important but Not Urgent (Schedule)
  - **Quadrant 3**: Urgent but Not Important (Delegate)
  - **Quadrant 4**: Neither Urgent nor Important (Eliminate)

- **Task Management**

  - Create, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Drag and drop functionality for easy task organization
  - Progress tracking with visual indicators

- **Subtask System**
  - Add subtasks to break down complex tasks
  - Independent completion tracking for subtasks
  - Hierarchical task organization

### User Experience

- **Authentication System**: Secure user registration and login with Better Auth
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful interface built with Tailwind CSS and Shadcn UI components
- **Dark/Light Mode**: Automatic theme switching support
- **Smooth Animations**: Enhanced user experience with custom CSS animations

### Technical Features

- **Real-time Updates**: Instant synchronization across sessions
- **Type Safety**: Full TypeScript implementation for robust development
- **Database Integration**: PostgreSQL with Prisma ORM for reliable data management
- **API Routes**: RESTful API endpoints for all operations
- **Form Validation**: Zod-based validation for data integrity

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Accessible, beautiful UI components
- **React Hook Form** - Performant forms with easy validation
- **@dnd-kit** - Modern drag and drop toolkit

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL 17** - Latest robust relational database
- **Better Auth** - Modern authentication solution
- **Zod** - Runtime type validation

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v22 LTS or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **PostgreSQL** database (v17 or higher recommended)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd time-management-matrix
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

> **Note**: If you encounter peer dependency issues with npm, the project includes a `.npmrc` file with `legacy-peer-deps=true` to resolve compatibility issues.

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the .env.local file with your actual values
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/time_management_matrix"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

> **Note**: See `.env.example` for detailed configuration examples and production settings.

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🐳 Docker Setup (Alternative)

### Using Docker Compose (Recommended)

The easiest way to run the application with Docker is using Docker Compose, which will set up both the application and PostgreSQL database:

```bash
# Clone and navigate to the project
git clone <repository-url>
cd time-management-matrix

# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Manual Docker Build

If you prefer to build and run manually:

```bash
# Build the Docker image
docker build -t time-management-matrix .

# Run PostgreSQL database
docker run -d \
  --name postgres-db \
  -e POSTGRES_DB=time_management_matrix \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:17-alpine

# Run the application
docker run -d \
  --name time-management-app \
  --link postgres-db:postgres \
  -e DATABASE_URL="postgresql://postgres:postgres@postgres:5432/time_management_matrix" \
  -e BETTER_AUTH_SECRET="your-secret-key" \
  -e BETTER_AUTH_URL="http://localhost:3000" \
  -p 3000:3000 \
  time-management-matrix
```

### Development with Docker

For development with hot reload:

```bash
# Run only the PostgreSQL database
docker-compose -f docker-compose.dev.yml up postgres-dev -d

# Set your environment variables to use the containerized database
# DATABASE_URL="postgresql://postgres:postgres@localhost:5433/time_management_matrix_dev"

# Run the application locally
npm run dev
```

## 📁 Project Structure

```
time-management-matrix/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (marketing)/       # Landing pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Main application
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── todo/              # Task management components
│   │   └── ui/                # Base UI components
│   ├── contexts/              # React Context providers
│   ├── lib/                   # Utility libraries
│   │   ├── api/               # API helper functions
│   │   ├── auth.ts            # Authentication configuration
│   │   ├── prisma.ts          # Database client
│   │   └── validations.ts     # Zod schemas
│   └── actions/               # Server actions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── package.json               # Dependencies and scripts
```

## 🎯 Usage

### Creating Tasks

1. Navigate to the dashboard after logging in
2. Click the "+" button in any quadrant
3. Fill in the task details:
   - **Title**: Brief description of the task
   - **Description**: Optional detailed description
   - **Quadrant**: Automatically set based on the quadrant clicked
4. Click "Create Task"

### Managing Subtasks

1. Click on a task to view details
2. Add subtasks to break down complex tasks
3. Mark subtasks as complete independently
4. Track overall progress

### Organizing Tasks

- **Drag and Drop**: Move tasks between quadrants
- **Edit Tasks**: Click on a task to modify details
- **Complete Tasks**: Check off completed tasks
- **Delete Tasks**: Remove tasks that are no longer needed

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main entities:

### User

- Authentication and user management
- Managed by Better Auth

### Task

- Core task entity with quadrant classification
- Fields: title, description, isUrgent, isImportant, completed, order
- Belongs to a user (creatorId)

### Subtask

- Child tasks for breaking down complex tasks
- Fields: title, completed, parentId
- Belongs to a parent task

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
DATABASE_URL="your-production-database-url"
BETTER_AUTH_SECRET="your-production-secret"
BETTER_AUTH_URL="https://your-domain.com"
NEXTAUTH_URL="https://your-domain.com"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow TypeScript best practices
2. Use meaningful commit messages
3. Add tests for new features
4. Ensure code passes ESLint checks
5. Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Eisenhower Matrix](https://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method) for the productivity methodology
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) for beautiful and accessible UI components
- [Better Auth](https://www.better-auth.com/) for modern authentication

## 📞 Support

If you have any questions or need help with setup, please [open an issue](../../issues) on GitHub.

---

**Happy Task Managing! 🎯**
