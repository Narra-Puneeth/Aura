# Aura - VR Therapy Platform



## 🌟 Overview

Aura is a cutting-edge, immersive VR therapy website built with React + Vite that delivers browser-based mental wellness sessions with seamless YouTube video integration. The platform adopts the visual design language inspired by TRIPP, featuring deep purples, vibrant gradients, and aurora-like aesthetics.

## ✨ Features

### Core Functionality
- **Immersive VR Therapy Sessions** - WebXR-powered VR experiences
- **YouTube Integration** - Custom video player with completely hidden branding
- **A-Frame VR Support** - 360° video rendering and VR headset compatibility
- **Responsive Design** - Works on desktop, mobile, and VR headsets
- **User Authentication** - Login/Signup with context-based state management
- **Personalized Dashboard** - Track progress, view stats, and access recommendations
- **Health Assessment** - Onboarding questionnaire for personalized experiences
- **Session Library** - Curated therapy sessions for various mental health needs

### Design Features
- **Aurora-Inspired Gradients** - Purple, pink, blue, and teal color transitions
- **Dark Theme** - Premium, calming aesthetic with gradient overlays
- **Smooth Animations** - Fade-in effects, hover states, and micro-interactions
- **Glass Morphism** - Modern frosted glass UI elements
- **Custom Components** - Reusable cards, buttons, navigation, and more

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with WebXR support (optional for VR mode)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Add Background Assets**
Place your aurora background video and logo SVG in:
```
src/assets/aurora-background.mp4
src/assets/logo.svg
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
```

5. **Preview Production Build**
```bash
npm run preview
```

## � Deploy to Vercel

### Quick Deploy

1. **Install Vercel CLI (optional)**
```bash
npm i -g vercel
```

2. **Deploy from CLI**
```bash
vercel
```

### Deploy from GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

Your site will be live at `https://your-project.vercel.app`

### Environment Variables (Optional)
If you add backend APIs, configure in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add your API keys and endpoints

### Build Settings (Auto-configured)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: Vite

## �📁 Project Structure

```
Aura/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, videos, logos
│   ├── components/        # Reusable React components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   └── VideoPlayer.jsx
│   ├── context/           # React Context for state management
│   │   └── AuthContext.jsx
│   ├── pages/             # Route pages
│   │   ├── About.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Signup.jsx
│   │   ├── Support.jsx
│   │   ├── TherapySelection.jsx
│   │   └── TherapySession.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── index.css          # Global styles with Tailwind
│   └── main.jsx           # App entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## 🎨 Design System

### Colors
- **Primary Purple**: `#8B5CF6`
- **Pink**: `#EC4899`
- **Blue**: `#3B82F6`
- **Teal**: `#14B8A6`
- **Neon Green**: `#BFFF00` (CTAs)
- **Dark Background**: `#0A0A0A`
- **Gray Background**: `#1A1A1A`

### Typography
- **Font Family**: Inter (imported from Google Fonts)
- **Headline Sizes**: 72-84px (desktop), 40-48px (mobile)
- **Body Text**: 16-20px

### Components
All components follow the glass morphism design pattern with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Border highlights
- Smooth transitions

## 🎮 VR Features

### Supported Platforms
- Meta Quest
- PlayStation VR
- HTC VIVE
- PICO
- Desktop browsers (360° mouse navigation)
- Mobile VR (Google Cardboard)

### WebXR Implementation
The platform uses:
- A-Frame for 3D scene rendering
- WebXR API for VR session management
- Custom video controls for immersive playback
- Gaze-based and controller-based interactions

## 📹 YouTube Integration

### Hidden Branding
The VideoPlayer component completely hides all YouTube UI elements:
- No YouTube logo
- No related videos
- No channel information
- No watermarks
- Custom overlay controls

### Parameters Used
```
controls=0
modestbranding=1
rel=0
showinfo=0
iv_load_policy=3
disablekb=1
fs=0
```

## 🗺️ Routes

- `/` - Landing page with hero section
- `/login` - User login
- `/signup` - User registration
- `/onboarding` - Multi-step onboarding with health assessment
- `/dashboard` - User dashboard with stats and recommendations
- `/therapy` - Session selection grid
- `/therapy/:sessionId` - Individual VR therapy session
- `/about` - About page with features and testimonials
- `/support` - FAQ and contact form

## 🔧 Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **A-Frame** - VR framework
- **WebXR API** - VR session management
- **YouTube IFrame API** - Video integration

## 🎯 Key Components

### VideoPlayer
Custom YouTube player with:
- Hidden branding
- Custom controls
- VR mode toggle
- Progress tracking
- Volume control

### Navbar
Responsive navigation with:
- Transparent/solid variants
- Mobile hamburger menu
- Authentication state awareness

### Card
Reusable card component with:
- Glass morphism styling
- Hover effects
- Flexible content

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1365px
- **Desktop**: 1366px+
- **Large Desktop**: 1920px+

## 🎭 Animation Classes

- `animate-fade-in` - Fade in effect
- `animate-fade-in-up` - Fade in with upward movement
- `animate-pulse-slow` - Slow pulsing effect
- `animate-float` - Floating animation
- `card-hover` - Card lift effect
- `wave-line` - Wavy line animation

## 🔐 State Management

Uses React Context API for:
- User authentication
- Session data
- User preferences
- Progress tracking

## 📊 Future Enhancements

- Backend API integration
- Real user authentication
- Payment gateway integration
- Advanced progress charts
- Social features (community)
- Push notifications
- Offline mode
- More therapy content

## 🤝 Contributing

This is a frontend-only implementation. Backend integration is planned separately.

## � Team

**Team Mathians** - INNOVASIA Hackathon Project

- 🤖 **Shritij** - AI Developer
- 💻 **Puneeth** - Full Stack Developer

## �📄 License

All rights reserved © 2025 Aura

## 🙏 Acknowledgments

- Design inspiration: TRIPP VR
- Icons: Heroicons
- Fonts: Google Fonts (Inter)
- VR Framework: A-Frame

## 📞 Support

For issues or questions, visit the `/support` page or contact the development team.

---

**Built with 💜 for mental wellness by Team Mathians**

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
