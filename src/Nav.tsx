import React from "react";
import { Link, useLocation } from "react-router-dom";
import All from "./All.tsx";

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          <li>
            <details>
              <summary>tools</summary>
              <ul className="p-2 bg-base-100 rounded-t-none z-50 end-0 w-max">
                {All.map((metronome) => (
                  <li key={metronome.path} className="list-none w-100%">
                    <Link
                      to={metronome.path}
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
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
