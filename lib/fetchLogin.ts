export async function fetchLogin(username: string, password: string) {
  const formData = new FormData()
  formData.append("username", username)
  formData.append("password", password)

  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
