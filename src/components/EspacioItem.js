// Tarjeta de un espacio en el catálogo
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colores, radio, sombra, tipografia } from '../theme'
import { imagenDeEspacio } from '../utils/imagenes'
import { textoCapacidad, textoUbicacion } from '../utils/textos'

export default function EspacioItem({ espacio, onPress }) {
  const libres = espacio.bloquesLibres
  const equipos = espacio.equipamiento.slice(0, 3).map((e) => e.nombre)
  const extra = espacio.equipamiento.length - equipos.length

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
      accessibilityRole="button"
      accessibilityLabel={`${espacio.nombre}, ${espacio.tipo}, ${textoUbicacion(espacio)}, ${textoCapacidad(espacio.capacidad)}`}
    >
      <Image source={imagenDeEspacio(espacio)} style={styles.imagen} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={2}>{espacio.nombre}</Text>
        <Text style={styles.detalle} numberOfLines={1}>{espacio.tipo} · {textoUbicacion(espacio)}</Text>
        <View style={styles.fila}>
          <Ionicons name="people-outline" size={15} color={colores.textoSuave} />
          <Text style={styles.detalle}>{textoCapacidad(espacio.capacidad)}</Text>
        </View>
        {equipos.length > 0 && (
          <Text style={styles.detalle} numberOfLines={1}>
            {equipos.join(' · ')}{extra > 0 ? ` +${extra}` : ''}
          </Text>
        )}
        <View style={styles.etiquetas}>
          {libres !== undefined && (
            <Text style={[styles.pastilla, styles.libres, libres === 0 && styles.sinLibres]}>
              {libres === 0 ? 'Sin horarios libres' : `${libres} ${libres === 1 ? 'horario libre' : 'horarios libres'}`}
            </Text>
          )}
          {espacio.requiereAprobacion && <Text style={[styles.pastilla, styles.aprobacion]}>Requiere aprobación</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.textoSuave} style={styles.flecha} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tarjeta: { flexDirection: 'row', backgroundColor: colores.blanco, borderRadius: radio, overflow: 'hidden', ...sombra },
  presionada: { opacity: 0.85 },
  imagen: { width: 96, height: '100%', minHeight: 128 },
  cuerpo: { flex: 1, paddingVertical: 12, paddingLeft: 14, paddingRight: 4, gap: 2 },
  nombre: { ...tipografia.titulo, color: colores.texto, marginBottom: 2 },
  detalle: { ...tipografia.cuerpoChico, color: colores.textoSuave },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  pastilla: { ...tipografia.etiquetaChica, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
  libres: { color: colores.exito, backgroundColor: colores.exitoClaro },
  sinLibres: { color: colores.textoSuave, backgroundColor: colores.ocupadoClaro },
  aprobacion: { color: colores.aviso, backgroundColor: colores.avisoClaro },
  flecha: { alignSelf: 'center', marginRight: 8 },
})
