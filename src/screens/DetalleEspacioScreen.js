// Detalle de un espacio: datos, equipamiento y disponibilidad por bloque del día elegido.
// Usa GET /api/espacios/:id y GET /api/espacios/:id/disponibilidad?fecha
import { useState } from 'react'
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SelectorDia from '../components/SelectorDia'
import { Aviso, Cargando, MensajeError } from '../components/Estados'
import { useConsulta } from '../hooks/useConsulta'
import { useAlVolver } from '../hooks/useAlVolver'
import { espaciosApi } from '../services/reservaunabApi'
import { colores, radio, sombra } from '../theme'
import { formatearFechaLarga } from '../utils/fechas'
import { imagenDeEspacio } from '../utils/imagenes'
import { textoCapacidad, textoEquipo } from '../utils/textos'

const ESTILO_BLOQUE = {
  libre: { fondo: colores.exitoClaro, borde: colores.exito, texto: colores.exito, etiqueta: 'Libre' },
  ocupado: { fondo: colores.ocupadoClaro, borde: colores.ocupadoClaro, texto: colores.textoSuave, etiqueta: 'Ocupado' },
  pasado: { fondo: colores.fondo, borde: colores.fondo, texto: colores.ocupado, etiqueta: 'Ya pasó' },
}

export default function DetalleEspacioScreen({ route, navigation }) {
  const { id } = route.params
  const [fecha, setFecha] = useState(route.params.fecha)

  const espacio = useConsulta((signal) => espaciosApi.obtener(id, signal), [id])
  const disponibilidad = useConsulta((signal) => espaciosApi.disponibilidad(id, fecha, signal), [id, fecha])

  // Al volver desde el formulario de reserva, el bloque reservado debe aparecer ocupado
  useAlVolver(disponibilidad.actualizarSilencioso)

  if (espacio.cargando) return <Cargando texto="Cargando espacio..." />
  if (espacio.error) return <MensajeError error={espacio.error} onReintentar={espacio.recargar} />

  const datos = espacio.datos
  const bloques = disponibilidad.datos?.bloques ?? []
  const libres = bloques.filter((b) => b.estado === 'libre').length

  function elegirBloque(bloque) {
    navigation.navigate('Reservar', { espacio: datos, fecha, bloque })
  }

  function refrescar() {
    espacio.refrescar()
    disponibilidad.refrescar()
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      refreshControl={<RefreshControl refreshing={espacio.refrescando} onRefresh={refrescar} colors={[colores.primario]} tintColor={colores.primario} />}
    >
      <Image source={imagenDeEspacio(datos)} style={styles.imagen} />

      <View style={styles.seccion}>
        <Text style={styles.tipo}>{datos.tipo.toUpperCase()}</Text>
        <Text style={styles.nombre}>{datos.nombre}</Text>
        <View style={styles.datos}>
          <Dato icono="business-outline" texto={datos.edificio.nombre} />
          <Dato icono="layers-outline" texto={`Piso ${datos.piso}`} />
          <Dato icono="people-outline" texto={`Capacidad: ${textoCapacidad(datos.capacidad)}`} />
        </View>
        {datos.requiereAprobacion && (
          <Aviso tipo="aviso">Este espacio requiere aprobación: tu reserva quedará pendiente hasta que la revise administración.</Aviso>
        )}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Equipamiento</Text>
        {datos.equipamiento.length === 0 ? (
          <Text style={styles.suave}>Este espacio no tiene equipamiento registrado.</Text>
        ) : (
          <View style={styles.equipos}>
            {datos.equipamiento.map((equipo) => (
              <View key={equipo.id} style={styles.equipo}>
                <Ionicons name="checkmark" size={14} color={colores.primario} />
                <Text style={styles.textoEquipo}>{textoEquipo(equipo)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.seccion, styles.seccionSinMargen]}>
        <View style={styles.margen}>
          <Text style={styles.subtitulo}>Disponibilidad</Text>
          <Text style={styles.suave}>
            {formatearFechaLarga(fecha)}
            {disponibilidad.datos ? ` · ${libres} ${libres === 1 ? 'bloque libre' : 'bloques libres'}` : ''}
          </Text>
        </View>
        <SelectorDia fecha={fecha} onCambiar={setFecha} />

        <View style={styles.margen}>
          {disponibilidad.cargando ? (
            <Cargando texto="Revisando horarios..." />
          ) : disponibilidad.error ? (
            <MensajeError error={disponibilidad.error} onReintentar={disponibilidad.recargar} />
          ) : (
            <>
              <Text style={styles.ayuda}>Toca un bloque libre para reservarlo.</Text>
              <View style={styles.grilla}>
                {bloques.map(({ bloque, estado }) => {
                  const estilo = ESTILO_BLOQUE[estado]
                  return (
                    <Pressable
                      key={bloque}
                      disabled={estado !== 'libre'}
                      onPress={() => elegirBloque(bloque)}
                      accessibilityRole="button"
                      accessibilityLabel={`${bloque}, ${estilo.etiqueta}`}
                      accessibilityState={{ disabled: estado !== 'libre' }}
                      style={({ pressed }) => [
                        styles.bloque,
                        { backgroundColor: estilo.fondo, borderColor: estilo.borde },
                        pressed && styles.bloquePresionado,
                      ]}
                    >
                      <Text style={[styles.horaBloque, { color: estilo.texto }]}>{bloque.replace('-', ' – ')}</Text>
                      <Text style={[styles.estadoBloque, { color: estilo.texto }]}>{estilo.etiqueta}</Text>
                    </Pressable>
                  )
                })}
              </View>
              {libres === 0 && <Aviso tipo="info" estilo={styles.avisoSinLibres}>No quedan bloques libres este día. Prueba con otra fecha.</Aviso>}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

function Dato({ icono, texto }) {
  return (
    <View style={styles.dato}>
      <Ionicons name={icono} size={18} color={colores.primario} />
      <Text style={styles.textoDato}>{texto}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingBottom: 32, gap: 12 },
  imagen: { width: '100%', height: 190 },
  seccion: { backgroundColor: colores.blanco, marginHorizontal: 16, borderRadius: radio, padding: 16, gap: 10, ...sombra },
  seccionSinMargen: { paddingHorizontal: 0 },
  margen: { paddingHorizontal: 16, gap: 4 },
  tipo: { fontSize: 12, fontWeight: '700', color: colores.acento, letterSpacing: 0.5 },
  nombre: { fontSize: 24, fontWeight: '800', color: colores.texto, marginTop: -6 },
  datos: { gap: 6 },
  dato: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoDato: { fontSize: 15, color: colores.texto, flex: 1 },
  subtitulo: { fontSize: 17, fontWeight: '700', color: colores.texto },
  suave: { fontSize: 14, color: colores.textoSuave },
  ayuda: { fontSize: 13, color: colores.textoSuave, marginTop: 4, marginBottom: 8 },
  equipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  equipo: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colores.primarioSuave, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  textoEquipo: { fontSize: 13, color: colores.primarioOscuro },
  grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  // tres columnas: (100% - 2 espacios de 8) / 3
  bloque: { width: '31.5%', minHeight: 56, borderRadius: radio - 4, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  bloquePresionado: { opacity: 0.7 },
  horaBloque: { fontSize: 13, fontWeight: '700' },
  estadoBloque: { fontSize: 12 },
  avisoSinLibres: { marginTop: 10 },
})
