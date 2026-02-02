import { useState } from "react";

const BASE_URL = "https://www.tempotick.com";

type EmbedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  embedPath: string; // e.g., "/embed/metronome"
  canonicalPath: string; // e.g., "/online-metronome"
  queryParams?: Record<string, string | number>;
  height: number;
  toolName: string;
};

function buildEmbedUrl(embedPath: string, queryParams?: Record<string, string | number>): string {
  const url = new URL(embedPath, BASE_URL);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
}

function buildIframeSnippet(src: string, height: number, toolName: string, canonicalUrl: string): string {
  return `<iframe
  src="${src}"
  width="100%"
  height="${height}"
  style="border:0;border-radius:12px;overflow:hidden"
  loading="lazy"
  allow="autoplay"
></iframe>
<p style="font-size:12px;margin-top:8px;text-align:center;">
  <a href="${canonicalUrl}" target="_blank" rel="noopener">${toolName} by Tempotick</a>
</p>`;
}

export function EmbedModal({ 
  isOpen, 
  onClose, 
  embedPath,
  canonicalPath,
  queryParams, 
  height,
  toolName 
}: EmbedModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const embedUrl = buildEmbedUrl(embedPath, queryParams);
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const iframeSnippet = buildIframeSnippet(embedUrl, height, toolName, canonicalUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = iframeSnippet;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Embed {toolName}</h3>
        
        <p className="text-sm text-base-content/70 mb-4">
          Copy the code below and paste it into your website's HTML to embed this tool.
        </p>

        <div className="mockup-code text-sm mb-4">
          <pre className="px-4 whitespace-pre-wrap break-all">
            <code>{iframeSnippet}</code>
          </pre>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            className={`btn ${copied ? "btn-success" : "btn-primary"} w-full`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy Embed Code"}
          </button>
          
          <a 
            href={embedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            Preview embed
          </a>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

// Convenience component that includes button + modal
type EmbedButtonProps = {
  embedPath: string;
  canonicalPath: string;
  queryParams?: Record<string, string | number>;
  height: number;
  toolName: string;
  className?: string;
};

export function EmbedButton({ 
  embedPath,
  canonicalPath,
  queryParams, 
  height, 
  toolName,
  className = ""
}: EmbedButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className={`btn btn-outline btn-sm gap-2 ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed
      </button>
      
      <EmbedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        embedPath={embedPath}
        canonicalPath={canonicalPath}
        queryParams={queryParams}
        height={height}
        toolName={toolName}
      />
    </>
  );
}
