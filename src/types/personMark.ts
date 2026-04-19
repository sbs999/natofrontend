export type PersonMark = "" | "green" | "red";

export type PersonMarkSource = "active" | "history";

export type SlowReturnEpisodeRow = {
  borrowDateLabel: string;
  repayDateLabel: string;
  /** 0-indexed month, same as DB — optional if API only sends labels */
  borrowDate?: { year: number; month: number; day: number };
  repayDate?: { year: number; month: number; day: number } | null;
  daysBetween: number;
  borrowAmount: number;
  infoAtBorrow: string;
  /** მიმდინარე ვალი — გადახდა არ ფიქსირდება, 1+ თვე გავიდა */
  ongoing?: boolean;
};

export type AdminMarkLogRow = {
  color: "green" | "red";
  comment: string;
  createdAt: string;
};

export type PersonMarkDetailsResponse = {
  name: string;
  surname: string;
  mark: PersonMark;
  /** UI color: admin’s saved mark if they ever saved; else auto-red on slow-return issues. */
  displayMark?: "green" | "red";
  adminMarkLog: AdminMarkLogRow[];
  slowReturnEpisodes: SlowReturnEpisodeRow[];
  slowReturnCount: number;
  /** რამდენჯერ დაემატა ვალი (add) */
  addDebtCount: number;
};
