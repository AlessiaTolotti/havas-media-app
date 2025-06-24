"use client"

import { useState, type FormEvent, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// 🎯 IMPORT DIRETTI (senza alias)
import { uploadFile, getFiles } from "../../lib/fetchCaricamento"
// import { apiClient, ApiError } from "../lib/api-client"
// import { API_ENDPOINTS } from "../lib/api-config"

// Tipi TypeScript inline
interface FileData {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  selected?: boolean
  url?: string
}

interface UploadResponse {
  success: boolean
  file: FileData
  message?: string
}

interface FilesResponse {
  success: boolean
  files: FileData[]
  total: number
}

// Nuovi tipi per l'anteprima Excel
interface ExcelPreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
  fileName: string
}

interface ProcessedFilesData {
  lavoroFile: FileData
  dizionarioFile: FileData
  previewData: ExcelPreviewData
  availableSheets: string[]
  availableColumns: string[]
}

export default function CaricamentoPage() {
  const router = useRouter()

  // Stati esistenti
  const [loading, setLoading] = useState(false)
  const [scelta, setScelta] = useState(false)
  const [lavoroPath, setLavoroPath] = useState("")
  const [dizionarioPath, setDizionarioPath] = useState("")
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [sheetName, setSheetName] = useState("")
  const [colonne, setColonne] = useState<string[]>([])

  // Nuovi stati per API
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLavoroFile, setSelectedLavoroFile] = useState<File | null>(null)
  const [selectedDizionarioFile, setSelectedDizionarioFile] = useState<File | null>(null)

  // Nuovi stati per gestione dinamica
  const [processedData, setProcessedData] = useState<ProcessedFilesData | null>(null)
  const [previewData, setPreviewData] = useState<ExcelPreviewData | null>(null)
  const [selectedColumn, setSelectedColumn] = useState("")

  // Funzioni API inline (sposta dentro il componente)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Funzioni API usando i tuoi file esistenti
  // const uploadFile = async (formData: FormData): Promise<UploadResponse> => {
  //   try {
  //     return await apiClient.post(API_ENDPOINTS.CARICAMENTO, formData)
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       throw new Error(`Errore nel caricamento del file: ${error.message}`)
  //     }
  //     throw new Error("Errore sconosciuto nel caricamento del file")
  //   }
  // }

  // const getFiles = async (): Promise<FilesResponse> => {
  //   try {
  //     return await apiClient.get(API_ENDPOINTS.FILES)
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       throw new Error(`Errore nel recupero dei file: ${error.message}`)
  //     }
  //     throw new Error("Errore sconosciuto nel recupero dei file")
  //   }
  // }

  const deleteFile = async (fileId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // return await apiClient.delete(`${API_ENDPOINTS.CARICAMENTO}/${fileId}`)
      return await deleteFile(fileId)
    } catch (error) {
      // if (error instanceof ApiError) {
      //   throw new Error(`Errore nell'eliminazione del file: ${error.message}`)
      // }
      throw new Error("Errore sconosciuto nell'eliminazione del file")
    }
  }

  const selectFile = async (fileId: string, selected = true): Promise<{ success: boolean; file: FileData }> => {
    try {
      // return await apiClient.put(`${API_ENDPOINTS.CARICAMENTO}/${fileId}/select`, { selected })
      return await selectFile(fileId, selected)
    } catch (error) {
      // if (error instanceof ApiError) {
      //   throw new Error(`Errore nella selezione del file: ${error.message}`)
      // }
      throw new Error("Errore sconosciuto nella selezione del file")
    }
  }

  // Nuova funzione per processare i file e ottenere l'anteprima
  const processFiles = async (lavoroFileId: string, dizionarioFileId: string): Promise<ProcessedFilesData> => {
    try {
      // const response = await apiClient.post(`${API_ENDPOINTS.CARICAMENTO}/process`, {
      //   lavoroFileId,
      //   dizionarioFileId,
      // })
      const response = await fetch(`${API_BASE_URL}/api/caricamento/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lavoroFileId, dizionarioFileId }),
      }).then((res) => res.json())
      return response
    } catch (error) {
      // if (error instanceof ApiError) {
      //   throw new Error(`Errore nell'elaborazione dei file: ${error.message}`)
      // }
      throw new Error("Errore sconosciuto nell'elaborazione dei file")
    }
  }

  // Nuova funzione per cambiare foglio
  const changeSheet = async (fileId: string, sheetName: string): Promise<ExcelPreviewData> => {
    try {
      // const response = await apiClient.post(`${API_ENDPOINTS.CARICAMENTO}/change-sheet`, {
      //   fileId,
      //   sheetName,
      // })
      const response = await fetch(`${API_BASE_URL}/api/caricamento/change-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, sheetName }),
      }).then((res) => res.json())
      return response
    } catch (error) {
      // if (error instanceof ApiError) {
      //   throw new Error(`Errore nel cambio foglio: ${error.message}`)
      // }
      throw new Error("Errore sconosciuto nel cambio foglio")
    }
  }

  // Caricamento iniziale dei file
  const loadFiles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getFiles()
      setUploadedFiles(response.files || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento dei file")
      // Fallback ai dati mock per sviluppo
      setUploadedFiles([
        {
          id: "1",
          name: "file1.xlsx",
          size: 1024,
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          uploadDate: new Date().toISOString(),
        },
        {
          id: "2",
          name: "file2.xlsx",
          size: 2048,
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          uploadDate: new Date().toISOString(),
        },
        {
          id: "3",
          name: "dizionario.xlsx",
          size: 512,
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          uploadDate: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  // Gestione upload file MIGLIORATA
  const handleFileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const fileLavoro = formData.get("file_lavoro") as File
    const fileDizionario = formData.get("file_dizionario") as File
    const lavoroEsistente = formData.get("file_lavoro_esistente") as string
    const dizionarioEsistente = formData.get("file_dizionario_esistente") as string

    // Validazione: deve esserci almeno un file di lavoro e uno dizionario
    if (!fileLavoro && !lavoroEsistente) {
      setError("Seleziona un file di lavoro")
      return
    }
    if (!fileDizionario && !dizionarioEsistente) {
      setError("Seleziona un file dizionario")
      return
    }

    setIsUploading(true)
    setLoading(true)

    try {
      let lavoroFileId = ""
      let dizionarioFileId = ""

      // Upload nuovo file lavoro se presente
      if (fileLavoro && fileLavoro.size > 0) {
        const lavoroFormData = new FormData()
        lavoroFormData.append("file", fileLavoro)
        lavoroFormData.append("type", "lavoro")
        const lavoroResponse = await uploadFile(lavoroFormData)
        lavoroFileId = lavoroResponse.file.id
        setLavoroPath(`uploads/${fileLavoro.name}`)
      } else {
        // Trova l'ID del file esistente selezionato
        const existingFile = uploadedFiles.find((f) => f.name === lavoroEsistente)
        if (existingFile) {
          lavoroFileId = existingFile.id
          setLavoroPath(`uploads/${lavoroEsistente}`)
        }
      }

      // Upload nuovo file dizionario se presente
      if (fileDizionario && fileDizionario.size > 0) {
        const dizionarioFormData = new FormData()
        dizionarioFormData.append("file", fileDizionario)
        dizionarioFormData.append("type", "dizionario")
        const dizionarioResponse = await uploadFile(dizionarioFormData)
        dizionarioFileId = dizionarioResponse.file.id
        setDizionarioPath(`uploads/${fileDizionario.name}`)
      } else {
        // Trova l'ID del file esistente selezionato
        const existingFile = uploadedFiles.find((f) => f.name === dizionarioEsistente)
        if (existingFile) {
          dizionarioFileId = existingFile.id
          setDizionarioPath(`uploads/${dizionarioEsistente}`)
        }
      }

      // Ricarica la lista se sono stati caricati nuovi file
      if ((fileLavoro && fileLavoro.size > 0) || (fileDizionario && fileDizionario.size > 0)) {
        await loadFiles()
      }

      // Processa i file e ottieni l'anteprima REALE
      try {
        const processedResult = await processFiles(lavoroFileId, dizionarioFileId)
        setProcessedData(processedResult)
        setPreviewData(processedResult.previewData)
        setSheetNames(processedResult.availableSheets)
        setSheetName(processedResult.availableSheets[0] || "")
        setColonne(processedResult.availableColumns)
        setScelta(true)
      } catch (apiError) {
        // Fallback ai dati mock se l'API non è ancora pronta
        console.warn("API non disponibile, usando dati mock:", apiError)
        setSheetNames(["Foglio1", "Foglio2", "Foglio3"])
        setSheetName("Foglio1")
        setColonne(["Nome File", "Dimensione", "Data Caricamento", "Tipo"])

        // Crea anteprima mock con i file reali caricati
        const mockPreview: ExcelPreviewData = {
          headers: ["Nome File", "Dimensione", "Data Caricamento", "Tipo"],
          rows: uploadedFiles
            .slice(0, 5)
            .map((file) => [
              file.name,
              formatFileSize(file.size),
              new Date(file.uploadDate).toLocaleDateString("it-IT"),
              file.type.includes("spreadsheet") ? "Excel" : "Altro",
            ]),
          totalRows: uploadedFiles.length,
          fileName: fileLavoro ? fileLavoro.name : lavoroEsistente,
        }
        setPreviewData(mockPreview)
        setScelta(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'upload")
    } finally {
      setLoading(false)
      setIsUploading(false)
    }
  }

  // Gestione cambio foglio MIGLIORATA
  const handleSheetChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const target = e.currentTarget
    const selectedSheet = (target.elements.namedItem("sheet_name") as HTMLSelectElement).value

    try {
      if (processedData) {
        // Chiamata API reale per cambiare foglio
        const newPreviewData = await changeSheet(processedData.lavoroFile.id, selectedSheet)
        setPreviewData(newPreviewData)
        setColonne(newPreviewData.headers)
        setSheetName(selectedSheet)
      } else {
        // Fallback mock
        setSheetName(selectedSheet)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel cambio foglio")
      // Fallback: aggiorna solo il nome del foglio
      setSheetName(selectedSheet)
    } finally {
      setLoading(false)
    }
  }

  const handleColumnConfirm = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const selectedCol = formData.get("colonna") as string
    setSelectedColumn(selectedCol)

    // Qui potresti fare una chiamata API per confermare la selezione
    setTimeout(() => {
      router.push("/soluzioni")
      setLoading(false)
    }, 500)
  }

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Sicuro di voler eliminare ${fileName}?`)) return

    setError(null)
    try {
      await deleteFile(fileId)
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'eliminazione del file")
    }
  }

  const clearError = () => setError(null)

  // Funzione per formattare la dimensione del file
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Funzione per generare l'HTML della tabella dinamicamente
  const generatePreviewTable = (): string => {
    if (!previewData) return ""

    const headerRow = previewData.headers
      .map(
        (header) =>
          `<th style="padding:12px;border:1px solid #dee2e6;text-align:left;background:#f8f9fa;font-weight:600;">${header}</th>`,
      )
      .join("")

    const dataRows = previewData.rows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td style="padding:12px;border:1px solid #dee2e6;">${cell}</td>`).join("")}</tr>`,
      )
      .join("")

    return `
      <div style="margin-bottom:15px;padding:10px;background:#f8f9fa;border-radius:8px;">
        <strong>File:</strong> ${previewData.fileName} | 
        <strong>Righe totali:</strong> ${previewData.totalRows} | 
        <strong>Anteprima:</strong> Prime ${previewData.rows.length} righe
      </div>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
    `
  }

  // Stili inline completi (mantenuti identici)
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f7fafc",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "30px 0",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      margin: "0",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      padding: "10px 20px",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "500",
      textDecoration: "none",
      transition: "all 0.3s ease",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    backButtonIcon: {
      marginRight: "8px",
      fontSize: "1.2rem",
    },
    main: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
    },
    loader: {
      display: loading ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      gap: "15px",
      backgroundColor: "#fff3cd",
      color: "#856404",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "30px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    spinner: {
      width: "20px",
      height: "20px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "transparent",
      borderTopColor: "#856404",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    errorAlert: {
      display: error ? "flex" : "none",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#fed7d7",
      color: "#c53030",
      padding: "15px 20px",
      borderRadius: "12px",
      marginBottom: "30px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#feb2b2",
    },
    errorText: {
      fontWeight: "500",
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "#c53030",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      padding: "0",
      marginLeft: "10px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "30px",
      marginBottom: "30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    fieldset: {
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      borderRadius: "12px",
      padding: "25px",
      marginBottom: "25px",
      backgroundColor: "#f8f9fa",
    },
    legend: {
      padding: "0 15px",
      fontWeight: "600",
      color: "#2d3748",
      backgroundColor: "white",
      borderRadius: "8px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#4a5568",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      boxSizing: "border-box" as const,
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      backgroundColor: "white",
      transition: "all 0.3s ease",
      boxSizing: "border-box" as const,
    },
    button: {
      backgroundColor: "#667eea",
      color: "white",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    buttonSecondary: {
      backgroundColor: "#48bb78",
      color: "white",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    buttonDanger: {
      backgroundColor: "#f56565",
      color: "white",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "0.85rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginLeft: "10px",
    },
    fileList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
    },
    fileItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      marginBottom: "10px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    fileName: {
      fontWeight: "500",
      color: "#2d3748",
    },
    fileInfo: {
      fontSize: "0.85rem",
      color: "#718096",
      marginTop: "4px",
    },
    fileActions: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    fileLink: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "500",
      padding: "6px 12px",
      borderRadius: "6px",
      transition: "all 0.3s ease",
    },
    flexRow: {
      display: "flex",
      gap: "30px",
      flexWrap: "wrap" as const,
      marginTop: "30px",
    },
    flexForm: {
      display: "flex",
      alignItems: "flex-end",
      gap: "15px",
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    formColumn: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "20px",
    },
    previewTable: {
      marginBottom: "30px",
      overflow: "auto",
      maxHeight: "400px",
    },
    infoSection: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "60px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      textAlign: "center" as const,
      margin: "80px auto 60px",
      maxWidth: "1200px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    infoTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "20px",
    },
    infoDescription: {
      fontSize: "1.2rem",
      color: "#718096",
      lineHeight: "1.6",
      maxWidth: "800px",
      marginBottom: "40px",
    },
    stepsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "30px",
      marginTop: "40px",
      width: "100%",
    },
    stepCard: {
      backgroundColor: "#f8f9fa",
      borderRadius: "16px",
      padding: "30px 20px",
      textAlign: "center" as const,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    stepNumber: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "50px",
      height: "50px",
      backgroundColor: "#667eea",
      color: "white",
      borderRadius: "50%",
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "20px",
    },
    stepTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "10px",
    },
    stepDescription: {
      fontSize: "0.95rem",
      color: "#718096",
      lineHeight: "1.5",
    },
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Carica o seleziona i file</h1>
          <Link
            href="/"
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
            }}
          >
            <span style={styles.backButtonIcon}>←</span>
            Torna alla Home
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        {/* Loader */}
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <span>{isUploading ? "Caricamento file in corso..." : "Attendere, caricamento in corso..."}</span>
        </div>

        {/* Alert errori */}
        <div style={styles.errorAlert}>
          <span style={styles.errorText}>{error}</span>
          <button onClick={clearError} style={styles.closeButton}>
            ×
          </button>
        </div>

        {!scelta ? (
          <>
            <div style={styles.card}>
              <form onSubmit={handleFileSubmit} encType="multipart/form-data">
                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Carica nuovi file (xlsx)</legend>
                  <div style={styles.formGroup}>
                    <label htmlFor="file_lavoro" style={styles.label}>
                      File lavoro:
                    </label>
                    <input
                      type="file"
                      id="file_lavoro"
                      name="file_lavoro"
                      accept=".xlsx,.xls"
                      style={styles.input}
                      onChange={(e) => setSelectedLavoroFile(e.target.files?.[0] || null)}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea"
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0"
                        e.target.style.boxShadow = "none"
                      }}
                    />
                    {selectedLavoroFile && (
                      <div style={styles.fileInfo}>
                        Selezionato: {selectedLavoroFile.name} ({formatFileSize(selectedLavoroFile.size)})
                      </div>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="file_dizionario" style={styles.label}>
                      File dizionario:
                    </label>
                    <input
                      type="file"
                      id="file_dizionario"
                      name="file_dizionario"
                      accept=".xlsx,.xls"
                      style={styles.input}
                      onChange={(e) => setSelectedDizionarioFile(e.target.files?.[0] || null)}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea"
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0"
                        e.target.style.boxShadow = "none"
                      }}
                    />
                    {selectedDizionarioFile && (
                      <div style={styles.fileInfo}>
                        Selezionato: {selectedDizionarioFile.name} ({formatFileSize(selectedDizionarioFile.size)})
                      </div>
                    )}
                  </div>
                </fieldset>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Oppure seleziona file esistenti</legend>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>File lavoro esistente:</label>
                    <select name="file_lavoro_esistente" style={styles.select}>
                      <option value="">Seleziona un file...</option>
                      {uploadedFiles.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name} ({formatFileSize(f.size)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>File dizionario esistente:</label>
                    <select name="file_dizionario_esistente" style={styles.select}>
                      <option value="">Seleziona un file...</option>
                      {uploadedFiles.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name} ({formatFileSize(f.size)})
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    opacity: isUploading ? 0.6 : 1,
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                  disabled={isUploading}
                  onMouseEnter={(e) => {
                    if (!isUploading) {
                      e.currentTarget.style.backgroundColor = "#5a67d8"
                      e.currentTarget.style.transform = "translateY(-1px)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUploading) {
                      e.currentTarget.style.backgroundColor = "#667eea"
                      e.currentTarget.style.transform = "translateY(0)"
                    }
                  }}
                >
                  {isUploading ? "Caricamento..." : "Avanti"}
                </button>
              </form>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>File esistenti ({uploadedFiles.length})</h2>
              {uploadedFiles.length === 0 ? (
                <p style={{ color: "#718096", textAlign: "center", padding: "20px" }}>
                  Nessun file caricato. Carica i tuoi primi file per iniziare.
                </p>
              ) : (
                <ul style={styles.fileList}>
                  {uploadedFiles.map((f) => (
                    <li key={f.id} style={styles.fileItem}>
                      <div>
                        <div style={styles.fileName}>{f.name}</div>
                        <div style={styles.fileInfo}>
                          {formatFileSize(f.size)} • Caricato il {new Date(f.uploadDate).toLocaleDateString("it-IT")}
                        </div>
                      </div>
                      <div style={styles.fileActions}>
                        <a
                          href={f.url || `/uploads/${f.name}`}
                          target="_blank"
                          style={styles.fileLink}
                          rel="noreferrer"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#667eea"
                            e.currentTarget.style.color = "white"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                            e.currentTarget.style.color = "#667eea"
                          }}
                        >
                          Visualizza
                        </a>
                        <button
                          onClick={() => handleDeleteFile(f.id, f.name)}
                          style={styles.buttonDanger}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e53e3e"
                            e.currentTarget.style.transform = "translateY(-1px)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#f56565"
                            e.currentTarget.style.transform = "translateY(0)"
                          }}
                        >
                          Elimina
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Anteprima del file lavoro</h2>
            <div style={styles.previewTable} dangerouslySetInnerHTML={{ __html: generatePreviewTable() }} />

            <div style={styles.flexRow}>
              <form onSubmit={handleSheetChange} style={styles.flexForm}>
                <div style={styles.formColumn}>
                  <label htmlFor="sheet_name" style={styles.label}>
                    Seleziona foglio:
                  </label>
                  <select
                    name="sheet_name"
                    id="sheet_name"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    required
                    style={styles.select}
                  >
                    {sheetNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  style={styles.buttonSecondary}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#38a169"
                    e.currentTarget.style.transform = "translateY(-1px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#48bb78"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  Cambia foglio
                </button>
              </form>

              <form onSubmit={handleColumnConfirm} style={styles.flexForm}>
                <div style={styles.formColumn}>
                  <label htmlFor="colonna" style={styles.label}>
                    Seleziona colonna:
                  </label>
                  <select name="colonna" id="colonna" required style={styles.select}>
                    {colonne.map((col, index) => (
                      <option key={index} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <input type="hidden" name="lavoro_path" value={lavoroPath} />
                <input type="hidden" name="dizionario_path" value={dizionarioPath} />
                <button
                  type="submit"
                  style={styles.button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#5a67d8"
                    e.currentTarget.style.transform = "translateY(-1px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#667eea"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  Conferma colonna
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {!scelta && (
        <section style={styles.infoSection}>
          <h2 style={styles.infoTitle}>Come funziona il sistema</h2>
          <p style={styles.infoDescription}>
            Il nostro sistema semplifica il processo di normalizzazione dei dati nei file Excel attraverso un flusso di
            lavoro guidato e intuitivo.
          </p>

          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Carica i file</h3>
              <p style={styles.stepDescription}>
                Carica il file di lavoro e il dizionario, oppure seleziona file già esistenti nel sistema.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Seleziona colonna</h3>
              <p style={styles.stepDescription}>
                Scegli il foglio di lavoro e la colonna da elaborare per la normalizzazione dei dati.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Conferma sostituzioni</h3>
              <p style={styles.stepDescription}>
                Rivedi i suggerimenti automatici e conferma le sostituzioni da applicare ai tuoi dati.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>4</div>
              <h3 style={styles.stepTitle}>Scarica risultati</h3>
              <p style={styles.stepDescription}>
                Ottieni i file elaborati e le statistiche dettagliate dell'operazione completata.
              </p>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
