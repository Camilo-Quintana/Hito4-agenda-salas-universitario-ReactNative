// ReservaUNAB móvil: segundo cliente de la API REST del Hito 3 (Hito 4, React Native con Expo)
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ProveedorSesion } from './src/context/SesionContext'
import Navegacion from './src/navigation/Navegacion'

export default function App() {
  return (
    <SafeAreaProvider>
      <ProveedorSesion>
        <Navegacion />
        <StatusBar style="light" />
      </ProveedorSesion>
    </SafeAreaProvider>
  )
}
