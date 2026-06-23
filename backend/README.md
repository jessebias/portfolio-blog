# Portfolio Blog Backend (PostgreSQL)

This is the backend for the Portfolio Blog application, migrated from MongoDB to PostgreSQL.

## Prerequisites

- Node.js
- PostgreSQL

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

1.  **Create the Database**:
    ```bash
    createdb portfolio_blog
    ```

2.  **Create a Database User** (Optional, if you want a dedicated user):
    ```bash
    psql -d portfolio_blog -c "CREATE USER portfolio_blog_admin WITH ENCRYPTED PASSWORD 'password123';"
    psql -d portfolio_blog -c "GRANT ALL ON SCHEMA public TO portfolio_blog_admin;"
    ```
    *Note: If you encounter permission errors, ensuring the user has rights to the `public` schema is crucial.*

3.  **Environment Variables**:
    Copy `.env` and update the database credentials if necessary.
    ```
    DB_USER=portfolio_blog_admin  # or your postgres user
    DB_NAME=portfolio_blog
    DB_PASSWORD=password123       # or your postgres password
    ```

### 3. Initialize Database Tables
Run the initialization script to create the `users` and `blogs` tables.
```bash
npm run db:init
```

## Running the Server

- **Development Mode**:
    ```bash
    npm run dev
    ```
- **Production Mode**:
    ```bash
    npm start
    ```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Blogs
- `GET /api/blogs` - Get all blogs (includes user info)
- `POST /api/blogs` - Create a blog
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
