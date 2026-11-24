// Cliente HTTP de la API del Hito 3. Es el mismo enfoque que services/api.js de la web:
// todas las pantallas pasan por aquí, que agrega el token, arma la URL, espera un tiempo máximo
// y convierte cualquier error en un ErrorApi con un mensaje listo para mostrar.
import { URL_API, TIEMPO_ESPERA_MS } from '../config'

export class ErrorApi extends Error {
  constructor(status, mensaje, detalles = null) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.status = status // 0 = no hubo respuesta del servidor
    this.detalles = detalles // errores por campo cuando falla la validación: { motivo: ['...'] }
  }
}

// El token lo guarda el contexto de sesión; aquí solo se mantiene en memoria para las peticiones
let tokenActual = null
let alExpirarSesion = () => {}

export function usarToken(token) {
  tokenActual = token
}

/** El contexto de sesión registra qué hacer si la API responde 401 (token vencido) */
export function alSesionExpirada(funcion) {
  alExpirarSesion = funcion
}

function armarUrl(ruta, consulta) {
  const partes = Object.entries(consulta ?? {})
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([clave, valor]) => `${encodeURIComponent(clave)}=${encodeURIComponent(String(valor))}`)
  return `${URL_API}${ruta}${partes.length ? `?${partes.join('&')}` : ''}`
}

export async function pedir(ruta, { metodo = 'GET', cuerpo, consulta, signal } = {}) {
  const cabeceras = { Accept: 'application/json' }
  if (tokenActual) cabeceras.Authorization = `Bearer ${tokenActual}`
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'

  // Tiempo máximo de espera: si la IP de la API está mal, fetch puede quedarse colgado mucho rato
  const control = new AbortController()
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS)
  const cancelarDesdeAfuera = () => control.abort()
  signal?.addEventListener('abort', cancelarDesdeAfuera)

  let respuesta
  try {
    respuesta = await fetch(armarUrl(ruta, consulta), {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: control.signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error // la pantalla canceló la petición a propósito (se desmontó)
    throw new ErrorApi(
      0,
      'No se pudo conectar con el servidor. Revisa tu conexión y que la API esté encendida.',
    )
  } finally {
    clearTimeout(temporizador)
    signal?.removeEventListener('abort', cancelarDesdeAfuera)
  }

  if (respuesta.status === 204) return null
  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    // token vencido o inválido: se cierra la sesión para que la app pida ingresar de nuevo
    if (respuesta.status === 401 && tokenActual) alExpirarSesion()
    throw new ErrorApi(
      respuesta.status,
      datos?.mensaje ?? `El servidor respondió con el código ${respuesta.status}.`,
      datos?.detalles ?? null,
    )
  }
  return datos
}

export const api = {
  obtener: (ruta, consulta, signal) => pedir(ruta, { consulta, signal }),
  crear: (ruta, cuerpo) => pedir(ruta, { metodo: 'POST', cuerpo }),
  actualizar: (ruta, cuerpo) => pedir(ruta, { metodo: 'PATCH', cuerpo }),
}
