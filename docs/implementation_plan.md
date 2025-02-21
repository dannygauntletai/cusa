# Cusa Offline Quiz App - Implementation Plan

This document describes a step-by-step implementation plan for the Cusa Offline Quiz App. Each phase is divided into granular steps with explicit references to the project documents and file paths.

## **Phase 1: Environment Setup**

1.  **Initialize Git Repository**

    *   Action: Create the project folder `CusaQuiz` and initialize a Git repository with `main` and `dev` branches.
    *   Reference: PRD Section 1 (Project Overview) and project constraints.
    *   Command: `git init CusaQuiz && cd CusaQuiz && git checkout -b dev`

2.  **Setup Project Directory Structure**

    *   Action: Create the following directories:

        *   `/frontend` (for Electron+React/Vite app)
        *   `/backend` (for Python-based Cusa integration)
        *   `/electron` (for Electron main process and packaging configuration)

    *   Reference: PRD Section 1 & Tech Stack Document

3.  **Setup Frontend Environment**

    *   Action: Initialize a Vite React project in `/frontend` using TypeScript.
    *   File/Command: Run `npm create vite@latest frontend --template react-ts` inside the `CusaQuiz` directory.
    *   Reference: Tech Stack Document (React/Vite, TypeScript)

4.  **Setup Electron Environment**

    *   Action: In `/electron`, install Electron via npm and create the main Electron entry file.
    *   File: Create `/electron/main.js` with Electron app bootstrapping code.
    *   Reference: PRD Section 1 (native macOS Electron app) and Tech Stack Document (electron)

5.  **Setup Python Backend Environment**

    *   Action: Create a Python virtual environment in `/backend` and install required modules (including the custom `educhain` module).

    *   Commands:

        *   `python -m venv venv`
        *   Activate the environment and run: `pip install educhain` (ensure that the local runtime and dependencies for the local generation engine are available, including Ollama integration).

    *   Reference: PRD Section 1 (Backend/Engine) and Tech Stack Document (python, educhain, ollama)

6.  **Configure Tailwind CSS**

    *   Action: In the `/frontend` directory, install Tailwind CSS per documentation and create configuration files.
    *   Files: Create `/frontend/tailwind.config.js` and add required content from Tailwind docs.
    *   Reference: Tech Stack Document (tailwind css)

7.  **Validation**

    *   Action: Run `npm run dev` from `/frontend` and verify that the Vite server launches.
    *   Command: `npm run dev`
    *   Action: Run `python --version` inside `/backend` to ensure Python environment is set up.

## **Phase 2: Frontend Development**

1.  **Electron Main Process Setup**

    *   Action: In `/electron/main.js`, initialize Electron with a single BrowserWindow that loads the frontend build.
    *   File: `/electron/main.js`
    *   Reference: PRD Section 3 (User Flow: Home Screen) and Tech Stack Document (electron, macOS)
    *   **Validation:** Launch Electron to ensure that a window opens.

2.  **Create Home Screen UI (Search Input Page)**

    *   Action: In `/frontend/src`, create a React component `HomeScreen.tsx` that includes:

        *   A prominent search input for topics
        *   A toggle button for web search (enabled only when internet connection is detected)

    *   File: `/frontend/src/components/HomeScreen.tsx`

    *   Reference: PRD Section 3 (User Flow: Entering the Quiz Topic) and Core Features

    *   **Validation:** Render `HomeScreen` and verify that the search input and toggle display correctly.

3.  **Implement Connectivity Check for Web Search**

    *   Action: In `HomeScreen.tsx`, add logic to detect internet connectivity and disable the web search toggle if offline.
    *   File: `/frontend/src/components/HomeScreen.tsx`
    *   Reference: PRD Section 4 (Error Handling - Connectivity) and Q&A response on connectivity issues
    *   **Validation:** Simulate offline mode (e.g., disable WiFi) and check that the toggle is disabled.

4.  **Create Question Type Selection Screen**

    *   Action: In `/frontend/src/components`, create `QuestionType.tsx` where users can select quiz question type(s) (multiple choice, true/false, mix) and optionally specify difficulty.
    *   File: `/frontend/src/components/QuestionType.tsx`
    *   Reference: PRD Section 3 (Choosing the Question Type) and Q&A on difficulty specifications
    *   **Validation:** Verify that each selection option is clickable and records the user’s choice.

5.  **Create Quiz Display and Result Summary Page**

    *   Action: In `/frontend/src/components`, create `QuizDisplay.tsx` that will display all generated questions on one page and include a summary section at the end of the quiz.
    *   File: `/frontend/src/components/QuizDisplay.tsx`
    *   Reference: PRD Section 3 (Completing and Reviewing the Quiz) and Core Features
    *   **Validation:** Temporarily fill the component with mock data and test rendering.

6.  **Create Global Settings Component for Model Switching**

    *   Action: In `/frontend/src/components`, create `Settings.tsx` to allow the user to switch local models (default to mistral).
    *   File: `/frontend/src/components/Settings.tsx`
    *   Reference: PRD Section 4 (Future Flexibility) and Q&A: Future integration and settings details
    *   **Validation:** Ensure clicking on the settings icon (placed in a global header component) opens the settings page.

7.  **Integrate Error Handling UI**

    *   Action: Create a reusable error component `ErrorMessage.tsx` in `/frontend/src/components` to display error messages when question generation fails.
    *   File: `/frontend/src/components/ErrorMessage.tsx`
    *   Reference: PRD Section 4 (Error Handling)
    *   **Validation:** Manually trigger an error scenario to check if the error message appears and includes a "Back to Home" button.

## **Phase 3: Backend Development**

1.  **Create Python Module for Quiz Generation**

    *   Action: In `/backend`, create `quiz_generator.py` to interface with the Educhain engine.
    *   Include sample code:

    `from educhain import Educhain, LLMConfig def generate_quiz(question_type: str, num: int, topic: str): config = LLMConfig( model_name="mistral", # Default model, can be replaced via settings base_url="http://localhost:11434", temperature=0.7 ) client = Educhain(config) return client.qna_engine.generate_questions( question_type=question_type, num=num, topic=topic )`

    *   File: `/backend/quiz_generator.py`
    *   Reference: PRD Section 1 (Local Quiz Generation) and sample usage provided

2.  **Expose Backend Functionality via a Local API**

    *   Action: Create a simple HTTP API using FastAPI to allow the Electron app to invoke quiz generation.
    *   File: `/backend/server.py`
    *   Code sample:

    `from fastapi import FastAPI, HTTPException from quiz_generator import generate_quiz app = FastAPI() @app.post('/generate') async def generate(data: dict): try: questions = generate_quiz( question_type=data.get('question_type'), num=data.get('num', 1), topic=data.get('topic') ) return questions.json(), 200 except Exception as e: raise HTTPException(status_code=500, detail=str(e)) if __name__ == '__main__': import uvicorn uvicorn.run(app, host="0.0.0.0", port=5000)`

    *   Reference: PRD Section 3 (Generating the Quiz)
    *   **Validation:** Run `uvicorn /backend/server:app --reload` and test the endpoint with `curl -X POST http://localhost:5000/generate -d '{"question_type":"Multiple Choice","num":1,"topic":"Python"}' -H 'Content-Type: application/json'` to verify a 200 response or proper error message.

3.  **Prepare for Future SQLite Integration**

    *   Action: Create a placeholder file `/backend/database.py` that sets up a SQLite connection (for future quiz history features).
    *   Reference: PRD Section 2 (Out-of-Scope note on local history) and Tech Stack Document (sqlite)
    *   **Validation:** Import and run a simple command-line script to test SQLite connectivity.

## **Phase 4: Integration**

1.  **Connect Frontend to Backend API Using Electron IPC**

    *   Action: In `/electron/main.js`, add an IPC handler that forwards requests from the frontend to the Python backend API at `http://localhost:5000/generate`.
    *   File: `/electron/main.js`
    *   Reference: PRD Section 3 & 4 (User Flow and Error Handling) and Tech Stack Document
    *   **Validation:** Trigger a quiz generation from the frontend and trace the IPC flow.

2.  **Frontend API Call Implementation**

    *   Action: In `/frontend/src/services/api.ts`, create an API service module using Axios (or fetch) to make POST requests to the backend endpoint `/generate`.
    *   File: `/frontend/src/services/api.ts`
    *   Reference: PRD Section 3 (Generating the Quiz)
    *   **Validation:** Write a unit test (e.g., with Jest) in `/frontend/src/tests/api.test.ts` to confirm the API call works as expected.

3.  **Global Error Propagation Handling**

    *   Action: In the API service, add error handling to catch backend API failures and trigger the error UI component, reverting to the home screen.
    *   File: `/frontend/src/services/api.ts`
    *   Reference: PRD Section 4 (Error Handling)
    *   **Validation:** Simulate a backend error (e.g., by stopping the Python server) and verify that the frontend displays an error message.

## **Phase 5: Deployment**

1.  **Package Electron App for macOS**

    *   Action: Configure Electron Packager or Electron Builder in the project to package the app for macOS.
    *   File: Create `/electron/package.json` with build scripts and configuration.
    *   Reference: PRD Section 1 (macOS Native App) and Tech Stack Document (electron, macOS)
    *   **Validation:** Run the packaging command and verify that a macOS .app package is generated.

2.  **Bundle Frontend Assets**

    *   Action: Build the React app with Vite from `/frontend` using `npm run build`, and ensure the built assets are loaded by Electron.
    *   Command: `npm run build` in `/frontend`
    *   Reference: PRD Section 1 (offline functionality) and Tech Stack Document (vite, react)
    *   **Validation:** Check `/frontend/dist` for static files and confirm they load in the packaged Electron app.

3.  **Setup Local Python Server as Background Process (Optional)**

    *   Action: For production, include a script to launch the Python backend server along with the Electron app. Document how to start both processes.
    *   Reference: PRD Section 3 (Local Quiz Generation) and Tech Stack Document (python)
    *   **Validation:** Manually run both processes on the target macOS machine and verify end-to-end functionality.

4.  **Deployment Documentation**

    *   Action: Create a README file with detailed instructions on installing dependencies and launching the app.
    *   File: `/README.md`
    *   Reference: PRD Section 7 (Constraints & Assumptions)

## **Phase 6: Post-Launch**

1.  **Setup Logging and Monitoring**

    *   Action: Implement local logging for error and status messages both in the Electron app and Python backend. Use a logging library (e.g., Winston for Node.js, logging module for Python).
    *   Files: Update `/electron/main.js` and `/backend/server.py` to include logging.
    *   Reference: PRD Section 6 (Non-Functional Requirements: Reliability)
    *   **Validation:** Trigger errors and verify that logs are written to local files.

2.  **User Feedback and Update Loop**

    *   Action: Document a process for collecting user feedback and updating the app for future versions (e.g., adding local quiz history in `/backend/database.py`).
    *   Reference: PRD Section 2 (Out-of-Scope for now, future plan) and Core Features

3.  **Final End-to-End Testing**

    *   Action: Perform a complete test of the app from launching the Electron app, entering a topic, selecting a question type, generating the quiz, completing it, and viewing the summary.
    *   Reference: Q&A (Feedback only at quiz end) and PRD Section 3 (User Flow)
    *   **Validation:** Use manual and automated end-to-end tests to verify the app functions as specified.

4.  **Backup and Documentation Update**

    *   Action: Backup the latest version of the code in a secure Git repository and update internal documentation.
    *   Reference: PRD Section 7 (Constraints & Assumptions)

This plan organizes the project into clear phases with specific steps, file paths, and validations. Each step directly references relevant sections of the documentation and tech stack, ensuring adherence to the strict requirements specified in the project documents.
