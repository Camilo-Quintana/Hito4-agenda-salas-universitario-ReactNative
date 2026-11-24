// Fechas como texto "AAAA-MM-DD", igual que en la API y en la web (utils/fechas.js)
import { DIAS_ANTICIPACION } from '../config'

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// Date -> "AAAA-MM-DD"
export function aTextoFecha(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// "AAAA-MM-DD" -> Date a medianoche (new Date("AAAA-MM-DD") lo tomaría en UTC y en Chile quedaría el día anterior)
export function aFecha(texto) {
  const [anio, mes, dia] = texto.split('-').map(Number)
  return new Date(anio, mes - 1, dia)
}

export function sumarDias(texto, dias) {
  const base = aFecha(texto)
  return aTextoFecha(new Date(base.getFullYear(), base.getMonth(), base.getDate() + dias))
}

export function fechaHoy() {
  return aTextoFecha(new Date())
}

// Hoy y los 7 días siguientes, que son los que la API permite reservar
export function fechasReservables() {
  const hoy = fechaHoy()
  return Array.from({ length: DIAS_ANTICIPACION + 1 }, (_, i) => sumarDias(hoy, i))
}

// Se arma a mano (no con toLocaleDateString) porque Android no siempre trae los textos en español
// "2026-11-24" -> { dia: 'mar', numero: 24, mes: 'nov' }
export function partesFecha(texto) {
  const fecha = aFecha(texto)
  return { dia: DIAS[fecha.getDay()], numero: fecha.getDate(), mes: MESES[fecha.getMonth()] }
}

// "2026-11-24" -> "martes 24 de noviembre"
export function formatearFechaLarga(texto) {
  const fecha = aFecha(texto)
  return `${DIAS_LARGOS[fecha.getDay()]} ${fecha.getDate()} de ${MESES_LARGOS[fecha.getMonth()]}`
}

// "2026-11-24" -> "Hoy", "Mañana" o "mar 24 nov"
export function formatearFechaRelativa(texto) {
  const hoy = fechaHoy()
  if (texto === hoy) return 'Hoy'
  if (texto === sumarDias(hoy, 1)) return 'Mañana'
  if (texto === sumarDias(hoy, -1)) return 'Ayer'
  const { dia, numero, mes } = partesFecha(texto)
  return `${dia} ${numero} ${mes}`
}

// Fecha y hora de un evento (ISO) -> "24 nov 2026, 14:05"
export function formatearFechaHora(valor) {
  const fecha = new Date(valor)
  const hora = `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}, ${hora}`
}

// "08:00-09:00" -> "08:00 - 09:00"
export function formatearBloque(bloque) {
  return bloque.replace('-', ' - ')
}
