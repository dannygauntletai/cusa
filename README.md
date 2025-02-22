# CUSA Platform

An offline-first, privacy-focused learning platform that leverages local AI models and web intelligence to generate personalized educational content.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## 🚀 Features

### Core Architecture
- **Offline-First Design**: Full functionality without internet connectivity
- **Electron-Based Desktop App**: Native cross-platform support
- **React + TypeScript Frontend**: Type-safe, component-based UI
- **FastAPI Backend**: High-performance async API server
- **SQLite Database**: Local data persistence with zero configuration

### AI Integration
- **Local Model Support**: 
  - Integrated with Ollama for local model execution
  - Support for multiple models (Mistral, Llama, GPT4All)
  - Model hot-swapping without app restart
  - Automatic model parameter optimization

### Learning Features
- **Intelligent Quiz Generation**:
  - Multiple question types (MCQ, True/False, Fill-in-blanks, Short Answer)
  - Web-augmented question generation using Firecrawl API
  - Offline question generation for continuous learning
  - Dynamic difficulty adjustment

- **Privacy-First Design**:
  - Zero data transmission to external servers
  - Local model execution
  - Encrypted local storage

- **Learning Analytics**:
  - Personal progress tracking
  - Performance metrics visualization
  - Learning pattern analysis
  - Custom learning goals and milestones

### Technical Features
- **Web Search Integration**:
  - Firecrawl API for real-time content enrichment
  - Offline content caching
  - Configurable search depth and sources
  - Content validation and filtering

- **Profile Management**:
  - Local user profiles
  - Learning preferences
  - Progress synchronization
  - Performance analytics

## 🛠 Setup

### Prerequisites
```bash
# Install Node.js (v18+)
# Install Python (v3.10+)
# Install Ollama (for local models)

# Clone repository
git clone https://github.com/dannygauntletai/educhain
cd educhain
mv educhain cusa (after cloning)
```

### Backend Setup
```bash
# Setup Python environment
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Electron App
```bash
# Build and start Electron app
cd electron
npm install
npm run dev
```

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Local Models Guide](./docs/local-models.md)
- [Privacy Policy](./docs/privacy.md)

## 🔧 Configuration

### Local Models
```env
# .env file
OLLAMA_HOST=http://localhost:11434
DEFAULT_MODEL=mistral
FIRECRAWL_API_KEY=your_api_key
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [EduChain Website](https://educhain.in)
- [Documentation](https://docs.educhain.in)
- [Issue Tracker](https://github.com/dannygauntletai/educhain/issues) 