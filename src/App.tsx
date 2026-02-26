import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import "./App.css";
import Navigation from "./Nav";
import routes from "./routes.tsx";
import All from "./All.tsx";
import Breadcrumbs, { getCurrentPageLabel } from "./components/Breadcrumbs";

function AppContent() {
  const location = useLocation();
  const isEmbedRoute = location.pathname.startsWith("/embed");

  if (isEmbedRoute) {
    // Embed routes: no nav, no footer, minimal wrapper
    return (
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-neutral text-neutral-content rounded-box mb-8">
        <div className="flex-1 px-2 lg:flex-none">
          <Link to="/" className="text-lg font-semibold hover:opacity-80">
            tempotick <span className="text-neutral-content/60">{(getCurrentPageLabel(location.pathname) ?? "music tools").toLowerCase()}</span>
          </Link>
        </div>
        <div className="flex justify-end flex-1 px-2">
          <div className="flex items-stretch">
            <Navigation />
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="px-4">
          <Breadcrumbs />
        </div>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const Footer = () => {
  const tools = All.filter((item) =>
    [
      "/online-metronome",
      "/circle-of-fifths-metronome",
      "/speed-trainer-metronome",
      "/time-signature-examples",
      "/youtube-looper",
    ].includes(item.path)
  );

  const trainers = All.filter((item) =>
    [
      "/chord-progression-trainer",
      "/melodic-dictation-trainer",
      "/prompts-for-guitar",
      "/guitar-triad-trainer",
    ].includes(item.path)
  );

  return (
    <footer className="footer bg-neutral text-neutral-content rounded-box p-10 mt-8">
      <nav>
        <h6 className="footer-title">Tools</h6>
        {tools.map((item) => (
          <Link key={item.path} to={item.path} className="link link-hover">
            {item.name}
          </Link>
        ))}
      </nav>
      <nav>
        <h6 className="footer-title">Practice</h6>
        {trainers.map((item) => (
          <Link key={item.path} to={item.path} className="link link-hover">
            {item.name}
          </Link>
        ))}
      </nav>
      <nav>
        <h6 className="footer-title">Learn</h6>
        <Link to="/dictionary" className="link link-hover">
          musical dictionary
        </Link>
        <Link to="/articles" className="link link-hover">
          articles
        </Link>
      </nav>
    </footer>
  );
};

export default App;
