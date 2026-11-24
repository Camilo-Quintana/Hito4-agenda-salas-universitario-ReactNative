// Textos que se repiten en varias pantallas (los mismos de la web)

// 1 -> "1 persona", 40 -> "40 personas"
export function textoCapacidad(cantidad) {
  return `${cantidad} ${cantidad === 1 ? 'persona' : 'personas'}`
}

// { nombre: 'Computadoras', cantidad: 40 } -> "Computadoras (40)"
export function textoEquipo(equipo) {
  return equipo.cantidad > 1 ? `${equipo.nombre} (${equipo.cantidad})` : equipo.nombre
}

// "Edificio A · Piso 2"
export function textoUbicacion(espacio) {
  return `Edificio ${espacio.edificio.codigo} · Piso ${espacio.piso}`
}

export const TIPOS_ESPACIO = ['Clases', 'Laboratorio', 'Reunión', 'Estudio', 'Exterior']

// Nombre legible de los eventos de la bitácora de MongoDB que puede tener una reserva
export const TEXTO_EVENTO = {
  'reserva.creada': 'Reserva solicitada',
  'reserva.aprobada': 'Reserva aprobada',
  'reserva.rechazada': 'Reserva rechazada',
  'reserva.cancelada': 'Reserva cancelada',
}

export const TEXTO_TEMPORAL = {
  proxima: 'Próxima',
  'en-curso': 'En curso',
  finalizada: 'Finalizada',
}
