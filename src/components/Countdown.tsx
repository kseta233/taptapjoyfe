interface Props {
  value: number;
}

export function Countdown({ value }: Props) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <div key={value} className="animate-countdown-pop">
        <span className="text-[120px] font-black leading-none bg-gradient-to-b from-accent-1 to-accent-3 bg-clip-text text-transparent drop-shadow-2xl">
          {value === 0 ? "GO!" : value}
        </span>
      </div>
    </div>
  );
}
