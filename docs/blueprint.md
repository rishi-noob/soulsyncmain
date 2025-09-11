# **App Name**: SoulSync

## Core Features:

- Google OAuth Authentication: Authenticate users via Google OAuth, issuing JWTs upon successful verification. The Google OAuth flow is implemented on the frontend, sending the ID token to the backend for verification.
- Role Selection and Management: Allow users to select a role (student, volunteer, counsellor, management) upon first login. Store roles in the database and implement role-based route guards. Implement admin approval for role changes via an /admin/approve-role endpoint.
- AI-Guided First-Aid Chatbot: Integrate Gemini to provide a conversational chatbot that uses user mood, academic deadlines, and chat history to personalize responses. Use it as a tool, to decide when it incorporate certain types of advice in the answer.
- Peer-to-Peer Forum: Implement a realtime peer-to-peer forum using socket.io for message broadcasting. Pseudonymize user identities and include tools to enable volunteers to moderate the content of the thread, messages.
- Mood Tracker: Allow users to log daily mood entries with emoji-based questions and optional triggers. Implement streak logic to track consecutive days with mood entries and display a simple calendar heatmap of mood intensity on the user's dashboard.
- Focus Tool with Gamification: Implement a Pomodoro timer tool with a visual "plant grow" animation to represent focus progress. Allow users to "plant trees" using focus points earned from completed Pomodoros, creating focus sessions records in a database. Track trees and display badges on profile page.
- Academic Calendar & Personalized Wellness Reminders: Allow users to create, read, update, and delete academic events in their calendar. The backend generates wellness reminders and AI-powered personalized tips based on the event's proximity and user's historical mood data. 

## Style Guidelines:

- Primary color: Light green (#A7D1AB) to evoke a sense of growth, health, and calm, in line with the mental health focus of the app.  The primary color is designed to suggest organic life.
- Background color: Light beige (#F5F5DC) for a soft, comforting, and unobtrusive backdrop that doesn't distract from the content.
- Accent color: Warm orange (#E59741) to draw attention to CTAs and important elements, adding a touch of optimism.
- Body text and headlines: 'PT Sans', a humanist sans-serif providing a modern and slightly warm aesthetic suitable for readability and general user interface purposes.
- Use simple, clean icons with rounded corners, in the same light green as the primary color. Consistent and accessible icons to represent actions and concepts.
- Employ a clean, minimal layout with ample whitespace to reduce clutter and improve focus. Prioritize content hierarchy with clear visual cues. Keep important navigation on the top bar of the page, so users can clearly move from one feature to the other.
- Use subtle animations to provide feedback, enhance usability, and add a touch of delight without distracting from the content.