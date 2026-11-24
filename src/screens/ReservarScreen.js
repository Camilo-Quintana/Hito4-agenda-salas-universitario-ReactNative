// Formulario para solicitar una reserva del bloque elegido (POST /api/reservas).
// Valida en el teléfono y muestra los errores que devuelva la API (horario ocupado, una reserva por día, etc.).
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Campo from '../components/Campo'
import Boton from '../components/Boton'
import EtiquetaEstado from '../components/EtiquetaEstado'
import { Aviso } from '../components/Estados'
import { reservasApi } from '../services/reservaunabApi'
import { colores, radio, sombra, tipografia } from '../theme'
import { formatearBloque, formatearFechaLarga } from '../utils/fechas'
import { erroresDeApi, validarReserva } from '../utils/validaciones'
import { textoCapacidad } from '../utils/textos'

export default function ReservarScreen({ route, navigation }) {
  const { espacio, fecha, bloque } = route.params
  const [motivo, setMotivo] = useState('')
  const [asistentes, setAsistentes] = useState(1)
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [creada, setCreada] = useState(null) // la reserva que devolvió la API

  function cambiarAsistentes(diferencia) {
    setAsistentes((actual) => Math.min(espacio.capacidad, Math.max(1, actual + diferencia)))
  }

  async function enviar() {
    const encontrados = validarReserva({ motivo, asistentes }, espacio.capacidad)
    setErrores(encontrados)
    setErrorApi(null)
    if (Object.keys(encontrados).length) return

    setEnviando(true)
    try {
      const reserva = await reservasApi.crear({ espacioId: espacio.id, fecha, bloque, motivo: motivo.trim(), asistentes })
      setCreada(reserva)
    } catch (error) {
      setErrores(erroresDeApi(error.detalles))
      setErrorApi(error)
    } finally {
      setEnviando(false)
    }
  }

  if (creada) return <Confirmacion reserva={creada} navigation={navigation} />

  // 409 = el horario se ocupó o ya tiene una reserva ese día: conviene volver a elegir
  const conflicto = errorApi?.status === 409

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>{espacio.nombre}</Text>
          <Fila icono="business-outline" texto={`Edificio ${espacio.edificio.codigo} · Piso ${espacio.piso}`} />
          <Fila icono="calendar-outline" texto={formatearFechaLarga(fecha)} />
          <Fila icono="time-outline" texto={formatearBloque(bloque)} />
        </View>

        {espacio.requiereAprobacion && (
          <Aviso tipo="aviso">La solicitud quedará pendiente hasta que administración la apruebe.</Aviso>
        )}
        {errorApi && (
          <Aviso tipo="error">
            {errorApi.message}
            {conflicto ? ' Vuelve atrás para elegir otro horario o día.' : ''}
          </Aviso>
        )}

        <View style={styles.formulario}>
          <Campo
            etiqueta="¿Para qué la necesitas?"
            value={motivo}
            onChangeText={setMotivo}
            error={errores.motivo}
            ayuda={`${motivo.trim().length}/200 caracteres (mínimo 5)`}
            placeholder="Ej.: Estudio para la prueba de Cálculo"
            multiline
            maxLength={200}
          />

          <View style={styles.campoAsistentes}>
            <Text style={styles.etiqueta}>Asistentes</Text>
            <View style={styles.contador}>
              <BotonContador icono="remove" onPress={() => cambiarAsistentes(-1)} deshabilitado={asistentes <= 1} etiqueta="Quitar un asistente" />
              <Text style={styles.numero} accessibilityLiveRegion="polite">{asistentes}</Text>
              <BotonContador icono="add" onPress={() => cambiarAsistentes(1)} deshabilitado={asistentes >= espacio.capacidad} etiqueta="Agregar un asistente" />
            </View>
            <Text style={errores.asistentes ? styles.error : styles.ayuda}>
              {errores.asistentes ?? `Capacidad máxima: ${textoCapacidad(espacio.capacidad)}`}
            </Text>
          </View>
        </View>

        <Boton
          titulo={espacio.requiereAprobacion ? 'Enviar solicitud' : 'Confirmar reserva'}
          icono="checkmark"
          onPress={enviar}
          cargando={enviando}
        />
        {conflicto && <Boton titulo="Elegir otro horario o día" variante="secundario" onPress={() => navigation.goBack()} />}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Confirmacion({ reserva, navigation }) {
  const pendiente = reserva.estado === 'pendiente'
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={[styles.contenido, styles.centro]}>
      <View style={[styles.icono, pendiente && styles.iconoPendiente]}>
        <Ionicons name={pendiente ? 'hourglass-outline' : 'checkmark'} size={44} color={pendiente ? colores.primarioOscuro : colores.blanco} />
      </View>
      <Text style={styles.tituloConfirmacion}>{pendiente ? 'Solicitud enviada' : '¡Reserva confirmada!'}</Text>
      <Text style={styles.textoConfirmacion}>
        {pendiente
          ? 'Administración revisará tu solicitud. Puedes ver su estado en "Mis reservas".'
          : 'Ya tienes el espacio reservado. También aparece en la aplicación web.'}
      </Text>
      <View style={styles.resumen}>
        <Text style={styles.resumenTitulo}>{reserva.espacio.nombre}</Text>
        <Fila icono="calendar-outline" texto={formatearFechaLarga(reserva.fecha)} />
        <Fila icono="time-outline" texto={formatearBloque(reserva.bloque)} />
        <Fila icono="pricetag-outline" texto={`Reserva N° ${reserva.id}`} />
        <EtiquetaEstado estado={reserva.estado} />
      </View>
      <Boton
        titulo="Ver mis reservas"
        icono="list"
        onPress={() => {
          navigation.popToTop()
          navigation.navigate('Pestanas', { screen: 'MisReservas' })
        }}
        estilo={styles.anchoCompleto}
      />
      <Boton titulo="Volver a los espacios" variante="secundario" onPress={() => navigation.popToTop()} estilo={styles.anchoCompleto} />
    </ScrollView>
  )
}

function Fila({ icono, texto }) {
  return (
    <View style={styles.fila}>
      <Ionicons name={icono} size={18} color={colores.primario} />
      <Text style={styles.textoFila}>{texto}</Text>
    </View>
  )
}

function BotonContador({ icono, onPress, deshabilitado, etiqueta }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      style={({ pressed }) => [styles.botonContador, deshabilitado && styles.inactivo, pressed && styles.presionado]}
      hitSlop={6}
    >
      <Ionicons name={icono} size={24} color={colores.primario} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 14, paddingBottom: 40 },
  centro: { alignItems: 'center', paddingTop: 32 },
  resumen: { alignSelf: 'stretch', backgroundColor: colores.blanco, borderRadius: radio, padding: 16, gap: 8, ...sombra },
  resumenTitulo: { ...tipografia.tituloGrande, color: colores.texto, marginBottom: 2 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoFila: { ...tipografia.cuerpo, color: colores.texto, flex: 1 },
  formulario: { backgroundColor: colores.blanco, borderRadius: radio, padding: 16, gap: 18, ...sombra },
  campoAsistentes: { gap: 6 },
  etiqueta: { ...tipografia.etiqueta, color: colores.texto },
  contador: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  botonContador: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: colores.primario, alignItems: 'center', justifyContent: 'center' },
  inactivo: { opacity: 0.35 },
  presionado: { backgroundColor: colores.primarioSuave },
  numero: { ...tipografia.titular, fontWeight: '700', color: colores.texto, minWidth: 40, textAlign: 'center', fontVariant: ['tabular-nums'] },
  ayuda: { ...tipografia.cuerpoChico, color: colores.textoSuave },
  error: { ...tipografia.cuerpoChico, color: colores.peligro },
  icono: { width: 84, height: 84, borderRadius: 42, backgroundColor: colores.exito, alignItems: 'center', justifyContent: 'center' },
  iconoPendiente: { backgroundColor: colores.acento },
  tituloConfirmacion: { ...tipografia.titular, color: colores.texto, textAlign: 'center' },
  textoConfirmacion: { ...tipografia.cuerpo, color: colores.textoSuave, textAlign: 'center', paddingHorizontal: 12, marginBottom: 6 },
  anchoCompleto: { alignSelf: 'stretch' },
})
