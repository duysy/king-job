# King Job Platform - Frontend

## Project Overview

This is the React.js frontend for the King Job platform, providing a user-friendly interface for creating, managing, and collaborating on blockchain-powered job postings.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/duysy/king-job.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

In the project directory, you can run:

#### `npm start`
- Runs the app in development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- The page will reload if you make edits.
- You will also see any lint errors in the console.

#### `npm run build`
- Builds the app for production to the `build` folder.
- Correctly bundles React in production mode.
- Optimizes the build for the best performance.

#### `npm run deploy`
- Serves the production build using `serve`.
- Useful for testing the production build locally.

## Project Structure

```
frontend/
│
├── public/
│   ├── index.html
│   └── ...
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-specific pages
│   ├── services/          # API and data handling logic
│   ├── utils/             # Utility functions and helpers
│   ├── App.js             # Main application component
│   └── index.js           # Entry point for React
│
├── package.json
└── README.md
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `build` folder to your hosting service.

## Technologies Used

- **React.js**: For building the user interface.
- **React Router**: For handling navigation.
- **Tailwind CSS**: For styling and responsive design.
- **Axios**: For making API calls.
- **Web3.js**: For blockchain interactions.
- **React Query**: For data fetching and caching.
