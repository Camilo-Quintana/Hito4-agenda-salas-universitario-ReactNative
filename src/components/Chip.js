// Opción seleccionable para los filtros (tipo de espacio, edificio, vista de reservas).
// Como los "filter chips" de Material 3: la opción elegida se rellena y muestra un check.
import { Pressable, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colores, tipografia } from '../theme'

export default function Chip({ texto, activo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={({ pressed }) => [styles.chip, activo && styles.activo, pressed && !activo && styles.presionado]}
      hitSlop={4}
    >
      {activo && <Ionicons name="checkmark" size={16} color={colores.blanco} />}
      <Text style={[styles.texto, activo && styles.textoActivo]}>{texto}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  // 40 de alto + 4 de hitSlop arriba y abajo = 48, el mínimo táctil de Android
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  activo: { backgroundColor: colores.primario, borderColor: colores.primario, paddingLeft: 10 },
  presionado: { backgroundColor: colores.primarioSuave },
  texto: { ...tipografia.etiqueta, fontWeight: '500', color: colores.texto },
  textoActivo: { color: colores.blanco, fontWeight: '600' },
})
