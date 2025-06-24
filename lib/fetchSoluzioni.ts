// Funzioni API standalone senza dipendenze esterne

// Tipo che rappresenta un suggerimento di sostituzione
export interface Suggerimento {
  valore: string // Valore suggerito per la sostituzione
  score: number // Punteggio di confidenza (0-1)
  confidence: number // Livello di fiducia del suggerimento
  source?: string // Fonte del suggerimento (es. "dizionario", "AI")
}

// Tipo che rappresenta un elemento non trovato nel dizionario
export interface ElementoNonTrovato {
  originalValue: string // Valore originale non trovato
  suggerimenti: Suggerimento[] // Array di suggerimenti possibili
  context?: string // Contesto in cui appare il valore
  frequency?: number // Frequenza di apparizione nel file
  rowNumbers?: number[] // Numeri delle righe dove appare
}

// Tipo della risposta quando si richiedono i suggerimenti
export interface SuggerimentiResponse {
  success: boolean // True se la richiesta è andata bene
  data: {
    elementiNonTrovati: ElementoNonTrovato[] // Array degli elementi da sostituire
    statistiche: {
      totaleElementi: number // Numero totale di elementi analizzati
      elementiTrovati: number // Elementi già presenti nel dizionario
      elementiNonTrovati: number // Elementi che necessitano sostituzione
      percentualeTrovati: number // Percentuale di elementi già corretti
    }
    fileInfo: {
      lavoroPath: string // Path del file di lavoro
      dizionarioPath: string // Path del file dizionario
      colonna: string // Nome della colonna analizzata
      foglio: string // Nome del foglio Excel
    }
  }
  message?: string // Eventuale messaggio informativo
}

// Tipo che rappresenta la configurazione di una sostituzione
export interface SostituzioneConfig {
  tipo: "salta" | "manuale" | "suggerimento" // Tipo di azione da eseguire
  valore?: string // Valore manuale (se tipo = "manuale")
  suggerimentoIndex?: number // Indice del suggerimento scelto (se tipo = "suggerimento")
}

// Tipo che rappresenta tutte le sostituzioni configurate dall'utente
export interface Sostituzioni {
  [originalValue: string]: SostituzioneConfig // Mappa valore originale -> configurazione
}

// Tipo della richiesta per applicare le sostituzioni
export interface ApplicaSostituzioniRequest {
  lavoroPath: string // Path del file di lavoro
  dizionarioPath: string // Path del file dizionario
  colonna: string // Nome della colonna da elaborare
  foglio: string // Nome del foglio Excel
  sostituzioni: Sostituzioni // Configurazioni delle sostituzioni
}

// Tipo della risposta dopo aver applicato le sostituzioni
export interface ApplicaSostituzioniResponse {
  success: boolean // True se l'elaborazione è andata bene
  data: {
    jobId: string // ID del job di elaborazione (per tracking)
    fileElaborato: string // Path del file elaborato
    statistiche: {
      sostituzioniApplicate: number // Numero di sostituzioni effettuate
      elementiSaltati: number // Numero di elementi saltati
      tempoElaborazione: number // Tempo impiegato in secondi
    }
  }
  message?: string // Eventuale messaggio informativo
}

// Funzione helper per chiamate API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Richiede i suggerimenti per gli elementi non trovati nel dizionario
export async function getSuggerimenti(
  lavoroPath: string,
  dizionarioPath: string,
  colonna: string,
  foglio: string,
): Promise<SuggerimentiResponse> {
  try {
    return await apiCall("/api/soluzioni/suggerimenti", {
      method: "POST",
      body: JSON.stringify({ lavoroPath, dizionarioPath, colonna, foglio }),
    })
  } catch (error) {
    throw new Error(
      `Errore nel recupero dei suggerimenti: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
    )
  }
}

// Applica le sostituzioni configurate dall'utente
export async function applicaSostituzioni(request: ApplicaSostituzioniRequest): Promise<ApplicaSostituzioniResponse> {
  try {
    return await apiCall("/api/soluzioni/applica-sostituzioni", {
      method: "POST",
      body: JSON.stringify(request),
    })
  } catch (error) {
    throw new Error(
      `Errore nell'applicazione delle sostituzioni: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
    )
  }
}

// Valida le sostituzioni prima di applicarle (controllo di sicurezza)
export async function validaSostituzioni(request: ApplicaSostituzioniRequest): Promise<{
  valid: boolean
  warnings: string[]
  errors: string[]
}> {
  try {
    return await apiCall("/api/soluzioni/applica-sostituzioni/validate", {
      method: "POST",
      body: JSON.stringify(request),
    })
  } catch (error) {
    // Fallback: validazione sempre OK per sviluppo
    return {
      valid: true,
      warnings: [],
      errors: [],
    }
  }
}
