# ONVENT Frontend (New Implementation)

This is the new frontend implementation for the ONVENT event ticket booking system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5174`

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API service classes
├── contexts/       # React context providers
├── utils/          # Utility functions
├── assets/         # Static assets
├── App.jsx         # Main application component
├── main.jsx        # Application entry point
└── index.css       # Global styles
```

## 🎨 Styling
This project uses Tailwind CSS for styling. Custom styles can be added to:
- `src/index.css` for global styles
- `src/App.css` for app-specific styles
- Individual component files for component-specific styles

## 🔄 API Integration
The frontend connects to the backend API at `http://localhost:8087` through a proxy configured in `vite.config.js`.

## 🧪 Testing
Run the linter:
```bash
npm run lint
```

## 🚀 Deployment
To deploy the frontend:
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform

## 📦 Dependencies
- React 18
- React Router DOM
- Axios
- React Hook Form
- React Icons
- Tailwind CSS
- Vite

## 🛠️ Development
- The development server runs on port 5174
- API requests are proxied to port 8087
- Hot module replacement is enabled for fast development

## 📞 Support
For any issues or questions, please contact the development team.