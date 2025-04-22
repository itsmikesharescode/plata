# Project Name

Ifugao State University Management System

## Prerequisites

- Docker
- Supabase CLI (`npm install -g supabase`)
- Node.js (v18+ recommended)

## Getting Started

1. Start Supabase services:

```bash
supabase stop && supabase start
```

2. Database setup and Create admin account:

   - Run `schema.sql` in Supabase SQL Editor
   - Navigate to Supabase Authentication page
   - Manually create initial admin user
   - Follow `cold_start.sql` instructions
   - Execute `trigger_on_auth_change.sql` in SQL Editor

3. Start development server:

```bash
npm install
npm run dev
```

## Technology Stack

### Frontend

- **SvelteKit**: Full-stack framework for reactive UI components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript implementation

### Backend

- **Supabase**: Authentication, real-time database, and storage
- **PostgreSQL**: Relational database with Row-Level Security

### Infrastructure

- **Docker**: Containerization for local development
- **Supabase CLI**: Local development environment management
