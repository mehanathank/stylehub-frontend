import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'error' ? '#c0392b' : t.type === 'info' ? '#2980b9' : '#27ae60',
            color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontFamily: 'Poppins,sans-serif',
            animation: 'fadeIn 0.25s ease', minWidth: 220, maxWidth: 320
          }}>
            {t.msg}
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
