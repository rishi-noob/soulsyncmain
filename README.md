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

## Sharing Your Project

The best way to share your codebase with a friend or collaborator is by using Git and a code hosting platform like GitHub.

### Steps to Share:

1.  **Initialize a Git Repository:**
    If your project isn't already a Git repository, open a terminal in the project's root directory and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub:**
    *   Go to [GitHub](https://github.com) and create a new repository. You can make it public or private.
    *   After creating the repository, GitHub will give you a URL (e.g., `https://github.com/your-username/your-project-name.git`).

3.  **Connect and Push Your Code:**
    In your terminal, connect your local repository to the one on GitHub and push your code:
    ```bash
    git remote add origin https://github.com/your-username/your-project-name.git
    git branch -M main
    git push -u origin main
    ```
    (Replace the URL with the one you got from GitHub).

4.  **Share the Link:**
    You can now share the GitHub repository link with your friend. They can download the code or clone it using Git.
