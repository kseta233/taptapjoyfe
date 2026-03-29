import { useRef, useCallback } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function useTapButtonModel({ onTap, disabled }: { onTap: () => void; disabled: boolean }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const handleTap = useCallback(() => {
    if (disabled) return;

    onTap();

    // Prefer native haptics on mobile wrappers, fallback to browser vibrate.
    void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });

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

  return { handleTap, buttonRef, rippleRef };
}
