
Routify
A web app to compare all modes of transport in one place

General description
This project is a RESTful API developed with NestJS and TypeORM, designed for create comparisons between multiple modes of transportation- such as car, bike, public trantis, and walking, and a based on route specific data. This API helps users make informed travel decisions by evalutaing time, cost and reliability across options. 

Purpose:

Modern travel decisions are fragmented. Users juggles multiple apps and  sources to compare transport modes, often leading to slow and suboptimal choices, Routify solves this by offering a unified solution for multimodal route comparison, backed by a robust and modular backend. 

Tech Stack.

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

Instalation
 1. Clone the repository git clone:
    cd Routify

 2. Install dependencies:
    npm install

 3. Configure environment variables:
    Create a .env file in the root of the project
    Copy the contents of .env.example and adjust the values as needed.

 4. Database configuration:
    Run migrations - npm run typeorm migration:run

Running the App:
    Development mode:
    npm run start:dev
    Production build:
    npm run build
    npm run start:prod

Testing:
    npm run test

Project structure 
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
│       ├── logs/               # 
│       ├── services/           # 
        ├── transport/          # Route simulation engine
│       └── users/              # User management
└── test/                       
test/                           # Unit and integration tests
.env.example                   # Environment variable template


