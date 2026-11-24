// Opción seleccionable para los filtros (tipo de espacio, edificio, vista de reservas)
import { Pressable, StyleSheet, Text } from 'react-native'
import { colores } from '../theme'

export default function Chip({ texto, activo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={[styles.chip, activo && styles.activo]}
      hitSlop={4}
    >
      <Text style={[styles.texto, activo && styles.textoActivo]}>{texto}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  activo: { backgroundColor: colores.primario, borderColor: colores.primario },
  texto: { fontSize: 14, color: colores.texto },
  textoActivo: { color: colores.blanco, fontWeight: '600' },
})
