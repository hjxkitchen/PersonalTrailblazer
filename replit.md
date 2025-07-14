# Portfolio Journey Application - replit.md

## Overview

This is an interactive 3D portfolio application that tells the story of an unconventional journey from Tanzania to San Francisco. The application combines a React Three.js frontend with an Express.js backend, using modern web technologies to create an immersive storytelling experience through a 3D mountain scene with interactive journey milestones.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling
- **State Management**: Zustand for client-side state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: Hot module replacement via Vite integration
- **Static Serving**: Express static file serving with Vite middleware in development

### Database & Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but using in-memory storage for now)
- **Schema**: User management with username/password authentication
- **Storage Interface**: Abstracted storage layer with both memory and database implementations

## Key Components

### 3D Interactive Scene
- **Mountain Terrain**: Procedurally generated landscape with peaks and valleys
- **Journey Path**: Curved 3D path representing life milestones using CatmullRom curves
- **Interactive Markers**: Clickable milestone markers with hover effects and animations
- **Camera Controls**: WASD/arrow key navigation with smooth movement
- **Lighting**: Directional and ambient lighting for realistic scene rendering

### Portfolio Storytelling
- **Milestone System**: Interactive story points along the 3D journey path
- **Story Panels**: Dynamic UI overlays showing milestone details, challenges, and achievements
- **Progress Visualization**: Visual representation of completed vs future milestones
- **Responsive Design**: Adaptive layout for desktop and mobile experiences

### UI/UX Features
- **Keyboard Controls**: WASD movement with space/shift for vertical navigation
- **Modal Systems**: Story panels, contact forms, and information overlays
- **Loading States**: Suspense boundaries with custom loading animations
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Data Flow

### Journey Data Management
1. **Static Journey Data**: Milestone information stored in TypeScript files
2. **State Management**: Zustand stores manage current milestone selection and view states
3. **3D Scene Updates**: React Three Fiber components react to state changes
4. **UI Synchronization**: Story panels and navigation update based on selected milestones

### User Interaction Flow
1. **Initial Load**: 3D scene renders with journey path and milestone markers
2. **Navigation**: Users move through the scene using keyboard controls
3. **Milestone Selection**: Clicking markers updates the current milestone state
4. **Story Display**: UI overlays show detailed information about selected milestones
5. **View Switching**: Toggle between 3D interactive and traditional portfolio views

## External Dependencies

### 3D Rendering Stack
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and abstractions for React Three Fiber
- **@react-three/postprocessing**: Post-processing effects for enhanced visuals
- **three**: Core 3D rendering library

### UI Component Library
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class variants
- **clsx**: Conditional className utility

### Development Tools
- **vite**: Fast build tool with HMR support
- **typescript**: Type safety across the entire application
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting in development

### Database & ORM
- **drizzle-orm**: Type-safe SQL ORM
- **@neondatabase/serverless**: PostgreSQL database adapter
- **drizzle-kit**: Database migration and introspection tools

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Assets**: 3D models, textures, and fonts included in build
- **Environment**: Production build uses NODE_ENV=production

### Development Environment
- **Hot Reload**: Vite middleware integrated with Express server
- **Error Handling**: Runtime error overlays for rapid debugging
- **File Watching**: Automatic rebuilds on file changes
- **TypeScript Checking**: Real-time type checking during development

### Production Considerations
- **Static Assets**: Optimized texture loading and 3D model compression
- **Performance**: Lazy loading and code splitting for optimal bundle sizes
- **Browser Compatibility**: WebGL support detection and fallbacks
- **Mobile Optimization**: Touch controls and responsive 3D rendering

### Database Setup
- **Migration System**: Drizzle Kit handles database schema migrations
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection
- **Development Storage**: In-memory storage fallback for development
- **Production Ready**: Configured for PostgreSQL deployment with connection pooling