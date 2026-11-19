const LINKS = [
  { id: "home", label: "Home" },
  { id: "chat", label: "Chat" },
  { id: "about", label: "About" },
];

export default function Navbar({ page, setPage, theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <button className="logo" type="button" onClick={() => setPage("home")}>
        <span className="logo-mark" aria-hidden="true">
          ✦
        </span>
        AI Smart Assistant
      </button>

      <nav className="nav-links" aria-label="Main">
        {LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className={page === link.id ? "nav-link active" : "nav-link"}
            onClick={() => setPage(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <button
        className="theme-button"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </header>
  );
}
