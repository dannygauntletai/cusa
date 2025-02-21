# Architecture Overview

## System Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Electron App   │────▶│React Frontend│────▶│FastAPI Backend
└─────────────────┘     └──────────────┘     └─────────────┘
         │                     │                    │
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────┐    ┌───────────────┐   ┌──────────────┐
│Local Storage    │    │State Management│   │Local Models  │
└─────────────────┘    └───────────────┘   └──────────────┘
```

## Component Overview

### Frontend Layer
- **Electron Shell**: Cross-platform desktop application wrapper
- **React + TypeScript**: UI components and business logic
- **TailwindCSS**: Utility-first styling
- **Web Speech API**: Native speech-to-text functionality

### Backend Layer
- **FastAPI**: High-performance async API server
- **SQLite**: Local data persistence
- **Ollama Integration**: Local model execution
- **Firecrawl API**: Web search integration (optional)

### Data Flow
1. User input captured through React components
2. State managed locally using React hooks
3. API requests handled by FastAPI backend
4. Model inference executed locally via Ollama
5. Results stored in SQLite database
6. UI updated with response data

## Security Architecture

### Local-First Design
- All sensitive data stored locally
- No cloud dependencies
- Offline functionality preserved

### Privacy Considerations
- Zero telemetry
- No external API calls without explicit consent
- Local model execution only

## Performance Optimizations

### Frontend
- Code splitting
- Lazy loading
- Memoized components
- Debounced inputs

### Backend
- Async request handling
- Connection pooling
- Response caching
- Batch processing 