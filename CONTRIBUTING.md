# Contributing to CUSA

First off, thank you for considering contributing to CUSA! It's people like you that make CUSA such a great platform.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to [project maintainers].

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* Include your environment details (OS, Node.js version, Python version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful
* List some other applications where this enhancement exists, if applicable

### Pull Requests

* Fork the repo and create your branch from `main`
* If you've added code that should be tested, add tests
* If you've changed APIs, update the documentation
* Ensure the test suite passes
* Make sure your code lints
* Issue that pull request!

## Development Setup

1. Fork the repo
2. Clone your fork
3. Create a branch:
   ```bash
   git checkout -b my-branch-name
   ```
4. Make your changes
5. Push to your fork and submit a pull request

### Project Structure

```
cusa/
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── tests/        # Test suite
│   └── README.md     # Backend documentation
├── frontend/         # React frontend
│   ├── src/         # Source files
│   ├── public/      # Static files
│   └── README.md    # Frontend documentation
└── electron/        # Electron wrapper
    └── README.md    # Electron documentation
```

### Coding Style

* Python: Follow PEP 8
* TypeScript/JavaScript: Follow the project's ESLint configuration
* Use meaningful variable names
* Write comments for complex logic
* Keep functions small and focused
* Use type hints in both Python and TypeScript

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add speech-to-text functionality for topic input

- Implement Web Speech API integration
- Add microphone button with active state
- Handle continuous listening mode
- Update types for speech recognition

Fixes #123
```

### Testing

* Write tests for new features
* Update tests when modifying existing functionality
* Run the test suite before submitting a PR
* Ensure both frontend and backend tests pass

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Documentation

* Update README.md if needed
* Add JSDoc comments for new TypeScript functions
* Update API documentation for backend changes
* Add inline comments for complex logic
* Update type definitions

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 