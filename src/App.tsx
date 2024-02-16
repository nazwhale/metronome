import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./Nav";
import routes from "./routes.tsx";

function App() {
  return (
    <Router>
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

      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
