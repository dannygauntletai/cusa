# CUSA Quiz Backend

Backend service for the CUSA Quiz application, built with FastAPI and Educhain.

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. Install Ollama (required by educhain):
Follow instructions at https://ollama.ai/download

4. Run the server:
```bash
# From the backend directory
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000

## API Documentation

After starting the server, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the backend directory:
```env
EDUCHAIN_API_KEY=your_api_key_here
OLLAMA_HOST=http://localhost:11434  # Default Ollama host
``` 