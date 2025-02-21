# Local Models Guide

## Supported Models

### Default Models
- Mistral (recommended)
- Llama 2
- GPT4All

### Model Requirements
- Minimum 8GB RAM
- 4GB disk space per model
- CPU with AVX2 support

## Setup Instructions

### Installing Ollama
```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

### Model Installation
```bash
# Pull default model
ollama pull mistral

# Verify installation
ollama list
```

## Configuration

### Environment Variables
```env
OLLAMA_HOST=http://localhost:11434
DEFAULT_MODEL=mistral
```

### Model Parameters
- Temperature: 0.7
- Top P: 0.9
- Max Tokens: 2048

## Best Practices

### Performance
- Keep models loaded
- Batch similar requests
- Use appropriate context lengths

### Memory Management
- Unload unused models
- Monitor memory usage
- Clear cache periodically 