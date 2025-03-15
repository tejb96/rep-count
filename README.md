# RepVision 

![Rep Count Logo](./frontend/public/logo.jpg)

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for tracking exercise repetitions hosted on AWS

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and registration
- Real-time rep counting
- Workout history tracking
- Progress statistics
- Responsive design for mobile and desktop

## Technologies

- **Frontend:**
  - React.js
  - Redux 
  - CSS/SCSS
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
- **Authentication:**
  - Passport.js
  - Google OAuth 2.0
  - JWT (JSON Web Tokens)
- **Additional Tools:**
  - RESTful API architecture

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/tejb96/rep-count.git
cd rep-count
```

2. Install dependencies:
```bash
# For backend
cd backend
npm install
```
```bash

# For frontend
cd ../frontend
npm install
```

3. Configure environment variables:
Create a `.env` file in the `backend` directory with:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create a `.env.development` file in the `frontend` directory with:
```bash
REACT_APP_SERVER_URL=localhost:5000
```
5. Start the application:
```bash
# Start backend (from backend directory)
npm run start
```
```bash
# Start frontend (from frontend directory in new terminal)
npm start
```

## Usage

1. Register a new account or login with existing credentials
2. Start a workout session
3. Track your reps in real-time
4. View your workout history and statistics

## Project Structure
```
rep-count/
├── frontend/              # React frontend
│   ├── public/         # Static assets
│   ├── src/           # React source code
│   │   ├── components/ # Reusable components
|   |   ├── config/     # Configuration for tensorflow and axios
|   |   ├── constants/  # Frequently used variables
│   │   ├── pages/     # Page components
│   │   ├── store/     # Redux state management
|   |   └── workoutTrackers/ # Workout tracking logic
│   └── package.json
├── backend/             # Express backend
│   ├── middleware/    # Authentication and request processing
│   ├── mongodb/       # Database models and connection
│   ├── oauth/         # Passport.js and Google OAuth setup
│   ├── routes/        # RESTful API routes
│   ├── utils/         # Helper functions and utilities
│   └── package.json
└── README.md
```


## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes:
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
