"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// 🎯 IMPORT DIRETTI (senza alias) - CORRETTO
import { getSuggerimenti, applicaSostituzioni, validaSostituzioni } from "../../lib/fetchSoluzioni"

export default function SoluzioniPage() {
  const router = useRouter()

  // 📊 STATI PER I DATI API
  const [suggerimenti, setSuggerimenti] = useState<any[]>([])
  const [sostituzioni, setSostituzioni] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statistiche, setStatistiche] = useState<any>(null)

  // 🔄 CARICA SUGGERIMENTI ALL'AVVIO
  useEffect(() => {
    loadSuggerimenti()
  }, [])

  // 📡 FUNZIONE PER CARICARE I SUGGERIMENTI
  const loadSuggerimenti = async () => {
    setLoading(true)
    setError(null)

    try {
      // 🎯 USA IL TUO FETCH!
      const response = await getSuggerimenti(
        "uploads/file_lavoro.xlsx", // Questi valori li prendi da sessionStorage o props
        "uploads/dizionario.xlsx",
        "Brand",
        "Foglio1",
      )

      if (response.success) {
        setSuggerimenti(response.data.elementiNonTrovati)
        setStatistiche(response.data.statistiche)
      } else {
        setError("Errore nel caricamento dei suggerimenti")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto")

      // 🔄 FALLBACK CON DATI MOCK
      setSuggerimenti([
        {
          originalValue: "Nike Inc",
          suggerimenti: [
            { valore: "Nike", score: 0.95, confidence: 0.9 },
            { valore: "NIKE", score: 0.85, confidence: 0.8 },
          ],
          frequency: 5,
        },
        {
          originalValue: "Coca Cola Co",
          suggerimenti: [
            { valore: "Coca-Cola", score: 0.98, confidence: 0.95 },
            { valore: "Coca Cola", score: 0.88, confidence: 0.85 },
          ],
          frequency: 3,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // ⚙️ GESTISCE LA SCELTA DELL'UTENTE
  const handleSceltaSostituzione = (originalValue: string, config: any) => {
    setSostituzioni((prev: any) => ({
      ...prev,
      [originalValue]: config,
    }))
  }

  // 🚀 APPLICA LE SOSTITUZIONI
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // 🛡️ VALIDA PRIMA DI APPLICARE
      const validazione = await validaSostituzioni(
        "uploads/file_lavoro.xlsx",
        "uploads/dizionario.xlsx",
        "Brand",
        "Foglio1",
        sostituzioni,
      )

      if (!validazione.valid) {
        setError(`Errori di validazione: ${validazione.errors.join(", ")}`)
        return
      }

      // 🎯 APPLICA LE SOSTITUZIONI
      const response = await applicaSostituzioni(
        "uploads/file_lavoro.xlsx",
        "uploads/dizionario.xlsx",
        "Brand",
        "Foglio1",
        sostituzioni,
      )

      if (response.success) {
        // 💾 SALVA IL JOB ID PER LA PAGINA RISULTATO
        sessionStorage.setItem("jobId", response.data.jobId)
        sessionStorage.setItem("processing_result", JSON.stringify(response))

        // 🚀 NAVIGA AI RISULTATI
        router.push("/risultato")
      } else {
        setError("Errore nell'applicazione delle sostituzioni")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto")

      // 🔄 FALLBACK - NAVIGA COMUNQUE
      const mockResult = {
        data: {
          jobId: "mock-job-123",
          fileElaborato: "uploads/file_elaborato.xlsx",
          statistiche: {
            sostituzioniApplicate: Object.keys(sostituzioni).length,
            elementiSaltati: 0,
            tempoElaborazione: 2.5,
          },
        },
      }
      sessionStorage.setItem("processing_result", JSON.stringify(mockResult))
      router.push("/risultato")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "#f7fafc", fontFamily: "system-ui, sans-serif", padding: "20px" }}
    >
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>🔧 Gestione Sostituzioni</h1>
        <Link href="/caricamento" style={{ color: "white", textDecoration: "underline" }}>
          ← Torna al Caricamento
        </Link>
      </header>

      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: "20px", color: "#667eea" }}>⏳ Caricamento in corso...</div>
        )}

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

        {statistiche && (
          <div style={{ backgroundColor: "#f0fff4", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
            <h3>📊 Statistiche</h3>
            <p>
              Elementi totali: <strong>{statistiche.totaleElementi}</strong>
            </p>
            <p>
              Elementi trovati: <strong>{statistiche.elementiTrovati}</strong>
            </p>
            <p>
              Da sostituire: <strong>{statistiche.elementiNonTrovati}</strong>
            </p>
            <p>
              Percentuale trovati: <strong>{statistiche.percentualeTrovati}%</strong>
            </p>
          </div>
        )}

        <h2>🔍 Elementi da sostituire</h2>

        {suggerimenti.map((elemento: any, index: number) => (
          <div
            key={index}
            style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}
          >
            <h4 style={{ color: "#2d3748", marginBottom: "10px" }}>
              "{elemento.originalValue}"
              {elemento.frequency && (
                <span style={{ color: "#718096", fontSize: "0.9rem" }}> (appare {elemento.frequency} volte)</span>
              )}
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* OPZIONE: SALTA */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="radio"
                  name={`sostituzione-${index}`}
                  onChange={() => handleSceltaSostituzione(elemento.originalValue, { tipo: "salta" })}
                />
                <span>⏭️ Salta (mantieni originale)</span>
              </label>

              {/* OPZIONI: SUGGERIMENTI */}
              {elemento.suggerimenti.map((sug: any, sugIndex: number) => (
                <label key={sugIndex} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="radio"
                    name={`sostituzione-${index}`}
                    onChange={() =>
                      handleSceltaSostituzione(elemento.originalValue, {
                        tipo: "suggerimento",
                        suggerimentoIndex: sugIndex,
                      })
                    }
                  />
                  <span>
                    ✅ Sostituisci con "<strong>{sug.valore}</strong>"
                    <span style={{ color: "#48bb78", fontSize: "0.8rem" }}>
                      {" "}
                      (confidenza: {Math.round(sug.confidence * 100)}%)
                    </span>
                  </span>
                </label>
              ))}

              {/* OPZIONE: MANUALE */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="radio"
                  name={`sostituzione-${index}`}
                  onChange={() => handleSceltaSostituzione(elemento.originalValue, { tipo: "manuale" })}
                />
                <span>✏️ Inserisci manualmente:</span>
                <input
                  type="text"
                  placeholder="Valore personalizzato"
                  style={{ padding: "5px 10px", border: "1px solid #e2e8f0", borderRadius: "4px" }}
                  onChange={(e) =>
                    handleSceltaSostituzione(elemento.originalValue, {
                      tipo: "manuale",
                      valore: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={handleSubmit}
            disabled={loading || suggerimenti.length === 0}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              backgroundColor: loading ? "#a0aec0" : "#48bb78",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
            }}
          >
            {loading ? "⏳ Elaborazione..." : "🚀 Applica Sostituzioni"}
          </button>
        </div>
      </div>
    </div>
  )
}
