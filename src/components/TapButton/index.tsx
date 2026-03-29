import { useTapButtonModel } from "./domain";
import { TapButtonView } from "./presentation";

interface Props {
  onTap: () => void;
  disabled: boolean;
}

export function TapButton({ onTap, disabled }: Props) {
  const { handleTap, buttonRef, rippleRef } = useTapButtonModel({ onTap, disabled });
  return (
    <TapButtonView
      disabled={disabled}
      onTap={handleTap}
      buttonRef={buttonRef}
      rippleRef={rippleRef}
    />
  );
}
