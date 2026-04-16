export interface AppSettings {
  daysBefore: number;
  minHours: number;
  maxHours: number;
  hoursInterval: number;
  allowSaturday: boolean;
  allowSunday: boolean;
}

export interface LocalData {
  idpersonale: string;
  localid: string;
  name: string;
  sector: string;
  token: string;
  user: number;
}

export interface TimeEntry {
  giorno: string; // "YYYY-MM-DD"
  idcommessa: string;
  nomecommessa: string;
  idarticolo: string;
  nomearticolo: string;
  ore: string;
  nota: string;
}
