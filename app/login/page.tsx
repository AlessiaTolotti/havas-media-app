"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation" //importa i dati delle pagine di navigazione 
import { fetchLogin } from "../../lib/fetchLogin" //hook per gestire lo stato

//componente principale pagina di login
export default function Login() {
  const [username, setUsername] = useState("") //stato per l'username
  const [password, setPassword] = useState("") //stato per la password
  const [error, setError] = useState("") //stato per l'errore
  const [isLoading, setIsLoading] = useState(false) //stato per il caricamento
  const router = useRouter() //hook per la navigazione

const handleSubmit = async (e: FormEvent) => { //funzione per gestire il submit (invio)
  e.preventDefault(); //evita il comportamento predefinito del form
  setIsLoading(true); //imposta il caricamento
  setError(""); //imposta l'errore come stringa vuota

  try {
    const data = await fetchLogin(username, password); //invia la richiesta di login
    console.log("Risposta backend:", data.ciao); //stampa il contenuto della risposta

    if (1) {
      router.push("/caricamento"); 
    } else {
      setError(data.message || "Login fallito");
    }
  } catch (error) {
    setError("Errore di rete o server"); //imposta l'errore in caso di errore nella richiesta di login 
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "50px 40px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "450px",
    },
    title: {
      fontSize: "2.2rem",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "10px",
      textAlign: "center" as const,
    },
    subtitle: {
      fontSize: "1rem",
      color: "#718096",
      marginBottom: "40px",
      textAlign: "center" as const,
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "25px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#4a5568",
      marginBottom: "5px",
    },
    input: {
      padding: "15px 20px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
    button: {
      backgroundColor: "#667eea",
      color: "white",
      border: "none",
      padding: "15px 20px",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    buttonHover: {
      backgroundColor: "#5a67d8",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    },
    buttonDisabled: {
      backgroundColor: "#a0aec0",
      cursor: "not-allowed",
      transform: "none",
    },
    error: {
      color: "#e53e3e",
      backgroundColor: "#fed7d7",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "0.9rem",
      textAlign: "center" as const,
      marginBottom: "20px",
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "2px solid transparent",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Accesso</h2>
        <p style={styles.subtitle}>Inserisci le tue credenziali per continuare</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0"
                e.target.style.boxShadow = "none"
              }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0"
                e.target.style.boxShadow = "none"
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                Object.assign(e.currentTarget.style, styles.buttonHover)
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#667eea"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }
            }}
          >
            {isLoading && <div style={styles.spinner}></div>}
            {isLoading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
