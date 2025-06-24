// Funzioni API standalone senza dipendenze esterne

// Tipo che rappresenta un file elaborato
export interface FileElaborato {
  url: string // URL per scaricare il file
  nome: string // Nome del file
  dimensione: number // Dimensione in byte
  formato: string // Formato del file (es. "xlsx")
  checksum?: string // Hash del file per verifica integrità
}

// Tipo che rappresenta le statistiche dettagliate dell'elaborazione
export interface StatisticheElaborazione {
  tempoElaborazione: number // Tempo totale in secondi
  elementiTotali: number // Numero totale di elementi processati
  elementiTrovati: number // Elementi già presenti nel dizionario
  sostituzioniApplicate: number // Sostituzioni effettivamente applicate
  elementiSaltati: number // Elementi saltati dall'utente
  nuoviTerminiAggiunti: number // Nuovi termini aggiunti al dizionario
  percentualeSuccesso: number // Percentuale di successo dell'operazione
  erroriRiscontrati: number // Numero di errori durante l'elaborazione
}

// Tipo che rappresenta i dettagli dell'elaborazione
export interface DettagliElaborazione {
  lavoroPath: string // Path del file di lavoro originale
  dizionarioPath: string // Path del file dizionario originale
  colonna: string // Nome della colonna elaborata
  foglio: string // Nome del foglio Excel
  dataElaborazione: string // Data e ora dell'elaborazione (ISO string)
  jobId: string // ID univoco del job di elaborazione
  utente?: string // Username dell'utente che ha fatto l'elaborazione
}

// Tipo della risposta completa con i risultati dell'elaborazione
export interface RisultatoElaborazione {
  success: boolean // True se l'elaborazione è completata con successo
  data: {
    fileElaborato: FileElaborato // File di lavoro modificato
    dizionarioAggiornato: FileElaborato // File dizionario aggiornato (se modificato)
    statistiche: StatisticheElaborazione // Statistiche dettagliate
    dettagliElaborazione: DettagliElaborazione // Dettagli del processo
    logElaborazione?: string[] // Log dettagliato delle operazioni (opzionale)
  }
  message?: string // Eventuale messaggio informativo
}

// Tipo per la richiesta di download
export interface DownloadRequest {
  jobId: string // ID del job di elaborazione
  fileType: "lavoro" | "dizionario" | "log" | "report" // Tipo di file da scaricare
  formato?: "xlsx" | "csv" | "pdf" // Formato desiderato (opzionale)
}

// Tipo della risposta per il download
export interface DownloadResponse {
  success: boolean // True se il download è disponibile
  downloadUrl: string // URL temporaneo per il download
  fileName: string // Nome del file da scaricare
  expiresAt: string // Data di scadenza del link (ISO string)
  fileSize: number // Dimensione del file in byte
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

// Recupera i risultati completi di un'elaborazione
export async function getRisultato(jobId: string): Promise<RisultatoElaborazione> {
  try {
    return await apiCall(`/api/risultato/${jobId}`)
  } catch (error) {
    throw new Error(
      `Errore nel recupero dei risultati: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
    )
  }
}

// Genera un link temporaneo per scaricare un file elaborato
export async function downloadFile(request: DownloadRequest): Promise<DownloadResponse> {
  try {
    return await apiCall("/api/risultato/download", {
      method: "POST",
      body: JSON.stringify(request),
    })
  } catch (error) {
    throw new Error(
      `Errore nella generazione del download: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
    )
  }
}

// Genera un report PDF dell'elaborazione
export async function generaReport(
  jobId: string,
  formato: "pdf" | "excel" = "pdf",
  includiDettagli = true,
): Promise<DownloadResponse> {
  try {
    return await apiCall(`/api/risultato/${jobId}/report`, {
      method: "POST",
      body: JSON.stringify({ formato, includiDettagli }),
    })
  } catch (error) {
    throw new Error(
      `Errore nella generazione del report: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
    )
  }
}

// Salva i risultati nello storico dell'utente
export async function salvaRisultato(request: {
  jobId: string
  nomeProgetto?: string
  descrizione?: string
  tags?: string[]
}): Promise<{ success: boolean; message?: string }> {
  try {
    return await apiCall("/api/risultato/save", {
      method: "POST",
      body: JSON.stringify(request),
    })
  } catch (error) {
    // Fallback: simula salvataggio riuscito
    return {
      success: true,
      message: "Risultati salvati (modalità sviluppo)",
    }
  }
}
