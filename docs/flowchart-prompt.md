
# SoulSync Application Flowchart Generation Prompt

Create a detailed flowchart for a web application named "SoulSync". The flowchart should illustrate the complete user journey, from authentication to interacting with the app's core features, including the AI-powered components.

## I. Authentication Flow (User Entry Point)

1.  **Start** at the "User Visits App Root (`/`)" node.
2.  The app displays an **Authentication UI** with two tabs: "Sign In" and "Sign Up".
3.  **Decision:** Does the user select "Sign In" or "Sign Up"?
    *   **Path A: Sign Up**
        1.  User enters `Name`, `Email`, `Password`, and `Role` into the sign-up form.
        2.  On submission, the system triggers the `handleSignup` function.
        3.  **Decision:** Does the email already exist in the user database?
            *   **Yes:** Display "Error: Email Already Exists" toast notification and return to the form.
            *   **No:** Create a new user object, update the global `AuthContext` with the new user's state, and proceed to the **Authenticated App Entry**.
    *   **Path B: Sign In**
        1.  User enters `Email` and `Password` into the sign-in form.
        2.  On submission, the system triggers the `handleLogin` function.
        3.  **Decision:** Do the credentials match an existing user in the database?
            *   **Yes:** Update the global `AuthContext` with the existing user's state and proceed to the **Authenticated App Entry**.
            *   **No:** Display "Error: Invalid Credentials" toast notification and return to the form.

## II. Authenticated App Entry & Navigation

1.  The user is redirected to the main app layout (`/(app)`).
2.  The `AuthGuard` component verifies that the `AuthContext` contains a valid user. If not, it redirects back to the **Authentication UI**.
3.  The main app layout renders, containing the `Header` component and the content for the current page.
4.  The `Header` displays a responsive navigation bar:
    *   **Desktop:** Shows a horizontal list of links (`Dashboard`, `Mood Tracker`, `Forum`, etc.).
    *   **Mobile:** Shows a hamburger menu icon. Clicking it opens a `Sheet` (slide-out panel) containing the navigation links.
5.  User navigates by clicking a link (e.g., "Chatbot").

## III. Feature Interaction: The AI Chatbot Workflow (Example)

1.  User navigates to the **Chatbot Page** (`/chatbot`).
2.  The UI displays the chat history and an input field.
3.  User types a message and clicks "Send".
4.  **Client-Side Action (`handleSendMessage`)**:
    *   The user's new message is immediately added to the local message state to update the UI.
    *   The function gathers context: recent mood data, upcoming academic deadlines, and the last 6 messages from the chat history.
5.  **Server-Side Action (Genkit Flow)**:
    *   The client calls the `generatePersonalizedAdvice` server function.
    *   This triggers the `generatePersonalizedAdviceFlow` Genkit flow on the server.
    *   The flow checks for a `503 Service Unavailable` error and implements a **retry loop** (up to 3 attempts) if the model is overloaded.
    *   It constructs a detailed prompt using the context provided by the client.
    *   It makes a secure API call to the **Google Gemini Model**.
6.  **Response Handling**:
    *   The Gemini model returns a structured JSON object containing the `message_html`.
    *   The Genkit flow sends this response back to the client.
    *   The client-side `handleSendMessage` function receives the HTML response.
    *   It adds the AI's message to the local message state, and the UI updates to display the chatbot's reply.

## IV. Feature Interaction: Forum Moderation Workflow

1.  User navigates to a **Thread Page** (`/forum/[id]`) and enters a reply.
2.  On submission, the client calls the `automoderateForumMessage` server function, passing the message text.
3.  **Server-Side Action (Genkit Flow)**:
    *   The `automoderateForumMessageFlow` is triggered.
    *   It prompts the Gemini model to evaluate if the message is appropriate.
    *   The model returns a JSON object: `{ "allowed": boolean, "flagReason": string }`.
4.  **Client-Side Decision**:
    *   **If `allowed` is `false`**: Display a "Message Flagged" error toast to the user. The message is **not** posted.
    *   **If `allowed` is `true`**: The message is added to the thread, and the UI updates.
