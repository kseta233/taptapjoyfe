import { useRef, useCallback } from "react";

interface Props {
  onTap: () => void;
  disabled: boolean;
}

export function TapButton({ onTap, disabled }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const handleTap = useCallback(() => {
    if (disabled) return;

    onTap();

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Scale animation
    const btn = buttonRef.current;
    if (btn) {
      btn.classList.remove("animate-tap-scale");
      // Force reflow
      void btn.offsetWidth;
      btn.classList.add("animate-tap-scale");
    }

    // Ripple effect
    const ripple = rippleRef.current;
    if (ripple) {
      const newRipple = document.createElement("span");
      newRipple.className =
        "absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 pointer-events-none";
      newRipple.style.animation = "ripple-out 0.5s ease-out forwards";
      ripple.appendChild(newRipple);
      setTimeout(() => newRipple.remove(), 500);
    }
  }, [onTap, disabled]);

  return (
    <button
      ref={buttonRef}
      onPointerDown={(e) => {
        e.preventDefault();
        handleTap();
      }}
      disabled={disabled}
      className={`
        relative w-full py-8 rounded-3xl font-black text-3xl uppercase tracking-wider
        transition-all overflow-hidden select-none touch-manipulation
        ${
          disabled
            ? "bg-bg-card text-text-muted border-2 border-border cursor-not-allowed"
            : "bg-gradient-to-b from-accent-1 via-accent-2 to-accent-3 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] active:shadow-[0_0_10px_rgba(99,102,241,0.2)] active:scale-95"
        }
      `}
    >
      <div ref={rippleRef} className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none" />
      <span className="relative z-10">
        {disabled ? "Wait..." : "TAP!"}
      </span>
    </button>
  );
}
