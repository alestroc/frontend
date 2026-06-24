import { useMemo, useState } from "react";
import type { TimeEntry } from "../../types";
import Combobox from "../modal/Combobox";

interface ExploreCommessaProps {
  entries: TimeEntry[];
}

type Preset = "all" | "year" | "month" | "week";

// Calcola lo "YYYY-MM-DD" del primo giorno del preset richiesto.
function presetFromDate(preset: Preset): string {
  const now = new Date();
  if (preset === "year") return `${now.getFullYear()}-01-01`;
  if (preset === "month") {
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${m}-01`;
  }
  if (preset === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }
  return "";
}

export default function ExploreCommessa({ entries }: ExploreCommessaProps) {
  const [selectedCommessa, setSelectedCommessa] = useState<string | null>(null);
  const [selectedArticolo, setSelectedArticolo] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  function applyPreset(preset: Preset) {
    setFromDate(presetFromDate(preset));
    setToDate("");
  }

  // Lista deduplicata di commesse trovate nelle entries
  const commesseOptions = useMemo(() => {
    const map = new Map<string, string>();
    entries.forEach((e) => map.set(e.idcommessa, e.nomecommessa));
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [entries]);

  // Entries filtrate per commessa
  const byCommessa = useMemo(
    () =>
      selectedCommessa
        ? entries.filter((e) => e.idcommessa === selectedCommessa)
        : [],
    [entries, selectedCommessa],
  );

  // Articoli usati in quella commessa
  const articoliOptions = useMemo(() => {
    const map = new Map<string, string>();
    byCommessa.forEach((e) =>
      map.set(e.idarticolo, e.nomearticolo ?? e.idarticolo),
    );
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [byCommessa]);

  // Entries filtrate per commessa + articolo + range di date.
  // fromDate/toDate sono stringhe "YYYY-MM-DD"

  const filtered = useMemo(() => {
    return byCommessa.filter((e) => {
      if (selectedArticolo && e.idarticolo !== selectedArticolo) return false;
      if (fromDate && e.giorno < fromDate) return false;
      if (toDate && e.giorno > toDate) return false;
      return true;
    });
  }, [byCommessa, selectedArticolo, fromDate, toDate]);

  const totHours = filtered.reduce((s, e) => s + Number(e.ore), 0);
  const dates = filtered.map((e) => e.giorno).sort();
  const firstDate = dates[0] ?? null;
  const lastDate = dates[dates.length - 1] ?? null;

  return (
    <section className="rounded-md border border-divider bg-surface p-4">
      <h2 className="text-lg font-semibold text-secondary mb-3">
        Esplora commessa
      </h2>

      <div className="flex flex-wrap gap-3 mb-3">
        <div className="flex-1 min-w-64">
          <Combobox
            options={commesseOptions}
            value={selectedCommessa}
            onChange={(id) => {
              setSelectedCommessa(id);
              setSelectedArticolo(null);
            }}
            placeholder="Seleziona commessa"
          />
        </div>
        {selectedCommessa && (
          <div className="flex-1 min-w-64">
            <Combobox
              options={articoliOptions}
              value={selectedArticolo}
              onChange={setSelectedArticolo}
              placeholder="Filtra per articolo (tutti)"
            />
          </div>
        )}
      </div>

      {selectedCommessa && (
        <>
          <div className="flex flex-wrap items-end gap-3 mb-3">
            <label className="text-xs text-secondary">
              Dal
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="block mt-1 rounded-md px-2 py-1 bg-white text-slate-900 border border-slate-300 text-sm"
              />
            </label>
            <label className="text-xs text-muted">
              Al
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="block mt-1 rounded-md px-2 py-1 bg-white text-slate-900 border border-slate-300 text-sm"
              />
            </label>

            <div className="flex gap-2">
              {(["all", "year", "month", "week"] as Preset[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => applyPreset(f)}
                  className="px-3 py-1 rounded-md text-sm transition-colors hover:bg-surface-raised text-secondary bg-surface-strong"
                >
                  {f === "all" && "Tutti"}
                  {f === "year" && "Quest'anno"}
                  {f === "month" && "Questo mese"}
                  {f === "week" && "Questa settimana"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-secondary mb-3">
            <div>
              Totale ore: <span className="font-bold">{totHours}h</span>
            </div>
            <div>
              Prima registrazione:{" "}
              <span className="font-bold">{firstDate ?? "—"}</span>
            </div>
            <div>
              Ultima registrazione:{" "}
              <span className="font-bold">{lastDate ?? "—"}</span>
            </div>
            <div>
              Registrate: <span className="font-bold">{filtered.length}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm text-accent-soft hover:text-accent mb-2"
          >
            {expanded ? "▲ Riduci" : "▼ Espandi tabella"}
          </button>

          {expanded && (
            <div className="overflow-auto max-h-80 rounded-md border border-divider">
              <table className="w-full text-sm text-left text-secondary">
                <thead className="bg-surface text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Ore</th>
                    <th className="px-3 py-2">Articolo</th>
                    <th className="px-3 py-2">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr key={i} className="border-t bg-base border-divider">
                      <td className="px-3 py-2">
                        {e.giorno.split("-").reverse().join("-")}
                      </td>
                      <td className="px-3 py-2">{Number(e.ore)}h</td>
                      <td className="px-3 py-2">
                        {e.nomearticolo ?? e.idarticolo}
                      </td>
                      <td className="px-3 py-2">{e.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
