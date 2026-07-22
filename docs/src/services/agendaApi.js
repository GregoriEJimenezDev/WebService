const API_BASE = 'https://www.raydelto.org/agenda.php'

export async function fetchContactos() {
  const response = await fetch(API_BASE)
  if (!response.ok) throw new Error('Error al obtener contactos')
  return response.json()
}

export async function createContacto(contacto) {
  await fetch(API_BASE, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contacto),
  })
}