# PostPilot AI – Social Media Content Generator & Scheduler

PostPilot AI is a lightweight web application that uses Google Gemini AI to generate engaging social media captions and helps users manage and schedule their content.

## Features

- **AI Caption Generator:** Generate 2–3 social media caption options using Google Gemini API.
- **Platform Selection:** Create content for different social media platforms.
- **Tone Selection:** Generate captions in different writing tones.
- **Caption Management:** Select, edit, and manage generated captions.
- **Post Scheduling:** Choose a date and time for posts.
- **Dashboard:** View, filter, and manage saved and scheduled posts.
- **Responsive UI:** Dashboard designed for desktop and mobile screens.

## Technology Stack

- **Frontend:** Next.js, JavaScript
- **Styling:** Tailwind CSS, Custom CSS
- **AI Integration:** Google Gemini API
- **Storage:** Browser LocalStorage (current implementation)
- **Deployment:** Vercel

## Project Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd webcompetetion
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Current Implementation Status

- Gemini AI caption generation: Implemented
- Caption selection and editing: Implemented
- Dashboard and post management: Implemented
- Basic post scheduling interface: Implemented
- Google Drive integration: Pending
- Automated email notifications: Pending
- Authentication: Not implemented
- Vercel deployment: Deployment target

## Future Improvements

- Google Drive integration for cloud storage and synchronization.
- Automated email notifications for scheduled posts.
- Improved scheduling automation.
- Further UI and mobile responsiveness improvements.

---

**Project:** PostPilot AI  
**Purpose:** Lightweight AI-powered social media content generation and scheduling.