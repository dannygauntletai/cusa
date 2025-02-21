## Project Overview

*   **Type:** cursor_project_rules
*   **Description:** This project is about building an offline macOS Electron app that allows users to generate custom quiz questions using a local GenAI educational engine called educhain. Users can input a topic, select the type of quiz (multiple choice, true/false, or a mix), and then receive a full quiz along with a summary of their performance, all without relying on continuous internet connectivity (web search is toggled off if offline).
*   **Primary Goal:** Provide an accessible, offline-first quiz generation and evaluation tool that leverages a local AI model (defaulting to mistral via Ollama) while allowing future flexibility to switch models.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   **[react/vite + latest]:** Utilize a clean separation between Electron’s main and renderer processes with routing handled by React Router 6. Routes are defined within `src/routes/` using nested directories to represent different screens (e.g., home, topic selection, quiz generation, and results).
    *   Example 1: For a home screen component, use `src/routes/home/HomePage.tsx`.
    *   Example 2: For the quiz page, follow a pattern like `src/routes/quiz/QuizPage.tsx`.
    *   Example 3: Use React Router’s configuration in `src/routes/index.tsx` to aggregate and export all routes.

### Core Directories

*   **Versioned Structure:**

    *   **[electron]:** The Electron app’s main process code is stored in `src/main/`, handling native integrations and window management.
    *   **[react/vite]:** The renderer process is found in `src/renderer/` which contains all React components and routing setups, leveraging Vite for fast builds.
    *   **[python]:** Backend modules related to the educhain engine are located in the `python/educhain/` directory, encapsulating all logic for quiz question generation and model integration.
    *   **[sqlite]:** Database schema and migration files for potential local quiz history and settings are managed under `database/`.

### Key Files

*   **Stack-Versioned Patterns:**

    *   **[src/main/main.ts]:** Electron main process entry file responsible for bootstrapping the app.
    *   **[src/renderer/App.tsx]:** Main React component for the renderer process which includes the application’s routing provider.
    *   **[src/routes/home/HomePage.tsx]:** Home screen component featuring the search input and web search toggle.
    *   **[python/educhain/generation.py]:** Contains version-specific integrations to handle quiz question generation using the local GenAI model.

## Tech Stack Rules

*   **Version Enforcement:**

    *   **[electron@latest]:** Use Electron’s latest stable version ensuring native macOS support and secure packaging practices.
    *   **[react/vite@latest]:** Enforce a modular component structure with React Router v6, ensuring file-based nested routing and separation of concerns.
    *   **[typescript@latest]:** Apply strict type-checking guidelines in all TypeScript files to minimize runtime errors.

## PRD Compliance

*   **Non-Negotiable:**

    *   "Provide an accessible, offline-first quiz generation tool with reliable error handling and flexible model switching, defaulting to mistral via Ollama." This must be incorporated into both UI and backend logic, ensuring that if any component (e.g. the local GenAI engine or web search) fails, the user is promptly notified and redirected back to the homepage.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Home Screen: `src/routes/home/HomePage.tsx` with search input bar and conditional web search toggle based on connectivity.
    *   Topic Entry & Question Type Selection: Transition screens handled within `src/routes/topic/` where users choose quiz parameters.
    *   Quiz Generation & Completion: `src/routes/quiz/QuizPage.tsx` displays all questions and a results summary at the end, with error handling routing back to the home screen if necessary.
    *   Settings Integration: A persistent settings component located in `src/renderer/components/Settings.tsx` allows users to switch AI models.

## Best Practices

*   **python**

    *   Write clean, modular code with appropriate exception handling for the educhain module.
    *   Maintain clear documentation for API integrations with Ollama and the mistral model.
    *   Implement unit tests to validate quiz generation logic.

*   **electron**

    *   Follow security best practices such as disabling node integration where not required and isolating the renderer process.
    *   Optimize the app for native macOS behaviors.
    *   Ensure smooth communication between main and renderer processes using IPC safely.

*   **ollama**

    *   Adhere to API rate limits and error handling as outlined in Ollama documentation.
    *   Validate model responses and ensure graceful fallbacks.
    *   Keep configuration settings (like base URL and temperature) centralized in the educhain module.

*   **macOS**

    *   Design the UI to reflect macOS native design guidelines for a seamless user experience.
    *   Optimize performance for the specific hardware characteristics of macOS.
    *   Ensure proper screen scaling and resolution handling.

*   **educhain**

    *   Encapsulate quiz generation logic clearly so that future integrations with additional models can be added with minimal disruption.
    *   Thoroughly test offline functionalities and error scenarios.
    *   Keep the engine configuration dynamic and accessible through a settings interface.

*   **mistral**

    *   Utilize the mistral model according to best practices recommended by Ollama.
    *   Monitor performance and response times; implement caching if needed.
    *   Ensure the default configuration is maintainable yet flexible for future updates.

*   **claude**

    *   Use Claude AI for code assistance while ensuring that sensitive information is not exposed.
    *   Validate generated code for security and performance issues.
    *   Incorporate feedback from code reviews to improve integration accuracy.

*   **sqlite**

    *   Use efficient schema design and indexing to ensure quick data retrieval as the app scales.
    *   Implement migrations for any schema changes.
    *   Ensure data integrity especially under offline conditions.

*   **react/vite**

    *   Follow functional component best practices and use React hooks for state management.
    *   Leverage code-splitting and lazy loading to enhance performance.
    *   Ensure clear separation between UI components and business logic.

*   **typescript**

    *   Enforce strict typing and linting rules for better code quality.
    *   Use interfaces and types to clearly define component props and state.
    *   Regularly review and update types to match evolving application needs.

*   **node.js**

    *   Implement asynchronous programming patterns to enhance performance.
    *   Use proper error handling and logging mechanisms.
    *   Keep dependencies updated and audit them regularly for security fixes.

*   **tailwind css**

    *   Use utility-first principles to build responsive, maintainable UIs.
    *   Configure purge options to eliminate unused styles in production builds.
    *   Maintain a centralized configuration to ensure consistency across the project.

## Rules

*   Derive folder/file patterns directly from tech stack documented versions.

*   For Electron with React/Vite:

    *   Enforce separate directories for main (`src/main/`) and renderer (`src/renderer/`) processes.
    *   Use clearly defined routes in the renderer process, leveraging React Router’s nested routing conventions.

*   Follow Python best practices for backend integration with the local AI quiz generation engine.

*   Ensure that no routing patterns from other frameworks (e.g., Next.js App Router) are mixed; adhere solely to React Router conventions for this project.

*   Maintain strict separation between UI and backend logic to meet PRD requirements for offline-first performance and robust error handling.

*   Always validate connectivity before enabling web search functionalities.
