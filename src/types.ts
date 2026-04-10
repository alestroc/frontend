export interface AppSettings {
  daysBefore: number;
  minHours: number;
  maxHours: number;
  hoursInterval: number;
  allowSaturday: boolean;
  allowSunday: boolean;
}

export interface TimeEntry {
  giorno: string; // "YYYY-MM-DD"
  idcommessa: string;
  nomecommessa: string;
  idarticolo: string;
  nomearticolo: string;
  ore: number;
  nota: string;
}
