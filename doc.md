# StoreRate - Low Level Design (LLD) & Architecture Documentation

This document serves as the foundational technical blueprint for the StoreRate platform. It provides all the necessary details, components, API contracts, and structural relationships required to construct a comprehensive Low-Level Design (LLD) diagram or a System Architecture Diagram.

## 1. System Overview
StoreRate is a full-stack web application designed to allow users to discover local businesses, read reviews, and share their own ratings. It supports different user personas:
- **Customer (normal_user):** Can browse stores, search, and leave ratings/reviews.
- **Store Owner (store_owner):** Can create and manage their own store profiles, reply to reviews (if implemented), and view store analytics.
- **System Admin (system_admin):** Has global moderation and management capabilities.

## 2. Technology Stack
- **Frontend Framework:** Next.js (App Router) / React
- **Styling:** Tailwind CSS, Radix UI primitives (via shadcn/ui components)
- **Backend/API:** Next.js Serverless Route Handlers (`app/api/*`)
- **Database ORM:** Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** Custom JWT (JSON Web Token) implementation using the `jose` library, stored in secure HttpOnly cookies.
- **Icons:** Lucide-React

## 3. High-Level Architecture
1. **Client Layer:** Next.js React components (Client Components for interactivity, Server Components for SEO and initial data fetching).
2. **API Layer (BFF - Backend For Frontend):** Next.js API Routes acting as the controller layer. Handles incoming HTTP requests, validates payloads, verifies JWT tokens, and orchestrates database calls.
3. **Data Access Layer (DAL):** Prisma Client acts as the bridge between the API routes and the PostgreSQL database, providing type-safe database queries.
4. **Database Layer:** Hosted PostgreSQL instance storing relational data.

## 4. Database Schema (Entity-Relationship Diagram details)

### `User` (users table)
- `id` (Int, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `passwordHash` (String) - bcrypt/scrypt hashed password
- `role` (Enum: `system_admin`, `normal_user`, `store_owner`)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- **Relationships:**
  - `1:N` with `Store` (A store owner can own multiple stores).
  - `1:N` with `Rating` (A user can leave multiple ratings).

### `Store` (stores table)
- `id` (Int, Primary Key)
- `name` (String)
- `slug` (String, Unique) - Used for SEO-friendly URLs (`/stores/[slug]`)
- `description` (String, Optional)
- `address` (String)
- `phone` (String, Optional)
- `email` (String, Optional)
- `website` (String, Optional)
- `image` (String, Optional)
- `ownerId` (Int, Foreign Key -> `User.id`)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- **Relationships:**
  - `N:1` with `User` (Owner).
  - `1:N` with `Rating` (A store has many ratings).

### `Rating` (ratings table)
- `id` (Int, Primary Key)
- `userId` (Int, Foreign Key -> `User.id`)
- `storeId` (Int, Foreign Key -> `Store.id`)
- `rating` (Int) - Usually 1 to 5
- `review` (String, Optional) - Textual review
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- **Constraints:**
  - Unique composite key on `[userId, storeId]` ensuring a user can only rate a specific store once.

## 5. Authentication & Security Flow
1. **Login/Registration:** User submits credentials to `POST /api/auth/login` or `/register`.
2. **Validation:** Backend verifies credentials against the database.
3. **Token Generation:** A JWT is signed (using `jose`) containing the payload `{ id, email, name, role }`.
4. **Token Delivery:** The JWT is set as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie on the client's browser.
5. **Authenticated Requests:** Subsequent requests to protected API endpoints automatically include the cookie. The backend extracts the cookie, verifies the JWT signature, and identifies the user.
6. **Client-Side State:** The frontend occasionally fetches `/api/auth/me` or reads a non-HttpOnly signal/localStorage object to maintain UI state (e.g., displaying the user's name).

## 6. API Endpoints Catalog

### Authentication (`/api/auth/*`)
- **`POST /api/auth/register`**
  - Payload: `{ name, email, password, role }`
  - Action: Hashes password, creates User, issues JWT cookie.
- **`POST /api/auth/login`**
  - Payload: `{ email, password }`
  - Action: Validates user, issues JWT cookie.
- **`POST /api/auth/logout`**
  - Action: Clears the JWT cookie.
- **`GET /api/auth/me`**
  - Action: Returns the current authenticated user's details based on the JWT payload.

### Stores (`/api/stores/*`)
- **`GET /api/stores`**
  - Action: Fetches a list of stores. Supports query parameters for search, filtering, and pagination.
- **`POST /api/stores`**
  - Payload: `{ name, description, address, phone, email, website, image }`
  - Auth: Requires valid JWT (Role: `store_owner` or `system_admin`).
  - Action: Creates a new store and assigns `ownerId` based on the JWT payload. Automatically generates a unique slug.
- **`GET /api/stores/[slug]`**
  - Action: Retrieves a single store's details, including its aggregated ratings and reviews.
- **`PUT /api/stores/[slug]`**
  - Auth: Requires valid JWT (Must be the owner of the store or admin).
  - Action: Updates store details.
- **`DELETE /api/stores/[slug]`**
  - Auth: Requires valid JWT (Must be the owner of the store or admin).
  - Action: Deletes the store.

### Ratings & Reviews (`/api/ratings/*`)
- **`POST /api/ratings`**
  - Payload: `{ storeId, rating, review }`
  - Auth: Requires valid JWT.
  - Action: Upserts (creates or updates) a rating for the specified store by the authenticated user.
- **`GET /api/ratings`** (Optionally filtered by `?storeId=` or `?userId=`)
  - Action: Fetches a list of ratings.
- **`DELETE /api/ratings/[id]`**
  - Auth: Requires valid JWT (Must be the author of the rating or admin).

### User Management (`/api/user/*`)
- **`GET /api/user/profile`**
  - Auth: Requires valid JWT.
  - Action: Retrieves the detailed profile of the authenticated user, including their activity history (recent ratings left, stores owned).
- **`PUT /api/user/profile`**
  - Auth: Requires valid JWT.
  - Action: Updates user profile details (e.g., name, avatar).

### Admin (`/api/admin/*`)
- **`GET /api/admin/dashboard`**
  - Auth: Requires valid JWT (Role: `system_admin`).
  - Action: Fetches global system statistics (total users, total stores, total ratings, system health).

## 7. Folder Structure Details (for LLD Mapping)
- `app/` - Next.js App Router root. Contains all page routes (`page.tsx`) and layouts (`layout.tsx`).
  - `app/api/` - Backend API Controllers.
  - `app/(auth)/login`, `app/(auth)/register` - Authentication UI pages.
  - `app/stores/` - Store listing and individual store details UI pages.
  - `app/profile/` - User dashboard and profile UI.
- `components/` - Reusable React components.
  - `components/ui/` - Shadcn UI primitive components (buttons, inputs, dialogs).
- `lib/` - Shared utility functions.
  - `lib/auth.ts` - JWT signing/verifying and cookie parsing logic.
  - `lib/db.ts` - Prisma client instantiation.
  - `lib/get-user.ts` - Helper function to extract user session from cookies server-side.
- `prisma/`
  - `schema.prisma` - The source of truth for the database schema.

## 8. State Management & Data Flow Diagram Logic
1. **User action** (e.g., "Submit Review") -> 
2. **React Component State Update** (loading state = true) -> 
3. **Fetch API Call** (`POST /api/ratings`) with credentials included -> 
4. **Next.js API Route Handler** -> 
5. Parses and validates cookie (`lib/auth.ts`) -> 
6. Extracts `userId` -> 
7. Executes **Prisma Query** (`prisma.rating.upsert`) -> 
8. **PostgreSQL** processes transaction -> 
9. Returns success to API Route -> 
10. API Route returns 200 OK JSON -> 
11. **React Component** updates UI (e.g., shows toast notification, refreshes data via `router.refresh()`).

---
*End of Design Document.*