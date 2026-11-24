// Colores y medidas de ReservaUNAB (los mismos de la aplicación web: burdeo y dorado)
export const colores = {
  primario: '#7a1128',
  primarioOscuro: '#4d0a19',
  primarioClaro: '#9c2c44',
  primarioSuave: '#f7e9ec',
  acento: '#d4a72c',
  acentoClaro: '#f4e6c1',
  texto: '#2b2b2b',
  textoSuave: '#6c757d',
  borde: '#e3e3e6',
  fondo: '#f5f5f7',
  blanco: '#ffffff',
  exito: '#1e8e5a',
  exitoClaro: '#dcfce7',
  peligro: '#b42318',
  peligroClaro: '#fde8e7',
  aviso: '#9a6700',
  avisoClaro: '#fff4d6',
  ocupado: '#9ca3af',
  ocupadoClaro: '#eceef1',
}

export const radio = 12

// Sombra suave para tarjetas: Android usa "elevation" e iOS las propiedades shadow*
export const sombra = {
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
}

// Colores e íconos de cada estado de reserva (iguales a la web)
export const ESTADOS_RESERVA = {
  pendiente: { texto: 'Pendiente', icono: 'hourglass-outline', color: colores.aviso, fondo: colores.avisoClaro },
  aprobada: { texto: 'Aprobada', icono: 'checkmark-circle-outline', color: colores.exito, fondo: colores.exitoClaro },
  rechazada: { texto: 'Rechazada', icono: 'close-circle-outline', color: colores.peligro, fondo: colores.peligroClaro },
  cancelada: { texto: 'Cancelada', icono: 'remove-circle-outline', color: colores.textoSuave, fondo: colores.ocupadoClaro },
}
