const TECHNOLOGIES = [
  ["HTML5", "The page structure in index.html."],
  ["CSS3", "Colors, layout, dark mode, and small animations."],
  ["JavaScript", "The click handlers and the fetch call."],
  ["React.js", "The Home, Chat, and About screens."],
  ["Node.js", "Runs the JavaScript server on your computer."],
  ["Express.js", "One route: POST /api/chat."],
  ["Gemini API", "Writes the AI reply. The key stays in server/.env."],
];

export default function About() {
  return (
    <section className="about">
      <div className="card about-intro">
        <p className="eyebrow">About</p>
        <h1>A first full-stack AI app</h1>
        <p className="lead">
          This project shows the basic path of a chat app. You type in React.
          Express receives the message. Express asks Gemini, then sends the
          reply back. Nothing here needs a login, a database, or a payment page.
        </p>
      </div>

      <div className="tech-grid">
        {TECHNOLOGIES.map(([name, detail]) => (
          <article className="card tech-card" key={name}>
            <h2>{name}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
