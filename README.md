# AI Smart Assistant

A small chatbot for learning AI engineering and full-stack development. React shows the pages. Express receives each message. Gemini writes the reply. The API key stays in `server/.env`.

## Folder structure

```text
ai-smart-assistant/
├── client/                 React app (what you see in the browser)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx        Starts React
│       ├── App.jsx         Pages and dark mode
│       ├── App.css
│       ├── index.css
│       └── components/
│           ├── Navbar.jsx
│           ├── Home.jsx
│           ├── Chat.jsx
│           └── About.jsx
├── server/
│   ├── index.js            POST /api/chat and the Gemini call
│   ├── package.json
│   ├── .env                Your secret key (not committed)
│   └── .env.example        A safe copy you can share
├── package.json            Shortcuts to run client and server
└── README.md
```

Vite is the small tool that runs React on your computer. The app itself is HTML, CSS, JavaScript, and React.

## Setup

Open a terminal in this folder.

```powershell
npm run install:all
```

Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

Open `server/.env` and replace `your_api_key_here`:

```text
GEMINI_API_KEY=paste_your_key_here
GEMINI_MODEL=gemini-3.5-flash
PORT=3001
```

If Google’s model list uses a different Flash name, change `GEMINI_MODEL` to that name.

## Run locally

Use two terminals. Both should stay open.

Terminal 1, the API:

```powershell
npm run server
```

You should see: `AI Smart Assistant server running at http://localhost:3001`

Terminal 2, the website:

```powershell
npm run client
```

Open [http://localhost:5173](http://localhost:5173).

## How a message travels

1. Chat.jsx sends `POST /api/chat` with your text and the messages already on screen.
2. Vite forwards `/api` to Express on port 3001.
3. `server/index.js` adds the key from `.env` and calls Gemini.
4. The reply comes back as JSON. React adds it as an AI bubble.

Chat history lasts until you refresh the page or press **Clear chat**. The theme choice is saved in the browser.
