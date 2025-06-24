// Configurazione centralizzata per le API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const API_ENDPOINTS = {
  CARICAMENTO: `${API_BASE_URL}/api/caricamento`,
  FILES: `${API_BASE_URL}/api/caricamento`,
} as const

// Configurazione per le chiamate fetch
export const fetchConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  // Aggiungere altre configurazioni comuni qui
}
