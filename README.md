# Experiment Project

## Overview

Showoff is a real-time messaging application that leverages modern technologies such as Node.js, Express, PostgreSQL, Redis, and Kafka. The application allows users to send messages, create channels, and manage user authentication through Google OAuth. It is designed to be scalable and efficient, utilizing a microservices architecture with a focus on performance and reliability.

## Features

- User authentication via Google OAuth
- Real-time messaging using WebSockets
- Channel creation and management
- Message storage in PostgreSQL
- Caching with Redis for improved performance
- Kafka for handling asynchronous message processing

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js to handle HTTP requests.
- **PostgreSQL**: Relational database for storing user and message data.
- **Redis**: In-memory data structure store for caching.
- **Kafka**: Distributed event streaming platform for handling real-time data feeds.
- **Sequelize**: ORM for interacting with the PostgreSQL database.
- **Passport**: Middleware for authentication.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 20 or higher)
- PostgreSQL (version 12 or higher)
- Redis (version 6 or higher)
- Docker (for running services like PostgreSQL and Kafka)
- Yarn or npm (for package management)

## Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/piyushpradhan/experiment-backend.git
   cd experiment-backend
   ```

2. **Install Dependencies**

   Use npm or yarn to install the required packages:

   ```bash
   pnpm install

   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DB_URL=postgresql://postgres:postgres@localhost:5433/showoff
   REDIS_URL=redis://localhost:6379
   KAFKA_BROKERS=localhost:9092
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_KEY=your_session_key
   CORS_ORIGIN=http://localhost:3000

   ```

4. **Run PostgreSQL and Redis**

   You can use Docker to run PostgreSQL and Redis:

   ```bash
   docker-compose up -d
   ```

5. **Run Migrations**

   To set up the database schema, run the following command:

   ```bash
   npx sequelize-cli db:migrate
   ```

6. **Start the Application**

   You can start the application in development mode using:

   ```bash
   pnpm run dev
   ```
