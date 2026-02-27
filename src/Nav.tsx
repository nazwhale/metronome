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
                <li className="list-none w-100%">
                  <Link
                    to="/"
                    onClick={closeDropdown}
                    className={`link link-hover text-base-content ${location.pathname === "/"
                      ? "font-semibold underline underline-offset-2"
                      : ""
                      }`}
                  >
                    All tools
                  </Link>
                </li>
                {All.map((metronome) => (
                  <li key={metronome.path} className="list-none w-100%">
                    <Link
                      to={metronome.path}
                      onClick={closeDropdown}
                      className={`link link-hover text-base-content ${location.pathname === metronome.path
                        ? "font-semibold underline underline-offset-2"
                        : ""
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
            <a
              href="https://forms.gle/bx26SRnHDHzv5TF68"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover focus-visible:text-neutral-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-content focus-visible:ring-offset-2 focus-visible:ring-offset-neutral"
            >
              feedback?
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
