// Validaciones del formulario antes de enviarlo. Son las mismas reglas de los DTO de la API,
// para avisar al tiro en el teléfono. La API igual vuelve a validar todo (las reglas viven en el backend).

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarIngreso({ correo, password }) {
  const errores = {}
  if (!correo.trim()) errores.correo = 'Ingresa tu correo.'
  else if (!FORMATO_CORREO.test(correo.trim())) errores.correo = 'Ingresa un correo válido (por ejemplo, nombre@uandresbello.edu).'
  if (!password) errores.password = 'Ingresa tu contraseña.'
  return errores
}

export function validarReserva({ motivo, asistentes }, capacidad) {
  const errores = {}
  const texto = motivo.trim()
  if (!texto) errores.motivo = 'Cuéntanos para qué es la reserva.'
  else if (texto.length < 5) errores.motivo = 'El motivo debe tener al menos 5 caracteres.'
  else if (texto.length > 200) errores.motivo = 'El motivo puede tener como máximo 200 caracteres.'
  if (!Number.isInteger(asistentes) || asistentes < 1) errores.asistentes = 'Debe asistir al menos 1 persona.'
  else if (asistentes > capacidad) errores.asistentes = `El espacio tiene capacidad para ${capacidad} personas.`
  return errores
}

/** Une los errores por campo que devuelve la API ({ motivo: ['...'] }) con los del formulario */
export function erroresDeApi(detalles) {
  if (!detalles) return {}
  return Object.fromEntries(Object.entries(detalles).map(([campo, mensajes]) => [campo, mensajes.join(' ')]))
}
