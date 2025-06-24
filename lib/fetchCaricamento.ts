// Importa l'oggetto apiClient (per fare richieste HTTP) e la classe ApiError (per gestire errori delle API)
import { apiClient, ApiError } from "@/lib/api-client"

// Importa gli endpoint API centralizzati in un oggetto
import { API_ENDPOINTS } from "@/lib/api-config"

// Tipo che rappresenta un file ricevuto o inviato all'API
export interface FileData {
  id: string              // ID univoco del file
  name: string            // Nome del file
  size: number            // Dimensione in byte
  type: string            // Tipo MIME (es. "image/png")
  uploadDate: string      // Data di caricamento (formato stringa ISO)
  selected?: boolean      // Opzionale: se il file è selezionato
  url?: string            // Opzionale: URL per accedere al file
}

// Tipo della risposta quando si carica un singolo file
export interface UploadResponse {
  success: boolean        // True se l'upload è andato a buon fine
  file: FileData          // Dati del file caricato
  message?: string        // Eventuale messaggio (es. "File salvato con successo")
}

// Tipo della risposta quando si richiedono tutti i file
export interface FilesResponse {
  success: boolean        // True se la richiesta è andata bene
  files: FileData[]       // Array di tutti i file ricevuti
  total: number           // Numero totale di file disponibili
}

// Caricamento di un singolo file
export async function uploadFile(formData: FormData): Promise<UploadResponse> {
  try {
    // Invia la FormData al backend usando POST
    return await apiClient.post(API_ENDPOINTS.CARICAMENTO, formData)
  } catch (error) {
    // Se è un errore previsto dell'API, mostra un messaggio specifico
    if (error instanceof ApiError) {
      throw new Error(`Errore nel caricamento del file: ${error.message}`)
    }
    // Altrimenti errore generico
    throw new Error("Errore sconosciuto nel caricamento del file")
  }
}

// Recupera tutti i file presenti sul server
export async function getFiles(): Promise<FilesResponse> {
  try {
    // Richiesta GET all'endpoint dei file
    return await apiClient.get(API_ENDPOINTS.FILES)
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Errore nel recupero dei file: ${error.message}`)
    }
    throw new Error("Errore sconosciuto nel recupero dei file")
  }
}

// Elimina un file specifico dato il suo ID
export async function deleteFile(fileId: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Costruisce l'URL dinamico tipo /api/files/ID e manda una DELETE
    return await apiClient.delete(`${API_ENDPOINTS.CARICAMENTO}/${fileId}`)
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Errore nell'eliminazione del file: ${error.message}`)
    }
    throw new Error("Errore sconosciuto nell'eliminazione del file")
  }
}

// Permette di selezionare o deselezionare un file (tipo per evidenziarlo)
export async function selectFile(fileId: string, selected = true): Promise<{ success: boolean; file: FileData }> {
  try {
    // Manda una PUT con un booleano { selected: true/false } al file con ID specifico
    return await apiClient.put(`${API_ENDPOINTS.CARICAMENTO}/${fileId}/select`, { selected })
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Errore nella selezione del file: ${error.message}`)
    }
    throw new Error("Errore sconosciuto nella selezione del file")
  }
}

// Carica più file in una volta sola (es. da un input multiplo)
export async function uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
  // Per ogni file crea una FormData separata e chiama uploadFile()
  const uploadPromises = files.map((file) => {
    const formData = new FormData()
    formData.append("file", file)
    return uploadFile(formData)
  })

  try {
    // Aspetta che tutti i file vengano caricati in parallelo
    return await Promise.all(uploadPromises)
  } catch (error) {
    throw new Error("Errore nel caricamento multiplo dei file")
  }
}
