export async function fetchLogin(username: string, password: string) {
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    throw new Error(`Errore: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
