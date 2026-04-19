import React from "react";
import type { PersonMark } from "../../types/personMark";

type Props = {
  mark?: PersonMark | string;
  onOpen: (e: React.MouseEvent) => void;
};

/** Clickable status dot; stops row navigation when used inside a list row. */
const CustomerMarkBadge: React.FC<Props> = ({ mark, onOpen }) => {
  const ring =
    mark === "green"
      ? "bg-emerald-500 ring-2 ring-emerald-200"
      : mark === "red"
      ? "bg-red-500 ring-2 ring-red-200"
      : "bg-slate-300 ring-2 ring-slate-100";

  return (
    <button
      type="button"
      title="სტატუსი / ისტორია"
      aria-label="სტატუსი / ისტორია"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(e);
      }}
      className={`h-4 w-4 shrink-0 rounded-full ${ring} cursor-pointer hover:opacity-90`}
    />
  );
};

export default CustomerMarkBadge;
