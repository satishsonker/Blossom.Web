# Blossom Web - React Application

A modern React.js application with separate Public and Admin sections, featuring authentication, theme switching, and mobile-first responsive design.

## Features

- **Two-Part Application**: Separate Public and Admin sections with different layouts
- **Authentication**: Role-based authentication with admin/user distinction
- **Theme Switching**: Light/Dark theme support with persistent storage
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Protected Routes**: Admin portal is fully secured with role-based access
- **Collapsible Sidebar**: Admin section includes a collapsible left menu
- **Professional UI**: Modern, clean interface with professional color scheme

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

- **Admin**: `admin@example.com` / `admin123`
- **Regular User**: Any email/password combination (except admin credentials)

## Project Structure

```
src/
├── components/
│   ├── headers/          # Public and Admin headers
│   ├── footers/          # Public and Admin footers
│   ├── layouts/          # Layout components
│   ├── sidebar/          # Admin sidebar
│   └── ProtectedRoute.js # Route protection component
├── contexts/             # React contexts (Auth, Theme)
├── pages/
│   ├── public/          # Public-facing pages
│   └── admin/           # Admin pages
└── styles/              # CSS files organized by component/page
```

## Features in Detail

### Public Section
- Home page with hero section and features
- About page
- Contact page with form
- Login modal in header
- Theme toggle
- Responsive navigation menu

### Admin Section
- Protected routes requiring admin authentication
- Dashboard with statistics
- User management
- Product management
- Settings page
- Collapsible sidebar menu
- Fixed header with logout

### Theme System
- Light and Dark themes
- Persistent theme preference (localStorage)
- Smooth transitions
- Professional color scheme

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Technologies Used

- React 18
- React Router DOM 6
- Webpack 5
- Babel
- CSS3 (Mobile-first approach)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

