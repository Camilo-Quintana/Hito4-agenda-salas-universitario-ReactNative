// Navegación de la app:
// - Sin sesión: solo la pantalla de ingreso.
// - Con sesión: pestañas inferiores (Espacios, Mis reservas, Perfil) y, encima, las pantallas
//   de detalle y el formulario de reserva, que se abren con la flecha de "volver".
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useSesion } from '../context/SesionContext'
import { Cargando } from '../components/Estados'
import { colores } from '../theme'
import IngresarScreen from '../screens/IngresarScreen'
import EspaciosScreen from '../screens/EspaciosScreen'
import DetalleEspacioScreen from '../screens/DetalleEspacioScreen'
import PerfilScreen from '../screens/PerfilScreen'

const Pila = createNativeStackNavigator()
const Pestanas = createBottomTabNavigator()

const tema = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colores.primario, background: colores.fondo },
}

const encabezado = {
  headerStyle: { backgroundColor: colores.primario },
  headerTintColor: colores.blanco,
  headerTitleStyle: { fontWeight: '700' },
}

const ICONOS = {
  Espacios: 'business',
  MisReservas: 'calendar',
  Perfil: 'person-circle',
}

function PestanasPrincipales() {
  return (
    <Pestanas.Navigator
      screenOptions={({ route }) => ({
        ...encabezado,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? ICONOS[route.name] : `${ICONOS[route.name]}-outline`} size={size} color={color} />
        ),
      })}
    >
      <Pestanas.Screen name="Espacios" component={EspaciosScreen} options={{ title: 'Espacios' }} />
      <Pestanas.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Pestanas.Navigator>
  )
}

export default function Navegacion() {
  const { usuario, iniciando } = useSesion()
  if (iniciando) return <Cargando texto="Abriendo ReservaUNAB..." />

  return (
    <NavigationContainer theme={tema}>
      <Pila.Navigator screenOptions={{ ...encabezado, headerBackTitle: 'Volver' }}>
        {usuario ? (
          <>
            <Pila.Screen name="Pestanas" component={PestanasPrincipales} options={{ headerShown: false }} />
            <Pila.Screen name="DetalleEspacio" component={DetalleEspacioScreen} options={{ title: 'Espacio' }} />
          </>
        ) : (
          <Pila.Screen name="Ingresar" component={IngresarScreen} options={{ headerShown: false }} />
        )}
      </Pila.Navigator>
    </NavigationContainer>
  )
}
