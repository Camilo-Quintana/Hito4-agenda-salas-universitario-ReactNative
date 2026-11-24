// Catálogo de espacios: búsqueda, filtros por edificio y tipo, y horarios libres del día elegido.
// Usa GET /api/edificios y GET /api/espacios?q&tipo&edificioId&fecha
import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Chip from '../components/Chip'
import SelectorDia from '../components/SelectorDia'
import EspacioItem from '../components/EspacioItem'
import Boton from '../components/Boton'
import { Cargando, MensajeError, MensajeVacio } from '../components/Estados'
import { useConsulta } from '../hooks/useConsulta'
import { useAlVolver } from '../hooks/useAlVolver'
import { edificiosApi, espaciosApi } from '../services/reservaunabApi'
import { colores, radio } from '../theme'
import { fechaHoy, formatearFechaLarga } from '../utils/fechas'
import { TIPOS_ESPACIO } from '../utils/textos'

export default function EspaciosScreen({ navigation }) {
  const [texto, setTexto] = useState('')
  const [busqueda, setBusqueda] = useState('') // el texto, pero 400 ms después de dejar de escribir
  const [tipo, setTipo] = useState(null)
  const [edificioId, setEdificioId] = useState(null)
  const [fecha, setFecha] = useState(fechaHoy())

  // Espera a que el usuario deje de escribir para no pedir a la API en cada letra
  useEffect(() => {
    const espera = setTimeout(() => setBusqueda(texto.trim()), 400)
    return () => clearTimeout(espera)
  }, [texto])

  const edificios = useConsulta((signal) => edificiosApi.listar(signal), [])
  const espacios = useConsulta(
    (signal) => espaciosApi.listar({ q: busqueda, tipo, edificioId, fecha }, signal),
    [busqueda, tipo, edificioId, fecha],
  )

  // Al volver a esta pestaña (por ejemplo, después de reservar) se actualizan los horarios libres
  useAlVolver(espacios.actualizarSilencioso)

  const edificioElegido = edificios.datos?.find((e) => e.id === edificioId)
  const hayFiltros = Boolean(busqueda || tipo || edificioId)

  function limpiarFiltros() {
    setTexto('')
    setBusqueda('')
    setTipo(null)
    setEdificioId(null)
  }

  function contenido() {
    if (espacios.cargando && !espacios.datos) return <Cargando texto="Buscando espacios..." />
    if (espacios.error && !espacios.datos) return <MensajeError error={espacios.error} onReintentar={espacios.recargar} />
    return (
      <FlatList
        data={espacios.datos ?? []}
        keyExtractor={(espacio) => String(espacio.id)}
        renderItem={({ item }) => (
          <EspacioItem espacio={item} onPress={() => navigation.navigate('DetalleEspacio', { id: item.id, fecha })} />
        )}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        refreshControl={
          <RefreshControl refreshing={espacios.refrescando} onRefresh={espacios.refrescar} colors={[colores.primario]} tintColor={colores.primario} />
        }
        ListHeaderComponent={
          <Text style={styles.resumen}>
            {espacios.cargando ? 'Actualizando...' : `${espacios.datos?.length ?? 0} espacios`} · {formatearFechaLarga(fecha)}
          </Text>
        }
        ListEmptyComponent={
          <MensajeVacio
            titulo="No encontramos espacios"
            texto="Prueba con otra búsqueda o quita algún filtro."
            accion={hayFiltros && <Boton titulo="Quitar filtros" variante="secundario" onPress={limpiarFiltros} estilo={styles.botonVacio} />}
          />
        }
        keyboardShouldPersistTaps="handled"
      />
    )
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.filtros}>
        <View style={styles.buscador}>
          <Ionicons name="search" size={20} color={colores.textoSuave} />
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Buscar por nombre o equipamiento"
            placeholderTextColor={colores.ocupado}
            style={styles.inputBuscar}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Buscar espacios"
          />
          {texto.length > 0 && (
            <Ionicons name="close-circle" size={20} color={colores.ocupado} onPress={() => setTexto('')} accessibilityLabel="Borrar búsqueda" />
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip texto="Todos los edificios" activo={edificioId === null} onPress={() => setEdificioId(null)} />
          {(edificios.datos ?? []).map((edificio) => (
            <Chip
              key={edificio.id}
              texto={`Edificio ${edificio.codigo}`}
              activo={edificioId === edificio.id}
              onPress={() => setEdificioId(edificioId === edificio.id ? null : edificio.id)}
            />
          ))}
        </ScrollView>
        {edificioElegido && (
          <Text style={styles.infoEdificio}>
            {edificioElegido.nombre} · {edificioElegido.pisos} {edificioElegido.pisos === 1 ? 'piso' : 'pisos'} ·{' '}
            {edificioElegido.totalEspacios} espacios
          </Text>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip texto="Todos los tipos" activo={tipo === null} onPress={() => setTipo(null)} />
          {TIPOS_ESPACIO.map((opcion) => (
            <Chip key={opcion} texto={opcion} activo={tipo === opcion} onPress={() => setTipo(tipo === opcion ? null : opcion)} />
          ))}
        </ScrollView>

        <SelectorDia fecha={fecha} onCambiar={setFecha} />
      </View>
      {contenido()}
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  filtros: { backgroundColor: colores.blanco, paddingTop: 12, paddingBottom: 10, gap: 10, borderBottomWidth: 1, borderBottomColor: colores.borde },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    minHeight: 46,
    borderRadius: radio,
    backgroundColor: colores.fondo,
  },
  inputBuscar: { flex: 1, fontSize: 16, color: colores.texto, paddingVertical: 8 },
  chips: { gap: 8, paddingHorizontal: 16 },
  infoEdificio: { marginHorizontal: 16, marginTop: -4, fontSize: 13, color: colores.textoSuave },
  lista: { padding: 16, paddingBottom: 32, flexGrow: 1 },
  separador: { height: 12 },
  resumen: { fontSize: 13, color: colores.textoSuave, marginBottom: 10 },
  botonVacio: { marginTop: 8, minWidth: 180 },
})
