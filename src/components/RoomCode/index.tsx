import { useRoomCodeModel } from "./domain";
import { RoomCodeView } from "./presentation";

interface Props {
  code: string;
}

export function RoomCode({ code }: Props) {
  const { copied, handleCopy } = useRoomCodeModel(code);
  return <RoomCodeView code={code} copied={copied} onCopy={handleCopy} />;
}
