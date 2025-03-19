# Makeflouss AI Ambassador Platform

## Overview
As the Chief Ambassador of the Makeflouss project, I am currently preparing the framework for our ambassador interface. This platform will serve as the central hub for our Makeflouss AI ambassadors, providing them with the tools and resources they need to effectively represent and promote our project.

> **Note**: This platform is currently under development and will be adapted and deployed once the main mfai.app platform is fully functional.

## Project Structure

### Frontend (React.js)
```
client/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API services
│   ├── store/             # Redux store configuration
│   │   └── slices/        # Redux slices for state management
│   └── utils/             # Utility functions
```

### Backend (Node.js/Express)
```
server/
├── controllers/           # Route controllers
├── models/               # Mongoose models
├── routes/               # API routes
├── middleware/           # Custom middleware
└── config/              # Configuration files
```

## Features

### 1. Authentication System
- Secure login and registration
- JWT-based authentication
- Role-based access control

### 2. Ambassador Dashboard
- Personal profile management
- Progress tracking
- Achievement system
- Points and rewards tracking

### 3. Resource Management
- Educational materials
- Training resources
- Video content
- Documentation
- Level-based access control

### 4. Mission System
- Available missions
- Mission completion tracking
- Proof submission
- Points rewards

### 5. Reward System
- Points accumulation
- Reward claiming
- Achievement badges
- Level progression

## Technical Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In server directory
cp .env.example .env

# In client directory
cp .env.example .env
```

4. Start the development servers
```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd client
npm start
```

## Development Status

The project is currently in its initial development phase. The following features are implemented:

- [x] Basic project structure
- [x] Authentication system
- [x] Resource management system
- [x] Mission system framework
- [x] Reward system framework

### Pending Features
- [ ] Integration with mfai.app platform
- [ ] Advanced analytics dashboard
- [ ] Community features
- [ ] Advanced reward system
- [ ] Gamification elements

## Contributing

This project is currently under active development by the Makeflouss team. Once the main platform is functional, we will open it for community contributions.

## License

This project is proprietary and confidential. All rights reserved by Makeflouss.

## Contact

For any inquiries about the Makeflouss AI Ambassador Platform, please contact the Chief Ambassador through the official Makeflouss channels. 