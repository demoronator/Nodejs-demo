# Node.js WebSocket and RESTful API Servers

This repository contains two separate servers implemented in Node.js: a WebSocket server for real-time messaging and a RESTful API server for handling CRUD operations.

## Overview

### WebSocket Server

- **Purpose**: Manages real-time communication between clients.
- **Technology**: Built with the `ws` library in Node.js.
- **Functionality**: Handles multiple client connections, broadcasts messages to all connected clients, and logs connection events and messages.

### RESTful API Server

- **Purpose**: Provides a set of HTTP endpoints for CRUD operations.
- **Technology**: Built on Express.js.
- **Endpoints**: Includes endpoints for creating, reading, updating, and deleting user data.
- **Database**: Uses PostgreSQL for data storage.

## Getting Started

### Prerequisites

- Node.js
- npm (Node.js package manager)
- PostgreSQL database

### Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/demoronator/Nodejs-demo.git
```

Navigate into each server directory (api-server and websocket-server) and install the required dependencies:

```bash
cd api-server
npm install

cd ../websocket-server
npm install
```

### Configuration

Create a .env file in each server directory with the necessary environment variables:

For api-server:

```.env
DB_USER=yourPostgresUsername
DB_HOST=yourDatabaseHost
DB_DATABASE=yourDatabaseName
DB_PASSWORD=yourDatabasePassword
DB_PORT=yourDatabasePort
```

For websocket-server:
No additional configuration required.

### Running the Servers

To start each server, run the following command in their respective directories:

For the API server:

```bash
node server.js
```

For the WebSocket server:

```bash
node server.js
```

## WebSocket Server

The WebSocket server listens on port 8080 and supports multiple client connections. It broadcasts any received message to all connected clients.

### Features

- Handling multiple client connections
- Broadcasting messages to all clients
- Connection and message logging

## RESTful API Server

The RESTful API server provides endpoints for user management, including creating, retrieving, updating, and deleting users.

### Endpoints

- POST /users: Create a new user
- GET /users: Retrieve all users
- GET /users/:​id: Retrieve a single user by ID
- PUT /users/:​id: Update a user by ID
- DELETE /users/:​id: Delete a user by ID

### Features

- CRUD operations for user management
- Input validation and error handling
- Secure password storage with bcrypt
- Request logging

## Logging

Both servers utilize winston for logging, which helps in monitoring server operations and debugging.
