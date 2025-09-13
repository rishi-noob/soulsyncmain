# High-Level Flowchart Prompt for SoulSync Application

Create a high-level flowchart for the SoulSync web application. The diagram should illustrate the primary user journey, from authentication to the core functionality of its main features.

## 1. Authentication Flow

*   **Start** at the "Landing Page" where the user is presented with **Sign In** and **Sign Up** options.
*   **Decision:** Does the user sign in or sign up?
    *   **Path A (Sign In):** User enters credentials.
        *   **System Check:** Are credentials valid?
            *   **Yes:** Redirect to **User Dashboard**.
            *   **No:** Show "Invalid Credentials" error.
    *   **Path B (Sign Up):** User fills out the registration form.
        *   **System Check:** Does the email already exist?
            *   **Yes:** Show "Email Already Exists" error.
            *   **No:** Create a user account and redirect to **User Dashboard**.

## 2. Post-Authentication: The Dashboard

*   The **User Dashboard** is displayed, showing a welcome message, a summary of upcoming deadlines, and quick links to key features.
*   The user interacts with the main **Navigation Bar** to access different application sections.

## 3. Core Feature Workflows (High-Level)

*   **Feature: AI Chatbot**
    1.  User sends a message.
    2.  The system sends the message, along with user context (mood data, deadlines), to the **Gemini AI Model**.
    3.  The AI generates a personalized, supportive response.
    4.  The response is displayed in the chat interface.

*   **Feature: Peer Forum**
    1.  User writes a reply to a thread.
    2.  **AI Moderation:** The system sends the reply to the **Gemini AI Model** to check for inappropriate content.
    3.  **Decision:** Is the message allowed?
        *   **Yes:** The reply is publicly posted to the thread.
        *   **No:** The user is shown a "Message Flagged" notification, and the reply is not posted.

*   **Feature: Mood Tracker**
    1.  User selects their current mood and answers related questions.
    2.  The system saves the entry.
    3.  The **Mood Heatmap** on the page is updated to visualize the new data point.

*   **Feature: Calendar & Wellness Reminders**
    1.  User adds an academic event (e.g., exam, assignment) to the calendar.
    2.  User clicks "Generate Reminders."
    3.  The system sends upcoming events to the **Gemini AI Model**, which generates personalized wellness tips related to the academic schedule.
