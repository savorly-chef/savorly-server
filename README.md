# Savorly Server

## Project setup

```bash
$ pnpm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
CORS_ORIGIN=*
```

## Running the Application

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Testing

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

## API Documentation

### Base URL

The API base URL is: `http://localhost:3000` (development) or your production domain.

### Authentication

The API uses JWT (JSON Web Token) for authentication. Protected endpoints require a valid Bearer token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Rate Limiting

The API implements rate limiting of 100 requests per minute per IP address.

### Endpoints

#### Health Check

- **GET** `/health`

  - Description: Check the API health status
  - Response:
    ```json
    {
      "status": "ok",
      "timestamp": "2024-02-03T08:00:00.000Z"
    }
    ```

- **GET** `/version`
  - Description: Get the API version information
  - Response:
    ```json
    {
      "version": "1.0.0",
      "environment": "development",
      "apiVersion": "v1"
    }
    ```

#### Authentication

- **POST** `/auth/register`

  - Description: Register a new user
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "username": "username"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "eyJhbG...",
      "refresh_token": "eyJhbG..."
    }
    ```

- **POST** `/auth/login`

  - Description: Login with email and password
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "eyJhbG...",
      "refresh_token": "eyJhbG..."
    }
    ```

- **POST** `/auth/refresh`

  - Description: Refresh access token using refresh token
  - Body:
    ```json
    {
      "refresh_token": "eyJhbG..."
    }
    ```
  - Response:
    ```json
    {
      "access_token": "eyJhbG...",
      "refresh_token": "eyJhbG..."
    }
    ```

- **POST** `/auth/apple`
  - Description: Sign in with Apple
  - Body:
    ```json
    {
      "identityToken": "...",
      "user": "...",
      "email": "user@privaterelay.appleid.com",
      "fullName": {
        "givenName": "John",
        "familyName": "Doe"
      }
    }
    ```
  - Response:
    ```json
    {
      "access_token": "eyJhbG...",
      "refresh_token": "eyJhbG..."
    }
    ```

#### Users

- **PUT** `/users/me`
  - Description: Update current user's profile
  - Authentication: Required
  - Body (all fields optional):
    ```json
    {
      "premium": boolean,
      "language": "string",
      "username": "string",
      "bio": "string",
      "profileImage": "string"
    }
    ```
  - Response: Updated user object

## Error Handling

The API returns standard HTTP status codes and JSON error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
