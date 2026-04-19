import type { PersonMark } from "../types/personMark";

/** Same rules as backend `effectiveCustomerMark`. */
export function effectiveCustomerMark(
  storedMark: PersonMark | string | undefined,
  slowReturnEpisodeCount: number,
  adminMarkLogLength: number
): "green" | "red" {
  const m = String(storedMark ?? "").trim();
  const adminChoseColor = adminMarkLogLength > 0 || m === "red";

  if (adminChoseColor) {
    return m === "red" ? "red" : "green";
  }
  if (slowReturnEpisodeCount >= 1) return "red";
  return "green";
}
