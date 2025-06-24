# Katsura Kotaro Ultimate Fan Adventure

## Overview

This is a full-stack web application dedicated to the character Katsura Kotaro from the anime/manga series Gintama. The application features an interactive fan experience with games, quotes, photo galleries, quizzes, and various activities themed around the character's comedic and revolutionary persona.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server:

- **Frontend**: React-based single-page application (SPA) built with TypeScript and Vite
- **Backend**: Node.js Express server with TypeScript support
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Development Environment**: Configured for Replit with hot reload and PostgreSQL support

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and API calls
- **Framer Motion** for animations and interactive elements
- **Tailwind CSS** with custom Katsura-themed colors and animations
- **shadcn/ui** component library for consistent UI elements

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations with PostgreSQL
- **RESTful API** design with proper error handling
- **Memory storage fallback** for development when PostgreSQL is not available
- **Session management** with connect-pg-simple

### Database Schema
The application uses four main data models:
- **quotes**: Stores character quotes with categories and active status
- **activities**: Daily activities like disguises, missions, and messages
- **quizResults**: User quiz responses and patriot level calculations
- **gameScores**: High scores and achievements for the interactive game

### Key Features
1. **Interactive Quiz System**: Personality quiz to determine "patriot level"
2. **Daily Activities Tracker**: Displays today's disguises, missions, and Elizabeth messages
3. **Quote Generator**: Categorized quotes with sound effects
4. **Photo Gallery**: Character moments and scenes
5. **Stick Figure Game**: Browser-based action game with Katsura as protagonist
6. **Interactive Elements**: Elizabeth feeding, costume changes, scenario responses

## Data Flow

1. **Client-Server Communication**: Uses TanStack Query for API calls with proper caching and error handling
2. **State Management**: Combination of React hooks and TanStack Query for server state
3. **Real-time Updates**: Activities and quotes are fetched dynamically from the API
4. **Sound Effects**: Custom audio system using Web Audio API for interactive feedback
5. **Animation System**: Framer Motion handles page transitions and interactive animations

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, TypeScript)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- Vite for build tooling

### UI and Styling
- Tailwind CSS for styling
- Radix UI primitives for accessible components
- shadcn/ui component library
- Google Fonts (Nunito, Creepster)
- Font Awesome for icons

### Development Tools
- TypeScript for type safety
- ESBuild for server bundling
- PostCSS with Tailwind
- Various React development tools

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Mode
- Runs on port 5000 with hot reload
- Uses Vite development server with middleware mode
- PostgreSQL database provisioned through Replit
- Environment variables for database connection

### Production Build
- Vite builds the client-side assets to `dist/public`
- ESBuild bundles the server code to `dist/index.js`
- Static file serving for production assets
- Autoscale deployment target for optimal performance

### Environment Configuration
- Database URL required for PostgreSQL connection
- Development/production mode switching
- Replit-specific plugins for development experience

## Changelog

- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.