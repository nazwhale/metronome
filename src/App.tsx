import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Navigation from "./Nav";
import routes from "./routes.tsx";
import All from "./All.tsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="navbar bg-neutral text-neutral-content rounded-box mb-8">
          <div className="flex-1 px-2 lg:flex-none">
            <h1 className="text-lg font-semibold">
              tempotick <span className="text-neutral-content/60">metronome</span>
            </h1>
          </div>
          <div className="flex justify-end flex-1 px-2">
            <div className="flex items-stretch">
              <Navigation />
            </div>
          </div>
        </div>

        <main className="flex-1">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

const Footer = () => {
  return (
    <footer className="footer footer-center bg-neutral text-neutral-content rounded-box p-6 mt-8">
      <nav className="flex flex-wrap justify-center gap-4">
        {All.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="link link-hover"
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <aside>
        <p className="text-neutral-content/60 text-sm">tempotick metronome</p>
      </aside>
    </footer>
  );
};

export default App;
