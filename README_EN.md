
![Routify Logo](src/assets/logo.png)

# Routify
A web app to compare all modes of transport in one place. RoutifyMD25 is a modular backend API built with NestJS, designed to support intelligent transportation systems. It provides secure authentication, user and route management, route comparisons, and persistent logging — all structured for scalability and maintainability.


# General description
This project is a RESTful API developed with NestJS and TypeORM, designed for create comparisons between multiple modes of transportation- such as car, bike, public trantis, and walking, and a based on route specific data. This API helps users make informed travel decisions by evalutaing time, cost and reliability across options. 

# Purpose:

Modern travel decisions are fragmented. Users juggles multiple apps and  sources to compare transport modes, often leading to slow and suboptimal choices, Routify solves this by offering a unified solution for multimodal route comparison, backed by a robust and modular backend. 

# Features

- JWT authentication with role-based access control
- User registration, login, and profile management
- Transport route creation, update, and retrieval
- Route comparison and history tracking
- Logging system with DB persistence
- Unit and integration tests with Jest + Supertest
- Modular NestJS architecture


# Tech Stack.

Layer               Technology
Backend             Nest JS
Database            TypeORM + MySQL
Auth                Passport + LWT  
Testing             Jest + Supertest
Documentation       Swagger

Requirements 
Nodejs 
MySQL
npm

# Instalation
 1. Clone the repository git clone:
    cd Routify

 2. Install dependencies:
    npm install

 3. Configure environment variables:
    Create a .env file in the root of the project
    Copy the contents of .env.example and adjust the values as needed.

 4. Database configuration:
    Run migrations - npm run typeorm migration:run

# Running the App:
    Development mode:
    npm run start:dev
    Production build:
    npm run build
    npm run start:prod

# Project structure 
Routify/
├── src/
│   ├── assets/                 # Other files such product logo
│   ├── common/                 # Pipes and common utilities
│   ├── dto/                    # Data Transfer Objects
│   ├── entities/               # Database entities
│   ├── interfaces/             # TypeScript Interfaces
│   ├── migrations/             # Database migrations
│   └── modules/                # Aplication modules
│       ├── auth/               # Authentication module (JWT, Passport)
│       ├── comparisons/        # Trasnport mode comparison logic
│       ├── logs/               # Logging interceptor and persistence
│       ├── services/           # Service for silmulations
        ├── transport/          # Route simulation engine
│       └── users/              # User management
└── test/                       
test/                           # Unit and integration tests
.env.example                    # Environment variable template


# API Endpoints
Auth

POST   /auth/register         → Register a new user
POST   /auth/login            → Authenticate and receive JWT token

Users

GET    /users                 → Get all users (admin only)
GET    /users/:id             → Get user by ID
PATCH  /users/:id             → Update user information
DELETE /users/:id             → Delete user

Transport

GET    /transport             → Get all transport routes
POST   /transport             → Create a new transport route
GET    /transport/:id         → Get transport route by ID
PATCH  /transport/:id         → Update transport route
DELETE /transport/:id         → Delete transport route

Comparisons

POST   /comparisons           → Compare two or more transport routes
GET    /comparisons/history   → Retrieve history of previous comparisons

# Logs register

![Logs in DB](src/assets/image.png)


# Testing:
    npm run test
    npm run test:cov


