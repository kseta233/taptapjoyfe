import type { Ref } from "react";

interface Props {
  disabled: boolean;
  onTap: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  rippleRef: Ref<HTMLDivElement>;
}

export function TapButtonView({ disabled, onTap, buttonRef, rippleRef }: Props) {
  const className = [
    "relative w-full py-8 rounded-3xl font-black text-3xl uppercase tracking-wider transition-all overflow-hidden select-none touch-manipulation",
    disabled
      ? "bg-bg-card text-text-muted border-2 border-border cursor-not-allowed"
      : "bg-gradient-to-b from-accent-1 via-accent-2 to-accent-3 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] active:shadow-[0_0_10px_rgba(99,102,241,0.2)] active:scale-95",
  ].join(" ");

  return (
    <button
      ref={buttonRef}
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
      disabled={disabled}
      className={className}
    >
      <div ref={rippleRef} className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none" />
      <span className="relative z-10">
        {disabled ? "Wait..." : "TAP!"}
      </span>
    </button>
  );
}
