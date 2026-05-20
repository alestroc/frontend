import { useMemo, useState } from "react";
import type { TimeEntry } from "../../types";
import Combobox from "../modal/Combobox";
import { exportTimeEntries } from "../../functions/entries";

interface DownloadReportProps {
  entries: TimeEntry[];
  showError?: (message: string) => void;
}

export default function DownloadReport({
  entries,
  showError,
}: DownloadReportProps) {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 7) + "-01";

  const [fromDate, setFromDate] = useState(firstOfMonth);
  const [toDate, setToDate] = useState(today);
  const [commessa, setCommessa] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const commesseOptions = useMemo(() => {
    const map = new Map<string, string>();
    entries.forEach((e) => map.set(e.idcommessa, e.nomecommessa));
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [entries]);

  async function handleDownload() {
    if (!fromDate || !toDate) {
      showError?.("Seleziona un periodo valido.");
      return;
    }
    setIsDownloading(true);
    try {
      await exportTimeEntries(fromDate, toDate, commessa ?? undefined);
    } catch (e) {
      showError?.(
        e instanceof Error ? e.message : "Errore durante il download.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section className="rounded-md border border-slate-700 bg-slate-800 p-4">
      <h2 className="text-lg font-semibold text-slate-100 mb-3">
        Scarica report
      </h2>

      <div className="flex flex-wrap gap-3 items-end">
        <label className="text-sm text-slate-200">
          Dal
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="block mt-1 rounded-md px-3 py-2 bg-white text-slate-900 border border-slate-300"
          />
        </label>
        <label className="text-sm text-slate-200">
          Al
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="block mt-1 rounded-md px-3 py-2 bg-white text-slate-900 border border-slate-300"
          />
        </label>
        <div className="flex-1 min-w-64">
          <span className="block text-sm text-slate-200 mb-1">Commessa</span>
          <Combobox
            options={commesseOptions}
            value={commessa}
            onChange={setCommessa}
            placeholder="Tutte le commesse"
          />
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDownloading ? "Scarico..." : "Scarica Excel"}
        </button>
      </div>
    </section>
  );
}
