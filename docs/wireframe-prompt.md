
# Prompt for Generating a SoulSync Application Wireframe

**Objective:** Generate a set of low-fidelity wireframes for the "SoulSync" web application. The wireframes should clearly illustrate the layout, structure, and key UI components for each primary screen. Focus on placement and hierarchy, not on colors, fonts, or specific imagery.

**I. Global Elements**

*   **Header:** A persistent header at the top of all authenticated pages.
    *   **Left Side:** App logo and name ("SoulSync"), followed by primary navigation links (e.g., "Home," "Mood Tracker," "Forum," "Resources"). On mobile, these links are collapsed into a hamburger menu icon that opens a slide-out panel.
    *   **Right Side:** A "Book a Session" button and a user avatar. Clicking the avatar opens a dropdown with links to "Profile" and "Log Out".

**II. Page-Specific Wireframes**

**1. Authentication Page (`/`)**
*   A centered card on the page.
*   **Top of Card:** Two tabs: "Sign In" and "Sign Up".
*   **Sign In View:**
    *   A heading: "Welcome Back".
    *   An input field labeled "Email".
    *   A password input field labeled "Password".
    *   A large "Sign In" button at the bottom.
*   **Sign Up View:**
    *   A heading: "Create an Account".
    *   Input fields for "Full Name," "Email," and "Password".
    *   A dropdown menu labeled "I am a..." with options like "Student."
    *   A large "Create Account" button at the bottom.

**2. Dashboard (`/dashboard`)**
*   **Top Section:** A welcome heading (e.g., "Welcome back, Alex!"). To the right, two primary action buttons: "Log Mood" and "Start Focus Session".
*   **Mid Section (Grid of 3 Cards):**
    *   Card 1: "Mood Streak" - shows a large number and a smaller description.
    *   Card 2: "Focus Points" - shows a large number and secondary stats.
    *   Card 3: "Community" - acts as a quick link to the forum.
*   **Bottom Section (Grid of 2 Cards): "Upcoming Deadlines" and "First-Aid Chatbot"**
    *   Card 1 (Left): "Upcoming Deadlines" - A list of 2-3 upcoming events, each with a title, date, and a "View" button.
    *   Card 2 (Right): "First-Aid Chatbot" - A promotional card with a brief message encouraging the user to chat, and a prominent "Chat Now" button.

**3. Chatbot Page (`/chatbot`)**
*   A large card that fills the main content area.
*   **Card Header:** An avatar for the AI bot and its title, "First-Aid Chatbot".
*   **Card Content (Main Area):** A scrollable chat history view.
    *   User messages are aligned to the right.
    *   AI assistant messages are aligned to the left, preceded by the AI's avatar.
*   **Card Footer:** A text input area for typing a message and a "Send" icon button.

**4. Mood Tracker Page (`/mood-tracker`)**
*   A two-column layout.
*   **Left Column:** A large card titled "Daily Mood Log".
    *   Contains a series of questions (e.g., "How was your day?").
    *   Each question has a set of selectable options (e.g., emoji faces).
    *   A "Save Today's Entry" button at the bottom.
*   **Right Column:** A card titled "Your Mood Calendar".
    *   Contains a grid-based "heatmap" showing colored squares for each day over the past few months, representing mood intensity.
    *   A legend at the bottom explains the color scale.

**5. Forum Page (`/forum`)**
*   **Top Section:** A heading "Community Forum" and a "New Thread" button on the right.
*   **Main Content:** A large card containing a table of discussion threads.
    *   Table columns: "Topic," "Author," "Replies," "Created".
    *   Each topic title is a link to the thread page.

**6. Thread Page (`/forum/[id]`)**
*   **Top:** The thread title and author information.
*   **Main Content:** A list of cards, where each card is a message in the thread.
    *   Each message card contains: Author's avatar, name, role (e.g., "Volunteer"), the message text, and the timestamp.
*   **Reply Section (Bottom):** A card containing a text area to write a reply and a "Post Reply" button.

**7. Resources Page (`/resources`)**
*   A page heading: "Resources".
*   **Articles Section:** A sub-heading "Helpful Articles" and a grid of cards. Each card represents an article with a title, source, and a brief description. If the user is an admin, "Edit" and "Delete" buttons are visible on each card.
*   **Videos Section:** A sub-heading "Watch & Learn" and a grid of cards. Each card contains an embedded video player and a title. Admin controls are visible where applicable.
