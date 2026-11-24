// Sesión del usuario: guarda el token JWT de la API en el almacenamiento seguro del teléfono
// (ver services/almacenamiento.js), así la sesión se mantiene al cerrar y volver a abrir la app.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { almacenamiento } from '../services/almacenamiento'
import { alSesionExpirada, usarToken } from '../services/api'
import { authApi } from '../services/reservaunabApi'

const CLAVE_TOKEN = 'reservaunab.token'
const CLAVE_USUARIO = 'reservaunab.usuario'

const SesionContext = createContext(null)

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [iniciando, setIniciando] = useState(true) // leyendo la sesión guardada
  const [avisoExpirada, setAvisoExpirada] = useState(false)

  const borrarSesion = useCallback(async () => {
    usarToken(null)
    setUsuario(null)
    await Promise.all([almacenamiento.borrar(CLAVE_TOKEN), almacenamiento.borrar(CLAVE_USUARIO)])
  }, [])

  // Al abrir la app: si hay una sesión guardada, se recupera y se confirma con la API
  useEffect(() => {
    let activo = true
    async function recuperar() {
      try {
        const token = await almacenamiento.leer(CLAVE_TOKEN)
        const guardado = await almacenamiento.leer(CLAVE_USUARIO)
        if (token && guardado) {
          usarToken(token)
          if (activo) setUsuario(JSON.parse(guardado))
          // Se actualizan los datos en segundo plano. Si el token venció, la API responde 401
          // y alSesionExpirada cierra la sesión; si no hay conexión, se mantiene la sesión guardada.
          authApi.yo().then((datos) => activo && setUsuario(datos)).catch(() => {})
        }
      } finally {
        if (activo) setIniciando(false)
      }
    }
    recuperar()
    return () => {
      activo = false
    }
  }, [])

  // Si la API responde 401 con un token, la sesión venció (los tokens duran 8 horas)
  useEffect(() => {
    alSesionExpirada(() => {
      setAvisoExpirada(true)
      borrarSesion()
    })
  }, [borrarSesion])

  const ingresar = useCallback(async (correo, password) => {
    const { token, usuario: datos } = await authApi.ingresar(correo, password)
    usarToken(token)
    await almacenamiento.guardar(CLAVE_TOKEN, token)
    await almacenamiento.guardar(CLAVE_USUARIO, JSON.stringify(datos))
    setAvisoExpirada(false)
    setUsuario(datos)
  }, [])

  const valor = useMemo(
    () => ({ usuario, iniciando, avisoExpirada, ingresar, salir: borrarSesion }),
    [usuario, iniciando, avisoExpirada, ingresar, borrarSesion],
  )
  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export function useSesion() {
  return useContext(SesionContext)
}
