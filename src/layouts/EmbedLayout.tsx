import React from "react";
import { EmbedProvider } from "../contexts/EmbedContext";

type Props = {
  toolName: string;
  canonicalUrl: string; // full tool page (non-embed)
  children: React.ReactNode;
};

export function EmbedLayout({ toolName, canonicalUrl, children }: Props) {
  return (
    <EmbedProvider>
      <div className="p-3 font-sans min-h-screen flex flex-col">
        <div className="flex-1 rounded-xl overflow-hidden">
          {children}
        </div>

      <div className="mt-3 text-xs opacity-80 flex items-center justify-center gap-2">
        <a
          href={canonicalUrl}
          target="_blank"
          rel="noreferrer"
          className="link link-hover"
        >
          Powered by Tempotick
        </a>
        <span>•</span>
        <a
          href={canonicalUrl}
          target="_blank"
          rel="noreferrer"
          className="link link-hover"
        >
          Open full {toolName}
        </a>
      </div>
    </div>
    </EmbedProvider>
  );
}

export default EmbedLayout;
