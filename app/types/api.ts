// Tipi per i file
export interface FileData {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  selected?: boolean
  url?: string
}

// Tipi per l'anteprima Excel
export interface ExcelPreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
  fileName: string
}

// Tipi per i file processati
export interface ProcessedFilesData {
  lavoroFile: FileData
  dizionarioFile: FileData
  previewData: ExcelPreviewData
  availableSheets: string[]
  availableColumns: string[]
}

// Tipi per i suggerimenti
export interface Suggerimento {
  valore: string
  score: number
  confidence: number
}

export interface ElementoNonTrovato {
  originalValue: string
  suggerimenti: Suggerimento[]
  context?: string
  frequency?: number
}

export interface SuggerimentiResponse {
  success: boolean
  data: {
    elementiNonTrovati: ElementoNonTrovato[]
    statistiche: {
      totaleElementi: number
      elementiTrovati: number
      elementiNonTrovati: number
      percentualeTrovati: number
    }
    fileInfo: {
      lavoroPath: string
      dizionarioPath: string
      colonna: string
      foglio: string
    }
  }
  message?: string
}

// Tipi per le sostituzioni
export interface SostituzioneConfig {
  tipo: "salta" | "manuale" | "suggerimento"
  valore?: string
  suggerimentoIndex?: number
}

export interface Sostituzioni {
  [originalValue: string]: SostituzioneConfig
}

// Tipi per i risultati
export interface RisultatoElaborazione {
  success: boolean
  data: {
    fileElaborato: {
      url: string
      nome: string
      dimensione: number
    }
    dizionarioAggiornato: {
      url: string
      nome: string
      dimensione: number
    }
    statistiche: {
      tempoElaborazione: number
      elementiTotali: number
      elementiTrovati: number
      sostituzioniApplicate: number
      elementiSaltati: number
      nuoviTerminiAggiunti: number
      percentualeSuccesso: number
    }
    dettagliElaborazione: {
      lavoroPath: string
      dizionarioPath: string
      colonna: string
      foglio: string
      dataElaborazione: string
    }
  }
  message?: string
}

// Tipi per le risposte API
export interface UploadResponse {
  success: boolean
  file: FileData
  message?: string
}

export interface FilesResponse {
  success: boolean
  files: FileData[]
  total: number
}

export interface ProcessingResult {
  success: boolean
  data: {
    fileElaborato: string
    statistiche: {
      sostituzioniApplicate: number
      elementiSaltati: number
      tempoElaborazione: number
    }
  }
  message?: string
}

export interface DownloadResponse {
  success: boolean
  downloadUrl: string
  fileName: string
}
