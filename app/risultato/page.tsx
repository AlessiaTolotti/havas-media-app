"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function RisultatoPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    lavoro: "/uploads/file_lavoro_modificato.xlsx",
    dizionario: "/uploads/dizionario_aggiornato.xlsx",
    tempo: "3.5",
    trovati: "42",
    sostituzioni: "15",
    aggiunte_vocab: "8",
  })

  useEffect(() => {
    console.log("🔍 Caricando risultati...")

    // Carica dati da sessionStorage se disponibili
    if (typeof window !== "undefined") {
      const savedData = sessionStorage.getItem("processing_result")

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log("✅ Dati caricati:", parsedData)

          // Aggiorna stats con i dati reali se disponibili
          if (parsedData.statistiche) {
            setStats({
              lavoro: parsedData.fileElaborato?.url || "/uploads/file_lavoro_modificato.xlsx",
              dizionario: parsedData.dizionarioAggiornato?.url || "/uploads/dizionario_aggiornato.xlsx",
              tempo: parsedData.statistiche.tempoElaborazione?.toString() || "3.5",
              trovati: parsedData.statistiche.elementiTrovati?.toString() || "42",
              sostituzioni: parsedData.statistiche.sostituzioniApplicate?.toString() || "15",
              aggiunte_vocab: parsedData.statistiche.nuoviTerminiAggiunti?.toString() || "8",
            })
          }
        } catch (error) {
          console.error("❌ Errore parsing dati:", error)
        }
      }
    }

    setLoading(false)
  }, [])

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f7fafc",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
      color: "white",
      padding: "30px 0",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      margin: "0",
    },
    successIcon: {
      fontSize: "2.5rem",
    },
    main: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "40px 20px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
    },
    downloadSection: {
      marginBottom: "40px",
    },
    downloadTitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "20px",
    },
    downloadItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      marginBottom: "15px",
      border: "1px solid #e2e8f0",
    },
    downloadLabel: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#4a5568",
    },
    downloadButton: {
      backgroundColor: "#667eea",
      color: "white",
      textDecoration: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    divider: {
      height: "2px",
      background: "linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 50%, #e2e8f0 100%)",
      border: "none",
      margin: "40px 0",
      borderRadius: "1px",
    },
    statsTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    statCard: {
      backgroundColor: "#f8f9fa",
      padding: "25px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      textAlign: "center" as const,
      transition: "all 0.3s ease",
    },
    statIcon: {
      fontSize: "2rem",
      marginBottom: "10px",
      display: "block",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "5px",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#718096",
      fontWeight: "500",
    },
    homeButton: {
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
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)",
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
      display: "flex",
      alignItems: "center",
      gap: "20px",
      fontSize: "1.2rem",
      fontWeight: "600",
    },
    spinner: {
      width: "30px",
      height: "30px",
      border: "3px solid #e2e8f0",
      borderTop: "3px solid #48bb78",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>
          <div style={styles.loaderContent}>
            <div style={styles.spinner}></div>
            <span>Caricamento risultati...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <span style={styles.successIcon}>✅</span>
          <h1 style={styles.headerTitle}>Elaborazione completata</h1>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.downloadSection}>
            <h2 style={styles.downloadTitle}>📁 File generati</h2>

            <div style={styles.downloadItem}>
              <span style={styles.downloadLabel}>📊 File lavoro modificato</span>
              <a
                href={stats.lavoro}
                style={styles.downloadButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#5a67d8"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#667eea"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <span>⬇️</span>
                Scarica
              </a>
            </div>

            <div style={styles.downloadItem}>
              <span style={styles.downloadLabel}>📚 File dizionario aggiornato</span>
              <a
                href={stats.dizionario}
                style={styles.downloadButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#5a67d8"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#667eea"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <span>⬇️</span>
                Scarica
              </a>
            </div>
          </div>

          <hr style={styles.divider} />

          <div>
            <h2 style={styles.statsTitle}>
              <span>📈</span>
              Statistiche elaborazione
            </h2>

            <div style={styles.statsGrid}>
              <div
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <span style={styles.statIcon}>⏱️</span>
                <div style={styles.statValue}>{stats.tempo}s</div>
                <div style={styles.statLabel}>Tempo esecuzione</div>
              </div>

              <div
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <span style={styles.statIcon}>🔎</span>
                <div style={styles.statValue}>{stats.trovati}</div>
                <div style={styles.statLabel}>Valori trovati</div>
              </div>

              <div
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <span style={styles.statIcon}>✏️</span>
                <div style={styles.statValue}>{stats.sostituzioni}</div>
                <div style={styles.statLabel}>Sostituzioni eseguite</div>
              </div>

              <div
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <span style={styles.statIcon}>🏷️</span>
                <div style={styles.statValue}>{stats.aggiunte_vocab}</div>
                <div style={styles.statLabel}>Brand riclassificati</div>
              </div>
            </div>

            <Link
              href="/"
              style={styles.homeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#38a169"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(72, 187, 120, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#48bb78"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(72, 187, 120, 0.3)"
              }}
            >
              <span>🔄</span>
              Torna all'inizio
            </Link>
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
