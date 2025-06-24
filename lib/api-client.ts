// Classe personalizzata per rappresentare un errore nelle chiamate API
export class ApiError extends Error {
  constructor(
    message: string,             // Messaggio descrittivo dell'errore
    public status: number,       // Codice di stato HTTP (es. 404, 500...)
    public response?: Response,  // L'intera risposta fetch, utile per debug avanzati
  ) {
    super(message)               // Richiama il costruttore di Error con il messaggio
    this.name = "ApiError"       // Imposta il nome dell'errore per riconoscerlo facilmente
  }
}

// Funzione che gestisce tutte le risposte fetch e lancia errori se qualcosa va storto
async function handleResponse(response: Response) {
  // Se la risposta non è OK (cioè status diverso da 200-299)
  if (!response.ok) {
    const errorText = await response.text() // Prova a leggere il corpo dell'errore (potrebbe contenere info utili)
    // Lancia un errore personalizzato con messaggio, codice e risposta completa
    throw new ApiError(`HTTP ${response.status}: ${errorText || response.statusText}`, response.status, response)
  }

  // Se il content-type della risposta è JSON, restituisce i dati parsati
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  // Se non è JSON, restituisce il testo grezzo (es. HTML, stringa, ecc.)
  return response.text()
}

// Wrapper che simula una mini libreria tipo Axios, ma usa fetch internamente
export const apiClient = {
  // Metodo GET: usato per ottenere dati da un endpoint
  async get(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specifica che ci aspettiamo JSON in risposta
      },
      ...options, // Aggiunge qualsiasi altra opzione passata dall'esterno (es. header auth)
    })
    return handleResponse(response) // Elabora la risposta e gestisce gli errori
  },

  // Metodo POST: usato per inviare dati al server
  async post(url: string, data?: any, options?: RequestInit) {
    const isFormData = data instanceof FormData // Controlla se stiamo mandando un FormData (es. file upload)

    const response = await fetch(url, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" }, // Se non è FormData, serve l'header JSON
      body: isFormData ? data : JSON.stringify(data), // Converte in JSON se serve, oppure manda direttamente il FormData
      ...options,
    })
    return handleResponse(response) // Gestione centralizzata della risposta
  },

  // Metodo PUT: simile al POST, ma usato per aggiornamenti
  async put(url: string, data?: any, options?: RequestInit) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Manda sempre i dati come JSON
      },
      body: JSON.stringify(data),
      ...options,
    })
    return handleResponse(response)
  },

  // Metodo DELETE: elimina una risorsa, non ha body per default
  async delete(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      method: "DELETE",
      ...options,
    })
    return handleResponse(response)
  },
}
