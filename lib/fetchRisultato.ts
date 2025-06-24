export async function getRisultato(jobId: string) {
  const res = await fetch(`http://localhost:8000/api/risultato/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function downloadFile(jobId: string, fileType: string) {
  const res = await fetch("http://localhost:8000/api/risultato/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId, fileType }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function generaReport(jobId: string, formato = "pdf") {
  const res = await fetch(`http://localhost:8000/api/risultato/${jobId}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formato }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function salvaRisultato(jobId: string, nomeProgetto: string) {
  const res = await fetch("http://localhost:8000/api/risultato/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId, nomeProgetto }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
