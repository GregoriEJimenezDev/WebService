import { useState, useEffect, useCallback } from 'react'
import { fetchContactos, createContacto } from '../services/agendaApi'

export function useContactos() {
  const [contactos, setContactos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchContactos()
      setContactos(data)
    } catch {
      setError('Error de conexión')
      setContactos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (contacto) => {
    await createContacto(contacto)
    await load()
  }

  return { contactos, loading, error, load, add }
}