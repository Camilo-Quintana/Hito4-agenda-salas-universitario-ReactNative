// Pregunta de confirmación antes de una acción que no se puede deshacer (cancelar, cerrar sesión).
// En el teléfono usa el diálogo nativo (Alert). En el navegador Alert no muestra botones, así que usa window.confirm.
import { Alert, Platform } from 'react-native'

export function confirmar({ titulo, mensaje, textoAceptar, textoCancelar = 'Cancelar', alAceptar }) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${titulo}\n\n${mensaje}`)) alAceptar()
    return
  }
  Alert.alert(titulo, mensaje, [
    { text: textoCancelar, style: 'cancel' },
    { text: textoAceptar, style: 'destructive', onPress: alAceptar },
  ])
}
