# Opinion Trading App

A real-time platform where users can trade on their opinions about upcoming events, with features like live odds updates, user profiles, and admin controls.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- MongoDB (included in Docker setup)

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/opinion-trading-app.git
cd opinion-trading-app
```

2. Start the application using Docker:
```bash
# Run the setup script
.\docker-setup.ps1

# Or manually:
docker-compose up
```

3. Access the application:
- Frontend: http://localhost:3002
- Backend API: http://localhost:5001
- MongoDB: localhost:27017

### Manual Setup (without Docker)

1. Backend Setup:
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm run dev
```

2. Frontend Setup:
```bash
cd frontend
npm install
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Event Endpoints

#### Get All Events
```http
GET /api/events
Authorization: Bearer <token>
```

#### Create Event (Admin)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "category": "sports|politics|entertainment",
  "startTime": "ISO date",
  "endTime": "ISO date",
  "options": [
    {
      "text": "string",
      "odds": number
    }
  ]
}
```

### Trade Endpoints

#### Place Trade
```http
POST /api/trades
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "string",
  "optionId": "string",
  "amount": number
}
```

#### Get User Trades
```http
GET /api/trades
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "email": "string"
}
```

## 🏗️ Architecture & Data Flow

### System Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │   Backend   │     │  MongoDB    │
│  (React)    │◄───►│  (Node.js)  │◄───►│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Key Components

1. **Frontend (React)**
   - Real-time updates using WebSocket
   - Context-based state management
   - Responsive design with Tailwind CSS

2. **Backend (Node.js)**
   - RESTful API with Express
   - WebSocket server for live updates
   - JWT authentication
   - MongoDB with Mongoose ODM

3. **Database (MongoDB)**
   - Document-based storage
   - Collections for users, events, and trades
   - Indexed queries for performance

### Data Flow

1. **User Authentication**
   - JWT-based authentication
   - Secure password hashing
   - Role-based access control

2. **Event Management**
   - CRUD operations for events
   - Real-time odds calculation
   - Event status tracking

3. **Trading System**
   - Real-time trade execution
   - Balance management
   - Odds recalculation

## 🎯 Challenges & Solutions

### 1. Real-time Updates
**Challenge**: Maintaining consistent real-time updates across all clients while handling high concurrency.

**Solution**: 
- Implemented WebSocket server for live updates
- Used debouncing for frequent updates
- Implemented optimistic UI updates

### 2. Loading State Management
**Challenge**: Flickering loading states during rapid state changes.

**Solution**:
- Implemented debounced loading states
- Added loading state queuing system
- Used React.memo for performance optimization

### 3. Data Consistency
**Challenge**: Ensuring data consistency during concurrent trades.

**Solution**:
- Implemented MongoDB transactions
- Added validation middleware
- Used atomic operations for updates

### 4. Performance Optimization
**Challenge**: Handling large datasets and frequent updates efficiently.

**Solution**:
- Implemented database indexing
- Used pagination for large queries
- Implemented caching strategies

## 🔧 Development Tools

- **Frontend Testing**: Jest, React Testing Library
- **Backend Testing**: Jest, Supertest
- **API Testing**: Postman Collection (available in `/postman` directory)
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

## 📝 License

MIT License - see LICENSE file for details 