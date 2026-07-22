const HEADERS = ['#', 'Nombre', 'Apellido', 'Teléfono']

export default function ContactTable({ contactos, total, filtro, onFiltroChange, onRecargar, loading }) {
  return (
    <section className="panel">
      <div className="panel-head between">
        <h2 className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2970ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          </svg>
          Listado de contactos
        </h2>
        <TableActions filtro={filtro} onFiltroChange={onFiltroChange} onRecargar={onRecargar} />
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {HEADERS.map(h => <th key={h} className="table-th">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="table-empty">
                  Cargando contactos...
                </td>
              </tr>
            ) : contactos.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty">
                  No hay contactos que mostrar.
                </td>
              </tr>
            ) : (
              contactos.map((c, i) => (
                <tr key={i} className="table-row" style={{ background: i % 2 === 0 ? '#f9fafb' : '#fff' }}>
                  <td className="table-id">{i + 1}</td>
                  <td className="table-cell">{c.nombre}</td>
                  <td className="table-cell">{c.apellido}</td>
                  <td className="table-cell mono">{c.telefono}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TableActions({ filtro, onFiltroChange, onRecargar }) {
  return (
    <div className="table-actions">
      <div className="search-wrap">
        <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={filtro}
          onChange={e => onFiltroChange(e.target.value)}
          placeholder="Filtrar contactos..."
          className="search-input"
        />
      </div>
      <button onClick={onRecargar} className="btn-icon" title="Recargar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      </button>
    </div>
  )
}