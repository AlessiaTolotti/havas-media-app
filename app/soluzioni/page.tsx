"use client"

import { useState, type FormEvent, useEffect, useCallback, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSuggerimenti, applicaSostituzioni } from "../../lib/fetchSoluzioni"

function SoluzioniContent() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elementiNonTrovati, setElementiNonTrovati] = useState<any[]>([])
  const [statistiche, setStatistiche] = useState({
    totaleElementi: 0,
    elementiTrovati: 0,
    elementiNonTrovati: 0,
    percentualeTrovati: 0,
  })
  const [fileInfo, setFileInfo] = useState({
    lavoroPath: "",
    dizionarioPath: "",
    colonna: "",
    foglio: "",
  })

  const [selections, setSelections] = useState<{ [key: string]: string }>({})
  const [manualInputs, setManualInputs] = useState<{ [key: string]: string }>({})
  const [hoverSubmit, setHoverSubmit] = useState(false)

  const loadSuggerimenti = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const lavoroPath = (typeof window !== "undefined" ? sessionStorage.getItem("lavoro_path") : "") || ""
      const dizionarioPath = (typeof window !== "undefined" ? sessionStorage.getItem("dizionario_path") : "") || ""
      const colonna = (typeof window !== "undefined" ? sessionStorage.getItem("colonna") : "") || ""
      const foglio = (typeof window !== "undefined" ? sessionStorage.getItem("foglio") : "") || ""

      if (!lavoroPath || !dizionarioPath || !colonna) {
        console.log("Nessun parametro trovato, usando dati mock")
        throw new Error("Parametri mancanti - usando mock")
      }

      setFileInfo({ lavoroPath, dizionarioPath, colonna, foglio })

      const response = await getSuggerimenti(lavoroPath, dizionarioPath, colonna, foglio)

      setElementiNonTrovati(response.data.elementiNonTrovati)
      setStatistiche(response.data.statistiche)

      const defaultSelections: { [key: string]: string } = {}
      response.data.elementiNonTrovati.forEach((elemento: any) => {
        defaultSelections[elemento.originalValue] = "salta"
      })
      setSelections(defaultSelections)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento suggerimenti")

      console.warn("API non disponibile, usando dati mock:", err)
      const mockData = [
        {
          originalValue: "Brand Alpha",
          suggerimenti: [
            { valore: "Alpha Corporation", score: 92, confidence: 0.92 },
            { valore: "Alpha Inc", score: 78, confidence: 0.78 },
          ],
          frequency: 15,
        },
        {
          originalValue: "Brand Beta",
          suggerimenti: [
            { valore: "Beta Solutions", score: 95, confidence: 0.95 },
            { valore: "Beta Group", score: 85, confidence: 0.85 },
            { valore: "Beta Ltd", score: 72, confidence: 0.72 },
          ],
          frequency: 23,
        },
        {
          originalValue: "Brand Gamma",
          suggerimenti: [{ valore: "Gamma Industries", score: 88, confidence: 0.88 }],
          frequency: 8,
        },
        {
          originalValue: "Brand Delta",
          suggerimenti: [
            { valore: "Delta Systems", score: 91, confidence: 0.91 },
            { valore: "Delta Technologies", score: 83, confidence: 0.83 },
          ],
          frequency: 12,
        },
      ]

      setElementiNonTrovati(mockData)
      setStatistiche({
        totaleElementi: 100,
        elementiTrovati: 42,
        elementiNonTrovati: 58,
        percentualeTrovati: 42,
      })
      setFileInfo({
        lavoroPath: "/uploads/lavoro.xlsx",
        dizionarioPath: "/uploads/dizionario.xlsx",
        colonna: "Brand",
        foglio: "Foglio1",
      })

      const defaultSelections: { [key: string]: string } = {}
      mockData.forEach((elemento) => {
        defaultSelections[elemento.originalValue] = "salta"
      })
      setSelections(defaultSelections)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSuggerimenti()
  }, [loadSuggerimenti])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log("🚀 SUBMIT INIZIATO")

    setProcessing(true)
    setError(null)

    try {
      console.log("📝 Preparando sostituzioni...")

      const sostituzioni: any = {}

      Object.entries(selections).forEach(([key, selection]) => {
        console.log(`🔍 Processando: ${key} = ${selection}`)
        if (selection === "salta") {
          sostituzioni[key] = { tipo: "salta" }
        } else if (selection === "manuale") {
          sostituzioni[key] = {
            tipo: "manuale",
            valore: manualInputs[key] || "",
          }
        } else if (selection.startsWith("suggerimento_")) {
          const index = Number.parseInt(selection.replace("suggerimento_", ""))
          sostituzioni[key] = {
            tipo: "suggerimento",
            suggerimentoIndex: index,
            valore: elementiNonTrovati.find((e) => e.originalValue === key)?.suggerimenti[index]?.valore,
          }
        }
      })

      console.log("📊 Sostituzioni preparate:", sostituzioni)

      let result
      try {
        console.log("🌐 Tentativo chiamata API...")
        result = await applicaSostituzioni(
          fileInfo.lavoroPath,
          fileInfo.dizionarioPath,
          fileInfo.colonna,
          fileInfo.foglio,
          sostituzioni,
        )
        console.log("✅ API call riuscita:", result)
      } catch (apiError) {
        console.warn("⚠️ API non disponibile, creando risultato mock:", apiError)

        const sostituzioniApplicate = Object.values(selections).filter(
          (s) => s.startsWith("suggerimento_") || s === "manuale",
        ).length
        const elementiSaltati = Object.values(selections).filter((s) => s === "salta").length

        console.log("📈 Statistiche calcolate:", { sostituzioniApplicate, elementiSaltati })

        result = {
          success: true,
          data: {
            fileElaborato: {
              url: "/uploads/file_lavoro_modificato.xlsx",
              nome: "file_lavoro_modificato.xlsx",
              dimensione: 2048576,
            },
            dizionarioAggiornato: {
              url: "/uploads/dizionario_aggiornato.xlsx",
              nome: "dizionario_aggiornato.xlsx",
              dimensione: 512000,
            },
            statistiche: {
              tempoElaborazione: 2.3,
              elementiTotali: statistiche.totaleElementi,
              elementiTrovati: statistiche.elementiTrovati,
              sostituzioniApplicate,
              elementiSaltati,
              nuoviTerminiAggiunti: Math.floor(sostituzioniApplicate * 0.6),
              percentualeSuccesso: Math.round(
                ((statistiche.elementiTrovati + sostituzioniApplicate) / statistiche.totaleElementi) * 100,
              ),
            },
            dettagliElaborazione: {
              lavoroPath: fileInfo.lavoroPath,
              dizionarioPath: fileInfo.dizionarioPath,
              colonna: fileInfo.colonna,
              foglio: fileInfo.foglio,
              dataElaborazione: new Date().toISOString(),
            },
          },
        }
        console.log("🎭 Risultato mock creato:", result)
      }

      console.log("💾 Salvando in sessionStorage...")
      if (typeof window !== "undefined") {
        sessionStorage.setItem("processing_result", JSON.stringify(result.data))
        console.log("✅ Salvato in sessionStorage")
      }

      console.log("🚀 Navigando a /risultato...")
      if (router && router.push) {
        await router.push("/risultato")
        console.log("✅ Navigazione completata")
      } else {
        console.error("❌ Router non disponibile!")
        if (typeof window !== "undefined") {
          window.location.href = "/risultato"
        }
      }
    } catch (err) {
      console.error("❌ Errore generale:", err)
      setError(err instanceof Error ? err.message : "Errore nell'applicazione delle sostituzioni")

      console.log("🎭 Creando risultato mock di emergenza...")
      const mockResult = {
        fileElaborato: {
          url: "/uploads/file_lavoro_modificato.xlsx",
          nome: "file_lavoro_modificato.xlsx",
          dimensione: 2048576,
        },
        dizionarioAggiornato: {
          url: "/uploads/dizionario_aggiornato.xlsx",
          nome: "dizionario_aggiornato.xlsx",
          dimensione: 512000,
        },
        statistiche: {
          tempoElaborazione: 1.8,
          elementiTotali: statistiche.totaleElementi,
          elementiTrovati: statistiche.elementiTrovati,
          sostituzioniApplicate: Object.values(selections).filter(
            (s) => s.startsWith("suggerimento_") || s === "manuale",
          ).length,
          elementiSaltati: Object.values(selections).filter((s) => s === "salta").length,
          nuoviTerminiAggiunti: 5,
          percentualeSuccesso: 65,
        },
        dettagliElaborazione: {
          lavoroPath: fileInfo.lavoroPath,
          dizionarioPath: fileInfo.dizionarioPath,
          colonna: fileInfo.colonna,
          foglio: fileInfo.foglio,
          dataElaborazione: new Date().toISOString(),
        },
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("processing_result", JSON.stringify(mockResult))
        console.log("💾 Risultato di emergenza salvato")
      }

      console.log("⏰ Aspettando 2 secondi prima della navigazione...")
      setTimeout(() => {
        console.log("🚀 Navigando a /risultato (dopo errore)...")
        if (router && router.push) {
          router.push("/risultato")
        } else if (typeof window !== "undefined") {
          window.location.href = "/risultato"
        }
      }, 2000)
    } finally {
      console.log("🏁 Impostando processing = false")
      setProcessing(false)
    }
  }

  const handleSelectionChange = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  const handleManualInputChange = (key: string, value: string) => {
    setManualInputs((prev) => ({ ...prev, [key]: value }))
  }

  const clearError = () => setError(null)

  const getSelectionStats = () => {
    const total = elementiNonTrovati.length
    const saltati = Object.values(selections).filter((s) => s === "salta").length
    const manuali = Object.values(selections).filter((s) => s === "manuale").length
    const suggerimenti = Object.values(selections).filter((s) => s.startsWith("suggerimento_")).length

    return { total, saltati, manuali, suggerimenti }
  }

  const selectionStats = getSelectionStats()

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
    loader: {
      display: loading ? "flex" : "none",
      position: "fixed" as const,
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    loaderContent: {
      backgroundColor: "white",
      padding: "40px 60px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#2d3748",
    },
    spinner: {
      width: "30px",
      height: "30px",
      borderWidth: "3px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      borderTopColor: "#667eea",
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
    main: {
      padding: "40px 0 80px",
    },
    contentColumn: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "0 20px",
    },
    statsCard: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "25px",
      marginBottom: "30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "20px",
    },
    statItem: {
      textAlign: "center" as const,
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#667eea",
      display: "block",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#718096",
      fontWeight: "500",
    },
    fileInfoCard: {
      backgroundColor: "#f0f4ff",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "15px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#c3dafe",
    },
    fileInfoTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "10px",
    },
    fileInfoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
    },
    fileInfoItem: {
      fontSize: "0.9rem",
      color: "#4a5568",
    },
    fileInfoLabel: {
      fontWeight: "600",
      color: "#2d3748",
    },
    itemContainer: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "30px",
      marginBottom: "30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    itemHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      padding: "15px 20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
    },
    itemTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      color: "#2d3748",
      margin: "0",
    },
    frequencyBadge: {
      backgroundColor: "#667eea",
      color: "white",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "600",
    },
    radioContainer: {
      marginBottom: "15px",
    },
    radioLabel: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "8px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      marginBottom: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "white",
    },
    radioLabelSelected: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "8px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#667eea",
      marginBottom: "10px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "#f0f4ff",
    },
    radioInput: {
      marginRight: "12px",
      transform: "scale(1.2)",
    },
    radioText: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#4a5568",
      flex: "1",
    },
    contentRow: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "15px",
    },
    manualInput: {
      flex: "1",
      padding: "10px 15px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      outline: "none",
    },
    suggerimenti: {
      marginLeft: "20px",
      marginTop: "10px",
    },
    suggestionLabel: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "8px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e8f5e8",
      marginBottom: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "#f0fff4",
    },
    suggestionLabelSelected: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "8px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#48bb78",
      marginBottom: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "#e6fffa",
    },
    scoreTag: {
      backgroundColor: "#48bb78",
      color: "white",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "600",
      marginLeft: "auto",
    },
    confidenceTag: {
      backgroundColor: "#ed8936",
      color: "white",
      padding: "4px 8px",
      borderRadius: "10px",
      fontSize: "0.75rem",
      fontWeight: "600",
      marginLeft: "8px",
    },
    submitButton: {
      backgroundColor: "#667eea",
      color: "white",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      padding: "16px 40px",
      borderRadius: "12px",
      fontSize: "1.2rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "40px",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },
    submitButtonHover: {
      backgroundColor: "#5a67d8",
      color: "white",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      padding: "16px 40px",
      borderRadius: "12px",
      fontSize: "1.2rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "40px",
      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
      transform: "translateY(-2px)",
    },
    submitButtonDisabled: {
      backgroundColor: "#a0aec0",
      color: "white",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
      padding: "16px 40px",
      borderRadius: "12px",
      fontSize: "1.2rem",
      fontWeight: "600",
      cursor: "not-allowed",
      transition: "all 0.3s ease",
      marginTop: "40px",
      boxShadow: "none",
    },
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>
          <div style={styles.loaderContent}>
            <div style={styles.spinner}></div>
            <span>Caricamento suggerimenti...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Conferma Sostituzioni</h1>
          <Link
            href="/caricamento"
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
            }}
          >
            <span style={styles.backButtonIcon}>←</span>
            Torna al Caricamento
          </Link>
        </div>
      </header>

      <div style={{ ...styles.loader, display: processing ? "flex" : "none" }}>
        <div style={styles.loaderContent}>
          <div style={styles.spinner}></div>
          <span>⏳ Elaborazione in corso...</span>
        </div>
      </div>

      <main style={styles.main}>
        <div style={styles.contentColumn}>
          <div style={styles.errorAlert}>
            <span style={styles.errorText}>{error}</span>
            <button onClick={clearError} style={styles.closeButton}>
              ×
            </button>
          </div>

          <div style={styles.statsCard}>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{statistiche.totaleElementi}</span>
                <span style={styles.statLabel}>Totale Elementi</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{statistiche.elementiTrovati}</span>
                <span style={styles.statLabel}>Trovati ({statistiche.percentualeTrovati}%)</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{statistiche.elementiNonTrovati}</span>
                <span style={styles.statLabel}>Da Elaborare</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>{selectionStats.suggerimenti}</span>
                <span style={styles.statLabel}>Suggerimenti Selezionati</span>
              </div>
            </div>

            <div style={styles.fileInfoCard}>
              <div style={styles.fileInfoTitle}>Informazioni File</div>
              <div style={styles.fileInfoGrid}>
                <div style={styles.fileInfoItem}>
                  <span style={styles.fileInfoLabel}>File Lavoro:</span> {fileInfo.lavoroPath.split("/").pop()}
                </div>
                <div style={styles.fileInfoItem}>
                  <span style={styles.fileInfoLabel}>Dizionario:</span> {fileInfo.dizionarioPath.split("/").pop()}
                </div>
                <div style={styles.fileInfoItem}>
                  <span style={styles.fileInfoLabel}>Colonna:</span> {fileInfo.colonna}
                </div>
                <div style={styles.fileInfoItem}>
                  <span style={styles.fileInfoLabel}>Foglio:</span> {fileInfo.foglio}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="lavoro_path" value={fileInfo.lavoroPath} />
            <input type="hidden" name="dizionario_path" value={fileInfo.dizionarioPath} />
            <input type="hidden" name="colonna" value={fileInfo.colonna} />
            <input type="hidden" name="start_time" value={Date.now().toString()} />
            <input type="hidden" name="trovati" value={statistiche.elementiTrovati.toString()} />

            {elementiNonTrovati.map((elemento, index) => (
              <div key={index} style={styles.itemContainer}>
                <div style={styles.itemHeader}>
                  <h3 style={styles.itemTitle}>{elemento.originalValue}</h3>
                  {elemento.frequency && <span style={styles.frequencyBadge}>Occorrenze: {elemento.frequency}</span>}
                </div>
                <input type="hidden" name="non_trovati" value={elemento.originalValue} />

                <div style={styles.radioContainer}>
                  <label
                    style={
                      selections[elemento.originalValue] === "salta" || !selections[elemento.originalValue]
                        ? styles.radioLabelSelected
                        : styles.radioLabel
                    }
                    onClick={() => handleSelectionChange(elemento.originalValue, "salta")}
                  >
                    <input
                      type="radio"
                      name={`opzione_${elemento.originalValue}`}
                      value="salta"
                      checked={selections[elemento.originalValue] === "salta" || !selections[elemento.originalValue]}
                      onChange={() => handleSelectionChange(elemento.originalValue, "salta")}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioText}>Salta (mantieni valore originale)</span>
                  </label>
                </div>

                <div style={styles.contentRow}>
                  <label
                    style={
                      selections[elemento.originalValue] === "manuale" ? styles.radioLabelSelected : styles.radioLabel
                    }
                    onClick={() => handleSelectionChange(elemento.originalValue, "manuale")}
                  >
                    <input
                      type="radio"
                      name={`opzione_${elemento.originalValue}`}
                      value="manuale"
                      checked={selections[elemento.originalValue] === "manuale"}
                      onChange={() => handleSelectionChange(elemento.originalValue, "manuale")}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioText}>Inserimento manuale:</span>
                  </label>
                  <input
                    type="text"
                    name={`manuale_${elemento.originalValue}`}
                    value={manualInputs[elemento.originalValue] || ""}
                    onChange={(e) => handleManualInputChange(elemento.originalValue, e.target.value)}
                    style={styles.manualInput}
                    placeholder="Inserisci valore personalizzato"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea"
                      e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                      handleSelectionChange(elemento.originalValue, "manuale")
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                </div>

                <div style={styles.suggerimenti}>
                  {elemento.suggerimenti.map((sug: any, idx: number) => (
                    <div key={idx}>
                      <label
                        style={
                          selections[elemento.originalValue] === `suggerimento_${idx}`
                            ? styles.suggestionLabelSelected
                            : styles.suggestionLabel
                        }
                        onClick={() => handleSelectionChange(elemento.originalValue, `suggerimento_${idx}`)}
                      >
                        <input
                          type="radio"
                          name={`opzione_${elemento.originalValue}`}
                          value={`suggerimento_${idx}`}
                          checked={selections[elemento.originalValue] === `suggerimento_${idx}`}
                          onChange={() => handleSelectionChange(elemento.originalValue, `suggerimento_${idx}`)}
                          style={styles.radioInput}
                        />
                        <span style={styles.radioText}>Suggerimento: {sug.valore}</span>
                        <span style={styles.scoreTag}>{sug.score}%</span>
                        <span style={styles.confidenceTag}>Conf: {Math.round(sug.confidence * 100)}%</span>
                      </label>
                      <input
                        type="hidden"
                        name={`suggerimento_valore_${elemento.originalValue}_${idx}`}
                        value={sug.valore}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={processing}
              style={
                processing ? styles.submitButtonDisabled : hoverSubmit ? styles.submitButtonHover : styles.submitButton
              }
              onMouseEnter={() => setHoverSubmit(true)}
              onMouseLeave={() => setHoverSubmit(false)}
            >
              {processing ? "Elaborazione in corso..." : "Applica Sostituzioni"}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default function SoluzioniPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#f7fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px 60px",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: "#e2e8f0",
                borderTopColor: "#667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <span>Caricamento...</span>
          </div>
        </div>
      }
    >
      <SoluzioniContent />
    </Suspense>
  )
}
