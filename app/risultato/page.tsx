"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

// 🎯 IMPORT CON PATH RELATIVO (fallback se @ non funziona)
import {
  getRisultato,
  downloadFile,
  generaReport,
  salvaRisultato,
  type RisultatoElaborazione,
  type DownloadRequest,
}  from "../../lib/fetchRisultato"

export default function RisultatoPage() {
  // 📊 STATI PER I DATI API
  const [risultato, setRisultato] = useState<RisultatoElaborazione | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  // 🔄 CARICA RISULTATI ALL'AVVIO
  useEffect(() => {
    loadRisultato()
  }, [])

  // 📡 FUNZIONE PER CARICARE I RISULTATI
  const loadRisultato = async () => {
    setLoading(true)
    setError(null)

    try {
      // 🔍 PRENDI IL JOB ID DA SESSION STORAGE
      const jobId = sessionStorage.getItem("jobId") || "mock-job-123"

      // 🎯 USA IL TUO FETCH!
      const response: RisultatoElaborazione = await getRisultato(jobId)

      if (response.success) {
        setRisultato(response)
      } else {
        setError("Errore nel caricamento dei risultati")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto")

      // 🔄 FALLBACK CON DATI MOCK
      const mockRisultato: RisultatoElaborazione = {
        success: true,
        data: {
          fileElaborato: {
            url: "/uploads/file_lavoro_modificato.xlsx",
            nome: "file_lavoro_modificato.xlsx",
            dimensione: 2048576,
            formato: "xlsx",
          },
          dizionarioAggiornato: {
            url: "/uploads/dizionario_aggiornato.xlsx",
            nome: "dizionario_aggiornato.xlsx",
            dimensione: 512000,
            formato: "xlsx",
          },
          statistiche: {
            tempoElaborazione: 3.5,
            elementiTotali: 42,
            elementiTrovati: 27,
            sostituzioniApplicate: 15,
            elementiSaltati: 3,
            nuoviTerminiAggiunti: 8,
            percentualeSuccesso: 95.2,
            erroriRiscontrati: 0,
          },
          dettagliElaborazione: {
            lavoroPath: "uploads/file_lavoro.xlsx",
            dizionarioPath: "uploads/dizionario.xlsx",
            colonna: "Brand",
            foglio: "Foglio1",
            dataElaborazione: new Date().toISOString(),
            jobId: "mock-job-123",
          },
        },
      }
      setRisultato(mockRisultato)
    } finally {
      setLoading(false)
    }
  }

  // 📥 GESTISCE IL DOWNLOAD DEI FILE
  const handleDownload = async (fileType: "lavoro" | "dizionario" | "report") => {
    if (!risultato) return

    setDownloading(fileType)
    setError(null)

    try {
      if (fileType === "report") {
        // 📊 GENERA E SCARICA REPORT
        const reportResponse = await generaReport(risultato.data.dettagliElaborazione.jobId, "pdf", true)

        if (reportResponse.success) {
          // 🔗 APRI IL LINK DI DOWNLOAD
          window.open(reportResponse.downloadUrl, "_blank")
        }
      } else {
        // 📁 SCARICA FILE ELABORATO O DIZIONARIO
        const downloadRequest: DownloadRequest = {
          jobId: risultato.data.dettagliElaborazione.jobId,
          fileType: fileType,
          formato: "xlsx",
        }

        const downloadResponse = await downloadFile(downloadRequest)

        if (downloadResponse.success) {
          // 🔗 APRI IL LINK DI DOWNLOAD
          window.open(downloadResponse.downloadUrl, "_blank")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel download")

      // 🔄 FALLBACK - DOWNLOAD DIRETTO
      const fileUrl = fileType === "lavoro" ? risultato.data.fileElaborato.url : risultato.data.dizionarioAggiornato.url
      window.open(fileUrl, "_blank")
    } finally {
      setDownloading(null)
    }
  }

  // 💾 SALVA I RISULTATI NELLO STORICO
  const handleSalvaRisultato = async () => {
    if (!risultato) return

    try {
      await salvaRisultato({
        jobId: risultato.data.dettagliElaborazione.jobId,
        nomeProgetto: `Elaborazione ${new Date().toLocaleDateString()}`,
        descrizione: `Elaborazione colonna ${risultato.data.dettagliElaborazione.colonna}`,
        tags: ["brand", "normalizzazione"],
      })

      alert("✅ Risultati salvati nello storico!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel salvataggio")
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
          <h2>Caricamento risultati...</h2>
        </div>
      </div>
    )
  }

  if (!risultato) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>❌</div>
          <h2>Errore nel caricamento</h2>
          <p>{error}</p>
          <Link href="/caricamento" style={{ color: "#667eea" }}>
            ← Torna al caricamento
          </Link>
        </div>
      </div>
    )
  }

  const stats = risultato.data.statistiche

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7fafc", fontFamily: "system-ui, sans-serif" }}>
      <header
        style={{
          background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
          color: "white",
          padding: "30px 0",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "2.5rem" }}>✅</span>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", margin: "0" }}>Elaborazione completata</h1>
        </div>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        {error && (
          <div
            style={{
              backgroundColor: "#fed7d7",
              color: "#c53030",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            ❌ {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* 📁 SEZIONE DOWNLOAD */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#2d3748", marginBottom: "20px" }}>
              📁 File generati
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                marginBottom: "15px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: "500", color: "#4a5568" }}>
                📊 {risultato.data.fileElaborato.nome}
              </span>
              <button
                onClick={() => handleDownload("lavoro")}
                disabled={downloading === "lavoro"}
                style={{
                  backgroundColor: "#667eea",
                  color: "white",
                  textDecoration: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {downloading === "lavoro" ? "⏳ Download..." : "⬇️ Scarica"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                marginBottom: "15px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: "500", color: "#4a5568" }}>
                📚 {risultato.data.dizionarioAggiornato.nome}
              </span>
              <button
                onClick={() => handleDownload("dizionario")}
                disabled={downloading === "dizionario"}
                style={{
                  backgroundColor: "#667eea",
                  color: "white",
                  textDecoration: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {downloading === "dizionario" ? "⏳ Download..." : "⬇️ Scarica"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                marginBottom: "15px",
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: "500", color: "#4a5568" }}>📋 Report dettagliato (PDF)</span>
              <button
                onClick={() => handleDownload("report")}
                disabled={downloading === "report"}
                style={{
                  backgroundColor: "#ed8936",
                  color: "white",
                  textDecoration: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {downloading === "report" ? "⏳ Generazione..." : "📄 Genera Report"}
              </button>
            </div>
          </div>

          <hr
            style={{
              height: "2px",
              background: "linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 50%, #e2e8f0 100%)",
              border: "none",
              margin: "40px 0",
              borderRadius: "1px",
            }}
          />

          {/* 📈 SEZIONE STATISTICHE */}
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#2d3748",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>📈</span>
              Statistiche elaborazione
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }}>⏱️</span>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#2d3748", marginBottom: "5px" }}>
                  {stats.tempoElaborazione}s
                </div>
                <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>Tempo esecuzione</div>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }}>🔎</span>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#2d3748", marginBottom: "5px" }}>
                  {stats.elementiTotali}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>Elementi totali</div>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }}>✏️</span>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#2d3748", marginBottom: "5px" }}>
                  {stats.sostituzioniApplicate}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>Sostituzioni eseguite</div>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "25px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }}>🎯</span>
                <div style={{ fontSize: "2rem", fontWeight: "700", color: "#2d3748", marginBottom: "5px" }}>
                  {stats.percentualeSuccesso}%
                </div>
                <div style={{ fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>Successo</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleSalvaRisultato}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#9f7aea",
                  color: "white",
                  textDecoration: "none",
                  padding: "15px 30px",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span>💾</span>
                Salva nello storico
              </button>

              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#48bb78",
                  color: "white",
                  textDecoration: "none",
                  padding: "15px 30px",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              >
                <span>🔄</span>
                Torna all'inizio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
