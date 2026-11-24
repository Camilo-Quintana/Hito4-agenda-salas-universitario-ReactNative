// Estados de interfaz que se repiten: cargando, error (con reintento), sin resultados y aviso.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Boton from './Boton'
import { colores, radio } from '../theme'

export function Cargando({ texto = 'Cargando…' }) {
  return (
    <View style={styles.centro} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colores.primario} />
      <Text style={styles.textoSuave}>{texto}</Text>
    </View>
  )
}

export function MensajeError({ error, onReintentar }) {
  const sinConexion = error?.status === 0
  return (
    <View style={styles.centro}>
      <Ionicons name={sinConexion ? 'cloud-offline-outline' : 'alert-circle-outline'} size={48} color={colores.peligro} />
      <Text style={styles.titulo}>{sinConexion ? 'Sin conexión con la API' : 'No se pudo cargar'}</Text>
      <Text style={styles.textoSuave}>{error?.message ?? 'Ocurrió un error inesperado.'}</Text>
      {onReintentar && <Boton titulo="Reintentar" icono="refresh" variante="secundario" onPress={onReintentar} estilo={styles.boton} />}
    </View>
  )
}

export function MensajeVacio({ icono = 'search-outline', titulo, texto, accion }) {
  return (
    <View style={styles.centro}>
      <Ionicons name={icono} size={48} color={colores.ocupado} />
      <Text style={styles.titulo}>{titulo}</Text>
      {texto ? <Text style={styles.textoSuave}>{texto}</Text> : null}
      {accion}
    </View>
  )
}

// Aviso en línea: tipo "error", "exito", "info" o "aviso"
const TIPOS_AVISO = {
  error: { color: colores.peligro, fondo: colores.peligroClaro, icono: 'alert-circle' },
  exito: { color: colores.exito, fondo: colores.exitoClaro, icono: 'checkmark-circle' },
  aviso: { color: colores.aviso, fondo: colores.avisoClaro, icono: 'information-circle' },
  info: { color: colores.primario, fondo: colores.primarioSuave, icono: 'information-circle' },
}

export function Aviso({ tipo = 'info', children, estilo }) {
  const t = TIPOS_AVISO[tipo]
  return (
    <View style={[styles.aviso, { backgroundColor: t.fondo, borderColor: t.color }, estilo]} accessibilityLiveRegion="polite">
      <Ionicons name={t.icono} size={20} color={t.color} />
      <Text style={[styles.textoAviso, { color: t.color }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10, minHeight: 280 },
  titulo: { fontSize: 18, fontWeight: '700', color: colores.texto, textAlign: 'center' },
  textoSuave: { fontSize: 15, color: colores.textoSuave, textAlign: 'center' },
  boton: { marginTop: 8, minWidth: 160 },
  aviso: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: radio, borderWidth: 1, alignItems: 'flex-start' },
  textoAviso: { flex: 1, fontSize: 14, lineHeight: 20 },
})
