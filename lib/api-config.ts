// Configurazione API completa con tutti gli endpoint
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const API_ENDPOINTS = {
  // Autenticazione
  LOGIN: "/api/login",
  LOGOUT: "/api/logout",

  // Gestione file
  CARICAMENTO: "/api/caricamento",
  FILES: "/api/caricamento",
  PROCESS: "/api/caricamento/process",
  CHANGE_SHEET: "/api/caricamento/change-sheet",

  // Soluzioni e suggerimenti
  SUGGERIMENTI: "/api/soluzioni/suggerimenti",
  APPLICA_SOSTITUZIONI: "/api/soluzioni/applica-sostituzioni",

  // Risultati e download
  RISULTATO: "/api/risultato",
  DOWNLOAD: "/api/risultato/download",

  // Utilità
  HEALTH: "/api/health",
  VERSION: "/api/version",
} as const

// Configurazioni aggiuntive
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 secondi
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: [".xlsx", ".xls"],
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 secondo
} as const
