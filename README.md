# SoulSync - A Campus Mental Health Companion

This is a Next.js application built with Firebase Studio.

## Running Locally

To run this project on your local machine, follow these steps:

### 1. Install Dependencies

Open a terminal in the project's root directory and run the following command to install all the necessary packages:

```bash
npm install
```

### 2. Set Up Environment Variables

The application's AI features are powered by the Gemini API. You will need to obtain an API key to use them.

1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a new API key.
2.  Create a file named `.env` in the root of the project.
3.  Add the following line to the `.env` file, replacing `YOUR_API_KEY` with the key you just obtained:

```
GEMINI_API_KEY=YOUR_API_KEY
```

### 3. Run the Development Servers

You need to run two processes simultaneously in two separate terminals.

**Terminal 1: Start the Next.js Application**

```bash
npm run dev
```

This will start the main web application, typically available at `http://localhost:9002`.

**Terminal 2: Start the Genkit AI Services**

```bash
npm run genkit:watch
```

This will start the backend services that power the AI chatbot and other generative features. The `--watch` flag ensures the service automatically restarts if you make changes to the AI flow files.

Once both processes are running, you can access the application in your browser.
