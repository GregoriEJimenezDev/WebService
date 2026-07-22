export default function StatusBar({ total, filtrados, filtro }) {
  return (
    <footer className="statusbar">
      <span>{total} contacto(s) en total</span>
      {filtro && <span className="statusbar-filtro">· {filtrados} coinciden con el filtro</span>}
      <span className="statusbar-fuente">raydelto.org/agenda.php</span>
    </footer>
  )
}