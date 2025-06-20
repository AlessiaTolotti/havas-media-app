"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Risultato() {
  const router = useRouter()
  const [stats, setStats] = useState({
    lavoro: "/uploads/file_lavoro_modificato.xlsx",
    dizionario: "/uploads/dizionario_aggiornato.xlsx",
    tempo: "3.5",
    trovati: "42",
    sostituzioni: "15",
    aggiunte_vocab: "8",
  })

  const handleGoHome = () => {
    router.push("/login")
  }

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
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
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
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
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
      border: "none",
      cursor: "pointer",
    },
    divider: {
      height: "2px",
      background: "linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 50%, #e2e8f0 100%)",
      borderWidth: "0",
      borderStyle: "none",
      borderColor: "transparent",
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
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e2e8f0",
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
      border: "none",
      padding: "15px 30px",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)",
    },
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

            <button
              onClick={handleGoHome}
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
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}