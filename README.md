# Golden Raspberry API

Backend challenge for parsing Golden Raspberry Awards data and calculating producer win intervals.

## Description

This project was developed as a technical test for Outsera.  
It provides a RESTful API that reads a CSV file containing movie awards, stores the data in memory, and exposes an endpoint to return the producers with the **minimum and maximum intervals** between award wins.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- SQLite (in-memory)
- csv-parse
- Jest & Supertest (integration tests)

## Project Structure (Clean Architecture)

```
src/
├── domain/          # Entities
├── application/     # Use cases
├── infrastructure/  # DB, CSV loader
├── interfaces/      # HTTP layer (Express)
├── shared/          # Helpers and mappers
```

## How to Run

```bash
# Install dependencies
npm install

# Run the project
npm start
```

The server will run at:  
`http://localhost:3000/api/producers/intervals`

## How to Test (to be implemented)

```bash
npm test
```

## Endpoint Example

**GET** `/api/producers/intervals`

```json
{
  "min": [
    {
      "producer": "Producer A",
      "interval": 1,
      "previousWin": 2001,
      "followingWin": 2002
    }
  ],
  "max": [
    {
      "producer": "Producer B",
      "interval": 13,
      "previousWin": 1990,
      "followingWin": 2003
    }
  ]
}
```

## Dataset

The dataset is located at `src/data/movieList.csv`.

---

