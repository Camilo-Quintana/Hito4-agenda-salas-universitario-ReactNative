// Una función por cada endpoint de la API que usa la aplicación móvil.
// Las pantallas llaman a estas funciones y nunca usan fetch directamente.
import { api } from './api'

export const authApi = {
  // POST /api/auth/login -> { token, usuario }
  ingresar: (correo, password) => api.crear('/auth/login', { correo, password }),
  // GET /api/auth/yo -> datos del usuario con sesión
  yo: () => api.obtener('/auth/yo'),
}

export const edificiosApi = {
  // GET /api/edificios -> [{ id, codigo, nombre, pisos, totalEspacios, ... }]
  listar: (signal) => api.obtener('/edificios', undefined, signal),
}

export const espaciosApi = {
  // GET /api/espacios?q&tipo&edificioId&fecha -> con "fecha", cada espacio trae "bloquesLibres"
  listar: (filtros, signal) => api.obtener('/espacios', filtros, signal),
  // GET /api/espacios/:id -> detalle con edificio y equipamiento
  obtener: (id, signal) => api.obtener(`/espacios/${id}`, undefined, signal),
  // GET /api/espacios/:id/disponibilidad?fecha -> { bloques: [{ bloque, estado: libre|ocupado|pasado }] }
  disponibilidad: (id, fecha, signal) => api.obtener(`/espacios/${id}/disponibilidad`, { fecha }, signal),
}

export const reservasApi = {
  // POST /api/reservas -> la reserva creada (aprobada, o pendiente si el espacio requiere aprobación)
  crear: (datos) => api.crear('/reservas', datos),
  // GET /api/reservas/mias?vista=activas|historial
  mias: (vista, signal) => api.obtener('/reservas/mias', { vista }, signal),
  // GET /api/reservas/:id
  obtener: (id, signal) => api.obtener(`/reservas/${id}`, undefined, signal),
  // GET /api/reservas/:id/historial -> eventos guardados en MongoDB
  historial: (id, signal) => api.obtener(`/reservas/${id}/historial`, undefined, signal),
  // PATCH /api/reservas/:id/cancelar
  cancelar: (id, observacion) => api.actualizar(`/reservas/${id}/cancelar`, observacion ? { observacion } : {}),
}
