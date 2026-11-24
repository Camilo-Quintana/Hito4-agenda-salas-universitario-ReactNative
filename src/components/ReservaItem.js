// Tarjeta de una reserva propia en "Mis reservas"
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import EtiquetaEstado from './EtiquetaEstado'
import { colores, radio, sombra } from '../theme'
import { formatearBloque, formatearFechaRelativa } from '../utils/fechas'

export default function ReservaItem({ reserva, onPress }) {
  const enCurso = reserva.estadoTemporal === 'en-curso' && reserva.estado === 'aprobada'
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
      accessibilityRole="button"
      accessibilityLabel={`Reserva de ${reserva.espacio.nombre}, ${formatearFechaRelativa(reserva.fecha)}, ${reserva.bloque}, ${reserva.estado}`}
    >
      <View style={styles.fecha}>
        <Text style={styles.dia}>{formatearFechaRelativa(reserva.fecha)}</Text>
        <Text style={styles.hora}>{reserva.bloque.slice(0, 5)}</Text>
      </View>
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={1}>{reserva.espacio.nombre}</Text>
        <Text style={styles.detalle}>
          {formatearBloque(reserva.bloque)} · Edificio {reserva.espacio.edificio.codigo}
        </Text>
        <View style={styles.etiquetas}>
          <EtiquetaEstado estado={reserva.estado} />
          {enCurso && <Text style={styles.enCurso}>En curso</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.ocupado} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colores.blanco, borderRadius: radio, padding: 12, ...sombra },
  presionada: { opacity: 0.85 },
  fecha: { width: 72, paddingVertical: 8, borderRadius: radio - 4, backgroundColor: colores.primarioSuave, alignItems: 'center' },
  dia: { fontSize: 12, fontWeight: '600', color: colores.primario, textAlign: 'center' },
  hora: { fontSize: 18, fontWeight: '700', color: colores.primario },
  cuerpo: { flex: 1, gap: 2 },
  nombre: { fontSize: 16, fontWeight: '700', color: colores.texto },
  detalle: { fontSize: 13, color: colores.textoSuave },
  etiquetas: { flexDirection: 'row', gap: 6, marginTop: 4, alignItems: 'center' },
  enCurso: { fontSize: 12, fontWeight: '600', color: colores.blanco, backgroundColor: colores.exito, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
})
