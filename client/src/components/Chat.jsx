import { useEffect, useRef, useState } from "react";

const STARTER_MESSAGE = {
  role: "assistant",
  text: "Hi, I am AI Smart Assistant. Ask me about coding, AI, or something you are learning.",
};

export default function Chat() {
  const [messages, setMessages] = useState([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, error]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) {
      return;
    }

    const history = messages.map((message) => ({
      role: message.role,
      text: message.text,
    }));

    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The assistant could not reply.");
      }

      setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    } catch (requestError) {
      setError(requestError.message || "Could not reach the server. Start it with npm run server.");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([{ ...STARTER_MESSAGE, text: "Chat cleared. What would you like to talk about?" }]);
    setError("");
    setInput("");
  }

  return (
    <section className="chat card">
      <div className="chat-header">
        <div>
          <p className="eyebrow">Chat</p>
          <h1>Talk with the assistant</h1>
        </div>
        <button className="ghost-button" type="button" onClick={clearChat} disabled={loading}>
          Clear chat
        </button>
      </div>

      <div className="messages" aria-live="polite">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={message.role === "user" ? "bubble user" : "bubble assistant"}
          >
            <span className="bubble-label">{message.role === "user" ? "You" : "AI"}</span>
            <p>{message.text}</p>
          </article>
        ))}

        {loading && (
          <article className="bubble assistant loading-bubble">
            <span className="bubble-label">AI</span>
            <p className="dots" aria-label="The assistant is typing">
              <span />
              <span />
              <span />
            </p>
          </article>
        )}

        {error && <p className="error-banner">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="message">
          Message
        </label>
        <input
          id="message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          autoComplete="off"
        />
        <button className="primary-button" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
