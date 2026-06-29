# HealthCare Platform

A modern, full-stack healthcare application built with Next.js, React, and TypeScript. This platform provides comprehensive healthcare services including appointment management, symptom checking, doctor consultations, pharmacy services, and provider management.

## Features

### Patient Portal
- **User Authentication**: Secure login and signup with Supabase
- **Appointments**: Book and manage healthcare appointments
- **Symptom Checker**: AI-powered symptom analysis
- **Doctor Chat**: Real-time consultation with healthcare providers
- **Pharmacy**: Browse and order medicines
- **Health Records**: Access personal health information
- **Clinic Directory**: Find nearby clinics and facilities
- **Order Management**: Track medicine and service orders
- **User Profile**: Manage personal health data

### Provider Portal
- **Doctor Dashboard**: Manage appointments and consultations
- **Admin Panel**: Administrative controls and analytics
- **Clinic Management**: Manage clinic information and services
- **Pharmacy Management**: Inventory and order management
- **Map Integration**: View provider locations

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.2.0
- **Component Library**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Maps**: Leaflet + React Leaflet
- **Charts**: Recharts
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB 6.10.0
- **Authentication**: Supabase SSR
- **Password Hashing**: bcryptjs
- **AI Integration**: 
  - AI SDK (Vercel)
  - Google AI
  - Groq AI
- **Analytics**: Vercel Analytics

### Development
- **Package Manager**: pnpm
- **Linting**: ESLint
- **CSS Processing**: PostCSS & Autoprefixer

## Project Structure

```
├── app/                      # Main application
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── api/                 # API routes
│   │   ├── appointments/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── facilities/
│   │   ├── health/
│   │   ├── medicines/
│   │   ├── pharmacy/
│   │   ├── symptom-check/
│   │   └── user/
│   ├── app/                 # Application pages
│   │   ├── appointments/
│   │   ├── clinics/
│   │   ├── doctor-chat/
│   │   ├── orders/
│   │   ├── pharmacy/
│   │   ├── profile/
│   │   └── symptom-checker/
│   └── auth/                # Authentication pages
│       ├── login/
│       ├── signup/
│       ├── signup-success/
│       └── error/
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── map.tsx
│   ├── medicine-cart.tsx
│   └── theme-provider.tsx
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                     # Utility functions
│   ├── auth.ts
│   ├── chat-utils.ts
│   ├── mongodb.ts
│   ├── utils.ts
│   └── supabase/
├── public/                  # Static assets
├── provider-portal/         # Provider/Admin portal (separate Next.js app)
├── scripts/                 # Database and utility scripts
└── output/                  # Output files
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- MongoDB instance
- Supabase account
- Google AI API key (optional)
- Groq API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealthCare
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # AI APIs
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
   GROQ_API_KEY=your_groq_api_key
   
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Run initial schema setup
   pnpm run db:init
   
   # Seed medicines (optional)
   pnpm run db:seed
   ```

### Running the Application

**Patient Portal (Main App)**
```bash
pnpm dev
```
The app will be available at `http://localhost:3000`

**Provider Portal (Separate)**
```bash
pnpm dev:provider
```
The provider portal will be available at `http://localhost:3001`

## Build & Deployment

### Build the application
```bash
pnpm build
```

### Start production server
```bash
pnpm start
```

### Run linting
```bash
pnpm lint
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Appointments
- `GET /api/appointments` - List user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Chat
- `POST /api/chat` - Send chat message with AI
- `GET /api/chat/history` - Get chat history

### Medicines
- `GET /api/medicines` - List medicines
- `POST /api/medicines/order` - Place medicine order

### Pharmacy
- `GET /api/pharmacy` - Pharmacy information
- `POST /api/pharmacy/checkout` - Process order

### Health Data
- `GET /api/health` - Get health records
- `POST /api/health/update` - Update health data

### Facilities
- `GET /api/facilities` - List healthcare facilities
- `GET /api/facilities/:id` - Get facility details

### Symptom Check
- `POST /api/symptom-check` - Analyze symptoms with AI

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Key Features Explained

### AI-Powered Symptom Checker
Uses Google Generative AI or Groq to analyze symptoms and provide health insights.

### Real-time Doctor Chat
WebSocket-based real-time communication between patients and healthcare providers.

### Appointment System
Complete appointment booking with calendar integration and notifications.

### Pharmacy Integration
Browse medicines, manage cart, and place orders with delivery tracking.

### Maps Integration
Find nearby clinics and healthcare facilities using Leaflet maps.

### Responsive Design
Fully responsive UI built with Tailwind CSS and Radix UI components, optimized for mobile, tablet, and desktop.

## Database Schema

### Collections
- `users` - User accounts and profiles
- `appointments` - Appointment records
- `chat_messages` - Chat history
- `medicines` - Medicine inventory
- `orders` - Customer orders
- `facilities` - Healthcare facilities
- `health_records` - Patient health data
- Triggers for automatic profile creation on user signup

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Authentication**: Supabase SSR for server-side session management
- **Environment Variables**: All sensitive data in `.env.local`
- **Input Validation**: Zod schemas for data validation

## Performance Optimizations

- Next.js Image Optimization
- Code Splitting and Dynamic Imports
- Tailwind CSS Purging
- React 19 with Concurrent Features
- Efficient State Management with React Hooks
- Chart and Map Lazy Loading

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env.local`
- Check firewall/network settings
- Ensure MongoDB instance is running

### Supabase Authentication Errors
- Verify API keys are correct
- Check Supabase project settings
- Clear browser cookies and try again

### AI API Errors
- Ensure API keys are valid and active
- Check API rate limits
- Verify API credentials in environment variables

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team or open an issue in the repository.

---

**Version**: 0.1.0  
**Last Updated**: April 2026
