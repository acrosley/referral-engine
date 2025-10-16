# Neon Database Setup Guide

This guide will help you set up Neon database integration for your referral engine project.

## Prerequisites

1. A Neon account (sign up at [neon.tech](https://neon.tech))
2. Node.js and npm installed
3. Your project dependencies installed (`npm install`)

## Setup Steps

### 1. Create a Neon Database

1. Go to the [Neon Console](https://console.neon.tech)
2. Create a new project or use an existing one
3. Copy your connection string (it will look like `postgresql://username:password@host:port/database?sslmode=require`)

### 2. Set Up Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Neon connection string:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
   ```

### 3. Set Up Database Tables

1. Go to the Neon SQL Editor in your Neon Console
2. Copy and paste the contents of `scripts/neon-setup.sql`
3. Run the SQL script to create all necessary tables

### 4. Test the Connection

Run the connection test script:

```bash
npx tsx scripts/test-neon-connection.ts
```

This will verify that:
- Your DATABASE_URL is set correctly
- The database connection works
- Required tables exist
- You can insert and retrieve data

### 5. Test the Demo Page

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/neon-demo`
3. Try submitting a comment to test the form

## Database Schema

The setup script creates the following tables:

### `comments`
- Simple table for testing the Neon integration
- Fields: `id`, `comment`, `created_at`

### `case_submissions`
- Main table for storing referral submissions
- Includes all fields for the referral engine workflow
- Has indexes for performance optimization

### `partner_firms`
- Table for storing partner law firm information
- Includes specialties, capacity, and acceptance rates
- Sample data is inserted for testing

## Troubleshooting

### Connection Issues
- Verify your DATABASE_URL is correct
- Check that your Neon database is active
- Ensure SSL mode is set to `require`

### Table Issues
- Make sure you ran the `neon-setup.sql` script
- Check the Neon SQL Editor for any error messages
- Verify table permissions

### Environment Issues
- Ensure `.env.local` exists and has the correct DATABASE_URL
- Restart your development server after changing environment variables
- Check that the file is not committed to version control

## Next Steps

Once your Neon database is set up and tested:

1. Update your existing API routes to use the new database connection
2. Test the referral form submission process
3. Verify that all database operations work correctly
4. Deploy to production with the new database configuration

## Migration from Vercel Postgres

If you're migrating from Vercel Postgres:

1. Export your data from Vercel Postgres
2. Import the data into your Neon database
3. Update your environment variables
4. Test thoroughly before switching production traffic

## Support

- [Neon Documentation](https://neon.tech/docs)
- [Neon Discord](https://discord.gg/neon)
- [Neon GitHub](https://github.com/neondatabase)
