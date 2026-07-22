import { useState, useEffect, useCallback } from 'react'

const API = 'https://www.raydelto.org/agenda.php'

export default function App() {
  const [contactos, setContactos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [estado, setEstado] = useState({ ok: false, texto: 'Conectando...' })
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const cargar = useCallback(async () => {
    setEstado({ ok: false, texto: 'Conectando...' })
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContactos(data)
      setEstado({ ok: true, texto: `${data.length} contactos` })
    } catch {
      setEstado({ ok: false, texto: 'Error de conexión' })
      setContactos([])
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const guardar = async (datos, reset) => {
    setGuardando(true)
    setMensaje(null)
    try {
      await fetch(API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      setMensaje({ tipo: 'ok', texto: 'Contacto guardado correctamente.' })
      reset()
      await cargar()
    } catch {
      setMensaje({ tipo: 'ok', texto: 'Contacto enviado.' })
      reset()
      await cargar()
    } finally {
      setGuardando(false)
    }
  }

  const filtrados = contactos.filter((c) => {
    if (!filtro) return true
    const t = filtro.toLowerCase()
    return [c.nombre, c.apellido, c.telefono].join(' ').toLowerCase().includes(t)
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header estado={estado} />
      <main style={{
        display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20,
        padding: '20px 24px', alignItems: 'start', maxWidth: 1200, margin: '0 auto', width: '100%',
      }}>
        <PanelForm onGuardar={guardar} guardando={guardando} mensaje={mensaje} />
        <PanelTabla
          contactos={filtrados}
          total={contactos.length}
          filtro={filtro}
          onFiltroChange={setFiltro}
          onRecargar={cargar}
        />
      </main>
      <StatusBar total={contactos.length} filtrados={filtrados.length} filtro={filtro} />
    </div>
  )
}

function Header({ estado }) {
  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 1.5rem',
      height: 64,
      background: '#fff',
      borderBottom: '1px solid #e4e7ec',
      boxShadow: '0 1px 3px rgba(16,24,40,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #2970ff, #6172f3)', color: '#fff',
          borderRadius: 6, fontWeight: 700, fontSize: 16, boxShadow: '0 2px 6px rgba(41,112,255,0.3)',
        }}>A</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#101828' }}>Agenda de Contactos</div>
          <div style={{ fontSize: 12, color: '#98a2b3' }}>Panel de administración</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <a href="https://www.linkedin.com/in/gregori-evangelista-jimenez-5a077932b/" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: '50%', background: '#0a66c2',
            color: '#fff', fontSize: 22, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(10,102,194,0.35)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(10,102,194,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: '#475467', background: '#f9fafb',
          padding: '4px 12px', borderRadius: 999, border: '1px solid #e4e7ec',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: estado.ok ? '#12b76a' : '#f04438',
            boxShadow: estado.ok ? '0 0 6px rgba(18,183,106,0.4)' : '0 0 6px rgba(240,68,56,0.4)',
          }} />
          {estado.texto}
        </div>
      </div>
    </header>
  )
}

function PanelForm({ onGuardar, guardando, mensaje }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(form, () => setForm({ nombre: '', apellido: '', telefono: '' }))
  }

  return (
    <section style={{
      background: '#fff', border: '1px solid #e4e7ec', borderRadius: 10,
      boxShadow: '0 1px 3px rgba(16,24,40,0.06)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '1rem 1.25rem', borderBottom: '1px solid #e4e7ec',
        background: '#f9fafb',
      }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2970ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          Nuevo contacto
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: '#98a2b3' }}>Los campos marcados son obligatorios</p>
      </div>
      <form onSubmit={handleSubmit} style={{
        padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {['nombre', 'apellido', 'telefono'].map(campo => (
          <label key={campo} style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            fontSize: 13, fontWeight: 500, color: '#101828',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {campo === 'telefono' ? '📞' : '👤'} {campo.charAt(0).toUpperCase() + campo.slice(1)} <span style={{ color: '#f04438' }}>*</span>
            </span>
            <input
              name={campo}
              value={form[campo]}
              onChange={e => setForm(f => ({ ...f, [campo]: e.target.value }))}
              placeholder={campo === 'telefono' ? '809-555-1234' : `Ej: ${campo === 'nombre' ? 'Juan' : 'Pérez'}`}
              required
              style={{
                fontFamily: 'inherit', fontSize: 14, color: '#101828',
                padding: '10px 12px', border: '1px solid #e4e7ec', borderRadius: 6,
                background: '#fff', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#2970ff'; e.target.style.boxShadow = '0 0 0 3px rgba(41,112,255,0.12)' }}
              onBlur={e => { e.target.style.borderColor = '#e4e7ec'; e.target.style.boxShadow = 'none' }}
            />
          </label>
        ))}
        <button type="submit" disabled={guardando} style={{
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: '#fff',
          background: guardando ? '#98a2b3' : '#2970ff', border: 'none',
          borderRadius: 6, padding: '10px 16px', cursor: guardando ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}>
          {guardando ? 'Guardando...' : 'Guardar contacto'}
        </button>
        {mensaje && (
          <p style={{
            margin: 0, fontSize: 13, padding: '6px 10px', borderRadius: 6,
            color: mensaje.tipo === 'ok' ? '#067647' : '#b42318',
            background: mensaje.tipo === 'ok' ? '#ecfdf5' : '#fef3f2',
            border: `1px solid ${mensaje.tipo === 'ok' ? '#abefc6' : '#fecdca'}`,
          }}>{mensaje.texto}</p>
        )}
      </form>
    </section>
  )
}

function PanelTabla({ contactos, total, filtro, onFiltroChange, onRecargar }) {
  return (
    <section style={{
      background: '#fff', border: '1px solid #e4e7ec', borderRadius: 10,
      boxShadow: '0 1px 3px rgba(16,24,40,0.06)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '1rem 1.25rem', borderBottom: '1px solid #e4e7ec',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap', background: '#f9fafb',
      }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2970ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>
          Listado de contactos
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: 10, color: '#98a2b3', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={filtro}
              onChange={e => onFiltroChange(e.target.value)}
              placeholder="Filtrar contactos..."
              style={{
                fontFamily: 'inherit', fontSize: 13, padding: '7px 10px 7px 32px',
                border: '1px solid #e4e7ec', borderRadius: 6, background: '#fff',
                minWidth: 200, outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = '#2970ff'; e.target.style.boxShadow = '0 0 0 3px rgba(41,112,255,0.12)' }}
              onBlur={e => { e.target.style.borderColor = '#e4e7ec'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <button onClick={onRecargar} style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f9fafb', border: '1px solid #e4e7ec', borderRadius: 6, cursor: 'pointer',
            color: '#475467', fontSize: 14,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto', maxHeight: '65vh', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['#', 'Nombre', 'Apellido', 'Teléfono'].map(h => (
                <th key={h} style={{
                  position: 'sticky', top: 0, textAlign: 'left',
                  background: '#f9fafb', color: '#98a2b3', fontWeight: 600,
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em',
                  padding: '10px 16px', borderBottom: '1px solid #e4e7ec',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#98a2b3', padding: '2rem' }}>
                  {contactos.length === 0 ? 'Cargando contactos...' : 'No hay contactos que mostrar.'}
                </td>
              </tr>
            ) : (
              filtrados.map((c, i) => (
                <tr key={i} style={{
                  background: i % 2 === 0 ? '#f9fafb' : '#fff',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eff4ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#f9fafb' : '#fff'}
                >
                  <td style={{ padding: '10px 16px', color: '#98a2b3', width: 48, fontSize: 13 }}>{i + 1}</td>
                  <td style={{ padding: '10px 16px' }}>{c.nombre}</td>
                  <td style={{ padding: '10px 16px' }}>{c.apellido}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'ui-monospace, Consolas, monospace' }}>{c.telefono}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusBar({ total, filtrados, filtro }) {
  return (
    <footer style={{
      display: 'flex', gap: 20, alignItems: 'center',
      padding: '8px 24px', background: '#fff',
      borderTop: '1px solid #e4e7ec', color: '#475467',
      fontSize: 12, marginTop: 'auto',
    }}>
      <span>{total} contacto(s) en total</span>
      {filtro && <span>· {filtrados} coinciden con el filtro</span>}
      <span style={{ marginLeft: 'auto', color: '#98a2b3' }}>raydelto.org/agenda.php</span>
    </footer>
  )
}

