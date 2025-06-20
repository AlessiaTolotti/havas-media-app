"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Caricamento() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [scelta, setScelta] = useState(false)
  const [lavoroPath, setLavoroPath] = useState("")
  const [dizionarioPath, setDizionarioPath] = useState("")
  const [anteprima, setAnteprima] = useState<string>("")
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [sheetName, setSheetName] = useState("")
  const [colonne, setColonne] = useState<string[]>([])

  useEffect(() => {
    setUploadedFiles(["file1.xlsx", "file2.xlsx", "dizionario.xlsx"])
  }, [])

  const handleFileSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setScelta(true)
      setLavoroPath("uploads/file_lavoro.xlsx")
      setDizionarioPath("uploads/dizionario.xlsx")
      setSheetNames(["Foglio1", "Foglio2", "Foglio3"])
      setSheetName("Foglio1")
      setColonne(["Colonna1", "Colonna2", "Colonna3"])
      setAnteprima(
        '<table style="width:100%;border-collapse:collapse;margin:20px 0;"><tr style="background:#f8f9fa;"><th style="padding:12px;border:1px solid #dee2e6;text-align:left;">ID</th><th style="padding:12px;border:1px solid #dee2e6;text-align:left;">Colonna1</th><th style="padding:12px;border:1px solid #dee2e6;text-align:left;">Colonna2</th></tr><tr><td style="padding:12px;border:1px solid #dee2e6;">1</td><td style="padding:12px;border:1px solid #dee2e6;">Valore1</td><td style="padding:12px;border:1px solid #dee2e6;">Valore2</td></tr></table>',
      )
      setLoading(false)
    }, 1000)
  }

  const handleSheetChange = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSheetName((e.target as HTMLFormElement).sheet_name.value)
      setLoading(false)
    }, 500)
  }

  const handleColumnConfirm = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/soluzioni")
      setLoading(false)
    }, 500)
  }

  const handleDeleteFile = (filename: string) => {
    if (confirm(`Sicuro di voler eliminare ${filename}?`)) {
      setUploadedFiles(uploadedFiles.filter((f) => f !== filename))
    }
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
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      margin: "0",
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
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <span>Attendere, caricamento in corso...</span>
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
                </fieldset>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Oppure seleziona file esistenti</legend>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>File lavoro esistente:</label>
                    <select name="file_lavoro_esistente" style={styles.select}>
                      <option value="">Seleziona un file...</option>
                      {uploadedFiles.map((f, index) => (
                        <option key={index} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>File dizionario esistente:</label>
                    <select name="file_dizionario_esistente" style={styles.select}>
                      <option value="">Seleziona un file...</option>
                      {uploadedFiles.map((f, index) => (
                        <option key={index} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

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
                  Avanti
                </button>
              </form>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>File esistenti</h2>
              <ul style={styles.fileList}>
                {uploadedFiles.map((f, index) => (
                  <li key={index} style={styles.fileItem}>
                    <span style={styles.fileName}>{f}</span>
                    <div style={styles.fileActions}>
                      <a
                        href={`/uploads/${f}`}
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
                        onClick={() => handleDeleteFile(f)}
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
            </div>
          </>
        ) : (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Anteprima del file lavoro</h2>
            <div style={styles.previewTable} dangerouslySetInnerHTML={{ __html: anteprima }} />

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