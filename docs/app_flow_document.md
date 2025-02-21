# Educhain Offline Quiz App Flow Document

## Introduction

This document describes in simple language how the Educhain Offline Quiz App works from start to finish. The app is designed to be an offline tool for generating quizzes on topics chosen by the user. It uses a local GenAI educational engine named educhain to produce different types of questions such as multiple choice and true/false. The app focuses on a clean, intuitive experience and emphasizes offline functionality with optional web search if an internet connection is present. The main goal is to allow users to quickly generate and take customized quizzes without interruptions and with a clear summary of their performance at the end.

## Onboarding and Sign-In/Sign-Up

Since the app is designed for single-user usage without the need for registration, there is no traditional sign-up or sign-in process. When the user opens the native macOS Electron app, they are immediately presented with the home screen. There is no need to create an account or log in. Because the app is intended for personal, offline use, all quiz sessions remain standalone, though there are plans for integrating a local quiz history in the future. The experience is fast and uninterrupted with no extra steps of authentication.

## Main Dashboard or Home Page

Upon launching the Educhain app, the first screen the user sees is a simple and clean home page. This page features a prominent search input bar where users can type in a topic they want to be quizzed on. Alongside the input bar, there is an option to enable web search. However, this feature only activates if the app detects an internet connection; if there is no connection, the web search option is automatically disabled to ensure the app continues to function as intended in offline mode. The home screen serves as the starting point and the navigation hub for the entire experience, allowing the user to proceed directly to quiz creation with ease.

## Detailed Feature Flows and Page Transitions

After entering a topic on the home screen, the user is taken to a page that prompts them to choose the type of quiz questions they want to generate. This page clearly asks for the question type, offering options like multiple choice, true/false, or a mix. The selection is made with simple input controls and clear labels, ensuring no confusion about the process. Once the user selects the question type, the app transitions smoothly to the quiz generation stage. In this stage, the educhain engine, set up with a local GenAI model, begins generating the questions in the background. The local engine defaults to using the mistral model via Ollama, but users can later change models through a settings option if desired. All generated quiz questions are displayed on a single page where the user can complete the quiz. The page is simply laid out with all the questions together, and there are clear instructions to ensure the users understand they have a set of questions to work through. When the user finishes the quiz, they are shown a summary page that aggregates their performance and displays a clear result with no interruptions during individual question answering.

## Settings and Account Management

While there is no user account management since the app is designed for single user use, there is a settings icon located in the top right corner of the interface. This settings area is designed to give the user control over the main configuration of the app. Here, users can switch the underlying model used for quiz generation, which is particularly useful if they want to move away from the default mistral model. In this settings screen, the user sees options for model configuration and can change settings. Once these adjustments are made, the user easily returns to the main quiz flow without disturbing the learning experience. There are no personal preferences to update, and no billing information is needed, as everything is handled locally.

## Error States and Alternate Paths

The app is built to be robust and user-friendly in handling errors and alternate paths. If a user tries to generate a quiz and the local GenAI engine fails to produce questions, an error message is clearly displayed on the screen. The user is then gently guided back to the home page so they can try again without confusion. Similarly, if the user attempts to use the web search feature without an internet connection, the feature is disabled automatically to keep the process smooth. These error messages are simple and reassuring, ensuring that the user always has a clear path to return to and begin again from the home screen without any technical jargon or complex instructions.

## Conclusion and Overall App Journey

The journey through the Educhain Offline Quiz App is designed to be as simple as possible. The user starts on a minimalistic home page with a search input and an optional web search toggle. After entering a topic, they choose the type of quiz questions they prefer, and the local GenAI engine takes over to generate a tailored quiz. Once the quiz is completed on a single, well-organized page, the user is shown a summary of their performance. At every step, errors are handled gracefully with clear messages and a quick way back to the starting point. In addition, the settings icon ensures future flexibility by allowing users to change the model if they desire. Overall, the app offers a seamless, offline learning experience where each step naturally flows into the next, ensuring that every user action leads to an intended and clear outcome. This structured simplicity encourages repeated use for continuous learning and self-assessment.
