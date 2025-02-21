# Tech Stack Document for Educhain Offline Quiz App

## Introduction

The Educhain Offline Quiz App is a desktop application created to enable users to generate quick, customized quizzes without an internet connection. Users can input a topic, choose their preferred quiz type, and receive tailored questions using a local GenAI engine called Educhain. By default, the app employs the "mistral" model via Ollama, though it allows flexibility in changing models. This document outlines the rationale behind the technology choices and how they combine to deliver an efficient and user-friendly experience.

## Frontend Technologies

The app's user interface is developed with Electron, facilitating the creation of a native macOS application that is robust and responsive. We utilize React with Vite to ensure a dynamic and fast user experience, and Tailwind CSS is employed for consistent and clean styling. TypeScript is the primary language for development, offering type safety and clarity, thereby improving code quality. The frontend design guarantees a smooth, intuitive user experience for entering topics and viewing quiz questions in a visually engaging manner.

## Backend Technologies

The backend is structured in Python, integrating a FastAPI instance to interface directly with the Educhain package. This setup enables seamless interaction for quiz question generation. The Educhain module communicates with the Ollama API to operate the mistral model by default, yet users have the option to alter the model via a settings icon. Additionally, SQLite serves as a lightweight local database system, paving the way for future functionalities like storing quiz histories. These backend components ensure that quiz generation remains consistent, rapid, and adaptable to changes in AI models.

## Infrastructure and Deployment

The application is distributed as a native macOS app using Electron, simplifying installation on Apple devices. With FastAPI serving the backend logic on the desktop, the integration with the Educhain module is efficient. Code versioning is managed using industry-standard systems, promoting collaboration and orderly modifications. While the details of continuous integration and deployment pipelines are not included here, they are anticipated to automate testing and ensure dependable releases. This approach supports the app's scalability and assures stable performance in production.

## Third-Party Integrations

Key integrations enhance the functionality of Educhain, with the Ollama API being vital for accessing local GenAI models like mistral. Development efficiencies are gained from tools like Cursor, an intelligent code assistant, and Claude AI, which enhances code quality through AI-driven insights. These integrations streamline development and contribute to a robust product built for future expansions.

## Security and Performance Considerations

Our security strategy focusses on providing a secure and smooth user experience. The app is built offline-first, minimizing dependency on internet connectivity and exposure to external risks. In cases of backend failures or internet issues affecting the web search feature, the application disables the web search and alerts users with clear notifications. Planned local data storage via SQLite prioritizes data protection. These strategies collectively optimize app performance in both online and offline scenarios, ensuring reliable quiz-taking experiences.

## Conclusion and Overall Tech Stack Summary

In conclusion, the Educhain Offline Quiz App uses a blend of modern technologies to provide an effective offline quiz generation experience. The combination of Electron, React with Vite, Tailwind CSS, and TypeScript delivers a high-quality frontend interface. On the backend, Python with FastAPI, the Educhain engine, Ollama, and SQLite offer the essential functionality to swiftly generate custom quiz questions. Infrastructure decisions, along with development tools like Cursor and Claude AI, guarantee efficient deployment and consistent performance. This carefully designed tech stack is well-suited to current user needs and is adaptable to future technical enhancements and integrations.
