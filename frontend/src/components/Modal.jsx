import { useEffect } from 'react'

export default function Modal({ titulo, children, onCerrar }) {
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && onCerrar?.()
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [onCerrar])

  return (
    <div className="modal" role="presentation" onClick={onCerrar}>
      <div className="modal__caja" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <span className="modal__asa" aria-hidden="true" />
        <h2 className="modal__titulo">{titulo}</h2>
        {children}
      </div>
    </div>
  )
}
