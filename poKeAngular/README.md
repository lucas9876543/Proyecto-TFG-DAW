# Angular Pokédex

A modern Pokédex application built with Angular that allows users to browse, search, and manage their favorite Pokémon. This project is an Angular conversion of a vanilla JavaScript Pokédex application.

## Features

- 🔍 **Search Pokémon** by name
- 🏷️ **Filter by type** and generation
- ⭐ **Favorites system** with local storage
- ✨ **Shiny Pokémon toggle**
- 📱 **Responsive design** for all devices
- 🔐 **User authentication** (login/register)
- 📊 **Detailed Pokémon stats** in modal view
- 🎨 **Dynamic type-based styling**

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 17 or higher)

### Installing Angular CLI

If you don't have Angular CLI installed globally:

\`\`\`bash
npm install -g @angular/cli
\`\`\`

## Installation

1. **Clone or download the project**
   \`\`\`bash
   git clone <repository-url>
   cd angular-pokedex
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

## Running the Application

### Development Server

To start the development server:

\`\`\`bash
ng serve
\`\`\`

The application will be available at \`http://localhost:4200\`

### Production Build

To build the project for production:

\`\`\`bash
ng build
\`\`\`

The build artifacts will be stored in the \`dist/\` directory.

## Project Structure

\`\`\`
src/
├── app/
│ ├── components/
│ │ ├── pokemon-card/ # Individual Pokémon card component
│ │ ├── pokemon-modal/ # Pokémon details modal
│ │ ├── search-filters/ # Search and filter controls
│ │ └── user-menu/ # User authentication menu
│ ├── pages/
│ │ ├── home/ # Main Pokédex page
│ │ ├── favorites/ # Favorites page
│ │ ├── login/ # Login page
│ │ └── register/ # Registration page
│ ├── services/
│ │ ├── pokemon.service.ts # Pokémon API service
│ │ ├── auth.service.ts # Authentication service
│ │ └── favorites.service.ts # Favorites management
│ ├── models/
│ │ └── pokemon.model.ts # Pokémon data models
│ ├── guards/
│ │ └── auth.guard.ts # Route protection
│ └── styles/
│ ├── globals.css # Global styles
│ ├── pokemon-types.css # Type-specific colors
│ └── components.css # Component styles
├── assets/
└── environments/
\`\`\`

## Key Dependencies

- **Angular 17+** - Main framework
- **Angular Router** - Navigation and routing
- **Angular Forms** - Reactive forms for authentication
- **RxJS** - Reactive programming for HTTP requests
- **Google Fonts** - Poppins font family

## API Integration

This application uses the [PokéAPI](https://pokeapi.co/) to fetch Pokémon data:

- **Base URL**: \`https://pokeapi.co/api/v2/\`
- **Pokémon endpoint**: \`/pokemon/{id or name}\`
- **Species endpoint**: \`/pokemon-species/{id}\`
- **Type endpoint**: \`/type/{id or name}\`

## Features Overview

### Authentication

- Simple username/password authentication
- User data stored in localStorage
- Route guards to protect authenticated pages
- User menu with logout functionality

### Pokémon Browsing

- Grid layout with responsive design
- Search by name functionality
- Filter by type and generation
- Shiny Pokémon variants toggle
- Infinite scroll or pagination (configurable)

### Favorites System

- Add/remove Pokémon from favorites
- Persistent storage using localStorage
- Dedicated favorites page
- Visual indicators for favorite Pokémon

### Pokémon Details

- Modal popup with detailed information
- Stats visualization with progress bars
- Type badges with appropriate colors
- Navigation between Pokémon in modal
- High-quality Pokémon images

## Customization

### Adding New Pokémon Types

To add support for new Pokémon types, update the type colors in \`src/app/styles/pokemon-types.css\`:

\`\`\`css
.new-type { --type1-color: #YOUR_COLOR; }
\`\`\`

### Modifying API Endpoints

Update the API URLs in \`src/app/services/pokemon.service.ts\`:

\`\`\`typescript
private readonly API_BASE = 'https://pokeapi.co/api/v2/';
\`\`\`

### Styling Customization

- Global styles: \`src/app/styles/globals.css\`
- Component styles: Individual component \`.css\` files
- Type colors: \`src/app/styles/pokemon-types.css\`

## Development Commands

\`\`\`bash

# Start development server

ng serve

# Run tests

ng test

# Run end-to-end tests

ng e2e

# Build for production

ng build --prod

# Lint the code

ng lint

# Generate a new component

ng generate component component-name

# Generate a new service

ng generate service service-name
\`\`\`

## Browser Support

This application supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- **Lazy loading** for route modules
- **OnPush change detection** for better performance
- **Image optimization** with proper sizing
- **HTTP caching** for API requests
- **Virtual scrolling** for large lists (optional)

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/new-feature\`)
3. Commit your changes (\`git commit -am 'Add new feature'\`)
4. Push to the branch (\`git push origin feature/new-feature\`)
5. Create a Pull Request

## Troubleshooting

### Common Issues

**Port already in use:**
\`\`\`bash
ng serve --port 4201
\`\`\`

**Node modules issues:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Angular CLI not found:**
\`\`\`bash
npm install -g @angular/cli@latest
\`\`\`

### API Rate Limiting

If you encounter API rate limiting, consider:

- Implementing request caching
- Adding request delays
- Using a local Pokémon data cache

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Google Fonts](https://fonts.google.com/) for the Poppins font
- Original vanilla JavaScript implementation as the foundation

---

**Happy Pokémon hunting! 🎮✨**
