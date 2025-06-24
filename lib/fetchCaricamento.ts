export async function uploadFile(formData: FormData) {
  const res = await fetch("http://localhost:8000/api/caricamento", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getFiles() {
  const res = await fetch("http://localhost:8000/api/caricamento", {
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

export async function deleteFile(fileId: string) {
  const res = await fetch(`http://localhost:8000/api/caricamento/${fileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function selectFile(fileId: string, selected = true) {
  const res = await fetch(`http://localhost:8000/api/caricamento/${fileId}/select`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selected }),
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
