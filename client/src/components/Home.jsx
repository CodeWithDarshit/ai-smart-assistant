export default function Home({ onStartChat }) {
  return (
    <section className="home">
      <div className="hero card">
        <p className="eyebrow">Beginner AI project</p>
        <h1>
          A simple chatbot you can
          <span> read, run, and learn from.</span>
        </h1>
        <p className="lead">
          AI Smart Assistant is a small full-stack app. The page is React. The
          server is Express. Gemini writes the replies. Your API key stays on
          the server.
        </p>
        <button className="primary-button" type="button" onClick={onStartChat}>
          Start Chat
        </button>
      </div>

      <div className="feature-grid">
        <article className="card feature">
          <h2>Ask questions</h2>
          <p>Type a message, send it, and read the answer in a chat bubble.</p>
        </article>
        <article className="card feature">
          <h2>See both sides</h2>
          <p>The browser talks to your own Node server. The server talks to Gemini.</p>
        </article>
        <article className="card feature">
          <h2>Keep it small</h2>
          <p>Three pages, one API route, and no extra accounts or databases.</p>
        </article>
      </div>
    </section>
  );
}
