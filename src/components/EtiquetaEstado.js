// Etiqueta de color con el estado de una reserva (pendiente, aprobada, rechazada o cancelada)
import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ESTADOS_RESERVA } from '../theme'

export default function EtiquetaEstado({ estado }) {
  const { texto, icono, color, fondo } = ESTADOS_RESERVA[estado] ?? ESTADOS_RESERVA.cancelada
  return (
    <View style={[styles.etiqueta, { backgroundColor: fondo }]} accessibilityLabel={`Estado: ${texto}`}>
      <Ionicons name={icono} size={14} color={color} />
      <Text style={[styles.texto, { color }]}>{texto}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  etiqueta: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  texto: { fontSize: 13, fontWeight: '600' },
})
