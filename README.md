# 🚀 Taskify - Modern Task Management App

> A scalable, feature-based React application for efficient task management with Google Calendar integration and modern UI components.

![Taskify Hero](src/assets/task-hero.png)

## ✨ Key Features

- **📝 Advanced Task Management**: Create, edit, delete, and organize tasks with intuitive UI
- **🎨 Priority & Color Coding**: Visual organization with customizable colors and priority levels
- **📅 Google Calendar Integration**: Seamless sync with your Google Calendar
- **📱 Responsive Design**: Perfect experience across all devices
- **🌓 Dark/Light Mode**: Toggle between themes for optimal viewing
- **⚡ Real-time Updates**: Instant sync across browser tabs with Supabase
- **🔄 Task Views**: Switch between grid and slider views
- **✅ Smart Filtering**: Collapsible completed tasks section
- **🎯 Modern Architecture**: Feature-based structure for scalability

## 🛠️ Technology Stack

### **Core Technologies**
- **React 18.3.1** - Modern functional components with hooks
- **TypeScript** - Type-safe development experience  
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling framework

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security** - Secure user data isolation
- **Google Calendar API** - Task synchronization with Google services

### **UI & Design System**
- **Shadcn/UI** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide Icons** - Beautiful, consistent icon set
- **CVA** - Class variance authority for component variants

### **State Management & Data**
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Efficient form handling with validation
- **Zod** - TypeScript-first schema validation

### **Developer Experience**
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript ESLint** - Advanced TypeScript linting rules

## 🏗️ Project Architecture

Taskify follows a **feature-based architecture** for maximum scalability and maintainability:

```
src/
├── features/                    # 🎯 Feature modules
│   ├── tasks/                  # Task management feature
│   │   ├── components/         # TaskCard, TaskForm, TaskList, TaskSlider
│   │   ├── hooks/             # useTasks, useGoogleCalendar
│   │   ├── services/          # taskService, googleCalendarService
│   │   ├── types/             # task.types.ts (centralized types)
│   │   └── index.ts           # Feature exports
│   └── app/                   # Main application feature
│       ├── components/        # TaskManager (main component)
│       └── index.ts           # App exports
├── shared/                     # 🔄 Shared resources
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Core design system (10 essential components)
│   ├── hooks/                # Shared hooks (useToast, useMobile)
│   ├── services/             # Shared services (supabase)
│   ├── utils/                # Utilities (cn, dateFormatters)
│   └── index.ts              # Shared exports
├── pages/                     # 📄 Application pages
│   ├── Index.tsx             # Home page
│   └── NotFound.tsx          # 404 page
├── assets/                    # 🖼️ Static assets
└── styles/                    # 🎨 Global styles
```

### **🎯 Architecture Benefits**

- **Feature Isolation**: Each feature is self-contained and independent
- **Scalability**: Easy to add new features without affecting existing code
- **Code Reusability**: Shared components and utilities across features
- **Type Safety**: Centralized types per feature for better TypeScript experience
- **Bundle Optimization**: Only 10 essential UI components (removed 47 unused ones)
- **Clean Imports**: Barrel exports for organized import statements

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn** package manager
- **Supabase** account (free tier available)
- **Google Cloud** account (for Calendar API - optional)

### **🛠️ Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/taskify.git
cd taskify
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional)
```

4. **Database Setup**
```bash
# Run the provided SQL script in your Supabase SQL editor
# File: supabase-setup.sql
```

5. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

🎉 **Application will be available at:** `http://localhost:8080`

### **📦 Build for Production**

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

## 💾 Database Setup

This project uses **Supabase** as the backend:

### **Quick Setup:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run `supabase-setup.sql` in SQL Editor
4. Copy project URL and anon key to `.env`

### **Database Features:**
- ✅ **PostgreSQL** with real-time subscriptions
- ✅ **Row Level Security** for user data isolation  
- ✅ **Auto-backup** and scaling
- ✅ **Type-safe** queries with generated types

## 📱 Features Showcase

### **Task Management**
- **Create Tasks**: Rich form with title, description, priority, color, and date
- **Smart Views**: Toggle between grid and slider layouts
- **Priority System**: High, Medium, Low with visual indicators
- **Color Coding**: 8 predefined colors for task categorization
- **Quick Actions**: Mark complete, delete, edit tasks

### **Google Calendar Integration**
- **Auto-sync**: Tasks automatically added to Google Calendar
- **Two-way sync**: Changes reflect in both applications  
- **Smart scheduling**: Respect existing calendar events

### **User Experience**
- **Dark/Light Mode**: System preference with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Updates**: Changes sync instantly across tabs
- **Smooth Animations**: Micro-interactions for better UX
- **Accessibility**: Full keyboard navigation and screen reader support

## 🎨 Design System

Taskify uses a **modern design system** built with:

- **10 Essential UI Components** (optimized from 54 original)
- **Consistent Color Palette** with dark/light mode support
- **Typography Scale** for hierarchical information
- **Spacing System** based on Tailwind's spacing scale
- **Animation Library** for smooth micro-interactions

## 🧪 Development Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📊 Performance Optimizations

- **Bundle Size**: Reduced by 40-50% by removing unused components
- **Tree Shaking**: Only essential code included in build
- **Code Splitting**: Feature-based modules for optimal loading
- **Image Optimization**: Optimized assets for faster loading
- **Lazy Loading**: Ready for component-level lazy loading

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow the feature-based architecture
- Use TypeScript for type safety
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Shadcn/UI](https://ui.shadcn.com)** - Beautiful, accessible component library
- **[Supabase](https://supabase.com)** - Backend-as-a-Service platform
- **[Vite](https://vitejs.dev)** - Next-generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com)** - Low-level UI primitives

## 🤖 Built with AI Assistance

This project demonstrates **modern AI-assisted development**:

- **� Claude Sonnet 4**: Architecture design and code generation
- **💻 GitHub Copilot**: AI pair programming for faster development  
- **🎨 Lovable**: AI-powered frontend generation for rapid prototyping
- **🗄️ Supabase**: Intelligent backend services with auto-generated types

---

**⭐ Star this repository if you found it helpful!**

Made with ❤️ using modern React and AI assistance.
