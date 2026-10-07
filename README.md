# URL Shortener

A TypeScript URL-shortening API built with Express, PostgreSQL, and Redis.

## Features

- Create short URLs
- Redirect short codes to original URLs
- Retrieve original URLs as JSON
- Update short URL destinations
- Delete short URLs
- Track redirect clicks
- Cache URL lookups with Redis
- Initialize the PostgreSQL schema on startup

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Redis
- Docker Compose

## Requirements

- Node.js 20.6+
- Docker Desktop
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Build the TypeScript source:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

For development, run the TypeScript server with the local environment file:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check API health |
| `POST` | `/shorten` | Create a short URL |
| `GET` | `/:code` | Redirect to the original URL |
| `GET` | `/shorten/:code` | Retrieve the original URL |
| `GET` | `/shorten/:code/stats` | Get click statistics |
| `PATCH` | `/shorten/:code` | Update the destination URL |
| `DELETE` | `/shorten/:code` | Delete a short URL |

## Examples

### Create a short URL

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Example response:

```json
{
  "short_code": "b594b6",
  "short_url": "http://localhost:3000/b594b6",
  "original_url": "https://example.com"
}
```

### Retrieve the original URL

```bash
curl http://localhost:3000/shorten/b594b6
```

### Redirect to the original URL

Open this URL in a browser or follow it with curl:

```bash
curl -i http://localhost:3000/b594b6
```

### Update a short URL

```bash
curl -X PATCH http://localhost:3000/shorten/b594b6 \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/new-page"}'
```

### Get statistics

```bash
curl http://localhost:3000/shorten/b594b6/stats
```

### Delete a short URL

```bash
curl -i -X DELETE http://localhost:3000/shorten/b594b6
```

## Project Structure

```text
src/
├── controllers/    # HTTP request and response handling
├── repositories/   # PostgreSQL queries
├── routes/         # Express route definitions
├── services/       # Application and caching logic
├── app.ts          # Express application setup
├── server.ts       # Dependency initialization and server startup
├── db.ts           # PostgreSQL configuration
├── redis.ts        # Redis configuration
└── utils.ts        # Shared utilities
```

## Local Services

The Docker Compose setup exposes:

- PostgreSQL at `localhost:5432`
- Redis at `localhost:6379`

PostgreSQL stores URL records and click counts. Redis caches short-code lookups for one hour.

## Development Notes

This project is currently intended for local development and learning. Automated tests and production environment configuration are not yet included.

Copy `.env.example` to `.env` and update the values for your environment. The `.env` file is ignored by Git and must not be committed.

## License

ISC
