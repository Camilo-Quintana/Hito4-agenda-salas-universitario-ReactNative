// ReservaUNAB móvil: segundo cliente de la API REST del Hito 3 (en construcción)
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>ReservaUNAB</Text>
      <StatusBar style="light" />
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7a1128' },
  titulo: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
})
