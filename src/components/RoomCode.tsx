import { useState } from "react";

interface Props {
  code: string;
}

export function RoomCode({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/?room=${code}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for mobile
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border rounded-lg hover:border-accent-1/50 transition-all"
    >
      <span className="font-mono font-bold text-sm tracking-widest text-accent-1">
        {code}
      </span>
      <span className="text-xs text-text-muted">
        {copied ? "✓" : "📋"}
      </span>
    </button>
  );
}
