# kickscale - Crowdfunding Platform for Startups

A modern, responsive web application built with React and TypeScript that connects entrepreneurs with investors to fund innovative startup ideas.

## 🎯 Project Overview

kickscale is a full-stack crowdfunding platform designed to:
- Allow entrepreneurs to create and manage crowdfunding campaigns
- Enable investors to discover and fund promising startup projects
- Facilitate secure payments and investment tracking
- Build a community around innovative ideas

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.tsx      # Navigation header
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Projects.tsx    # Projects listing
│   ├── ProjectDetail.tsx # Individual project page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   └── Dashboard.tsx   # User dashboard
├── services/           # API services
│   └── api.ts          # Axios API client & endpoints
├── context/            # React context (for future use)
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Tailwind CSS imports
```

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Node.js Version**: 14+ (recommended 16+)

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^7.3.1",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Navigate to project directory**
   ```bash
   cd "Crowdfunding Platform for startups (Project 6th sem)"
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Edit `src/services/api.ts`
   - Update `API_BASE_URL` to point to your backend server (default: `http://localhost:5000/api`)

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173/`

5. **Start the lightweight backend**
  ```bash
  npm run server
  ```
  The API will run at `http://localhost:5000/api` and stores demo data in `server/data/store.json`.

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 UI Components

### Tailwind Custom Classes
The project includes custom Tailwind classes for common elements:
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-outline` - Outline style button
- `.card` - Card container with shadow
- `.section-title` - Section heading

## 📄 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with featured projects |
| `/projects` | Projects | Browse all projects with filters |
| `/projects/:id` | ProjectDetail | Individual project details |
| `/login` | Login | User login page |
| `/signup` | Signup | User registration |
| `/dashboard` | Dashboard | User dashboard (authenticated) |

## 🔐 Authentication

- Uses JWT tokens stored in localStorage
- Login/Signup forms with validation
- Protected routes redirect unauthenticated users
- Demo credentials: `demo@example.com` / `demo123`

## 🔌 API Integration

### Backend Notes
- The project uses a lightweight Express backend for a school-project friendly setup.
- Data is stored in a local JSON file instead of MongoDB.
- The backend supports auth, projects, investments, payments, and transaction history endpoints.

### Available Services

**Project Service**
- `getAll(filters)` - Get all projects
- `getById(id)` - Get project details
- `create(data)` - Create new project
- `update(id, data)` - Update project
- `delete(id)` - Delete project

**User Service**
- `register(data)` - Register new user
- `login(data)` - Login user
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile

**Investment Service**
- `getAll()` - Get user's investments
- `create(data)` - Make investment
- `getProjectInvestments(projectId)` - Get project backers

**Payment Service**
- `initiatePayment(data)` - Start payment
- `verifyPayment(data)` - Verify payment

## 🎨 Color Scheme

- **Primary**: `#667eea` (Purple-Blue)
- **Secondary**: `#764ba2` (Purple)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Warning**: `#f59e0b` (Orange)

## 📱 Responsive Design

- Mobile-first design approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu on mobile devices

## 🔄 State Management

Currently using:
- React's built-in `useState` for component state
- `localStorage` for persistent data (token, user info)
- Context API structure available for global state (if needed)

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint conventions
- Use functional components with hooks
- Keep components modular and reusable

### File Naming
- Components: PascalCase (e.g., `Navbar.tsx`)
- Services: camelCase (e.g., `api.ts`)
- Pages: PascalCase (e.g., `Home.tsx`)

### CSS Classes
- Use Tailwind CSS utility classes
- Create custom components in `index.css` when needed
- Avoid inline styles

## 🌐 Backend Requirements

The frontend expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Investments
- `GET /api/investments` - Get user investments
- `POST /api/investments` - Create investment
- `GET /api/projects/:id/investments` - Get project investments

### Payments
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/verify` - Verify payment

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite and configure the build
3. Deploy!

### Netlify
```bash
npm run build
netlify deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Build errors
```bash
rm -rf node_modules
npm install
npm run build
```

### Tailwind CSS not working
- Ensure `tailwind.config.js` includes all content paths
- Check `postcss.config.js` is properly configured
- Restart dev server after config changes

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [React Router](https://reactrouter.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## ✅ Next Steps for Backend Development

1. Set up backend API server (Node.js/Python/Java)
2. Implement database schema (PostgreSQL/MongoDB)
3. Create authentication system
4. Implement payment gateway integration (Stripe/PayPal)
5. Add email notifications
6. Create project creation wizard
7. Add user profile customization
8. Implement real-time notifications

---

**Happy Coding! 🚀**
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
