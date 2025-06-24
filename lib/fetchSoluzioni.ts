export async function getSuggerimenti(lavoroPath: string, dizionarioPath: string, colonna: string, foglio: string) {
  const res = await fetch("http://localhost:8000/api/soluzioni/suggerimenti", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lavoroPath, dizionarioPath, colonna, foglio }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function applicaSostituzioni(
  lavoroPath: string,
  dizionarioPath: string,
  colonna: string,
  foglio: string,
  sostituzioni: any,
) {
  const res = await fetch("http://localhost:8000/api/soluzioni/applica-sostituzioni", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lavoroPath, dizionarioPath, colonna, foglio, sostituzioni }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function validaSostituzioni(
  lavoroPath: string,
  dizionarioPath: string,
  colonna: string,
  foglio: string,
  sostituzioni: any,
) {
  const res = await fetch("http://localhost:8000/api/soluzioni/applica-sostituzioni/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lavoroPath, dizionarioPath, colonna, foglio, sostituzioni }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
