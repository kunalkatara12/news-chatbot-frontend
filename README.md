# News Chatbot Frontend

This is a modern, responsive frontend application for a Retrieval-Augmented Generation (RAG) chatbot. It provides a user-friendly interface for users to interact with a conversational AI backend, manage chat sessions, and view conversation history.

---

## Features

- **Welcome Screen**: A simple onboarding screen to capture the user's name and create a persistent user session.  
- **Session Management**: Users can create new chat sessions, view a list of previous sessions, and delete them individually or all at once.  
- **Real-time Chat Interface**: A clean and intuitive chat UI that displays messages from both the user and the AI bot.  
- **Typing Effect**: AI responses are displayed with a typing animation for a more engaging user experience.  
- **Responsive Design**: The layout is optimized for both desktop and mobile devices, with a collapsible sidebar for chat history on smaller screens.  
- **Asynchronous Communication**: Built with TanStack Query (React Query) to handle asynchronous state management, caching, and data fetching from the backend.  

---

## Tech Stack

- **Framework**: React  
- **Build Tool**: Vite  
- **Language**: TypeScript  
- **Styling**: SCSS (Sass)  
- **State Management**: TanStack Query (React Query)  
- **Routing**: React Router  
- **HTTP Client**: Axios  
- **Icons**: React Icons  
- **Package Manager**: npm  

---

## Installation Instructions

### Prerequisites

- Node.js (v18.x or later recommended)  
- npm (or another package manager like Yarn or pnpm)  
- A running instance of the backend server  

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd frontend
2. **Install dependencies:**
   ```bash
   npm install
3. **Configure the backend URL:**
   
   Open the src/lib/axiosInstance.tsx file and update the baseUrl variable to point to your running backend API.
   ```typescript
   const baseUrl = "http://localhost:2309/api/v1"; // Update this URL if your backend is running elsewhere
   ```

  ## Usage
  ### Running the Development Server

To start the frontend application in development mode with hot-reloading:
```bash
npm run dev
```

### Building for Production

To create a production-ready build of the application:
```bash
npm run build
```

The optimized static files will be generated in the dist/ directory.
You can preview the production build locally using:
```bash
npm run preview
```

## Folder Structure
```graphql
frontend/
├── public/               # Static assets
├── src/
│   ├── api/              # API call definitions (e.g., chats.api.ts)
│   ├── assets/           # SVG icons and other assets
│   ├── components/       # Reusable React components (ChatHistory, TypingText)
│   ├── hooks/            # Custom React hooks (e.g., for React Query)
│   ├── lib/              # Library configurations (axiosInstance.tsx)
│   ├── pages/            # Page-level components (ChatPage, WelcomePage)
│   ├── styles/           # SCSS stylesheets
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions (e.g., localStorage helpers)
│   ├── App.tsx           # Main application component with routing
│   └── main.tsx          # Application entry point
├── package.json          # Project metadata and dependencies
└── vite.config.ts        # Vite configuration

```

## Available Scripts

In the project directory, you can run the following commands:

- npm run dev: Starts the Vite development server.

- npm run build: Compiles TypeScript and builds the app for production into the dist/ folder.

- npm run lint: Lints the source code using ESLint.

- npm run preview: Starts a local server to preview the production build.