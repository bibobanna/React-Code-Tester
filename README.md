# CodeTester

CodeTester is a web application designed to run code snippets securely in isolated Docker containers. It supports multiple programming languages and provides real-time feedback on code execution.

## Features

- **Multi-Language Support**: Currently supports Python and JavaScript.
- **Secure Execution**: Runs user-submitted code in Docker containers to ensure isolation and security.
- **Real-Time Feedback**: Instantly returns the output or errors from executed code.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

```bash
docker pull python:3.8-slim
docker pull node:14-alpine
```

## Installing

A step-by-step guide to setting up the development environment:

1. **Clone the repository:**
```bash
git clone https://github.com/bibobanna/React-Code-Tester
```
2. **Navigate to the project directory:**
```bash
cd CodeTester
```
3. **Install dependencies:**
```bash
npm install
```
4. **Start the server:**
```bash
node server/src/index.js
```
5. **In another terminal, start the frontend:**
```bash
cd client
npm start
```

The application should now be running on `http://localhost:3001` with the backend on `http://localhost:3000`.

# Usage
To use CodeTester, select the programming language from the dropdown menu, enter the code in the editor, and click "Run Code". The output or error will display below the editor.

