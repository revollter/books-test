# Books Management

Book management application - Yii2 REST API + AngularJS + PostgreSQL in Docker.

## Requirements

- Docker
- Docker Compose

## Getting Started

#### Clone repository
```bash
git clone https://github.com/revollter/books-test.git
cd books-test
```
#### Start containers
```bash
docker compose up --build -d
```
#### Run database migrations
```bash
docker compose exec backend php yii migrate --interactive=0
```
#### (Optional) Load sample data - choose ONE:
```bash
docker compose exec backend php yii seed              # downloads covers image also
```
```bash
docker compose exec backend php yii seed --no-covers  # without covers downloading
```
> **Note:** Run only ONE of the seed commands above, not both!

Application available at: http://localhost:8000

## API Endpoints

Base URL: `http://localhost:8080`

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | List books (paginated) |
| GET | `/books/{id}` | Get book details |
| POST | `/books` | Create book |
| PUT | `/books/{id}` | Update book |
| DELETE | `/books/{id}` | Delete book |
| GET | `/books/export` | Export to JSON file |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/images` | List images |
| GET | `/images/{id}` | Get image details |
| POST | `/images` | Upload image |
| DELETE | `/images/{id}` | Delete image |

## Example Requests

### List all books

```bash
curl http://localhost:8080/books
```

### List books with pagination

```bash
curl "http://localhost:8080/books?page=2&per-page=5"
```

### Get single book

```bash
curl http://localhost:8080/books/1
```

### Create book

```bash
curl -X POST http://localhost:8080/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "country": "USA",
    "language": "English",
    "pages": 218,
    "year": 1925
  }'
```

### Update book

```bash
curl -X PUT http://localhost:8080/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby (Updated)",
    "author": "F. Scott Fitzgerald",
    "country": "USA",
    "language": "English",
    "pages": 218,
    "year": 1925
  }'
```

### Delete book

```bash
curl -X DELETE http://localhost:8080/books/1
```

### Export all books to JSON

```bash
curl http://localhost:8080/books/export -o books.json
```

### List images

```bash
curl http://localhost:8080/images
```

### Get image details

```bash
curl http://localhost:8080/images/1
```

### Upload image

```bash
curl -X POST http://localhost:8080/images \
  -F "file=@cover.jpg"
```

### Delete image

```bash
curl -X DELETE http://localhost:8080/images/1
```

### Create book with image

```bash
# First upload image
curl -X POST http://localhost:8080/images -F "file=@cover.jpg"
# Response: {"id": 1, "filename": "abc123.jpg", ...}

# Then create book with image_id
curl -X POST http://localhost:8080/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Book with Cover",
    "author": "Author Name",
    "country": "Country",
    "language": "English",
    "pages": 300,
    "year": 2024,
    "image_id": 1
  }'
```

## Project Structure

```
├── backend/          # Yii2 REST API
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── migrations/
├── frontend/         # AngularJS + Bootstrap
│   ├── js/
│   │   ├── controllers/
│   │   ├── directives/
│   │   └── services/
│   └── templates/
└── docker-compose.yml
```
