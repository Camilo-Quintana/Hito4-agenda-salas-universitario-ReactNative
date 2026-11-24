// Dirección base de la API del Hito 3 (la misma que usa la aplicación web).
//
// Orden en que se elige:
// 1. La variable EXPO_PUBLIC_API_URL del archivo mobile/.env (si existe). Ejemplo:
//      EXPO_PUBLIC_API_URL=http://192.168.1.15:3000/api
// 2. La IP del computador que está corriendo "npx expo start" (sirve en Expo Go y en el emulador),
//    con el puerto de la API (EXPO_PUBLIC_API_PORT, por defecto 3000).
// 3. Si no se puede saber: 10.0.2.2 en el emulador de Android (así llega al computador) o localhost en iOS.
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const PUERTO_API = process.env.EXPO_PUBLIC_API_PORT ?? '3000'

function ipDelServidorExpo() {
  // hostUri viene como "192.168.1.15:8081" cuando la app se abre desde el servidor de desarrollo
  const hostUri = Constants.expoConfig?.hostUri
  if (!hostUri) return null
  const ip = hostUri.split(':')[0]
  // con "--tunnel" el host es un dominio de Expo, no el computador: ahí no sirve
  if (!ip || ip.endsWith('.exp.direct')) return null
  return ip
}

function calcularUrlBase() {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')
  const ip = ipDelServidorExpo()
  if (ip) return `http://${ip}:${PUERTO_API}/api`
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
  return `http://${host}:${PUERTO_API}/api`
}

export const URL_API = calcularUrlBase()

/** Segundos que se espera una respuesta antes de mostrar el error de conexión */
export const TIEMPO_ESPERA_MS = 12000

/** Días hacia adelante que se pueden reservar (la API usa 7) */
export const DIAS_ANTICIPACION = 7

/** Usuario de prueba que carga el script de datos del Hito 3 */
export const CUENTA_DEMO = { correo: 'demo@uandresbello.edu', password: 'Demo1234' }
