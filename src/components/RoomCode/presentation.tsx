import { IonButton, IonText } from "@ionic/react";

interface Props {
  code: string;
  copied: boolean;
  onCopy: () => void;
}

export function RoomCodeView({ code, copied, onCopy }: Props) {
  return (
    <IonButton
      onClick={onCopy}
      color="medium"
      fill="outline"
      size="small"
    >
      <div className="flex items-center gap-2">
        <IonText className="font-mono font-bold tracking-widest text-accent-1">
          {code}
        </IonText>
        <IonText color="medium">
          {copied ? "✓" : "📋"}
        </IonText>
      </div>
    </IonButton>
  );
}
