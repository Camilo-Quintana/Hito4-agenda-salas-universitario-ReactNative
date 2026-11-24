// Datos del usuario con sesión, dirección de la API en uso y cierre de sesión
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Boton from '../components/Boton'
import { useSesion } from '../context/SesionContext'
import { colores, radio, sombra, tipografia } from '../theme'
import { URL_API } from '../config'
import { confirmar } from '../utils/confirmar'

export default function PerfilScreen() {
  const { usuario, salir } = useSesion()

  function confirmarSalida() {
    confirmar({
      titulo: 'Cerrar sesión',
      mensaje: '¿Quieres salir de tu cuenta en este teléfono?',
      textoAceptar: 'Cerrar sesión',
      alAceptar: salir,
    })
  }

  const iniciales = usuario.nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <View style={styles.avatar}>
          <Text style={styles.iniciales}>{iniciales}</Text>
        </View>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.rol}>{usuario.rol === 'admin' ? 'Administración' : 'Estudiante'}</Text>
      </View>

      <View style={styles.tarjeta}>
        <Dato icono="mail-outline" etiqueta="Correo" valor={usuario.correo} />
        <Dato icono="card-outline" etiqueta="RUT" valor={usuario.rut} />
      </View>

      <View style={styles.tarjeta}>
        <Dato icono="server-outline" etiqueta="Servidor de la API" valor={URL_API} />
        <Text style={styles.nota}>
          La app móvil usa la misma API y los mismos datos que la aplicación web: lo que reserves aquí también aparece allá.
        </Text>
      </View>

      <Boton titulo="Cerrar sesión" variante="peligroSecundario" icono="log-out-outline" onPress={confirmarSalida} />
    </ScrollView>
  )
}

function Dato({ icono, etiqueta, valor }) {
  return (
    <View style={styles.dato}>
      <Ionicons name={icono} size={20} color={colores.primario} />
      <View style={styles.flex}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <Text style={styles.valor} selectable>{valor}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 14, paddingBottom: 40 },
  cabecera: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colores.primario, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colores.acento },
  iniciales: { color: colores.blanco, fontSize: 30, fontWeight: '700' },
  nombre: { ...tipografia.titular, color: colores.texto, marginTop: 8, textAlign: 'center' },
  rol: { ...tipografia.cuerpo, color: colores.textoSuave },
  tarjeta: { backgroundColor: colores.blanco, borderRadius: radio, padding: 16, gap: 14, ...sombra },
  dato: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  etiqueta: { ...tipografia.cuerpoChico, fontSize: 12, color: colores.textoSuave },
  valor: { ...tipografia.cuerpo, color: colores.texto },
  nota: { ...tipografia.cuerpoChico, color: colores.textoSuave },
})
