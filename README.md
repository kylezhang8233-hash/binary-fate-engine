# Binary Fate Engine

A professional Zi Ping Bazi (Four Pillars of Destiny) SaaS system that provides binary YES/NO decisions based on ancient Chinese metaphysics.

## Features

- Bazi chart derivation using Lu Ming method and Zi Ping logic
- Binary outcome determination (YES/NO/NOT NOW)
- Classic English poem verse selection matching the chart's Qi
- Mysterious teaser analysis
- User registration and login system
- Free usage limit (3 readings)
- Premium subscription integration with Shopify
- Responsive design with mystical theme

## Technologies

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Vite
- **Integration**: Shopify API
- **Authentication**: JWT

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BinaryFate
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the MongoDB URI and other environment variables

4. Start the development servers:
```bash
npm run dev
```

- Backend server will run on `http://localhost:5000`
- Frontend server will run on `http://localhost:3000`

## Usage

1. Register with your email to get 3 free readings
2. Enter your birth details (gender, date of birth, time of birth)
3. Ask a question that requires a YES/NO answer
4. Get your binary verdict, poem verse, and teaser analysis
5. Upgrade to premium for unlimited readings

## Project Structure

```
BinaryFate/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── bazi.js
│   │   ├── user.js
│   │   └── shopify.js
│   ├── utils/
│   │   ├── baziCalculator.js
│   │   ├── luMingAnalysis.js
│   │   ├── ziPingAnalysis.js
│   │   └── binaryVerdict.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Bazi Analysis
- `POST /api/bazi/analyze` - Generate Bazi chart and get binary verdict

### User Management
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile
- `POST /api/user/usage` - Increment usage count

### Shopify Integration
- `POST /api/shopify/checkout` - Create checkout session
- `POST /api/shopify/webhook/order-paid` - Handle order paid webhook
- `GET /api/shopify/subscription/status` - Check subscription status

## License

MIT