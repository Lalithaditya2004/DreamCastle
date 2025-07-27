# PG Management System Frontend

A comprehensive React TypeScript frontend for managing Paying Guest (PG) accommodations.

## Features

- **Complete CRUD Operations** for all entities (Owners, PGs, Rooms, Guests, Wardens, Workers)
- **Advanced Search & Filtering** capabilities
- **Dark/Light Mode** toggle
- **Responsive Design** for desktop and mobile
- **Modern UI** with Tailwind CSS
- **Type-safe** with TypeScript

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API endpoint:**
   ```bash
   cp .env.example .env
   # Edit .env and set your API base URL
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

The frontend integrates with all backend endpoints:

### Owners
- Create, view, and update owner details
- Search owners by PG ID

### PGs (Paying Guests)
- Full CRUD operations
- Search by owner ID
- Update revenue and warden assignments

### Rooms
- Create and manage rooms
- Search by PG, floor, or room number
- Find vacant rooms with advanced filtering
- View cleaning status by floor

### Guests
- Complete guest management
- Search by PG, room, or floor
- Update fee status and dates
- Assign rooms to guests
- View pending payments

### Wardens
- Create and manage wardens
- Search by PG
- Update salary status

### Workers
- Full worker management
- Search by PG and job title
- Update salary status

## Environment Variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Theme)
├── pages/              # Main application pages
├── services/           # API service functions
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Configure your API base URL in the environment variables

The application is ready for deployment and requires no additional configuration beyond setting the API endpoint.