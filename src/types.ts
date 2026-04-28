export interface ApiSettings {
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

export interface Commessa {
  id: string;
  name: string;
  hidearticle?: string;
}

export interface Articolo {
  id: string;
  name: string;
}
//Favorites così come arrivano dal backend
export interface Favorite {
  id: number;
  idcommessa: string;
  idarticolo: string;
  order_no: number;
}
// Favorites dopo aver trovato il name della commessa
export interface ProcessedFavorite {
  id: number;
  idcommessa: string;
  nomecommessa: string;
  idarticolo: string;
  order_no: number;
}
