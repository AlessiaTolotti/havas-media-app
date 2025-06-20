"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

interface Suggerimento {
  valore: string
  score: number
}

interface NonTrovati {
  [key: string]: Suggerimento[]
}

export default function Soluzioni() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selections, setSelections] = useState<{ [key: string]: string }>({})
  const [manualInputs, setManualInputs] = useState<{ [key: string]: string }>({})
  const [hoverSubmit, setHoverSubmit] = useState(false)

  // Mock data - in a real app this would come from props or API
  const nonTrovati = ["Brand Alpha", "Brand Beta", "Brand Gamma", "Brand Delta"]
  const suggerimenti: NonTrovati = {
    "Brand Alpha": [
      { valore: "Alpha Corporation", score: 92 },
      { valore: "Alpha Inc", score: 78 },
    ],
    "Brand Beta": [
      { valore: "Beta Solutions", score: 95 },
      { valore: "Beta Group", score: 85 },
      { valore: "Beta Ltd", score: 72 },
    ],
    "Brand Gamma": [{ valore: "Gamma Industries", score: 88 }],
    "Brand Delta": [
      { valore: "Delta Systems", score: 91 },
      { valore: "Delta Technologies", score: 83 },
    ],
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate processing time
    setTimeout(() => {
      router.push("/risultato")
    }, 2000)
  }

  const handleSelectionChange = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  const handleManualInputChange = (key: string, value: string) => {
    setManualInputs((prev) => ({ ...prev, [key]: value }))
  }

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
    safeSpace: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      margin: "0",
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
    main: {
      padding: "40px 0 80px",
    },
    contentColumn: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "0 20px",
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
    itemTitle: {
      fontSize: "1.4rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "25px",
      padding: "15px 20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
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
    manualInputFocus: {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.safeSpace}>
          <h1 style={styles.headerTitle}>Havas Media | Conferma Sostituzioni</h1>
        </div>
      </header>

      {/* Loader */}
      <div style={styles.loader}>
        <div style={styles.loaderContent}>
          <div style={styles.spinner}></div>
          <span>⏳ Attendere, elaborazione in corso...</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.safeSpace}>
          <div style={styles.contentColumn}>
            <form onSubmit={handleSubmit}>
              {/* Hidden inputs */}
              <input type="hidden" name="lavoro_path" value="/uploads/lavoro.xlsx" />
              <input type="hidden" name="dizionario_path" value="/uploads/dizionario.xlsx" />
              <input type="hidden" name="colonna" value="Brand" />
              <input type="hidden" name="start_time" value={Date.now().toString()} />
              <input type="hidden" name="trovati" value="42" />

              {/* Items to process */}
              {nonTrovati.map((key, index) => (
                <div key={index} style={styles.itemContainer}>
                  <div style={styles.itemTitle}>
                    <strong>{key}</strong>
                  </div>
                  <input type="hidden" name="non_trovati" value={key} />

                  {/* Skip option */}
                  <div style={styles.radioContainer}>
                    <label
                      style={
                        selections[key] === "salta" || !selections[key] ? styles.radioLabelSelected : styles.radioLabel
                      }
                      onClick={() => handleSelectionChange(key, "salta")}
                    >
                      <input
                        type="radio"
                        name={`opzione_${key}`}
                        value="salta"
                        checked={selections[key] === "salta" || !selections[key]}
                        onChange={() => handleSelectionChange(key, "salta")}
                        style={styles.radioInput}
                      />
                      <span style={styles.radioText}>Salta</span>
                    </label>
                  </div>

                  {/* Manual input option */}
                  <div style={styles.contentRow}>
                    <label
                      style={selections[key] === "manuale" ? styles.radioLabelSelected : styles.radioLabel}
                      onClick={() => handleSelectionChange(key, "manuale")}
                    >
                      <input
                        type="radio"
                        name={`opzione_${key}`}
                        value="manuale"
                        checked={selections[key] === "manuale"}
                        onChange={() => handleSelectionChange(key, "manuale")}
                        style={styles.radioInput}
                      />
                      <span style={styles.radioText}>Manuale:</span>
                    </label>
                    <input
                      type="text"
                      name={`manuale_${key}`}
                      value={manualInputs[key] || ""}
                      onChange={(e) => handleManualInputChange(key, e.target.value)}
                      style={styles.manualInput}
                      placeholder="Inserisci valore personalizzato"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea"
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0"
                        e.target.style.boxShadow = "none"
                      }}
                    />
                  </div>

                  {/* Suggestions */}
                  <div style={styles.suggerimenti}>
                    {suggerimenti[key]?.map((sug, idx) => (
                      <div key={idx}>
                        <label
                          style={
                            selections[key] === `suggerimento_${idx}`
                              ? styles.suggestionLabelSelected
                              : styles.suggestionLabel
                          }
                          onClick={() => handleSelectionChange(key, `suggerimento_${idx}`)}
                        >
                          <input
                            type="radio"
                            name={`opzione_${key}`}
                            value={`suggerimento_${idx}`}
                            checked={selections[key] === `suggerimento_${idx}`}
                            onChange={() => handleSelectionChange(key, `suggerimento_${idx}`)}
                            style={styles.radioInput}
                          />
                          <span style={styles.radioText}>Suggerimento: {sug.valore}</span>
                          <span style={styles.scoreTag}>{sug.score}%</span>
                        </label>
                        <input type="hidden" name={`suggerimento_valore_${key}_${idx}`} value={sug.valore} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={
                  loading ? styles.submitButtonDisabled : hoverSubmit ? styles.submitButtonHover : styles.submitButton
                }
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
              >
                {loading ? "Elaborazione in corso..." : "Applica modifiche"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}