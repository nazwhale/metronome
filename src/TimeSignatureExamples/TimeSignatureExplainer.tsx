import React, { useState } from "react";

export type ExplainerContent = {
  title: string;
  content: string;
};

type TimeSignatureExplainerProps = {
  explainer: ExplainerContent;
};

/** Reusable explainer: question mark icon toggles an inline help panel. */
export const TimeSignatureExplainer: React.FC<TimeSignatureExplainerProps> = ({ explainer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`inline-block ${open ? "w-full basis-full" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content/80 p-0 min-h-0 h-7 w-7 inline-flex items-center justify-center shrink-0"
        aria-label={open ? "Hide explainer" : `Show explainer: ${explainer.title}`}
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {open && (
        <div
          className="mt-2 p-3 rounded-lg bg-base-300/80 border border-base-content/10 text-left"
          role="region"
          aria-label={explainer.title}
        >
          <h4 className="font-semibold text-sm text-base-content/90 mb-1.5">{explainer.title}</h4>
          <p className="text-xs text-base-content/80 leading-relaxed">{explainer.content}</p>
        </div>
      )}
    </div>
  );
};
