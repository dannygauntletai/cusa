# API Documentation

## Core Endpoints

### Quiz Generation
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "topic": "string",
  "questionType": "string",
  "numQuestions": "integer",
  "difficulty": "string"
}
```

### Model Management
```http
GET /api/models/list
Response: List of available local models

POST /api/models/select
{
  "model": "string"
}
```

### Web Search Integration
```http
POST /api/search
{
  "query": "string",
  "maxResults": "integer"
}
```

## Data Structures

### Quiz Question
```typescript
interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}
```

### Quiz Result
```typescript
interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  questions: QuizQuestion[];
}
```

## Error Handling

All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

Error responses include:
```json
{
  "error": "string",
  "detail": "string"
}
``` 