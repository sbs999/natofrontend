import React, { useEffect, useState } from "react";
import useAxios from "../../helper/useAxios";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/reduxStore";
import { getPersons } from "../../store/debts";
import { getHistoryPersons } from "../../store/history";
import type {
  AdminMarkLogRow,
  PersonMark,
  PersonMarkDetailsResponse,
  PersonMarkSource,
} from "../../types/personMark";
import { effectiveCustomerMark } from "../../helper/effectiveCustomerMark";
import { formatEpisodeDate } from "../../helper/formatGeorgianDate";

type Props = {
  open: boolean;
  personId: string | null;
  source: PersonMarkSource;
  onClose: () => void;
};

function normalizeAdminMarkLog(
  raw: unknown
): AdminMarkLogRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row: Record<string, unknown>) => {
    const created = row.createdAt;
    let createdAt = "";
    if (typeof created === "string") createdAt = created;
    else if (created instanceof Date) createdAt = created.toISOString();
    else if (created && typeof (created as { toISOString?: () => string }).toISOString === "function") {
      createdAt = (created as Date).toISOString();
    }
    const color = row.color === "red" ? "red" : "green";
    const comment =
      typeof row.comment === "string" ? row.comment : "";
    return { color, comment, createdAt };
  });
}

function markHeaderBarClassDisplay(mark: "green" | "red" | undefined): string {
  if (mark === "green") return "bg-emerald-500";
  if (mark === "red") return "bg-red-500";
  return "bg-slate-200";
}

function normalizeDetails(
  data: Partial<PersonMarkDetailsResponse>
): PersonMarkDetailsResponse {
  const episodes = Array.isArray(data.slowReturnEpisodes)
    ? data.slowReturnEpisodes
    : [];
  const episodeCount = episodes.length;
  const rawLog = Array.isArray(data.adminMarkLog) ? data.adminMarkLog : [];
  const rawDisplay = data.displayMark;
  const displayMark: "green" | "red" =
    rawDisplay === "green" || rawDisplay === "red"
      ? rawDisplay
      : effectiveCustomerMark(
          (data.mark as PersonMark) ?? "",
          episodeCount,
          rawLog.length
        );
  return {
    name: data.name ?? "",
    surname: data.surname ?? "",
    mark: (data.mark as PersonMark) ?? "",
    displayMark,
    adminMarkLog: normalizeAdminMarkLog(data.adminMarkLog),
    slowReturnEpisodes: episodes,
    slowReturnCount:
      typeof data.slowReturnCount === "number"
        ? data.slowReturnCount
        : episodes.length,
    addDebtCount:
      typeof data.addDebtCount === "number" ? data.addDebtCount : 0,
  };
}

const CustomerMarkModal: React.FC<Props> = ({
  open,
  personId,
  source,
  onClose,
}) => {
  const { getData, postData } = useAxios();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<PersonMarkDetailsResponse | null>(
    null
  );
  const [newMark, setNewMark] = useState<"green" | "red">("green");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!open || !personId) {
      setDetails(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const q = source === "history" ? "history" : "active";
        const data = (await getData(
          `personMarkDetails/${personId}?source=${q}`
        )) as PersonMarkDetailsResponse;
        if (!cancelled) {
          const normalized = normalizeDetails(data);
          setDetails(normalized);
          setNewMark(
            normalized.displayMark === "red" ? "red" : "green"
          );
          setComment("");
        }
      } catch {
        if (!cancelled) {
          toast.error("მონაცემები ვერ ჩაიტვირთა");
          setDetails(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open, personId, source]); // eslint-disable-line react-hooks/exhaustive-deps -- getData not stable

  const handleSaveMark = async () => {
    if (!personId) return;
    setSaving(true);
    try {
      await postData("setPersonAdminMark", {
        personId,
        source,
        mark: newMark,
        comment: comment.trim() || "",
      });
      toast.success("შენახულია");
      setComment("");
      const q = source === "history" ? "history" : "active";
      const data = (await getData(
        `personMarkDetails/${personId}?source=${q}`
      )) as PersonMarkDetailsResponse;
      const normalized = normalizeDetails(data);
      setDetails(normalized);
      setNewMark(
        normalized.displayMark === "red" ? "red" : "green"
      );
      if (source === "active") {
        dispatch(getPersons({}));
      } else {
        dispatch(getHistoryPersons({}));
      }
      onClose();
    } catch {
      toast.error("შეცდომა, სცადეთ თავიდან");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const lateCount =
    details?.slowReturnEpisodes?.length ??
    details?.slowReturnCount ??
    0;

  const headerDisplayMark = details?.displayMark;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-[20px] w-full shrink-0 ${markHeaderBarClassDisplay(
            loading ? undefined : headerDisplayMark
          )}`}
          role="presentation"
          aria-hidden
        />
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3 sm:px-5">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-100 px-2 py-1 text-sm text-slate-700"
              aria-label="დახურვა"
            >
              ✕
            </button>
          </div>

          {loading && (
            <p className="text-center text-slate-600">იტვირთება...</p>
          )}

          {!loading && details && (
            <div className="flex flex-col gap-5">
              <section
                aria-label="ინფორმაცია"
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white px-4 py-6 text-center shadow-sm sm:px-6 sm:py-8"
              >
                <p className="text-[22px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                  {details.name} {details.surname}
                </p>

                <p className="mx-auto mt-5 max-w-prose text-[17px] leading-relaxed text-slate-800 sm:text-lg">
                  ვალი სულ აღებული აქვს{" "}
                  <span className="font-semibold text-slate-900">
                    {details.addDebtCount}
                  </span>
                  -ჯერ{" "}
                  {lateCount === 0 ? (
                    <span className="text-slate-700">
                      და არცერთხელ დაუგვიანებია.
                    </span>
                  ) : (
                    <span className="text-slate-700">
                      და გადახდა დააგვიანა{" "}
                      <span className="font-semibold text-slate-900">
                        {lateCount}
                      </span>
                      -ჯერ.
                    </span>
                  )}
                </p>

                {lateCount > 0 && (
                  <div className="mt-6 border-t border-slate-200/80 pt-5 text-left">
                    <p className="mb-4 text-center text-base font-semibold text-slate-900 sm:text-lg">
                      დაგვიანების შემთხვევები
                    </p>
                    <ul className="space-y-4 text-[16px] leading-relaxed text-slate-800 sm:text-[17px]">
                      {details.slowReturnEpisodes.map((row, i) => {
                        const borrowText = formatEpisodeDate(
                          row.borrowDate,
                          row.borrowDateLabel
                        );
                        const daysLabel =
                          typeof row.daysBetween === "number" &&
                          Number.isFinite(row.daysBetween)
                            ? row.daysBetween
                            : null;
                        const isHistory = source === "history";
                        return (
                          <li
                            key={`${row.borrowDateLabel}-${row.repayDateLabel}-${i}`}
                            className="rounded-lg bg-white/80 px-3 py-2.5 ring-1 ring-slate-100"
                          >
                            <span className="font-semibold text-slate-900">
                              #{i + 1}.
                            </span>{" "}
                            წაიღო{" "}
                            <span className="font-medium text-slate-900">
                              {borrowText}
                            </span>
                            {!isHistory ? (
                              <>
                                {" და "}
                                {row.ongoing ? (
                                  <>ჯერ არ გადაუხდია</>
                                ) : (
                                  <>
                                    გადაიხადა{" "}
                                    <span className="font-medium text-slate-900">
                                      {formatEpisodeDate(
                                        row.repayDate ?? undefined,
                                        row.repayDateLabel
                                      )}
                                    </span>
                                  </>
                                )}
                              </>
                            ) : null}
                            {!isHistory && daysLabel !== null ? (
                              <span className="whitespace-nowrap text-slate-600">
                                {" "}
                                ({daysLabel} დღე)
                              </span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </section>

              <section
                aria-label="მონიშვნა"
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left shadow-sm sm:px-4 sm:py-3.5"
              >
                <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  მონიშვნა
                </p>
                {details.adminMarkLog.some((r) => r.comment.trim()) ? (
                  <div className="mb-3">
                    <p className="mb-1.5 text-center text-[11px] text-slate-500">
                      მიმდინარე:{" "}
                      {details.displayMark === "red" ? "წითელი" : "მწვანე"}
                    </p>
                    <ul className="max-h-24 space-y-1 overflow-y-auto text-left text-xs leading-snug text-slate-600">
                      {details.adminMarkLog
                        .filter((r) => r.comment.trim())
                        .map((row, i) => (
                          <li
                            key={`${row.createdAt}-${i}`}
                            className="flex items-start gap-2"
                          >
                            <span
                              className={
                                row.color === "red"
                                  ? "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
                                  : "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                              }
                              aria-hidden
                            />
                            <span className="min-w-0 whitespace-pre-wrap break-words">
                              {row.comment.trim()}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500">
                    ფერი
                  </label>
                  <select
                    value={newMark}
                    onChange={(e) =>
                      setNewMark(e.target.value as "green" | "red")
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1.5 text-sm text-slate-800"
                  >
                    <option value="green">მწვანე</option>
                    <option value="red">წითელი</option>
                  </select>
                  <label className="block text-xs font-medium text-slate-500">
                    კომენტარი (არასავალდებულო)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1.5 text-xs"
                    placeholder="შენიშვნა…"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveMark}
                    className="w-full rounded-lg bg-[#3498db] py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "ინახება…" : "შენახვა"}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMarkModal;
