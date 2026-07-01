import { useMemo, useState } from "react";
import type { TimeEntry } from "../../types";

interface CardMostUsedEntriesProps {
  da?: Date;
  a?: Date;
  entries: TimeEntry[];
  periodo?: string;
}

export default function CardMostUsedEntries({
  entries,
  da = new Date("2012-01-01"),
  a = new Date(),
  periodo = "DI SEMPRE",
}: CardMostUsedEntriesProps) {
  const [expanded, setExpanded] = useState(false);

  const topCommesse = useMemo(() => {
    const map = new Map<
      string,
      {
        ore: number;
        nRegistrazioni: number;
        primaRegistrazione: string;
        ultimaRegistrazione: string;
      }
    >();

    // Confronto date come stringhe YYYY-MM-DD: ordine lessicografico = ordine cronologico.
    const daKey = da.toISOString().slice(0, 10);
    const aKey = a.toISOString().slice(0, 10);

    for (const e of entries) {
      if (
        e.giorno < daKey ||
        e.giorno > aKey ||
        e.idcommessa === "NON-OPERATIVO"
      )
        continue;
      // "get o default": una sola branch, niente if/else duplicati.
      const cur = map.get(e.nomecommessa) ?? {
        ore: 0,
        nRegistrazioni: 0,
        primaRegistrazione: e.giorno,
        ultimaRegistrazione: e.giorno,
      };
      cur.ore += Number(e.ore);
      cur.nRegistrazioni++;
      if (e.giorno > cur.ultimaRegistrazione)
        cur.ultimaRegistrazione = e.giorno;
      if (e.giorno < cur.primaRegistrazione) cur.primaRegistrazione = e.giorno;
      map.set(e.nomecommessa, cur);
    }

    // da Map ad array piatto, ordinato per ore decrescente e prende la top 3
    return Array.from(map, ([nomecommessa, stats]) => ({
      nomecommessa,
      ...stats,
    }))
      .sort((a, b) => b.ore - a.ore)
      .slice(0, 3);
  }, [entries, da, a]);

  // "YYYY-MM-DD" → "DD-MM-YYYY"
  const formatDate = (d: string) => d.split("-").reverse().join("-");

  const visibili = expanded ? topCommesse : topCommesse.slice(0, 1);

  return (
    <div className="flex-1 min-w-0 rounded-md border border-divider bg-surface p-4 flex flex-col">
      <h3 className="text-center font-semibold uppercase text-primary mb-3">
        {periodo}
      </h3>
      <div className="flex-1 rounded-lg border border-divider bg-surface-raised p-4 mb-3 min-h-56">
        {topCommesse.length === 0 ? (
          <p className="text-center text-muted text-sm">Nessun dato</p>
        ) : (
          visibili.map((c, i) => (
            <div
              key={c.nomecommessa}
              className={i > 0 ? "mt-4 pt-4 border-t border-divider" : ""}
            >
              <p
                className="text-center font-medium text-primary mb-2 line-clamp-2"
                title={c.nomecommessa}
              >
                {c.nomecommessa}
              </p>
              <ul className="text-sm text-secondary justify-start space-y-1">
                <li>
                  Totale ore: <b>{c.ore}h</b> ( {Math.floor(c.ore / 24)} giorni
                  e {c.ore % 24} ore)
                </li>
                <li>
                  N. registrazioni: <b>{c.nRegistrazioni}</b>
                </li>
                <li>
                  Prima registrazione: <b>{formatDate(c.primaRegistrazione)}</b>
                </li>
                <li>
                  Ultima registrazione:
                  <b>{formatDate(c.ultimaRegistrazione)}</b>
                </li>
              </ul>
            </div>
          ))
        )}
      </div>

      {topCommesse.length > 1 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-sm font-semibold text-accent-soft hover:text-accent flex items-center justify-center gap-1"
        >
          {expanded ? "RIDUCI ▲" : "ESPANDI ▼"}
        </button>
      )}
    </div>
  );
}
