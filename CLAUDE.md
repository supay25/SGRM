# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SGRM is a full-stack application with:
- **Backend**: Node.js/Express server with REST API
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: Empty client directory (not yet implemented)

The project uses modern authentication patterns with JWT tokens and password hashing with bcryptjs.

## Architecture

### Backend Structure

The server follows a layered MVC-inspired architecture:

```
server/src/
├── index.js           # Express app setup, middleware configuration, and server startup
├── config/
│   └── db.js         # Prisma client singleton for database access
├── routes/
│   └── auth.routes.js # Route definitions for authentication endpoints
├── controllers/
│   └── auth.controller.js # Request handlers and business logic
└── services/
    └── auth.service.js    # Service layer for business operations (e.g., registrarUsuario)
```

**Key Architecture Patterns:**
- Express middleware stack includes CORS, Morgan logging, and JSON parsing
- Prisma Client is exported as a singleton from `config/db.js` for use across controllers/services
- Services layer handles database operations and business logic
- Controllers act as HTTP request handlers that call services
- Routes define the API endpoints and map them to controllers

### Database Schema

PostgreSQL database with Prisma as ORM. Currently defined schema in `prisma/schema.prisma`:
- **User model**: Stores user credentials with roles (SUPER_ADMIN, OWNER)
  - Fields: id, name, email (unique), password, role, isActive, timestamps
  - Enum: UserRole with SUPER_ADMIN and OWNER values

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Run server in development mode with hot-reload (nodemon)
npm run dev

# Run server in production mode
npm start
```

### Database

```bash
# Apply pending Prisma migrations to the database
npx prisma migrate deploy

# Create and apply a new migration after schema changes
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (web UI for database inspection)
npx prisma studio

# Generate Prisma Client code (done automatically on install)
npx prisma generate
```

## Environment Setup

The project requires a `.env` file at `server/.env` with:

```
DATABASE_URL="postgresql://user:password@host:port/database_name?schema=public"
PORT=5000  # Optional, defaults to 5000
```

The current setup connects to PostgreSQL at localhost:5432 with database name SGRM.

## Development Workflow

1. **Making Database Changes**: Update the schema in `prisma/schema.prisma`, then run `npx prisma migrate dev` to create and apply migrations.

2. **Adding API Endpoints**: 
   - Define route in `server/src/routes/*.routes.js`
   - Create controller method in `server/src/controllers/*.controller.js`
   - Create service method in `server/src/services/*.service.js` for database operations
   - Import Prisma from `config/db.js` in services

3. **Testing Endpoints**: Use `npm run dev` to start the server. Health check available at `GET /api/health`.

## Dependencies

**Core**:
- `express@5.2.1` - Web framework
- `@prisma/client@7.8.0` - Database ORM and client
- `dotenv@17.4.2` - Environment variable management

**Authentication**:
- `jsonwebtoken@9.0.3` - JWT token generation and verification
- `bcryptjs@3.0.3` - Password hashing

**Utilities**:
- `cors@2.8.6` - CORS middleware
- `morgan@1.11.0` - HTTP request logger

**Dev**:
- `prisma@7.8.0` - Prisma CLI and schema tooling
- `nodemon@3.1.14` - Automatic server restart on file changes
