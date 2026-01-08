# OrgV Frontend (v1.0.0)

A comprehensive React-based frontend application for the OrgV platform, featuring authentication, user profile management, and granular role-based access control (RBAC) administration.

## 🚀 Overview

This project is built with **React 19**, **TypeScript**, and **Vite**, offering a fast and modern development experience. It utilizes **Tailwind CSS** for styling and **React Router DOM** for navigation, with robust state management for authentication and theme preferences.

## ✨ Features

### 🔐 Authentication & Security
*   **Secure Login & Registration**: Full flow including email verification.
*   **Multi-Factor Authentication (MFA)**: Settings to configure MFA for enhanced security.
*   **Password Management**: Forgot password, reset password, and change password functionality.
*   **OAuth2 Support**: Handling for OAuth2 callbacks.
*   **Session Management**: View and manage active sessions.

### 👤 User Management
*   **Dashboard**: Central hub for user activities.
*   **Profile Management**: Update profile details, change email, and delete account options.
*   **Verification**: Email verification and resend verification flows.

### 🛡️ Admin Panel
A dedicated administrative interface for managing the organization's resources:
*   **User Management**: Create, Read, Update, and Delete (CRUD) users.
*   **Role Management**: Create, Read, Update, and Delete (CRUD) roles.
*   **Permissions**: View available permissions and assign them to roles.

## 🛠️ Tech Stack

*   **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer)
*   **Routing**: [React Router DOM v7](https://reactrouter.com/)
*   **State Management**: React Context API (Auth, Theme)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **UI Components**: [Sonner](https://sonner.emilkowal.ski/) (Toasts), [React Icons](https://react-icons.github.io/react-icons/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Utilities**: [Classnames](https://github.com/JedWatson/classnames), [JS Cookie](https://github.com/js-cookie/js-cookie), [UUID](https://github.com/uuidjs/uuid)
*   **Linting**: [ESLint](https://eslint.org/)

## 🏁 Getting Started

### Prerequisites
*   Node.js (Latest LTS recommended)
*   npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd OrgV-Frontend-Version-1.0.0
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy the example environment file to create your local configuration:
    ```bash
    cp .env.example .env
    ```
    *Open `.env` and fill in the required API endpoints and configuration values.*

### Running the App

To start the development server:
```bash
npm run dev
```
The application need to be accessed via the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To create a production-ready build:
```bash
npm run build
```
This will compile the application into the `dist` directory.

### Linting

To run the linter and check for code quality issues:
```bash
npm run lint
```

## 📂 Project Structure

```text
src/
├── admin/          # Admin panel pages and components (User/Role/Permission mgmt)
├── auth/           # Authentication related pages (Login, Register, MFA)
├── commons/        # Shared resources
│   ├── components/ # Reusable UI components (Layout, Loader, etc.)
│   ├── contexts/   # React Contexts (AuthContext, ThemeContext)
│   ├── types/      # TypeScript type definitions
│   └── utils/      # Helper functions and utilities
├── user/           # User dashboard and profile management pages
├── App.tsx         # Main application component with Routing configuration
└── main.tsx        # Application entry point
```

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
