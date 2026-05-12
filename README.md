# Priya Tutoring - Tutor Booking & Registration Platform

A comprehensive full-stack application for booking tutoring sessions, registering as a tutor, and processing secure payments.

## 🌟 Features

### For Students
- 🔐 Secure registration and authentication
- 🔍 Browse and filter tutors by subject, rating, and availability
- 📅 Easy session booking with real-time calendar
- 💳 Secure payment processing via Stripe
- ⭐ Rate and review tutors
- 📊 Track booking history and upcoming sessions
- 🔔 Email notifications for bookings and reminders

### For Tutors
- 👨‍🏫 Complete profile setup with qualifications
- 📚 Manage subjects and specializations
- 📅 Set availability and manage schedule
- 💰 Track earnings and payment history
- 📈 View student reviews and ratings
- 📧 Manage student inquiries

### Admin Features
- 👥 User management (approve/reject tutors)
- 📊 Platform analytics and statistics
- 💼 Transaction management
- 📋 Manage disputes and reviews

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Redux Toolkit |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL 14+ |
| **ORM** | Sequelize |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payment** | Stripe API |
| **Email** | Nodemailer |
| **Containerization** | Docker & Docker Compose |

## 📁 Project Structure

```
Priya-Tutions/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── models/             # Sequelize models
│   │   ├── middleware/         # Auth & error handling
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helper utilities
│   │   ├── config/             # Configuration
│   │   ├── validators/         # Input validation
│   │   └── app.ts              # Express app setup
│   ├── tests/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── store/              # Redux store
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Stripe Account
- Docker & Docker Compose (optional)

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/manikanthaebburi-ops/Priya-Tutions.git
cd Priya-Tutions

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start services
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Manual Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm start
```

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh           - Refresh JWT token
GET    /api/auth/me                - Get current user
```

### Tutors
```
GET    /api/tutors                 - List all tutors
GET    /api/tutors/:id             - Get tutor details
POST   /api/tutors/profile         - Create tutor profile
PUT    /api/tutors/profile         - Update tutor profile
GET    /api/tutors/:id/availability - Get availability
```

### Bookings
```
GET    /api/bookings               - Get user bookings
POST   /api/bookings               - Create booking
PUT    /api/bookings/:id           - Update booking
DELETE /api/bookings/:id           - Cancel booking
```

### Payments
```
POST   /api/payments/intent        - Create payment intent
POST   /api/payments/confirm       - Confirm payment
GET    /api/payments/history       - Payment history
```

### Reviews
```
POST   /api/reviews                - Create review
GET    /api/reviews/tutor/:id      - Get tutor reviews
```

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Secure payment processing

## 📧 Email Notifications

- Registration verification
- Password reset
- Booking confirmations
- Session reminders (24h before)
- Payment receipts
- Review requests

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

## 🚢 Deployment

### Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Platforms
- Heroku, AWS, DigitalOcean, Vercel

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- 📧 Email: support@priyatutions.com
- 🐛 GitHub Issues: [Report Bugs](https://github.com/manikanthaebburi-ops/Priya-Tutions/issues)
- 💬 Discussions: [Join Discussion](https://github.com/manikanthaebburi-ops/Priya-Tutions/discussions)

## 👨‍💻 Authors

**Priya Tutoring Team**
- GitHub: [@manikanthaebburi-ops](https://github.com/manikanthaebburi-ops)

---

**Made with ❤️ for education**
