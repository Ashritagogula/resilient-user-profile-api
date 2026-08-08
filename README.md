# Resilient User Profile API

A RESTful API built with Node.js, Express.js, MongoDB Atlas, and Mongoose for managing user profiles.

## Features

- Create User
- Get All Users
- Get User By ID
- Update User
- Delete User
- MongoDB Atlas Integration
- Repository Pattern
- Service Layer Architecture
- Error Handling
- Health Check Endpoint

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS
- Helmet
- Morgan

## Project Structure

src/
├── config/
├── controllers/
├── models/
├── repositories/
│ ├── interfaces/
│ └── impl/
├── routes/
├── services/
├── middleware/
├── utils/
└── app.js

tests/
├── unit/
└── integration/

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd resilient-user-profile-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_atlas_connection_string

EXTERNAL_SERVICE_URL=http://localhost:8081/enrich

EXTERNAL_SERVICE_TIMEOUT_MS=1500

CIRCUIT_BREAKER_FAILURE_THRESHOLD=5

CIRCUIT_BREAKER_RESET_TIMEOUT_MS=30000

RETRY_MAX_ATTEMPTS=3

RETRY_BASE_DELAY_MS=100
```

## Run Application

```bash
node src/app.js
```

Server starts on:

```text
http://localhost:3000
```

## API Endpoints

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "UP"
}
```

### Create User

```http
POST /api/users
```

Request Body:

```json
{
  "name": "Ashrita",
  "email": "ashrita@gmail.com"
}
```

### Get All Users

```http
GET /api/users
```

### Get User By ID

```http
GET /api/users/:id
```

### Update User

```http
PUT /api/users/:id
```

Request Body:

```json
{
  "name": "Ashrita Updated"
}
```

### Delete User

```http
DELETE /api/users/:id
```

## Testing

Example:

```bash
curl http://localhost:3000/api/users
```

## Database

MongoDB Atlas is used as the cloud database for storing user profile information.

## Author

Ashrita Gogula