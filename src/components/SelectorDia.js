// Fila deslizable con hoy y los 7 días siguientes (los que la API permite reservar)
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { colores, radio } from '../theme'
import { fechaHoy, fechasReservables, partesFecha } from '../utils/fechas'

export default function SelectorDia({ fecha, onCambiar }) {
  const hoy = fechaHoy()
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fila}>
      {fechasReservables().map((opcion) => {
        const { dia, numero, mes } = partesFecha(opcion)
        const activo = opcion === fecha
        return (
          <Pressable
            key={opcion}
            onPress={() => onCambiar(opcion)}
            accessibilityRole="button"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={`${opcion === hoy ? 'Hoy, ' : ''}${dia} ${numero} de ${mes}`}
            style={[styles.dia, activo && styles.activo]}
          >
            <Text style={[styles.nombre, activo && styles.textoActivo]}>{opcion === hoy ? 'Hoy' : dia}</Text>
            <Text style={[styles.numero, activo && styles.textoActivo]}>{numero}</Text>
            <Text style={[styles.mes, activo && styles.textoActivo]}>{mes}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  fila: { gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  dia: {
    width: 58,
    paddingVertical: 8,
    borderRadius: radio,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
    alignItems: 'center',
  },
  activo: { backgroundColor: colores.primario, borderColor: colores.primario },
  nombre: { fontSize: 12, color: colores.textoSuave, textTransform: 'capitalize' },
  numero: { fontSize: 20, fontWeight: '700', color: colores.texto },
  mes: { fontSize: 12, color: colores.textoSuave },
  textoActivo: { color: colores.blanco },
})
