# Warehouse Management System - Frontend

## Overview

This is the frontend application for a Warehouse Management System built with Next.js. It provides a user interface for interacting with products, sellers, buyers, and orders in a marketplace environment.

## Technology Stack

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Axios** for API communication

## Features

- View and manage products
- View and manage sellers
- View and manage buyers
- View and manage orders
- Responsive design for desktop and mobile devices

## Setup and Installation

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn package manager

### Steps

1. Clone the repository

   ```
   git clone https://your-repository-url.git
   cd warehouse-frontend
   ```

2. Install dependencies

   ```
   npm install
   # or
   yarn install
   ```

3. Configure API connection

   - Create a `.env.local` file in the root directory
   - Add the following environment variable:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8085/api
     ```

4. Run the development server

   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Project Structure

### Key Directories

- `src/app` - Next.js pages and routes
- `src/components` - Reusable React components
- `src/hooks` - Custom React hooks
- `src/services` - API service functions
- `src/types` - TypeScript type definitions
- `public` - Static assets

### Main Pages

- `/` - Home page
- `/products` - Product listing
- `/products/[id]` - Product details
- `/products/create` - Create new product
- `/products/edit/[id]` - Edit product
- `/sellers` - Seller listing
- `/sellers/[id]` - Seller details
- `/sellers/create` - Create new seller
- `/sellers/edit/[id]` - Edit seller
- `/buyers` - Buyer listing
- `/buyers/[id]` - Buyer details
- `/buyers/create` - Create new buyer
- `/buyers/edit/[id]` - Edit buyer
- `/orders` - Order listing
- `/orders/[id]` - Order details
- `/orders/create` - Create new order
- `/orders/edit/[id]` - Edit order

## Core Components

- **API Hooks** - `useApi.ts` contains custom hooks for data fetching and mutations
- **Navigation** - `Navigation.tsx` provides the application header with navigation links
- **Layouts** - `layout.tsx` defines the base layout structure

## State Management

- The application uses React's built-in state management with hooks
- `useState` and `useEffect` are used for local component state
- Custom `useFetch` and `useMutation` hooks handle API communication

## Styling

- Tailwind CSS is used for styling components
- Global styles are defined in `globals.css`
- The application supports light and dark modes using CSS variables

## Building for Production

```
npm run build
# or
yarn build
```

## Running in Production

```
npm start
# or
yarn start
```

## Deployment

The frontend can be deployed to various platforms:

- **Vercel** (recommended for Next.js apps)

  ```
  vercel
  ```

- **Netlify**
  - Connect your GitHub repository to Netlify
  - Set build command to `npm run build`
  - Set publish directory to `out`

## Browser Support

The application is tested and supported on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request
