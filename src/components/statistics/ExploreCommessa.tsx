import { useMemo, useState } from "react";
import type { TimeEntry } from "../../types";
import Combobox from "../modal/Combobox";

interface ExploreCommessaProps {
  entries: TimeEntry[];
}

type DateFilter = "all" | "year" | "month" | "week";

export default function ExploreCommessa({ entries }: ExploreCommessaProps) {
  const [selectedCommessa, setSelectedCommessa] = useState<string | null>(null);
  const [selectedArticolo, setSelectedArticolo] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [expanded, setExpanded] = useState(false);

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

  // Soglia di data per i filtri rapidi
  const dateThreshold = useMemo(() => {
    const now = new Date();
    if (dateFilter === "year") return new Date(now.getFullYear(), 0, 1);
    if (dateFilter === "month")
      return new Date(now.getFullYear(), now.getMonth(), 1);
    if (dateFilter === "week") {
      const d = new Date(now);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return null;
  }, [dateFilter]);

  // Entries filtrate per commessa + articolo + data
  const filtered = useMemo(() => {
    return byCommessa.filter((e) => {
      if (selectedArticolo && e.idarticolo !== selectedArticolo) return false;
      if (dateThreshold && new Date(e.giorno) < dateThreshold) return false;
      return true;
    });
  }, [byCommessa, selectedArticolo, dateThreshold]);

  const totHours = filtered.reduce((s, e) => s + Number(e.ore), 0);
  const dates = filtered.map((e) => e.giorno).sort();
  const firstDate = dates[0] ?? null;
  const lastDate = dates[dates.length - 1] ?? null;

  return (
    <section className="rounded-md border border-slate-700 bg-slate-800 p-4">
      <h2 className="text-lg font-semibold text-slate-100 mb-3">
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
          <div className="flex gap-2 mb-3">
            {(["all", "year", "month", "week"] as DateFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setDateFilter(f)}
                className={[
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  dateFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600",
                ].join(" ")}
              >
                {f === "all" && "Tutti"}
                {f === "year" && "Quest'anno"}
                {f === "month" && "Questo mese"}
                {f === "week" && "Questa settimana"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-200 mb-3">
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
            className="text-sm text-blue-400 hover:text-blue-300 mb-2"
          >
            {expanded ? "▲ Riduci" : "▼ Espandi tabella"}
          </button>

          {expanded && (
            <div className="overflow-auto max-h-80 rounded-md border border-slate-700">
              <table className="w-full text-sm text-left text-slate-200">
                <thead className="bg-slate-900 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Ore</th>
                    <th className="px-3 py-2">Articolo</th>
                    <th className="px-3 py-2">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr key={i} className="border-t border-slate-700">
                      <td className="px-3 py-2">{e.giorno}</td>
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
