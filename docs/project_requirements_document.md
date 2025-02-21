# Project Requirements Document for CUSA Offline Quiz App

## 1. Project Overview

CUSA is an offline desktop application designed to help users generate and take quizzes on a topic of their choice using a local GenAI educational engine. The app empowers users to enter a topic, choose a type of quiz (such as multiple choice or true/false), and then generate custom quiz questions based on their input. This approach solves the problem of needing an immediate and tailored educational experience without relying on continuous internet connectivity.

The purpose of CUSA is to provide an accessible learning tool for users who want a self-contained quiz generation and evaluation system. The key objectives are to offer a simple, clean user interface, reliable offline question generation using a local generation model (defaulting to mistral via Ollama), and an intuitive flow that guides users from input to quiz completion with a comprehensive result summary at the end. Success will be measured by smooth offline performance, ease-of-use, and the ability to flexibly switch between models if needed.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   A native macOS Electron app that provides an offline-first experience.
*   A clean home screen with a search input bar and an option to enable web search (only active if there is an internet connection).
*   Functionality to enter a topic and select the type(s) of quiz questions.
*   Integration of the local AI generation engine (CUSA) for generating quiz questions, with support for different question types (multiple choice, true/false, and a mix).
*   Default use of the mistral model available via Ollama with an option in settings to switch to another model.
*   Single-page quiz display that allows users to complete the quiz and view summary results at the end.
*   Error handling that reverts the user back to the search input page if question generation or web search fails.

**Out-of-Scope:**

*   Advanced quiz customization options like time limits, randomization of questions, or varying difficulty levels within a single session.
*   User account management, authentication, or storing quiz history (though future plans include local history review).
*   Integration with external services beyond the optional web search feature.
*   Immediate feedback on each individual question; feedback is summarized only at the end.

## 3. User Flow

When a user opens the CUSA app on their macOS device, they are greeted with a clean, minimalistic home screen featuring a prominent search bar. The user has the option to enable a web search feature, which is only active if an internet connection is detected. The process starts simply: the user enters a topic they wish to be quizzed on into the input field.

After providing a topic, the app asks the user to choose the type of quiz questions they want (e.g., multiple choice, true/false, or a mix). Once the selection is made, the local GenAI engine kicks in to generate the quiz questions. The questions are displayed on one single page where the user can complete the quiz. On finishing, the app provides a summary of the user’s performance. If at any point there is an error (like a question generation failure or web search issue), the app shows an error message and allows the user to easily return to the home screen to restart the process.

## 4. Core Features (Bullet Points)

*   **Home Screen with Search Input:**

    *   A prominent search input bar for entering a topic.
    *   An optional web search toggle that only works with an active internet connection.

*   **Question Type Selection:**

    *   Simple interface for selecting between different quiz question types (multiple choice, true/false, etc.).
    *   Option to specify the difficulty level when generating questions.

*   **Local Quiz Generation:**

    *   Integration with the CUSA engine to generate quiz questions offline.
    *   Default model is mistral via Ollama; settings icon available in the top right to switch models.

*   **Quiz Display and Summary:**

    *   Single-page presentation of all quiz questions.
    *   A summary results screen at the end of the quiz detailing how the user performed.

*   **Error Handling:**

    *   Clear error messages if the quiz generation fails or web search encounters issues.
    *   Automatic reversion to the home screen on error.

## 5. Tech Stack & Tools

*   **Frontend:**

    *   Desktop App Framework: Electron (for macOS native app experience)
    *   UI Development: React with Vite (for a modern, fast frontend), Tailwind CSS (for clean and simple styling)
    *   Language: TypeScript for type safety and better development experience

*   **Backend/Engine:**

    *   Primary language: Python (for interfacing with the CUSA engine)
    *   Local GenAI Model Integration: Ollama API to work with the mistral model (default)
    *   CUSA: Custom module that handles question generation

*   **Database/Storage:**

    *   SQLite (for potential local storage, future expansion for quiz history)

*   **Additional Tools & Integrations:**

    *   IDE Assistance: Cursor (for real-time code suggestions with AI)
    *   AI Code Assistance: Claude AI (Anthropic's Sonnet 3.5 for additional coding help)
    *   Electron for packaging the desktop app as a native macOS application

## 6. Non-Functional Requirements

*   **Performance:**

    *   Quick response time for question generation to ensure a seamless user experience.
    *   Smooth offline operation even when web search is disabled.

*   **Security:**

    *   Ensure that any local data (if stored in the future) is handled securely.
    *   Minimal internet exposure by prioritizing offline functionality.

*   **Usability:**

    *   Clean and intuitive user interface with simple navigation.
    *   Clear error messages and feedback to guide the user through the quiz process.

*   **Reliability:**

    *   Robust error handling for scenarios when the GenAI engine or web search fails.
    *   Consistent performance in both offline and online modes (with web search auto-disabled when offline).

## 7. Constraints & Assumptions

*   The app runs exclusively on macOS using Electron.
*   The local generation model (mistral via Ollama) is assumed to be readily available and configured correctly on the user’s system.
*   Internet connectivity is required only for optional web search functionality; lack thereof should not disrupt the main offline functionality.
*   The current version is designed for single-user use without authentication or user accounts.
*   Future integration possibilities (like local quiz history) are acknowledged but not part of the first release.
*   A settings icon in the top right is assumed to be sufficient for future model switching.

## 8. Known Issues & Potential Pitfalls

*   There could be challenges with managing connectivity states dynamically (switching web search on/off) which may require robust network checking to avoid user confusion.
*   The error handling mechanism must gracefully handle failures within the local generation engine and web search, showing user-friendly messages and returning to the search screen.
*   Integrating and testing the local GenAI model (mistral via Ollama) might lead to compatibility issues if dependencies change or if users decide to switch models.
*   Packaging the application with Electron for a native macOS experience may present challenges with OS-specific quirks.
*   Future model switching via the settings icon should be designed to be flexible and secure, ensuring that even alternative models can be integrated without disrupting the app.

To mitigate these issues, ensure thorough testing across scenarios, maintain clear and simple error messages, and design with future flexibility in mind. Regularly validate network checks and error responses to maintain a robust offline experience.

This PRD provides all the necessary details for the AI model to understand and generate further technical documents such as the Tech Stack Document, Frontend Guidelines, Backend Structure, and more, ensuring that every aspect of the CUSA Offline Quiz App is clearly defined and unambiguous.
