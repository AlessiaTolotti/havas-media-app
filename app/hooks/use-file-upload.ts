"use client"

// Hook personalizzato per gestire il caricamento dei file
import { useState, useCallback } from "react"
import { uploadFile, getFiles, deleteFile, selectFile, type FileData } from "@/lib/fetchCaricamento"

export interface UseFileUploadReturn {
  files: FileData[]
  isLoading: boolean
  isUploading: boolean
  error: string | null
  uploadFiles: (files: FileList | File[]) => Promise<void>
  refreshFiles: () => Promise<void>
  removeFile: (fileId: string) => Promise<void>
  toggleFileSelection: (fileId: string, selected: boolean) => Promise<void>
  clearError: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const refreshFiles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getFiles()
      setFiles(response.files || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento dei file")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setIsUploading(true)
      setError(null)

      try {
        const filesArray = Array.from(fileList)
        const uploadPromises = filesArray.map((file) => {
          const formData = new FormData()
          formData.append("file", file)
          return uploadFile(formData)
        })

        await Promise.all(uploadPromises)
        await refreshFiles() // Ricarica la lista dopo l'upload
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore nel caricamento")
      } finally {
        setIsUploading(false)
      }
    },
    [refreshFiles],
  )

  const removeFile = useCallback(async (fileId: string) => {
    setError(null)

    try {
      await deleteFile(fileId)
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'eliminazione del file")
    }
  }, [])

  const toggleFileSelection = useCallback(async (fileId: string, selected: boolean) => {
    setError(null)

    try {
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
