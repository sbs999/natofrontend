import { useCallback, useState } from "react";
import type { PersonMarkSource } from "../types/personMark";

export function usePersonMarkModal() {
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState<{
    personId: string;
    source: PersonMarkSource;
  } | null>(null);

  const openModal = useCallback(
    (personId: string, source: PersonMarkSource) => {
      setCtx({ personId, source });
      setOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setOpen(false);
    setCtx(null);
  }, []);

  return { open, ctx, openModal, closeModal };
}
