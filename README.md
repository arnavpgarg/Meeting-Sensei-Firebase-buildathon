# Meeting Sensei 🧠

**Meeting Sensei** is an AI-powered application designed to streamline your meeting workflow. It transforms raw meeting transcripts from text, PDF, or video files into structured, actionable insights. With features like multi-language summaries, sentiment analysis, and task tracking, it ensures that no critical information is ever lost.

Live Preview - https://9000-firebase-studio-1757748261027.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev

## ✨ Key Features

- **Transcript Analysis**: Upload a meeting transcript as a `.txt`, `.pdf`, or video file (`.mp4`, `.webm`), or simply paste the text directly.
- **AI-Powered Insights**: Get a full breakdown of your meeting, including:
  - **Concise Summary**: Key discussion points, available in multiple languages.
  - **Sentiment Analysis**: Understand the overall mood of the meeting (Positive, Neutral, Negative).
  - **Meeting Category**: Automatically classifies the meeting type (e.g., Project Update, Client Call).
  - **Key Decisions**: A list of all important decisions made.
- **Live Meeting Mode**: Take notes in real-time and click "Refresh Summary" to get a dynamically updated summary as the meeting progresses.
- **Task & Action Tracking**:
  - **Team Accountability**: A dedicated page that tracks tasks assigned to each team member with deadlines.
  - **Actions Chart**: A visual Gantt chart to track the timeline of all action items.
- **Multi-Language Support**: Generate summaries in a variety of languages, including English, Spanish, Hindi, and more.
- **Export Functionality**: Export the complete analysis report as a `.txt` or `.pdf` file.

## 🚀 How to Get Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/) (or your preferred package manager like `npm` or `yarn`)
- A **Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Set Up Your Environment

First, add your Gemini API key to the project. Create a file named `.env` in the root of the project and add the following line:

```env
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Gemini API key.

### 2. Install Dependencies

Install the project dependencies using your package manager:

```bash
pnpm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 🛠️ How to Use the App

1.  **Input a Transcript**:
    - **Paste Text**: Directly paste the meeting transcript into the text area.
    - **Upload File**: Click "Upload File" to select a `.txt`, `.pdf`, `.mp4`, or `.webm` file (up to 35MB).
2.  **Select Language (Optional)**: Choose a language from the dropdown if you want the summary in a language other than English.
3.  **Analyze**: Click the "Analyze" button.
4.  **Review Insights**: The app will display a comprehensive analysis, including summary, sentiment, key decisions, and an action timeline.
5.  **Explore Further**:
    - Click **"Accountability"** to see a breakdown of tasks assigned to team members.
    - Click **"Actions Chart"** to view a Gantt chart of the timeline.
6.  **Export**: Click the "Export" button to save the analysis as a TXT or PDF file.

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI**: [Google Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
