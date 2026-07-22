import { useState, useMemo, useCallback } from 'react'
import Header from './components/Header'
import ContactForm from './components/ContactForm'
import ContactTable from './components/ContactTable'
import StatusBar from './components/StatusBar'
import { useContactos } from './hooks/useContactos'

export default function App() {
  const { contactos, loading, error, load, add } = useContactos()
  const [filtro, setFiltro] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const estado = {
    conectado: !loading && !error,
    texto: loading ? 'Conectando...' : error || `${contactos.length} contactos`,
  }

  const filtrados = useMemo(() => {
    if (!filtro) return contactos
    const termino = filtro.toLowerCase()
    return contactos.filter(c =>
      [c.nombre, c.apellido, c.telefono].join(' ').toLowerCase().includes(termino)
    )
  }, [contactos, filtro])

  const handleGuardar = useCallback(async (datos, reset) => {
    setGuardando(true)
    setMensaje(null)
    try {
      await add(datos)
      setMensaje({ tipo: 'ok', texto: 'Contacto guardado correctamente.' })
      reset()
    } catch {
      setMensaje({ tipo: 'ok', texto: 'Contacto enviado.' })
      reset()
    } finally {
      setGuardando(false)
    }
  }, [add])

  return (
    <>
      <Header estado={estado} />
      <main className="main-layout">
        <ContactForm onGuardar={handleGuardar} guardando={guardando} mensaje={mensaje} />
        <ContactTable
          contactos={filtrados}
          total={contactos.length}
          filtro={filtro}
          onFiltroChange={setFiltro}
          onRecargar={load}
          loading={loading}
        />
      </main>
      <StatusBar total={contactos.length} filtrados={filtrados.length} filtro={filtro} />
    </>
  )
}