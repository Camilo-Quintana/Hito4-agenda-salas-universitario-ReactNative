// Detalle de una reserva propia, su línea de tiempo (eventos de MongoDB) y la opción de cancelarla.
// Usa GET /api/reservas/:id, GET /api/reservas/:id/historial y PATCH /api/reservas/:id/cancelar
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import EtiquetaEstado from '../components/EtiquetaEstado'
import Boton from '../components/Boton'
import Campo from '../components/Campo'
import { Aviso, Cargando, MensajeError } from '../components/Estados'
import { useConsulta } from '../hooks/useConsulta'
import { reservasApi } from '../services/reservaunabApi'
import { colores, radio, sombra, tipografia } from '../theme'
import { formatearBloque, formatearFechaHora, formatearFechaLarga } from '../utils/fechas'
import { TEXTO_EVENTO, TEXTO_TEMPORAL } from '../utils/textos'
import { confirmar } from '../utils/confirmar'

export default function DetalleReservaScreen({ route }) {
  const { id } = route.params
  const reserva = useConsulta((signal) => reservasApi.obtener(id, signal), [id])
  const historial = useConsulta((signal) => reservasApi.historial(id, signal), [id])

  const [cancelando, setCancelando] = useState(false) // se muestra el formulario de cancelación
  const [observacion, setObservacion] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null) // { tipo, texto }

  if (reserva.cargando) return <Cargando texto="Cargando reserva…" />
  if (reserva.error) return <MensajeError error={reserva.error} onReintentar={reserva.recargar} />

  const datos = reserva.datos
  // Misma regla que la API: se cancela si está pendiente o aprobada y todavía no empieza
  const sePuedeCancelar = ['pendiente', 'aprobada'].includes(datos.estado) && datos.estadoTemporal === 'proxima'

  function confirmarCancelacion() {
    confirmar({
      titulo: '¿Cancelar la reserva?',
      mensaje: `${datos.espacio.nombre}, ${formatearFechaLarga(datos.fecha)}, ${formatearBloque(datos.bloque)}. El horario quedará libre para otras personas.`,
      textoCancelar: 'No, mantener',
      textoAceptar: 'Sí, cancelar',
      alAceptar: cancelar,
    })
  }

  async function cancelar() {
    setEnviando(true)
    setMensaje(null)
    try {
      await reservasApi.cancelar(id, observacion.trim())
      setCancelando(false)
      setObservacion('')
      setMensaje({ tipo: 'exito', texto: 'La reserva fue cancelada y el horario quedó libre.' })
      reserva.actualizarSilencioso()
      historial.actualizarSilencioso()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  function refrescar() {
    reserva.refrescar()
    historial.refrescar()
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView
        style={styles.pantalla}
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={reserva.refrescando} onRefresh={refrescar} colors={[colores.primario]} tintColor={colores.primario} />}
      >
        {mensaje && <Aviso tipo={mensaje.tipo}>{mensaje.texto}</Aviso>}

        <View style={styles.tarjeta}>
          <View style={styles.encabezado}>
            <Text style={styles.numero}>Reserva N° {datos.id}</Text>
            <EtiquetaEstado estado={datos.estado} />
          </View>
          <Text style={styles.nombre}>{datos.espacio.nombre}</Text>
          <Fila icono="business-outline" texto={`${datos.espacio.tipo} · Edificio ${datos.espacio.edificio.codigo} · Piso ${datos.espacio.piso}`} />
          <Fila icono="calendar-outline" texto={formatearFechaLarga(datos.fecha)} />
          <Fila icono="time-outline" texto={`${formatearBloque(datos.bloque)} · ${TEXTO_TEMPORAL[datos.estadoTemporal]}`} />
          <Fila icono="people-outline" texto={`${datos.asistentes} ${datos.asistentes === 1 ? 'asistente' : 'asistentes'}`} />
          <Fila icono="chatbubble-ellipses-outline" texto={datos.motivo} />
          {datos.observacion && (
            <Aviso tipo={datos.estado === 'rechazada' ? 'error' : 'info'}>
              {datos.estado === 'rechazada' ? 'Motivo del rechazo: ' : 'Observación: '}
              {datos.observacion}
            </Aviso>
          )}
          {datos.estado === 'pendiente' && <Aviso tipo="aviso">Esperando la revisión de administración.</Aviso>}
        </View>

        {sePuedeCancelar &&
          (cancelando ? (
            <View style={styles.tarjeta}>
              <Text style={styles.subtitulo}>Cancelar reserva</Text>
              <Campo
                etiqueta="Motivo (opcional)"
                value={observacion}
                onChangeText={setObservacion}
                placeholder="Ej.: Se cambió la fecha de la reunión"
                multiline
                maxLength={300}
                ayuda={`${observacion.length}/300 caracteres`}
              />
              <Boton titulo="Cancelar reserva" variante="peligro" icono="close-circle-outline" onPress={confirmarCancelacion} cargando={enviando} />
              <Boton titulo="Volver" variante="secundario" onPress={() => setCancelando(false)} deshabilitado={enviando} />
            </View>
          ) : (
            <Boton titulo="Cancelar esta reserva" variante="peligroSecundario" icono="close-circle-outline" onPress={() => setCancelando(true)} />
          ))}

        <View style={styles.tarjeta}>
          <Text style={styles.subtitulo}>Historial de la reserva</Text>
          {historial.cargando ? (
            <Text style={styles.suave}>Cargando historial…</Text>
          ) : historial.error ? (
            <Text style={styles.suave}>No se pudo cargar el historial. Desliza hacia abajo para reintentar.</Text>
          ) : historial.datos.length === 0 ? (
            <Text style={styles.suave}>Sin eventos registrados.</Text>
          ) : (
            historial.datos.map((evento, i) => (
              <View key={evento._id ?? `${evento.tipo}-${evento.fecha}`} style={styles.evento}>
                <View style={styles.linea}>
                  <View style={styles.punto} />
                  {i < historial.datos.length - 1 && <View style={styles.trazo} />}
                </View>
                <View style={styles.cuerpoEvento}>
                  <Text style={styles.tituloEvento}>{TEXTO_EVENTO[evento.tipo] ?? evento.tipo}</Text>
                  <Text style={styles.suave}>
                    {formatearFechaHora(evento.fecha)} · {evento.actor.nombre}
                  </Text>
                  {evento.datos?.observacion ? <Text style={styles.observacion}>“{evento.datos.observacion}”</Text> : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Fila({ icono, texto }) {
  return (
    <View style={styles.fila}>
      <Ionicons name={icono} size={18} color={colores.primario} />
      <Text style={styles.textoFila}>{texto}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 12, paddingBottom: 40 },
  tarjeta: { backgroundColor: colores.blanco, borderRadius: radio, padding: 16, gap: 10, ...sombra },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  numero: { ...tipografia.cuerpoChico, color: colores.textoSuave, fontVariant: ['tabular-nums'] },
  nombre: { ...tipografia.titular, color: colores.texto },
  fila: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  textoFila: { ...tipografia.cuerpo, color: colores.texto, flex: 1 },
  subtitulo: { ...tipografia.titulo, color: colores.texto },
  suave: { ...tipografia.cuerpoChico, color: colores.textoSuave },
  evento: { flexDirection: 'row', gap: 10 },
  linea: { alignItems: 'center', width: 14 },
  punto: { width: 12, height: 12, borderRadius: 6, backgroundColor: colores.primario, marginTop: 4 },
  trazo: { flex: 1, width: 2, backgroundColor: colores.borde, marginVertical: 2 },
  cuerpoEvento: { flex: 1, paddingBottom: 14 },
  tituloEvento: { ...tipografia.etiqueta, fontSize: 15, color: colores.texto },
  observacion: { ...tipografia.cuerpoChico, color: colores.texto, fontStyle: 'italic', marginTop: 2 },
})
