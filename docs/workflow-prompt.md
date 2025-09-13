
# Prompt for Generating a SoulSync Application Workflow Document

**Objective:** Create a detailed workflow document for the "SoulSync" web application. This document should provide a step-by-step narrative of the user journey and system processes, explaining how users interact with the application and how the backend logic, particularly the AI services, responds to those interactions.

**Audience:** The document is for project stakeholders, developers, and designers who need to understand the application's end-to-end functionality.

**Structure:** Please structure the workflow into the following sections.

**1. Introduction**
*   Provide a brief overview of SoulSync's purpose: a mental wellness application for university students that uses AI to provide personalized support.

**2. User Authentication and Onboarding**
*   **Step 1: Initial Access:** A user lands on the homepage, which serves as the authentication gateway.
*   **Step 2: Path Selection (Sign-In vs. Sign-Up):**
    *   **Sign-Up Workflow:** Describe the process for a new user. They fill out a form with their name, email, password, and role. Explain that the system validates this data, checking for existing emails to prevent duplicates. Upon success, a new user account is created, their state is stored in a global `AuthContext`, and they are redirected to the dashboard.
    *   **Sign-In Workflow:** Describe how an existing user enters their credentials. The system verifies these against stored user data. On success, the user's information is loaded into the `AuthContext`, and they are redirected to the dashboard.
*   **Step 3: Session Management:** Explain that the user's authenticated state is managed throughout their session, granting them access to protected pages.

**3. The User Dashboard: The Central Hub**
*   Describe the dashboard as the user's personalized landing page, presenting a snapshot of their wellness data (e.g., mood streak, upcoming deadlines) and providing quick links to all major features.
*   Explain that navigation to different parts of the application occurs from the main header.

**4. Core Feature Workflows**

*   **AI Chatbot Interaction Workflow:**
    1.  The user sends a message.
    2.  The client-side application gathers contextual data: mood history, academic calendar events, and recent conversation history.
    3.  This data is securely sent to a server-side Genkit flow.
    4.  The Genkit flow constructs a detailed prompt for the Google Gemini model. Describe how the flow includes a retry mechanism to handle potential "Service Unavailable" errors.
    5.  The AI model processes the prompt and returns a supportive, HTML-formatted response.
    6.  The response is sent back to the client and rendered in the chat interface.

*   **Peer Forum Moderation Workflow:**
    1.  A user attempts to post a reply in a forum thread.
    2.  Before the message is saved, its content is sent to a dedicated AI moderation flow (`automoderateForumMessage`).
    3.  The AI analyzes the text for harmful or inappropriate content based on its prompt instructions.
    4.  The flow returns a decision (`allowed: true/false`).
    5.  Describe the conditional logic: if `true`, the message is posted publicly. If `false`, the message is discarded, and the user receives a notification explaining that their message was flagged.

*   **Mood Tracking Workflow:**
    1.  The user navigates to the Mood Tracker page and answers a series of questions about their feelings.
    2.  Upon submission, a `MoodEntry` object is created.
    3.  The system checks if an entry for the current day already exists. If so, it updates it; otherwise, it creates a new one and increments the user's "streak."
    4.  The "Mood Heatmap" component re-renders to visually reflect the new data point.

*   **Journaling Workflow:**
    1.  The user opens the Journal page and can either start with a blank editor or select a template (e.g., "Gratitude List").
    2.  After writing their entry, the user clicks "Save Entry."
    3.  The system saves the content as a private `JournalEntry` associated with the user's account.
    4.  The "Past Entries" list is updated, allowing the user to view or edit their previous reflections.

*   **Resource Management Workflow:**
    1.  A general user views the Resources page with read-only access to articles and videos.
    2.  Describe the role-based access control: If the logged-in user has an "Admin" or "Volunteer" role, additional UI controls (Add, Edit, Delete buttons) are visible.
    3.  Explain the process for an admin to add a new resource, which involves filling out a form in a dialog and updating the central list of resources.

*   **Session Booking Workflow:**
    1.  The user clicks on the "Book a Session" button.
    2.  The application redirects the user in a new tab to a pre-defined external URL (a Google Form), decoupling the booking process from the main application.
