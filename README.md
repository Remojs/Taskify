# Taskify - Modern Task Management Application

![Taskify Banner](./src/assets/task-hero.jpg)

## About Taskify

Taskify is a modern, intuitive task management application designed to help you organize your daily activities, projects, and goals with ease. Whether you're a professional managing complex projects, a student organizing your studies, or simply someone looking to keep track of your daily tasks, Taskify provides the tools you need to stay productive and organized.

### Key Features

- **Intuitive Task Management**: Create, edit, and delete tasks with a user-friendly interface
- **Task Categories**: Organize tasks by categories or projects
- **Priority Levels**: Set priorities to focus on what matters most
- **Due Dates & Reminders**: Never miss a deadline with built-in due dates and reminders
- **Progress Tracking**: Visual indicators for task completion status
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Task Filtering & Sorting**: Find tasks quickly with advanced filtering options
- **Beautiful UI Components**: Powered by shadcn-ui for a modern look and feel

## Technology Stack

Taskify is built with a powerful and modern tech stack:

### Frontend Technologies

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: For type-safe code and enhanced developer experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn-ui**: High-quality, accessible UI components built with Radix UI and Tailwind CSS

### UI Component Libraries

- **Radix UI**: Unstyled, accessible components for building high‑quality design systems
- **Lucide Icons**: Beautiful, consistent icon set for the UI
- **React Router DOM**: For application routing and navigation
- **React Hook Form**: For efficient form handling with validation
- **Zod**: TypeScript-first schema validation library
- **React Query**: For data fetching, caching, and state management
- **Sonner**: Beautiful, accessible toast notifications
- **Embla Carousel**: Lightweight carousel component for image galleries
- **Recharts**: Composable charting library for data visualization

### Backend & Database

- **Supabase**: PostgreSQL database with real-time subscriptions
- **Row Level Security**: User data isolation and security

### Developer Tools

- **ESLint**: For code linting and maintaining code quality
- **TypeScript-ESLint**: ESLint rules for TypeScript
- **PostCSS**: Tool for transforming CSS with JavaScript plugins
- **Autoprefixer**: Plugin to parse CSS and add vendor prefixes

## Database Setup

This project uses **Supabase** as the backend database. To get started:

1. **Create a Supabase account** at [https://supabase.com](https://supabase.com)
2. **Follow the setup guide** in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. **Configure your environment variables** in `.env`

### Key Features with Supabase:

- ✅ **Persistent task storage**: Tasks are saved to PostgreSQL database
- ✅ **Real-time updates**: Changes sync across browser tabs
- ✅ **User isolation**: Each user sees only their tasks (RLS enabled)
- ✅ **Automatic backups**: Supabase handles database backups
- ✅ **Scalable**: Ready for production deployment

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or newer)
- npm or yarn
- Cuenta en [Supabase](https://supabase.com) (gratuita)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd Taskify

# Install dependencies
npm install
# or
yarn install

# Configure Supabase (see SUPABASE_SETUP.md for detailed instructions)
cp .env.example .env
# Edit .env with your Supabase credentials

# Start the development server
npm run dev
# or
yarn dev
```

**Important**: Before running the app, you need to configure Supabase. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

The application will be available at http://localhost:8080

### Building for Production

```sh
# Build the application
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

## Project Structure

```
Taskify/
├── public/                 # Static assets
│   ├── favicon.ico         # Site favicon
│   ├── placeholder.svg     # Placeholder image
│   └── robots.txt          # SEO configuration
├── src/
│   ├── assets/             # Images and other assets
│   │   └── task-hero.jpg   # Hero image for the application
│   ├── components/         # UI components
│   │   ├── ui/             # shadcn-ui components (design system)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...        # Other UI components
│   │   ├── TaskCard.tsx   # Component for individual task display
│   │   ├── TaskForm.tsx   # Component for creating/editing tasks
│   │   ├── TaskList.tsx   # Component for displaying task lists
│   │   ├── TaskManager.tsx # Main task management component
│   │   └── TaskSlider.tsx # Task visualization component
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx # Hook for responsive design
│   │   └── use-toast.ts   # Hook for toast notifications
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Common utility functions
│   ├── pages/             # Application pages
│   │   ├── Index.tsx      # Home page component
│   │   └── NotFound.tsx   # 404 page component
│   ├── App.css            # Main application styles
│   ├── App.tsx            # Main App component with routing
│   ├── index.css          # Global CSS styles
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite type definitions
├── bun.lockb              # Bun lockfile (dependency versions)
├── components.json        # shadcn-ui components configuration
├── eslint.config.js       # ESLint configuration
├── index.html             # Entry HTML file
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.app.json      # TypeScript config for app
├── tsconfig.json          # Main TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Node.js
└── vite.config.ts         # Vite build configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn-ui](https://ui.shadcn.com) for the beautiful UI components
- [Vite](https://vitejs.dev) for the blazing fast development experience
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com) for accessible UI primitives

## Built With AI & Modern Tools

This project was developed using cutting-edge AI tools and modern development platforms:

- **🤖 Claude Sonnet 4**: AI assistant for architecture, code generation, and problem-solving
- **💻 GitHub Copilot**: AI pair programming for faster development
- **🎨 Lovable**: AI-powered frontend generation for rapid prototyping
- **🗄️ Supabase**: Backend-as-a-Service for database and real-time functionality

*This demonstrates the power of AI-assisted development in creating modern, production-ready applications.*
