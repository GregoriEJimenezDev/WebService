import { useState } from 'react'

const CAMPOS = [
  { name: 'nombre', label: 'Nombre', placeholder: 'Ej: Juan', icon: '👤' },
  { name: 'apellido', label: 'Apellido', placeholder: 'Ej: Pérez', icon: '👤' },
  { name: 'telefono', label: 'Teléfono', placeholder: '809-555-1234', icon: '📞' },
]

const INITIAL_FORM = { nombre: '', apellido: '', telefono: '' }

export default function ContactForm({ onGuardar, guardando, mensaje }) {
  const [form, setForm] = useState(INITIAL_FORM)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(form, () => setForm(INITIAL_FORM))
  }

  const isDisabled = guardando

  return (
    <section className="panel">
      <div className="panel-head">
        <h2 className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2970ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" x2="19" y1="8" y2="14"/>
            <line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
          Nuevo contacto
        </h2>
        <p className="panel-desc">Los campos marcados son obligatorios</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {CAMPOS.map(({ name, label, placeholder, icon }) => (
          <label key={name} className="campo">
            <span className="campo-label">
              {icon} {label} <span className="required">*</span>
            </span>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className="campo-input"
            />
          </label>
        ))}

        <button type="submit" disabled={isDisabled} className={`btn ${isDisabled ? 'btn--disabled' : 'btn--primary'}`}>
          {isDisabled ? 'Guardando...' : 'Guardar contacto'}
        </button>

        {mensaje && (
          <p className={`mensaje mensaje--${mensaje.tipo}`}>
            {mensaje.texto}
          </p>
        )}
      </form>
    </section>
  )
}