# Replit.md - Full-Stack Web Application Guide

## Overview

This is a full-stack web application built with React (frontend) and Express.js (backend), featuring a modern UI component library (shadcn/ui), PostgreSQL database with Drizzle ORM, and TypeScript throughout. The application appears to be set up for an e-commerce or fashion website based on the hero carousel component and styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Build Tool**: esbuild for server bundling
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL (configured for, but can be adapted)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Connection**: Neon Database serverless driver
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Key Components

### Frontend Components
1. **UI Components**: Complete shadcn/ui component library including buttons, forms, dialogs, carousels, etc.
2. **Hero Carousel**: Image carousel component for showcasing products/content
3. **Routing System**: Simple route setup with Home and 404 pages
4. **Query Client**: Configured TanStack Query for API data fetching

### Backend Components
1. **Express Server**: Main server with middleware for JSON parsing, logging, and error handling
2. **Storage Layer**: Abstracted interface for data operations with in-memory implementation
3. **Routes System**: Modular route registration system (currently minimal)
4. **Vite Integration**: Development server integration for HMR and asset serving

### Database Schema
- **Users Table**: Basic user entity with id, username, and password fields
- **Schema Validation**: Zod schemas for type-safe database operations
- **Migration System**: Drizzle Kit for database schema migrations

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data from API endpoints
2. **API Layer**: Express routes handle HTTP requests and interact with storage layer
3. **Storage Layer**: Abstracted storage interface allows switching between in-memory and database implementations
4. **Database Operations**: Drizzle ORM handles type-safe database queries and migrations
5. **Response Flow**: Data flows back through the same layers with proper error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **wouter**: Lightweight routing

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment setting (development/production)
- **Port Configuration**: Server runs on configurable port

### Development Workflow
- **Hot Reload**: Vite HMR for frontend changes
- **TypeScript Checking**: Separate type checking process
- **Database Migrations**: Push schema changes directly to database
- **Logging**: Request/response logging for API endpoints

### Production Considerations
- **Static Assets**: Frontend built assets served by Express in production
- **Error Handling**: Centralized error middleware for API routes
- **Session Management**: Cookie-based sessions with PostgreSQL store
- **Security**: CORS and security headers should be configured for production

## Notes

- The storage layer is currently implemented with in-memory storage for development
- Database schema supports user authentication but routes are not yet implemented
- The UI is themed for a fashion/e-commerce application
- All TypeScript configurations support both client and server code
- The application is set up to work seamlessly in the Replit environment with special development tooling