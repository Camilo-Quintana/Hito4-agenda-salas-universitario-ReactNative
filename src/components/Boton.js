// Botón de la app. Variantes: primario (burdeo), secundario (borde) y peligro (rojo).
// Con "cargando" muestra un indicador y no se puede presionar dos veces.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colores, radio } from '../theme'

const VARIANTES = {
  primario: { fondo: colores.primario, texto: colores.blanco, borde: colores.primario },
  secundario: { fondo: colores.blanco, texto: colores.primario, borde: colores.primario },
  peligro: { fondo: colores.peligro, texto: colores.blanco, borde: colores.peligro },
  peligroSecundario: { fondo: colores.blanco, texto: colores.peligro, borde: colores.peligro },
}

export default function Boton({ titulo, onPress, variante = 'primario', icono, cargando = false, deshabilitado = false, estilo }) {
  const v = VARIANTES[variante]
  const inactivo = deshabilitado || cargando
  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: v.fondo, borderColor: v.borde },
        inactivo && styles.inactivo,
        pressed && styles.presionado,
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={v.texto} />
      ) : (
        <View style={styles.contenido}>
          {icono && <Ionicons name={icono} size={20} color={v.texto} />}
          <Text style={[styles.texto, { color: v.texto }]}>{titulo}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  // 48 de alto: tamaño mínimo cómodo para tocar con el dedo
  boton: { minHeight: 48, borderRadius: radio, borderWidth: 1.5, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  contenido: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  texto: { fontSize: 16, fontWeight: '600' },
  inactivo: { opacity: 0.55 },
  presionado: { opacity: 0.8 },
})
