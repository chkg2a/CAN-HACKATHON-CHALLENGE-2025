# User Authentication with Node.js, Express, and Redis

This project provides a user authentication system using Node.js, Express, and Redis for session management.

## Features
- User signup and login
- Session-based authentication stored in Redis
- Secure password hashing with bcrypt
- Logout functionality

## Tech Stack
- Node.js
- Express.js
- Redis (for session storage)
- bcrypt (for password hashing)
- express-session & connect-redis (for session handling)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/repository-name.git
   cd repository-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and add:
   ```
   SESSION_SECRET=your_secret_key
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
4. Start Redis server:
   ```bash
   redis-server
   ```
5. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes

- **POST /register** - Register a new user
- **POST /login** - Log in a user



## Usage

1. Register a user using the `/register` endpoint.
2. Log in using the `/login` endpoint.
3. Access protected routes after authentication.
4. Logout using `/logout`.

## Contributing
Feel free to fork the repository and submit pull requests!

## License
This project is licensed under the MIT License.

