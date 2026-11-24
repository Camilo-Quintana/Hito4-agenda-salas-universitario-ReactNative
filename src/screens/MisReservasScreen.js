// Reservas propias, separadas en activas (pendientes o aprobadas que no han terminado) e historial.
// Usa GET /api/reservas/mias?vista=activas|historial
import { useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import Chip from '../components/Chip'
import Boton from '../components/Boton'
import ReservaItem from '../components/ReservaItem'
import { Cargando, MensajeError, MensajeVacio } from '../components/Estados'
import { useConsulta } from '../hooks/useConsulta'
import { useAlVolver } from '../hooks/useAlVolver'
import { reservasApi } from '../services/reservaunabApi'
import { colores } from '../theme'

export default function MisReservasScreen({ navigation }) {
  const [vista, setVista] = useState('activas')
  const reservas = useConsulta((signal) => reservasApi.mias(vista, signal), [vista])

  // Al volver de una cancelación o de una reserva nueva, la lista se actualiza
  useAlVolver(reservas.actualizarSilencioso)

  function contenido() {
    if (reservas.cargando) return <Cargando texto="Cargando tus reservas..." />
    if (reservas.error) return <MensajeError error={reservas.error} onReintentar={reservas.recargar} />
    return (
      <FlatList
        data={reservas.datos}
        keyExtractor={(reserva) => String(reserva.id)}
        renderItem={({ item }) => <ReservaItem reserva={item} onPress={() => navigation.navigate('DetalleReserva', { id: item.id })} />}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        refreshControl={
          <RefreshControl refreshing={reservas.refrescando} onRefresh={reservas.refrescar} colors={[colores.primario]} tintColor={colores.primario} />
        }
        ListEmptyComponent={
          vista === 'activas' ? (
            <MensajeVacio
              icono="calendar-outline"
              titulo="No tienes reservas activas"
              texto="Busca un espacio y elige un horario libre."
              accion={<Boton titulo="Buscar espacios" icono="search" onPress={() => navigation.navigate('Espacios')} estilo={styles.botonVacio} />}
            />
          ) : (
            <MensajeVacio icono="time-outline" titulo="Tu historial está vacío" texto="Aquí aparecerán tus reservas terminadas, canceladas o rechazadas." />
          )
        }
      />
    )
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.pestanas}>
        <Chip texto="Activas" activo={vista === 'activas'} onPress={() => setVista('activas')} />
        <Chip texto="Historial" activo={vista === 'historial'} onPress={() => setVista('historial')} />
      </View>
      {contenido()}
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  pestanas: { flexDirection: 'row', gap: 8, padding: 12, paddingHorizontal: 16, backgroundColor: colores.blanco, borderBottomWidth: 1, borderBottomColor: colores.borde },
  lista: { padding: 16, paddingBottom: 32, flexGrow: 1 },
  separador: { height: 10 },
  botonVacio: { marginTop: 8, minWidth: 180 },
})
