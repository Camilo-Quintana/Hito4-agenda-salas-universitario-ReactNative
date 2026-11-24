// Inicio de sesión con la cuenta de la API (POST /api/auth/login)
import { useRef, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Campo from '../components/Campo'
import Boton from '../components/Boton'
import { Aviso } from '../components/Estados'
import { useSesion } from '../context/SesionContext'
import { colores, radio, sombra } from '../theme'
import { validarIngreso } from '../utils/validaciones'
import { CUENTA_DEMO, URL_API } from '../config'

export default function IngresarScreen() {
  const { ingresar, avisoExpirada } = useSesion()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const passwordRef = useRef(null)

  async function enviar() {
    const encontrados = validarIngreso({ correo, password })
    setErrores(encontrados)
    setErrorApi(null)
    if (Object.keys(encontrados).length) return
    setEnviando(true)
    try {
      await ingresar(correo.trim(), password)
      // al guardar el usuario, la navegación cambia sola a las pantallas de la app
    } catch (error) {
      setErrorApi(error.message)
      setEnviando(false)
    }
  }

  function usarDemo() {
    setCorreo(CUENTA_DEMO.correo)
    setPassword(CUENTA_DEMO.password)
    setErrores({})
    setErrorApi(null)
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
          <View style={styles.cabecera}>
            <Text style={styles.marca}>ReservaUNAB</Text>
            <Text style={styles.subtitulo}>Reserva salas y laboratorios de la Sede Viña del Mar desde tu teléfono.</Text>
          </View>

          <View style={styles.tarjeta}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="Universidad Andrés Bello" />
            <Text style={styles.titulo}>Ingresar</Text>
            {avisoExpirada && <Aviso tipo="aviso">Tu sesión venció. Ingresa nuevamente.</Aviso>}
            {errorApi && <Aviso tipo="error">{errorApi}</Aviso>}

            <Campo
              etiqueta="Correo institucional"
              value={correo}
              onChangeText={setCorreo}
              error={errores.correo}
              placeholder="nombre@uandresbello.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Campo
              ref={passwordRef}
              etiqueta="Contraseña"
              value={password}
              onChangeText={setPassword}
              error={errores.password}
              secureTextEntry
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={enviar}
            />
            <Boton titulo="Ingresar" icono="log-in-outline" onPress={enviar} cargando={enviando} />

            <Pressable onPress={usarDemo} style={styles.demo} accessibilityRole="button">
              <Text style={styles.textoDemo}>Usar la cuenta de prueba (estudiante demo)</Text>
            </Pressable>
          </View>

          <Text style={styles.servidor}>Servidor: {URL_API}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.primario },
  flex: { flex: 1 },
  contenido: { flexGrow: 1, justifyContent: 'center', padding: 20, gap: 20 },
  cabecera: { alignItems: 'center', gap: 8 },
  marca: { color: colores.blanco, fontSize: 32, fontWeight: '800' },
  logo: { width: 200, height: 56, alignSelf: 'center' },
  subtitulo: { color: colores.acentoClaro, fontSize: 15, textAlign: 'center' },
  tarjeta: { backgroundColor: colores.blanco, borderRadius: radio + 4, padding: 20, gap: 16, ...sombra },
  titulo: { fontSize: 22, fontWeight: '700', color: colores.texto },
  demo: { alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  textoDemo: { color: colores.primario, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  servidor: { color: colores.acentoClaro, fontSize: 12, textAlign: 'center' },
})
