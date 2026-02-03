import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import All from "./All.tsx";

const Navigation: React.FC = () => {
  const location = useLocation();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeDropdown = () => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  return (
    <nav>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          <li>
            <details ref={detailsRef}>
              <summary>tools</summary>
              <ul className="p-2 bg-base-100 rounded-t-none z-50 end-0 w-max">
                {All.map((metronome) => (
                  <li key={metronome.path} className="list-none w-100%">
                    <Link
                      to={metronome.path}
                      onClick={closeDropdown}
                      className={`link link-hover ${
                        location.pathname === metronome.path
                          ? "link-success"
                          : "link-primary"
                      }`}
                    >
                      {metronome.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          <li>
            <Link
              to="/dictionary"
              className={`link link-hover ${
                location.pathname.startsWith("/dictionary")
                  ? "link-success"
                  : "link-primary"
              }`}
            >
              dictionary
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
