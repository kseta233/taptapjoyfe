import { useState, useCallback } from "react";

export function useRoomCodeModel(code: string) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
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
  }, [code]);

  return { copied, handleCopy };
}
