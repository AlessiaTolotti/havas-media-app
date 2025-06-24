"use client"

// Hook personalizzato per gestire il caricamento dei file
import { useState, useCallback } from "react"
import { uploadFile, getFiles, deleteFile, selectFile, type FileData } from "@/lib/fetchCaricamento"

export interface UseFileUploadReturn { 
  files: FileData[] 
  isLoading: boolean // Stato di caricamento dei file
  isUploading: boolean // Stato di caricamento di un singolo file 
  error: string | null // Errore nel caricamento dei file
  uploadFiles: (files: FileList | File[]) => Promise<void> // Funzione per caricare i file
  refreshFiles: () => Promise<void> // Funzione per aggiornare la lista dei file
  removeFile: (fileId: string) => Promise<void> // Funzione per rimuovere un file
  toggleFileSelection: (fileId: string, selected: boolean) => Promise<void> // Funzione per selezionare o deselezionare un file
  clearError: () => void // Funzione per pulire l'errore
}

export function useFileUpload(): UseFileUploadReturn { // Hook per gestire il caricamento dei file e la loro gestione 
  const [files, setFiles] = useState<FileData[]>([]) // Lista dei file
  const [isLoading, setIsLoading] = useState(false) // Stato di caricamento
  const [isUploading, setIsUploading] = useState(false) // Stato di caricamento di un singolo file
  const [error, setError] = useState<string | null>(null) // Errore nel caricamento

  const clearError = useCallback(() => { // Funzione per pulire l'errore
    setError(null) // Imposta l'errore come null perché non ci sono errori attuali 
  }, []) 

  const refreshFiles = useCallback(async () => { // Funzione per aggiornare la lista dei file
    setIsLoading(true) // Imposta il caricamento
    setError(null) 

    try { // Effettua la richiesta GET per ottenere la lista dei file
      const response = await getFiles() // Ottiene la lista dei file
      setFiles(response.files || []) // Imposta la lista dei file nel state
    } catch (err) { // Gestisce gli errori
      setError(err instanceof Error ? err.message : "Errore nel caricamento dei file") // Imposta l'errore nel state e stampa un messaggio di errore
    } finally { // Chiude il caricamento di file
      setIsLoading(false)  // Imposta il caricamento come false se la richiesta è andata a buon fine
    }
  }, [])

  const uploadFiles = useCallback( // Funzione per caricare i file della lista
    async (fileList: FileList | File[]) => { // Funzione per caricare i file della lista
      setIsUploading(true) 
      setError(null)

      try { // Effettua la richiesta POST per caricare i file
        const filesArray = Array.from(fileList) // Converte i file in un array
        const uploadPromises = filesArray.map((file) => { // Per ogni file crea una FormData separata
          const formData = new FormData() // Crea un oggetto FormData
          formData.append("file", file) // Aggiunge il file alla FormData
          return uploadFile(formData) // Effettua la richiesta POST per caricare il file
        })  

        await Promise.all(uploadPromises)// Aspetta che tutti i file vengano caricati in parallelo
        await refreshFiles() // Ricarica la lista dopo l'upload
      } catch (err) { // Gestisce gli errori
        setError(err instanceof Error ? err.message : "Errore nel caricamento") 
      } finally {
        setIsUploading(false)
      }
    },
    [refreshFiles], 
  )

  const removeFile = useCallback(async (fileId: string) => { // Funzione per rimuovere un file
    setError(null)

    try { // Effettua la richiesta DELETE per rimuovere un file
      await deleteFile(fileId)
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'eliminazione del file")
    }
  }, [])

  const toggleFileSelection = useCallback(async (fileId: string, selected: boolean) => {
    setError(null)

    try { // Effettua la richiesta PUT per selezionare o deselezionare un file
      const response = await selectFile(fileId, selected)
      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, selected } : file)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nella selezione del file")
    }
  }, [])

  return {
    files,
    isLoading,
    isUploading,
    error,
    uploadFiles,
    refreshFiles,
    removeFile,
    toggleFileSelection,
    clearError,
  }
}
