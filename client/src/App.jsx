import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Chat from "./components/Chat";
import About from "./components/About";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <div className="app">
      <div className="glow glow-purple" />
      <div className="glow glow-blue" />
      <Navbar page={page} setPage={setPage} theme={theme} onToggleTheme={toggleTheme} />
      <main className="page">
        {page === "home" && <Home onStartChat={() => setPage("chat")} />}
        {/* Keep Chat mounted so messages stay while you visit other pages. */}
        <div className={page === "chat" ? "page-panel" : "page-panel hidden"}>
          <Chat />
        </div>
        {page === "about" && <About />}
      </main>
    </div>
  );
}
